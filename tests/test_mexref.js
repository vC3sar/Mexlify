const assert = require('assert');

function cleanSongTitle(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(official\s*(music)?\s*video|official\s*audio|video\s*oficial|audio\s*oficial|lyric\s*video|lyrics|closed-captioned|audio)\b/gi, '')
    .replace(/\[.*?\]|\(.*?\)/g, '')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanArtist(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(feat\.?|ft\.?)\b.*/gi, '')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([0-9A-Za-z_-]{6,16})/);
  return match ? match[1] : null;
}

function validateMexrefContent(parsed, filename = 'archivo.mexref') {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`El archivo "${filename}" no contiene un documento JSON válido.`);
  }
  if (parsed.format !== 'mexref') {
    throw new Error(`El archivo "${filename}" no es un archivo .mexref válido (formato esperado: "mexref", recibido: "${parsed.format || 'ninguno'}").`);
  }
  if (typeof parsed.version !== 'number') {
    throw new Error(`El archivo "${filename}" no especifica una versión numérica válida.`);
  }
  if (parsed.version > 1) {
    throw new Error(`El archivo "${filename}" tiene la versión ${parsed.version}, pero esta versión de Mexlify solo soporta la versión 1 o anterior.`);
  }
  if (!Array.isArray(parsed.tracks)) {
    throw new Error(`El archivo "${filename}" no contiene una lista de pistas válida ("tracks" debe ser un arreglo).`);
  }

  const validTracks = [];
  for (let i = 0; i < parsed.tracks.length; i++) {
    const t = parsed.tracks[i];
    if (!t || typeof t !== 'object') continue;

    const title = typeof t.title === 'string' ? t.title.trim() : '';
    const id = typeof t.id === 'string' ? t.id.trim() : '';
    if (!title && !id) continue;

    let artists = [];
    if (Array.isArray(t.artists)) {
      artists = t.artists.filter((a) => typeof a === 'string' && a.trim()).map((a) => a.trim());
    } else if (typeof t.artists === 'string' && t.artists.trim()) {
      artists = [t.artists.trim()];
    } else if (typeof t.uploader === 'string' && t.uploader.trim()) {
      artists = [t.uploader.trim()];
    }

    validTracks.push({
      id: id || null,
      source: typeof t.source === 'string' ? t.source.toLowerCase().trim() : 'mexlify',
      title: title || id,
      artists: artists.length > 0 ? artists : ['Desconocido'],
      album: typeof t.album === 'string' && t.album.trim() ? t.album.trim() : undefined,
      durationMs: typeof t.durationMs === 'number' && t.durationMs > 0 ? t.durationMs : undefined
    });
  }

  return {
    format: 'mexref',
    version: 1,
    app: parsed.app || 'Mexlify Music',
    createdAt: parsed.createdAt || new Date().toISOString(),
    export: parsed.export || {},
    tracks: validTracks
  };
}

function mergeMexrefTracks(filesMap) {
  const mergedTracks = [];
  const seenIds = new Set();
  const seenTitleArtists = new Set();

  for (const [, fileObj] of filesMap.entries()) {
    if (!fileObj.data || !Array.isArray(fileObj.data.tracks)) continue;
    for (const track of fileObj.data.tracks) {
      if (track.source && track.id) {
        const idKey = `${track.source}:${track.id}`;
        if (seenIds.has(idKey)) continue;
        seenIds.add(idKey);
      }

      const normTitle = cleanSongTitle(track.title);
      const normArtist = cleanArtist(track.artists && track.artists[0] ? track.artists[0] : '');
      if (normTitle && normArtist) {
        const titleKey = `${normTitle}|${normArtist}`;
        if (seenTitleArtists.has(titleKey)) continue;
        seenTitleArtists.add(titleKey);
      }

      mergedTracks.push(track);
    }
  }

  return mergedTracks;
}

function matchSongWithMexref(song, mexrefTracks) {
  if (!mexrefTracks || mexrefTracks.length === 0) return { match: false };

  const songSpotifyUri = song.spotifyUri || (song.SpotifyUri && song.SpotifyUri !== 'N/A' ? song.SpotifyUri : null);
  const songUrl = song.url || (song.Url && song.Url !== 'N/A' ? song.Url : null);
  const songVideoId = song.videoId || (song.VideoId && song.VideoId !== 'N/A' ? song.VideoId : null) || extractYouTubeId(songUrl);

  for (const ref of mexrefTracks) {
    if (songSpotifyUri && ref.source === 'spotify' && ref.id) {
      if (ref.id === songSpotifyUri || ref.id === songSpotifyUri.replace('spotify:track:', '')) {
        return { match: true, reason: 'ID Spotify', ref };
      }
    }
    if (songVideoId && ref.source === 'youtube' && ref.id) {
      const refVid = ref.id.replace(/^youtube:/, '');
      if (refVid === songVideoId) {
        return { match: true, reason: 'ID YouTube', ref };
      }
    }
  }

  const rawTitle = song.title || song.Title || '';
  let rawArtist = song.uploader || song.Uploader || '';

  if (!rawArtist && rawTitle.includes(' - ')) {
    const parts = rawTitle.split(' - ');
    rawArtist = parts[0].trim();
  }

  const normSongTitle = cleanSongTitle(rawTitle);
  const normSongArtist = cleanArtist(rawArtist);

  if (!normSongTitle || !normSongArtist || normSongArtist === 'desconocido' || normSongArtist === 'n a') {
    return { match: false, ambiguous: true };
  }

  for (const ref of mexrefTracks) {
    const normRefTitle = cleanSongTitle(ref.title);
    if (!normRefTitle) continue;

    const titleMatch = normSongTitle === normRefTitle ||
      (normSongTitle.length > 5 && normRefTitle.length > 5 && (normSongTitle.includes(normRefTitle) || normRefTitle.includes(normSongTitle)));

    if (titleMatch) {
      const refArtists = (Array.isArray(ref.artists) ? ref.artists : [ref.artists]).map(cleanArtist);
      const artistMatch = refArtists.some((ra) => ra && (ra === normSongArtist || ra.includes(normSongArtist) || normSongArtist.includes(ra)));

      if (artistMatch) {
        return { match: true, reason: 'Título y Artista', ref };
      }
    }
  }

  return { match: false };
}

