/**
 * Test Suite: Mexlify Music - Lyrics Engine & LRCLIB System
 */
const assert = require("assert");
const {
  cleanSongMetadata,
  parseLRC,
  scoreCandidate,
  getLyricsCacheKey
} = require("../services/lyricsService");

console.log("=== TEST SUITE: MEXLIFY LYRICS ENGINE ===");

// Test 1: Limpieza de metadatos de YouTube / Spotify
console.log("Test 1: Limpieza de metadatos de canciones");
const m1 = cleanSongMetadata("Juanes - La Camisa Negra (Official Music Video)", "Universal Music");
assert.strictEqual(m1.title, "La Camisa Negra", "Debe extraer el título limpio");
assert.strictEqual(m1.artist, "Juanes", "Debe extraer el artista de la separación ' - '");
assert.strictEqual(m1.isLive, false);
assert.strictEqual(m1.isRemix, false);

const m2 = cleanSongMetadata("11 PM [Video Oficial]", "Maluma - Topic");
assert.strictEqual(m2.title, "11 PM");
assert.strictEqual(m2.artist, "Maluma", "Debe remover '- Topic'");

const m3 = cleanSongMetadata("Yellow (Live in Buenos Aires)", "Coldplay");
assert.strictEqual(m3.isLive, true, "Debe detectar que es versión en vivo");

const m4 = cleanSongMetadata("Despacito (Remix)", "Luis Fonsi");
assert.strictEqual(m4.isRemix, true, "Debe detectar que es remix");
console.log("  ✓ Limpieza de metadatos superada con éxito");

// Test 2: Parser de formato LRC
console.log("Test 2: Parseo de formato LRC");
const sampleLrc = `
[ar:Juanes]
[ti:La Camisa Negra]
[00:15.30]Tengo la camisa negra
[00:18.50]Hoy mi amor está de luto
[00:22.125]Hoy tengo en el alma una pena
[00:40.00][01:20.00]Coro repetido
`;

const parsed = parseLRC(sampleLrc);
assert.strictEqual(parsed.length, 5, "Debe parsear 5 marcas de tiempo (incluyendo la duplicada)");
assert.strictEqual(parsed[0].time, 15.3, "Primera línea debe iniciar en 15.3s");
assert.strictEqual(parsed[0].text, "Tengo la camisa negra");
assert.strictEqual(parsed[1].time, 18.5);
assert.strictEqual(parsed[2].time, 22.125, "Debe soportar milisegundos de 3 dígitos");
assert.strictEqual(parsed[3].time, 40.0);
assert.strictEqual(parsed[4].time, 80.0, "01:20.00 debe ser 80 segundos");
assert.strictEqual(parsed[4].text, "Coro repetido");
console.log("  ✓ Parseo LRC superado con éxito");

// Test 3: Puntuación de candidatos (Score) y prevención de versiones erróneas
console.log("Test 3: Puntuación de candidatos y selección de versión correcta");
const targetStudio = {
  title: "11 PM",
  artist: "Maluma",
  isLive: false,
  isRemix: false,
  isCover: false
};

const candidateGood = {
  trackName: "11 PM",
  artistName: "Maluma",
  albumName: "11:11",
  duration: 176,
  syncedLyrics: "[00:10.00] Letra sincronizada"
};

const candidateLive = {
  trackName: "11 PM (Live)",
  artistName: "Maluma",
  albumName: "En Vivo",
  duration: 250,
  syncedLyrics: "[00:10.00] Letra en vivo"
};

const candidateCover = {
  trackName: "11 PM (Cover)",
  artistName: "Tributo Pop",
  albumName: "Covers",
  duration: 176,
  plainLyrics: "Letra cover"
};

const scoreGood = scoreCandidate(candidateGood, targetStudio, 176);
const scoreLive = scoreCandidate(candidateLive, targetStudio, 176);
const scoreCover = scoreCandidate(candidateCover, targetStudio, 176);

