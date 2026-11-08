const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("=== TEST SUITE: MEXLIFY SYNC INTEGRATION (ELECTRON & PRELOAD) ===");

const mainContent = fs.readFileSync(path.join(__dirname, "../main.js"), "utf8");
const preloadContent = fs.readFileSync(path.join(__dirname, "../preload.js"), "utf8");

// Test 1: SyncServer import and instantiation in main.js
console.log("Test 1: Verification of SyncServer setup in main.js");
assert(mainContent.includes('require("./services/syncServer")'), "main.js must require syncServer");
assert(mainContent.includes("new SyncServer("), "main.js must instantiate SyncServer");
assert(mainContent.includes('ipcMain.handle("sync-get-status"'), "main.js must expose sync-get-status IPC");
assert(mainContent.includes('ipcMain.handle("sync-start-server"'), "main.js must expose sync-start-server IPC");
assert(mainContent.includes('ipcMain.handle("sync-stop-server"'), "main.js must expose sync-stop-server IPC");
console.log("  ✓ Test 1 passed: main.js correctly configures SyncServer & IPC handlers");

// Test 2: Preload exposure
console.log("Test 2: Verification of electronAPI sync methods in preload.js");
assert(preloadContent.includes("getSyncStatus: async () =>"), "preload.js must expose getSyncStatus");
assert(preloadContent.includes("startSyncServer: async () =>"), "preload.js must expose startSyncServer");
assert(preloadContent.includes("stopSyncServer: async () =>"), "preload.js must expose stopSyncServer");
console.log("  ✓ Test 2 passed: preload.js bridges sync API methods safely");

console.log("\nALL SYNC INTEGRATION TESTS PASSED! (2/2) 🎉");

