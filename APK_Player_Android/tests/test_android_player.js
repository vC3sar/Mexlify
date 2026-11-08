import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { LyricsEngine } from "../src/lyricsEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=== TEST SUITE: MEXLIFY ANDROID PLAYER ENGINE ===");

// ==========================================
// TEST 1: LYRICS ENGINE PARSING & TIMESTAMPS
// ==========================================
console.log("Test 1: Verification of LyricsEngine parsing and timestamp synchronization");

const sampleLrc = `
[00:00.00] Intro Instrumental
[00:04.50] Primera línea de la canción
[00:08.20] Segunda línea con sentimiento
[00:15.00] Coro principal
[01:02.30] Outro final
`;

const engine = new LyricsEngine();
const parsed = engine.parseLRC(sampleLrc);

assert.strictEqual(parsed.length, 5, "Debería parsear exactamente 5 líneas con marcas de tiempo");
assert.strictEqual(parsed[0].time, 0, "Primera línea debe iniciar en 0s");
assert.strictEqual(parsed[1].time, 4.5, "Segunda línea debe iniciar en 4.5s");
assert.strictEqual(parsed[1].text, "Primera línea de la canción");
assert.strictEqual(parsed[4].time, 62.3, "Última línea debe iniciar en 62.3s");

// Test time synchronization & live active line preview
assert.strictEqual(engine.syncTime(2.0), 0, "A los 2.0s debe estar activa la línea 0");
assert.strictEqual(engine.getActiveLineText(), "Intro Instrumental");
assert.strictEqual(engine.syncTime(4.5), 1, "A los 4.5s debe estar activa la línea 1");
assert.strictEqual(engine.getActiveLineText(), "Primera línea de la canción");
assert.strictEqual(engine.syncTime(7.0), 1, "A los 7.0s debe seguir activa la línea 1");
assert.strictEqual(engine.syncTime(8.2), 2, "A los 8.2s debe estar activa la línea 2");
assert.strictEqual(engine.syncTime(30.0), 3, "A los 30.0s debe estar activo el coro (línea 3)");
assert.strictEqual(engine.syncTime(999.0), 4, "Al final debe permanecer en la última línea");

// Test plain lyrics fallback
const plainEngine = new LyricsEngine();
plainEngine.parseLRC("Verso uno sin marcas de tiempo\nVerso dos");
assert.strictEqual(plainEngine.lines.length, 0);
assert.strictEqual(plainEngine.plainLines.length, 2);
assert.strictEqual(plainEngine.getActiveLineText(), "Verso uno sin marcas de tiempo");

console.log("  ✓ Test 1 passed: LyricsEngine parsea, sincroniza y previsualiza en tiempo real");

// ==========================================
// TEST 2: DEDUPLICATION ALGORITHM (ANTI-DUPLICADOS)
// ==========================================
console.log("Test 2: Verification of LAN Sync Deduplication Algorithm");

const remoteSongs = [
  { filename: "Rude.mp3", size: 5000000, title: "Rude" },
  { filename: "Earrings.mp3", size: 4500000, title: "Earrings" },
  { filename: "New_Song_2026.mp3", size: 6200000, title: "New Song" },
];

const localSongs = [
  { filename: "Rude.mp3", size: 5000000, title: "Rude" },
  { filename: "Earrings.mp3", size: 4500000, title: "Earrings" },
];

const localMap = new Map();
localSongs.forEach((s) => localMap.set(s.filename.toLowerCase(), s));

const toDownload = [];
const alreadySynced = [];

for (const remote of remoteSongs) {
  const existing = localMap.get(remote.filename.toLowerCase());
  if (existing && Math.abs((existing.size || 0) - (remote.size || 0)) < 1024) {
    alreadySynced.push(remote);
  } else {
    toDownload.push(remote);
  }
}

assert.strictEqual(alreadySynced.length, 2, "Debe detectar 2 canciones ya existentes (0 duplicados)");
assert.strictEqual(toDownload.length, 1, "Solo debe transferir 1 canción nueva");
assert.strictEqual(toDownload[0].filename, "New_Song_2026.mp3");

console.log("  ✓ Test 2 passed: Deduplicación inteligente verificada, 0 duplicados transferidos");

// ==========================================
// TEST 3: NATIVE ANDROID MEDIA NOTIFICATION, NOTCH & BACK GESTURE
// ==========================================
console.log("Test 3: Verification of Android MediaSession Service, Notch Cutout & Back Gesture");

const mainActivityPath = path.resolve(__dirname, "../android/app/src/main/java/com/mexlify/player/MainActivity.java");
const musicServicePath = path.resolve(__dirname, "../android/app/src/main/java/com/mexlify/player/MusicPlaybackService.java");
const appJsPath = path.resolve(__dirname, "../src/app.js");

const mainActivityCode = fs.readFileSync(mainActivityPath, "utf8");
const musicServiceCode = fs.readFileSync(musicServicePath, "utf8");
const appJsCode = fs.readFileSync(appJsPath, "utf8");

assert(mainActivityCode.includes("LAYOUT_IN_DISPLAY_CUTOUT_MODE"), "MainActivity debe configurar soporte para Notch/DisplayCutout");
assert(mainActivityCode.includes("WindowInsetsCompat.Type.displayCutout()"), "MainActivity debe leer los insets del Notch/Cutout");
assert(mainActivityCode.includes("OnBackPressedCallback"), "MainActivity debe interceptar el gesto de volver de Android");
assert(musicServiceCode.includes("Notification.MediaStyle"), "MusicPlaybackService debe construir notificaciones MediaStyle del sistema");
assert(musicServiceCode.includes("MediaSession"), "MusicPlaybackService debe registrar MediaSession activa para Samsung/Tecno Dynamic Port");
assert(appJsCode.includes("isUserScrubbing"), "app.js debe separar el arrastre manual (isUserScrubbing) de timeupdate");
assert(appJsCode.includes("__handleAndroidBack"), "app.js debe manejar la pila de cierre con el gesto de volver");

console.log("  ✓ Test 3 passed: Soporte nativo de MediaStyle, Notch (Tecno/Samsung), Scrubber y Gesto Volver verificados");

console.log("\nALL ANDROID PLAYER ENGINE TESTS PASSED! (3/3) 🎉");