assert(scoreGood > scoreLive, "La versión de estudio debe tener mayor puntuación que la versión Live");
assert(scoreGood > scoreCover, "La versión original debe superar a los covers");
assert(scoreGood >= 100, "Coincidencia exacta debe tener alta puntuación");
console.log(`  ✓ Puntuaciones: Exacta=${scoreGood}, Live=${scoreLive}, Cover=${scoreCover}`);

// Test 4: Prioridad de letras (syncedLyrics > plainLyrics)
console.log("Test 4: Prioridad de syncedLyrics sobre plainLyrics");
const candidateSynced = {
  trackName: "La Camisa Negra",
  artistName: "Juanes",
  duration: 217,
  syncedLyrics: "[00:10.00] ..."
};
const candidatePlain = {
  trackName: "La Camisa Negra",
  artistName: "Juanes",
  duration: 217,
  plainLyrics: "Tengo la camisa negra..."
};
const targetJuanes = {
  title: "La Camisa Negra",
  artist: "Juanes",
  isLive: false,
  isRemix: false,
  isCover: false
};

const sSynced = scoreCandidate(candidateSynced, targetJuanes, 217);
const sPlain = scoreCandidate(candidatePlain, targetJuanes, 217);
assert(sSynced > sPlain, "syncedLyrics debe recibir mayor prioridad que plainLyrics");
console.log(`  ✓ Prioridad verificada: Sincronizada=${sSynced} > Normal=${sPlain}`);

// Test 5: Clave de caché normalizada
console.log("Test 5: Claves de caché insensibles a tildes y mayúsculas");
const key1 = getLyricsCacheKey("Canción de Cuna", "Los Ángeles");
const key2 = getLyricsCacheKey("cancion de cuna", "los angeles");
assert.strictEqual(key1, key2, "Las claves normalizadas deben coincidir");
console.log("  ✓ Claves de caché verificadas");

// Test 6: Integración con base de datos SQLite en memoria (Caché Positiva y Negativa)
async function runDbTests() {
  console.log("Test 6: Caché en base de datos SQLite (almacenamiento y recuperación)");
  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database(":memory:");
  const { initLyricsTable, getSongLyrics } = require("../services/lyricsService");

  await new Promise((res) => {
    initLyricsTable(db);
    setTimeout(res, 100);
  });

  // 6.1 Guardar y recuperar canción
  const res1 = await getSongLyrics(db, {
    title: "La Camisa Negra",
    uploader: "Juanes",
    duration: 217
  });

  assert(res1.success, "Debe obtener respuesta exitosa de LRCLIB o caché");
  assert(res1.isSynced, "La Camisa Negra debe tener letras sincronizadas");
  assert.strictEqual(res1.cached, false, "Primera llamada debe ser de red (no de caché)");

  // 6.2 Segunda llamada: debe responder desde la caché SQLite instantáneamente
  const res2 = await getSongLyrics(db, {
    title: "La Camisa Negra",
    uploader: "Juanes",
    duration: 217
  });

  assert(res2.success);
  assert.strictEqual(res2.cached, true, "Segunda llamada DEBE ser de la caché SQLite");
  assert.strictEqual(res2.isSynced, true);
  console.log("  ✓ Caché persistente verificada (primera llamada de red, segunda de SQLite)");

  // 6.3 Canción inexistente: debe registrar en caché negativa para evitar reintentos continuos
  const fakeSong = {
    title: "XyzInexistente9876543210Song",
    uploader: "UnknownAuthor999"
  };
  const resNegative1 = await getSongLyrics(db, fakeSong);
  assert(resNegative1.notAvailable, "Canción inventada debe marcar notAvailable");
  assert.strictEqual(resNegative1.cached, false);

  const resNegative2 = await getSongLyrics(db, fakeSong);
  assert(resNegative2.notAvailable);
  assert.strictEqual(resNegative2.cached, true, "Segunda consulta de canción sin letra debe responder desde la caché negativa");
  console.log("  ✓ Caché negativa verificada para canciones sin letra");

  db.close();
  console.log("\nTODAS LAS PRUEBAS DE LETRAS Y CACHÉ PASARON CON ÉXITO (6/6) 🎉");
}

runDbTests().catch((err) => {
  console.error("Error en pruebas asíncronas:", err);
  process.exit(1);
});
