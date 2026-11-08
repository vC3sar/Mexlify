const assert = require("assert");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { SyncServer, getLocalIps } = require("../services/syncServer");

console.log("=== TEST SUITE: MEXLIFY LAN SYNC SERVER ===");

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    }).on("error", reject);
  });
}

(async () => {
  const testPort = 5987;
  const mockDownloadsDir = path.join(__dirname, "mock_downloads");
  const mockMetadataDir = path.join(mockDownloadsDir, "metadata");

  if (!fs.existsSync(mockMetadataDir)) {
    fs.mkdirSync(mockMetadataDir, { recursive: true });
  }

  // Crear archivo mock de MP3 y carátula/letras
  const sampleMp3 = path.join(mockDownloadsDir, "Artist - Sample Song.mp3");
  const sampleCover = path.join(mockMetadataDir, "Artist - Sample Song.jpg");
  const sampleLrc = path.join(mockMetadataDir, "Artist - Sample Song.lrc");

  fs.writeFileSync(sampleMp3, "fake mp3 content for test");
  fs.writeFileSync(sampleCover, "fake cover image");
  fs.writeFileSync(sampleLrc, "[00:10.00] Primera linea de prueba\n[00:20.00] Segunda linea sincronizada");

  const server = new SyncServer({
    port: testPort,
    downloadsDir: mockDownloadsDir,
    metadataDir: mockMetadataDir,
  });

  try {
    console.log("Test 1: Starting SyncServer");
    const status = await server.start();
    assert.strictEqual(status.running, true, "Server should be running");
    assert.strictEqual(status.port, testPort, "Server should listen on test port");
    console.log("  ✓ Test 1 passed: Server started on port", testPort);

    console.log("Test 2: GET /api/ping");
    const pingRes = await fetchJson(`http://localhost:${testPort}/api/ping`);
    assert.strictEqual(pingRes.status, 200, "Ping should return 200");
    assert.strictEqual(pingRes.data.status, "ok", "Status should be ok");
    assert.strictEqual(pingRes.headers["access-control-allow-origin"], "*", "CORS should be enabled");
    console.log("  ✓ Test 2 passed: /api/ping responded with valid status and CORS");

    console.log("Test 3: GET /api/songs");
    const songsRes = await fetchJson(`http://localhost:${testPort}/api/songs`);
    assert.strictEqual(songsRes.status, 200, "Songs list should return 200");
    assert(Array.isArray(songsRes.data.songs), "songs should be an array");
    assert.strictEqual(songsRes.data.total, 1, "Should detect 1 mock song");
    const item = songsRes.data.songs[0];
    assert.strictEqual(item.title, "Sample Song");
    assert.strictEqual(item.artist, "Artist");
    assert.strictEqual(item.hasCover, true);
    assert.strictEqual(item.hasLyrics, true);
    console.log("  ✓ Test 3 passed: /api/songs correctly listed downloadable song with metadata");

    console.log("Test 4: GET /api/lyrics/:filename");
    const lyricsRes = await fetchJson(`http://localhost:${testPort}/api/lyrics/Artist%20-%20Sample%20Song.mp3`);
    assert.strictEqual(lyricsRes.status, 200);
    assert.strictEqual(lyricsRes.data.isSynced, true);
    assert(lyricsRes.data.syncedLyrics.includes("Primera linea de prueba"));
    console.log("  ✓ Test 4 passed: /api/lyrics served .lrc file correctly");

    console.log("Test 5: Stopping SyncServer");
    await server.stop();
    assert.strictEqual(server.isRunning, false, "Server should be stopped");
    console.log("  ✓ Test 5 passed: Server stopped cleanly");

    console.log("\nALL SYNC SERVER TESTS PASSED! (5/5) 🎉");
  } finally {
    await server.stop().catch(() => {});
    // Limpieza de archivos mock
    try {
      if (fs.existsSync(sampleMp3)) fs.unlinkSync(sampleMp3);
      if (fs.existsSync(sampleCover)) fs.unlinkSync(sampleCover);
      if (fs.existsSync(sampleLrc)) fs.unlinkSync(sampleLrc);
      if (fs.existsSync(mockMetadataDir)) fs.rmdirSync(mockMetadataDir);
      if (fs.existsSync(mockDownloadsDir)) fs.rmdirSync(mockDownloadsDir);
    } catch (_) {}
  }
})();

