const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== TEST SUITE: ARTIST RECOMMENDS UI/UX ===');

const scriptContent = fs.readFileSync(path.resolve('assets/js/script.js'), 'utf8');
const styleContent = fs.readFileSync(path.resolve('assets/css/style.css'), 'utf8');

// Test 1: Header and action buttons structure
console.log('Test 1: Verification of Recommendations Header and Controls');
assert(scriptContent.includes('class="ListHeader recommends-header"'), 'Must include native ListHeader for recommendations');
assert(scriptContent.includes('id="closeRecommendsBtn"'), 'Must include close/hide recommendations button');
assert(scriptContent.includes('id="playMixRecommendsBtn"'), 'Must include play mix recommendations button');
assert(scriptContent.includes('id="recommendsArtistBadge"'), 'Must include stat badge with artist name');
console.log('  ✓ Test 1 passed: Recommendations header and controls match Mexlify design language');

// Test 2: Song items and actions
console.log('Test 2: Verification of Song Items, High-res Artwork & Actions');
assert(scriptContent.includes('recommend-song-item'), 'Must render items as recommend-song-item');
assert(scriptContent.includes('/200x200bb.'), 'Must upgrade thumbnail resolution to 200x200');
assert(scriptContent.includes('class="recommend-rank-icon"'), 'Must include rank/sparkle icon');
assert(scriptContent.includes('addToQueue({'), 'Must support adding to queue');
assert(scriptContent.includes('openPlaylistModal({'), 'Must support adding to playlist');
console.log('  ✓ Test 2 passed: Song items, high-res artwork, and action buttons properly defined');

// Test 3: CSS Liquid Glass & Responsive Rules
console.log('Test 3: Verification of CSS Liquid Glass styling and responsiveness');
assert(styleContent.includes('#artistRecommends {'), 'Must style #artistRecommends container');
assert(styleContent.includes('#artistRecommends.is-visible'), 'Must handle visibility class');
assert(styleContent.includes('.recommend-song-item:hover'), 'Must include hover state for recommendation items');
assert(!styleContent.includes('#artistRecommends li:active {\n    background: linear-gradient(135deg, #fc913a'), 'Must remove legacy orange gradient');
assert(styleContent.includes('@media (max-width: 650px)'), 'Must include mobile responsive rules');
console.log('  ✓ Test 3 passed: CSS styles align with dark liquid glass theme and responsive layouts');

console.log('\nALL ARTIST RECOMMENDS UI/UX TESTS PASSED! (3/3) 🎉');
