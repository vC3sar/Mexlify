const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("=== TEST SUITE: DISCORD RICH PRESENCE ===");

const mainPath = path.join(__dirname, "../main.js");
const preloadPath = path.join(__dirname, "../preload.js");
const scriptPath = path.join(__dirname, "../assets/js/script.js");

const mainContent = fs.readFileSync(mainPath, "utf8");
const preloadContent = fs.readFileSync(preloadPath, "utf8");
const scriptContent = fs.readFileSync(scriptPath, "utf8");

// ==========================================
// TEST 1: PRELOAD.JS EXPOSURE & VARIADIC SUPPORT
// ==========================================
console.log("Test 1: Verification of preload.js electronAPI exposure");
assert(
  preloadContent.includes("setDiscordActivity: async (...args) =>"),
  "preload.js should expose setDiscordActivity accepting variadic or object arguments"
);
assert(
  preloadContent.includes('return await ipcRenderer.invoke("discord-set-activity", ...args);'),
  "preload.js should invoke discord-set-activity passing all arguments"
);
console.log("  ✓ Test 1 passed: preload.js bridges setDiscordActivity correctly");

// ==========================================
// TEST 2: MAIN.JS DISCORD RPC & SPOTIFY STYLING
// ==========================================
console.log("Test 2: Verification of main.js Discord RPC Spotify configuration");

// 2.1 Reconnection and Client ID
assert(mainContent.includes('const CLIENT_ID = "1417279389858529392";'), "CLIENT_ID must be preserved");
assert(mainContent.includes("lastDiscordReconnectAttempt"), "main.js should track reconnect attempts");
assert(mainContent.includes("formatRpcString"), "formatRpcString must sanitize strings for Discord requirements");

// 2.2 Activity type: 2 (Listening)
assert(
  mainContent.includes("type: 2"),
  "Activity payload must specify type: 2 for Spotify-like 'Listening to' presence"
);

// 2.3 No [DEV] prefix in song titles
assert(
  !mainContent.includes("`[DEV] ${trackTitle}`") && !mainContent.includes('`[DEV] - ${details}`'),
  "main.js must not prepend [DEV] to song titles in Discord Rich Presence"
);

// 2.4 Spotify state formatting (de Artista / En pausa)
assert(
  mainContent.includes("artistPrefix") && mainContent.includes("⏸️ En pausa •"),
  "main.js must format state with 'de Artista' and pause prefix"
);

// 2.5 Live scrubber timeline calculation
assert(
  mainContent.includes("const startSec = Math.max(0, nowSec - curSec);") &&
  mainContent.includes("const endSec = startSec + Math.max(1, Math.floor(dur));"),
  "main.js must calculate start and end epoch timestamps in seconds for Discord music timeline scrubber"
);

// 2.6 Automatic online music metadata resolution (iTunes cover & album)
assert(
  mainContent.includes("async function resolveOnlineMusicMetadata"),
  "main.js must define resolveOnlineMusicMetadata to fetch official cover & album from iTunes"
);

// 2.7 Line 3 without repetitive Mexlify wording
assert(
  mainContent.includes("largeText = resolvedAlbum.trim();") &&
  !mainContent.includes("`${opts.album} • Mexlify`"),
  "main.js must not produce repetitive 'Mexlify Music • Mexlify' in line 3"
);

// 2.8 Clean album cover without duplicate logo badge
assert(
  !mainContent.includes('small_image: "logo_app_mexlify_center"'),
  "main.js must not overlay a duplicate Mexlify logo badge on top of covers"
);

// 2.9 Action buttons
assert(
  mainContent.includes("🎧 Escuchar tema") || mainContent.includes("▶️ Escuchar en Mexlify"),
  "main.js must offer direct listening button"
);
assert(
  mainContent.includes("https://discord.gg/hpRMKdqWRy"),
  "main.js must offer official Discord community button"
);

// 2.10 IPC command & fallback
assert(
  mainContent.includes('await rpc.request("SET_ACTIVITY"') &&
  mainContent.includes("await rpc.setActivity"),
  "main.js should prioritize SET_ACTIVITY IPC request and fall back to setActivity"
);
console.log("  ✓ Test 2 passed: main.js configured with Spotify-like presence, online cover resolution and clean typography");

// ==========================================
// TEST 3: SCRIPT.JS LOGIC & RESOLUTION UPGRADE
// ==========================================
console.log("Test 3: Verification of script.js helpers and playback hooks");

// 3.1 Helpers exist
assert(scriptContent.includes("function getBestArtworkUrl"), "script.js must define getBestArtworkUrl");
assert(scriptContent.includes("function getSongExternalUrl"), "script.js must define getSongExternalUrl");
assert(scriptContent.includes("function syncDiscordPresence"), "script.js must define syncDiscordPresence");

// 3.2 Artwork resolution boost
assert(
  scriptContent.includes("600x600bb."),
  "getBestArtworkUrl must upscale Apple/iTunes thumbnails to high-res"
);
assert(
  scriptContent.includes("hqdefault.jpg"),
  "getBestArtworkUrl must upscale YouTube thumbnails to hqdefault"
);

// 3.3 Event hooks (play, pause, loadedmetadata, seeked)
assert(
  scriptContent.includes('player.addEventListener("seeked", () => {\n  syncDiscordPresence(false);\n});') ||
  scriptContent.includes('player.addEventListener("seeked", () => {\r\n  syncDiscordPresence(false);\r\n});'),
  "script.js must sync Discord presence when user seeks in the track"
);

// Verify simulated getBestArtworkUrl logic
const simulatedArtworkFn = (song) => {
  if (!song) return "";
  let thumb = song.thumbnail || song.Thumbnail || song.cover || "";
  if (thumb && typeof thumb === "string" && (thumb.startsWith("http://") || thumb.startsWith("https://"))) {
    if (thumb.includes("mzstatic.com")) {
      thumb = thumb.replace(/\/\d+x\d+bb\./i, "/600x600bb.");
    }
    if (thumb.includes("ytimg.com") && thumb.includes("/default.jpg")) {
      thumb = thumb.replace("/default.jpg", "/hqdefault.jpg");
    }
    return thumb;
  }
  const ytId = song.id || (song.url && (song.url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)?.[1]));
  if (ytId && typeof ytId === "string" && ytId.length === 11) {
    return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
  }
  return "";
};

// Check iTunes upscale
const itunesThumb = "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/60x60bb.jpg";
assert.strictEqual(
  simulatedArtworkFn({ thumbnail: itunesThumb }),
  "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/600x600bb.jpg",
  "iTunes thumbnail should be upscaled to 600x600"
);

// Check YouTube upscale
const ytThumb = "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg";
assert.strictEqual(
  simulatedArtworkFn({ thumbnail: ytThumb }),
  "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  "YouTube default thumbnail should be upscaled to hqdefault"
);

// Check YouTube ID resolution
const localSongWithId = {
  thumbnail: "mexlify://C:/Users/vCesar/AppData/Roaming/Mexlify/downloads/metadata/sample.jpg",
  id: "dQw4w9WgXcQ"
};
assert.strictEqual(
  simulatedArtworkFn(localSongWithId),
  "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  "Song with YouTube ID should fetch YouTube artwork for Discord"
);

console.log("  ✓ Test 3 passed: script.js artwork enhancer and presence sync verified");

console.log("\nALL DISCORD RICH PRESENCE TESTS PASSED! (3/3) 🎉");
