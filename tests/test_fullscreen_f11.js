const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE: FULLSCREEN F11 INTEGRATION ===');

const mainContent = fs.readFileSync(path.resolve('main.js'), 'utf8');
const preloadContent = fs.readFileSync(path.resolve('preload.js'), 'utf8');
const scriptContent = fs.readFileSync(path.resolve('assets/js/script.js'), 'utf8');

// Test 1: main.js configuration
console.log('Test 1: Verification of main.js window configuration and event listener');
assert(mainContent.includes('fullscreenable: true,'), 'BrowserWindow must be fullscreenable');
assert(mainContent.includes('input.key === "F11"'), 'before-input-event must catch F11');
assert(mainContent.includes('win.setFullScreen(!win.isFullScreen())'), 'Must toggle fullscreen on F11 in main process');
assert(mainContent.includes('ipcMain.handle("toggle-fullscreen"'), 'Must handle toggle-fullscreen IPC');
assert(mainContent.includes('ipcMain.handle("is-fullscreen"'), 'Must handle is-fullscreen IPC');
console.log('  ✓ Test 1 passed: main.js configured with fullscreen capability and F11 handler');

// Test 2: preload.js API exposure
console.log('Test 2: Verification of preload.js electronAPI exposure');
assert(preloadContent.includes('toggleFullScreen: async () =>'), 'Must expose toggleFullScreen');
assert(preloadContent.includes('isFullScreen: async () =>'), 'Must expose isFullScreen');
console.log('  ✓ Test 2 passed: electronAPI exposes toggleFullScreen and isFullScreen');

// Test 3: script.js keyboard shortcut listener
console.log('Test 3: Verification of script.js window keydown listener');
assert(scriptContent.includes('e.key === "F11"'), 'Renderer must listen to F11');
assert(scriptContent.includes('window.electronAPI.toggleFullScreen()'), 'Renderer must invoke toggleFullScreen');
console.log('  ✓ Test 3 passed: Renderer keydown listener triggers toggleFullScreen');

console.log('\nALL FULLSCREEN F11 TESTS PASSED! (3/3) 🎉');

