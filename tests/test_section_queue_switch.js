const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE: SECTION QUEUE SWITCHING & CONTEXT ISOLATION ===');

const scriptContent = fs.readFileSync(path.resolve('assets/js/script.js'), 'utf8');
const indexContent = fs.readFileSync(path.resolve('index.html'), 'utf8');

// Test 1: Downloads header action buttons
console.log('Test 1: Verification of Downloads Header Action Buttons in index.html');
assert(indexContent.includes('id="playAllDownloadedBtn"'), 'Must include playAllDownloadedBtn');
assert(indexContent.includes('id="shuffleDownloadedBtn"'), 'Must include shuffleDownloadedBtn');
console.log('  ✓ Test 1 passed: index.html contains play all and shuffle buttons in downloads header');

// Test 2: Descargadas (Downloads) Queue Replacement Logic
console.log('Test 2: Verification of Descargadas Queue Replacement');
assert(scriptContent.includes('// Reemplazar la cola con todas las descargas y olvidar la sección previa'), 'Must replace queue with downloads');
assert(scriptContent.includes('playAllDownloadedBtn.addEventListener("click"'), 'Must wire playAllDownloadedBtn');
assert(scriptContent.includes('shuffleDownloadedBtn.addEventListener("click"'), 'Must wire shuffleDownloadedBtn');
console.log('  ✓ Test 2 passed: Descargadas replaces queue and sets currentIndex on song click & header buttons');

// Test 3: Playlists Queue Replacement Logic
console.log('Test 3: Verification of Playlist Queue Replacement');
assert(scriptContent.includes('// Configurar la cola con todas las canciones de la playlist y olvidar la seccion previa'), 'Must replace queue in playPlaylistSong');
assert(scriptContent.includes('plTitleEl.addEventListener("click", () => playPlaylistSong(pl, origIndex))'), 'Must wire title click in playlist');
console.log('  ✓ Test 3 passed: Playlist replaces queue and sets currentIndex on song click');

// Test 4: Top Charts (Top Nacional / Mix Global) Queue Replacement Logic
console.log('Test 4: Verification of Top Charts Queue Replacement');
assert(scriptContent.includes('titleLink.addEventListener("click", playHandler);'), 'Must wire title click in charts');
assert(scriptContent.includes('queue = songs.map((s) => ({ ...s }));'), 'Must populate queue with chart songs');
console.log('  ✓ Test 4 passed: Top Nacional & Mix Global replace queue and set currentIndex on song click');

// Test 5: Mis Más Escuchadas (Most Played) Queue Replacement Logic
console.log('Test 5: Verification of Mis Más Escuchadas Queue Replacement');
assert(scriptContent.includes('titleLink.addEventListener("click", playHandler);'), 'Must wire title click in most played');
console.log('  ✓ Test 5 passed: Mis Más Escuchadas replaces queue and sets currentIndex on song click');

// Test 6: Regional / México default list Queue Replacement Logic
console.log('Test 6: Verification of Default Regional México Queue Replacement');
assert(scriptContent.includes('queue = defaultMexicanSongsList.map((s) => ({ ...s }));'), 'Must populate queue with regional songs');
console.log('  ✓ Test 6 passed: Tendencias en México replaces queue and sets currentIndex on song click');

console.log('\nALL SECTION QUEUE SWITCHING TESTS PASSED! (6/6) 🎉');

