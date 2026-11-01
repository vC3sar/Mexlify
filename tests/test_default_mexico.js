const fs = require('fs');
const assert = require('assert');

console.log('=== TEST SUITE: RECOMMENDATIONS & CHARTS (MEXICO & GLOBAL) ===');

// Test 1: index.html markup
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('id="defaultRegionalHeader"'), 'defaultRegionalHeader should be in index.html');
assert(indexHtml.includes('id="playAllRegionalBtn"'), 'playAllRegionalBtn should be in index.html');
assert(indexHtml.includes("showTopChartList('mexico')"), 'Card Mexico should call showTopChartList');
assert(indexHtml.includes("showTopChartList('global')"), 'Card Global should call showTopChartList');
assert(indexHtml.includes("playTopChart('mexico', true)"), 'Play button Mexico should call playTopChart');
assert(indexHtml.includes("playTopChart('global', true)"), 'Play button Global should call playTopChart');
console.log('  ✓ Test 1: index.html recommendations markup passed');

// Test 2: script.js functions and constants
const scriptJs = fs.readFileSync('assets/js/script.js', 'utf8');
assert(scriptJs.includes('DEFAULT_MEXICAN_TRACKS'), 'DEFAULT_MEXICAN_TRACKS should be in script.js');
assert(scriptJs.includes('DEFAULT_GLOBAL_TRACKS'), 'DEFAULT_GLOBAL_TRACKS should be in script.js');
assert(scriptJs.includes('showTopChartList'), 'showTopChartList should be in script.js');
assert(scriptJs.includes('playTopChart'), 'playTopChart should be in script.js');
assert(scriptJs.includes('getChartTracks'), 'getChartTracks should be in script.js');
assert(scriptJs.includes('scrollToTop'), 'scrollToTop should be defined in script.js');
console.log('  ✓ Test 2: script.js functions and constants passed');

// Test 3: Search restoration logic
assert(scriptJs.includes('loadDefaultMexicanMusic()'), 'Search clear should call loadDefaultMexicanMusic');
console.log('  ✓ Test 3: Search restoration logic passed');

// Test 4: topSongs.js backward compatibility
const topSongsJs = fs.readFileSync('assets/js/topSongs.js', 'utf8');
assert(topSongsJs.includes('playTopChart'), 'topSongs.js should bridge to playTopChart');
console.log('  ✓ Test 4: topSongs.js backward compatibility passed');

// Test 5: Navigation links scroll to top
assert(scriptJs.includes('.nav-right a'), 'nav-right links should be registered for scroll to top');
console.log('  ✓ Test 5: Navigation links scroll to top passed');

console.log('\nALL RECOMMENDATION & NAVIGATION TESTS PASSED! (5/5) 🎉');
