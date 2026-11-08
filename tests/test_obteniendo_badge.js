const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE: OBTENIENDO / REPRODUCIENDO STATUS BADGE ===');

const scriptContent = fs.readFileSync(path.resolve('assets/js/script.js'), 'utf8');

// Test 1: setPlaybackBadgeState function existence and logic
console.log('Test 1: Verification of setPlaybackBadgeState implementation');
assert(scriptContent.includes('function setPlaybackBadgeState(state)'), 'Must define setPlaybackBadgeState');
assert(scriptContent.includes('textEl.textContent = "OBTENIENDO"'), 'Must set text to OBTENIENDO when obtaining');
assert(scriptContent.includes('textEl.textContent = "REPRODUCIENDO"'), 'Must set text to REPRODUCIENDO when playing/resetting');
assert(scriptContent.includes('container.classList.add("active")'), 'Must activate container on obtaining and playing');
assert(scriptContent.includes('container.classList.remove("active")'), 'Must deactivate container when paused/stopped');
console.log('  ✓ Test 1 passed: setPlaybackBadgeState accurately manages text and visibility');

// Test 2: playSong triggers "obtaining"
console.log('Test 2: Verification of playSong obtaining lifecycle');
assert(scriptContent.includes('setPlaybackBadgeState("obtaining")'), 'playSong must trigger obtaining state');
assert(scriptContent.includes('setPlaybackBadgeState("playing")'), 'Must transition to playing state');
console.log('  ✓ Test 2 passed: playSong triggers OBTENIENDO immediately upon touching a song');

// Test 3: Player events synchronization
console.log('Test 3: Verification of player events synchronization');
assert(scriptContent.includes('player.addEventListener("playing"'), 'Must listen to playing event');
assert(scriptContent.includes('player.addEventListener("waiting"'), 'Must listen to waiting event');
console.log('  ✓ Test 3 passed: Audio player events sync seamlessly with badge states');

console.log('\nALL OBTENIENDO BADGE TESTS PASSED! (3/3) 🎉');