console.log('=== TEST SUITE: .MEXREF SYSTEM ===');

// Test 1: Validation
console.log('Test 1: Validation of .mexref format');
assert.throws(() => validateMexrefContent(null), /no contiene un documento JSON válido/);
assert.throws(() => validateMexrefContent({ format: 'other' }), /formato esperado: "mexref"/);
assert.throws(() => validateMexrefContent({ format: 'mexref', version: 2 }), /solo soporta la versión 1/);
assert.throws(() => validateMexrefContent({ format: 'mexref', version: 1, tracks: 'not an array' }), /"tracks" debe ser un arreglo/);

const validSample = {
  format: 'mexref',
  version: 1,
  app: 'Mexlify Music',
  createdAt: '2026-10-28T12:00:00.000Z',
  export: { name: 'Test Playlist', totalTracks: 2 },
  tracks: [
    { id: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC', source: 'spotify', title: 'Never Gonna Give You Up', artists: ['Rick Astley'] },
    { id: 'youtube:dQw4w9WgXcQ', source: 'youtube', title: 'Example 2', artists: ['Artist 2'] }
  ]
};
const validated = validateMexrefContent(validSample);
assert.strictEqual(validated.tracks.length, 2);
console.log('  ✓ Validation tests passed');

// Test 2: Merging & Deduplication across multiple files
console.log('Test 2: Merging multiple .mexref files without duplicates');
const filesMap = new Map();
filesMap.set('dump1.mexref', {
  data: {
    tracks: [
      { id: 'spotify:track:1111111111111111111111', source: 'spotify', title: 'Song 1', artists: ['Artist 1'] },
      { id: 'youtube:dQw4w9WgXcQ', source: 'youtube', title: 'Song 2', artists: ['Artist 2'] }
    ]
  }
});
filesMap.set('dump2.mexref', {
  data: {
    tracks: [
      // Duplicate of Song 1
      { id: 'spotify:track:1111111111111111111111', source: 'spotify', title: 'Song 1', artists: ['Artist 1'] },
      // New song
      { id: 'spotify:track:2222222222222222222222', source: 'spotify', title: 'Song 3', artists: ['Artist 3'] }
    ]
  }
});

const merged = mergeMexrefTracks(filesMap);
assert.strictEqual(merged.length, 3, 'Should have exactly 3 unique tracks, not 4');
console.log('  ✓ Deduplication across files passed');

// Test 3: Match by Spotify ID
console.log('Test 3: Match by Spotify ID');
const matchSpotify = matchSongWithMexref({
  title: 'Completely Different Title',
  uploader: 'Different Uploader',
  spotifyUri: 'spotify:track:1111111111111111111111'
}, merged);
assert.strictEqual(matchSpotify.match, true);
assert.strictEqual(matchSpotify.reason, 'ID Spotify');
console.log('  ✓ Spotify ID matching passed');

// Test 4: Match by YouTube Video ID
console.log('Test 4: Match by YouTube Video ID');
const matchYouTube = matchSongWithMexref({
  title: 'Any Title',
  uploader: 'Any Artist',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
}, merged);
assert.strictEqual(matchYouTube.match, true);
assert.strictEqual(matchYouTube.reason, 'ID YouTube');
console.log('  ✓ YouTube ID matching passed');

// Test 5: Isolation of different platforms (Spotify ID should NOT match YouTube ID)
console.log('Test 5: Platform isolation');
const noCrossMatch = matchSongWithMexref({
  title: 'Unrelated',
  uploader: 'Unrelated',
  url: 'https://www.youtube.com/watch?v=11111111111'
}, merged);
assert.strictEqual(noCrossMatch.match, false);
console.log('  ✓ Cross-platform false positives prevented');

// Test 6: Fallback matching by Normalized Title + Artist
console.log('Test 6: Fallback Title + Artist matching');
const matchText = matchSongWithMexref({
  title: 'Song 3 (Official Music Video)',
  uploader: 'Artist 3 ft. Someone'
}, merged);
assert.strictEqual(matchText.match, true);
assert.strictEqual(matchText.reason, 'Título y Artista');
console.log('  ✓ Title + Artist normalization matching passed');

// Test 7: Prevent matching by title only
console.log('Test 7: Prevent match by title only when artist differs');
const noTitleOnlyMatch = matchSongWithMexref({
  title: 'Song 3',
  uploader: 'Completely Different Artist'
}, merged);
assert.strictEqual(noTitleOnlyMatch.match, false);
console.log('  ✓ False positive prevention (title only) passed');

// Test 8: Ambiguity handling when artist is unknown
console.log('Test 8: Ambiguity prevention when artist is missing/unknown');
const ambiguousSong = matchSongWithMexref({
  title: 'Song 3',
  uploader: 'Desconocido'
}, merged);
assert.strictEqual(ambiguousSong.match, false);
assert.strictEqual(ambiguousSong.ambiguous, true);
console.log('  ✓ Ambiguity protection passed');

console.log('\nALL TESTS PASSED SUCCESSFULLY! (8/8)');
