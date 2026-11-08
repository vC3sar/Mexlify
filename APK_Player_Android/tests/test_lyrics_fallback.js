import assert from "assert";
import { cleanSongMetadata, scoreCandidate, normalizeText, fetchSongLyricsFromLRCLIB } from "../src/lyricsService.js";

console.log("=== TEST SUITE: MEXLIFY ANDROID LYRICS SERVICE & FALLBACK ===");

// Test 1: Limpieza inteligente de metadatos (misma lógica que Electron)
console.log("Test 1: Metadata cleaning (video suffixes, topic, feats)");
const cleaned1 = cleanSongMetadata("MAGIC! - Rude (Official Music Video)", "MAGIC! - Topic");
assert.strictEqual(cleaned1.title.toLowerCase(), "rude");
assert.strictEqual(cleaned1.artist.toLowerCase(), "magic!");

const cleaned2 = cleanSongMetadata("Blinding Lights [Official Audio] (feat. Max)", "The Weeknd");
assert.strictEqual(cleaned2.title.toLowerCase(), "blinding lights");
console.log("  ✓ Test 1 passed: Metadata cleaned accurately");

// Test 2: Puntuación de candidatos (Prioridad syncedLyrics > plainLyrics)
console.log("Test 2: Candidate scoring");
const meta = { title: "Rude", artist: "MAGIC!", isLive: false, isRemix: false, isCover: false };
const syncedCandidate = {
  trackName: "Rude",
  artistName: "MAGIC!",
  syncedLyrics: "[00:01.00]Saturday morning...",
  plainLyrics: "Saturday morning...",
  duration: 224,
};
const plainCandidate = {
  trackName: "Rude",
  artistName: "MAGIC!",
  syncedLyrics: "",
  plainLyrics: "Saturday morning...",
  duration: 224,
};
const liveCandidate = {
  trackName: "Rude (Live at Wembley)",
  artistName: "MAGIC!",
  syncedLyrics: "[00:01.00]...",
  duration: 260,
};

const scoreSynced = scoreCandidate(syncedCandidate, meta, 224);
const scorePlain = scoreCandidate(plainCandidate, meta, 224);
const scoreLive = scoreCandidate(liveCandidate, meta, 224);

assert(scoreSynced > scorePlain, "Synced candidate must have higher score than plain candidate");
assert(scoreSynced > scoreLive, "Original candidate must score higher than Live mismatch");
console.log(`  ✓ Test 2 passed: Synced score (${scoreSynced}) > Plain score (${scorePlain}) > Live score (${scoreLive})`);

// Test 3: Consulta real a LRCLIB (mismo servicio que Electron)
console.log("Test 3: Query LRCLIB online service");
(async () => {
  try {
    const result = await fetchSongLyricsFromLRCLIB({
      title: "Rude",
      artist: "MAGIC!",
      duration: 224,
    });

    assert.strictEqual(result.success, true, "LRCLIB query should succeed");
    assert(result.syncedLyrics && result.syncedLyrics.length > 50, "Synced lyrics should be present");
    assert.strictEqual(result.isSynced, true, "isSynced must be true");
    console.log("  ✓ Test 3 passed: LRCLIB returned synced lyrics successfully");
    console.log("    Sample LRC line:", result.syncedLyrics.split("\n")[0]);

    console.log("\nALL ANDROID LYRICS SERVICE TESTS PASSED! (3/3) 🎉\n");
  } catch (err) {
    console.error("❌ Test 3 failed:", err);
    process.exit(1);
  }
})();

