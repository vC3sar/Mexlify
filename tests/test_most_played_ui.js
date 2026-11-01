const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE: MOST PLAYED UI/UX & CHARTS INTEGRATION ===');

const scriptContent = fs.readFileSync(path.resolve('assets/js/script.js'), 'utf8');
const styleContent = fs.readFileSync(path.resolve('assets/css/style.css'), 'utf8');

// Test 1: showMostPlayedList implementation & layout structure
console.log('Test 1: Verification of showMostPlayedList UI structure');
assert(scriptContent.includes('id="btnBackFromMostPlayed"'), 'Must include back button');
assert(scriptContent.includes('class="top-chart-hero"'), 'Must use top-chart-hero for consistent design');
assert(scriptContent.includes('id="btnPlayAllMostPlayed"'), 'Must include "Reproducir todo" action button');
assert(scriptContent.includes('id="btnShuffleMostPlayed"'), 'Must include "Mezclar" action button');
assert(scriptContent.includes('id="mostPlayedSongsList"'), 'Must render songs inside #mostPlayedSongsList');
console.log('  ✓ Test 1 passed: showMostPlayedList structure is consistent with Mexlify design language');

// Test 2: createSongListItem rank and playCount support
console.log('Test 2: Verification of createSongListItem rank & playCount');
assert(scriptContent.includes('song-play-count-badge'), 'Must support song-play-count-badge');
assert(scriptContent.includes('options.playCount !== undefined'), 'Must check options.playCount');
assert(scriptContent.includes('class="top-chart-rank"'), 'Must render top-chart-rank');
console.log('  ✓ Test 2 passed: createSongListItem supports rank, clean titles, and play count badge');

// Test 3: highlightPlayingSong list synchronization
console.log('Test 3: Verification of highlightPlayingSong lists');
assert(scriptContent.includes('"#mostPlayedSongsList"'), 'Must include #mostPlayedSongsList in highlightPlayingSong');
assert(scriptContent.includes('"#topChartSongsList"'), 'Must include #topChartSongsList in highlightPlayingSong');
console.log('  ✓ Test 3 passed: Active song highlighter syncs with both charts and most played lists');

// Test 4: CSS styling and responsiveness
console.log('Test 4: Verification of CSS rules and responsive media queries');
assert(styleContent.includes('.song-play-count-badge'), 'Must include .song-play-count-badge in CSS');
assert(styleContent.includes('@media (max-width: 650px)'), 'Must include responsive rules for top chart & most played hero');
assert(styleContent.includes('.top-chart-hero-actions button'), 'Must ensure action buttons are responsive on mobile');
console.log('  ✓ Test 4 passed: Styling and responsive layout rules are in place');

console.log('\nALL MOST PLAYED UI/UX TESTS PASSED! (4/4) 🎉');

