/**
 * Mexlify Music - Lyrics Service (LRCLIB Integration & SQLite Cache)
 * 
 * - Fuente principal: LRCLIB (gratuito, sin API key)
 * - Prioridad: 1) syncedLyrics -> 2) plainLyrics -> 3) no disponible
 * - Normalización inteligente de título y artista (evita falsos positivos con covers/remixes/en vivo)
 * - Caché persistente en SQLite con distinción entre resultado negativo y error de red
 * - Deduplicación de peticiones en vuelo y gestión de límites HTTP 429
 */

const USER_AGENT = "MexlifyMusic/1.4.0 (https://github.com/vC3sar/Mexlify_Musica)";
const NEGATIVE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días para caché de canciones sin letra

// Mapa para deduplicar peticiones en vuelo
const inFlightRequests = new Map();

/**
 * Inicializa la tabla de caché de letras en la base de datos SQLite de Mexlify
 * @param {import("sqlite3").Database} db
 */
function initLyricsTable(db) {
  if (!db) return;
  const sql = `
    CREATE TABLE IF NOT EXISTS lyrics_cache (
      cache_key TEXT PRIMARY KEY,
      track_name TEXT,
      artist_name TEXT,
      album_name TEXT,
      duration INTEGER,
      synced_lyrics TEXT,
      plain_lyrics TEXT,
      instrumental INTEGER DEFAULT 0,
      is_empty INTEGER DEFAULT 0,
      updated_at INTEGER
    )
  `;
  db.run(sql, (err) => {
    if (err) {
      console.error("❌ Error al crear tabla lyrics_cache en SQLite:", err.message);
    } else {
      console.log("✅ Tabla lyrics_cache verificada/creada.");
    }
  });
}

/**
 * Normaliza cadenas para comparación insensible a mayúsculas, tildes y caracteres especiales
 */
function normalizeText(str) {
  if (!str || typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Limpieza inteligente de metadatos de canción (YouTube / Spotify / Local)
 */
function cleanSongMetadata(rawTitle, rawArtist) {
  let title = rawTitle || "";
  let artist = rawArtist || "";

  // Detección de variantes antes de limpiar
  const isRemix = /\b(remix|mixed|edit|club mix)\b/i.test(title);
  const isLive = /\b(live|en vivo|en directo|acoustic|acustico|acústico)\b/i.test(title);
  const isCover = /\b(cover|tribute|tributo|karaoke|instrumental)\b/i.test(title);

  // Si el título viene en formato "Artista - Canción"
  if (title.includes(" - ")) {
    const parts = title.split(" - ");
    if (parts.length === 2) {
      artist = parts[0].trim();
      title = parts[1].trim();
    }
  }

  // Eliminar palabras de video/calidad/features innecesarias
  const cleanedTitle = title
    .replace(/[\(\[\{][^\)\]\}]*?(official|oficial|video|audio|lyrics?|lyric|videoclip|clip|visualizer|hd|4k|hq|remaster|versi[oó]n|feat\.?|ft\.?)[^\)\]\}]*?[\)\]\}]/gi, "")
    .replace(/\b(official\s*(music)?\s*video|video\s*oficial|audio\s*oficial|official\s*audio|lyric\s*video|videoclip|visualizer)\b/gi, "")
    .replace(/\b(feat\.?|ft\.?)\s+[^\(\[\{\-]+/gi, "")
    .replace(/[\(\[\{]\s*[\)\]\}]/g, "")
    .replace(/[\(\[\{\)\]\}]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Limpiar artista
  const cleanedArtist = artist
    .replace(/\s*-\s*topic$/i, "")
    .replace(/\bvevo\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    title: cleanedTitle || title,
    artist: cleanedArtist || artist,
    isRemix,
    isLive,
    isCover
  };
}

/**
 * Genera la clave única de caché SQLite para una canción
 */
function getLyricsCacheKey(title, artist) {
  const normT = normalizeText(title);
  const normA = normalizeText(artist);
  return `${normT}||${normA}`;
}

/**
 * Consulta la caché SQLite
 */
function getCachedLyrics(db, cacheKey) {
  return new Promise((resolve) => {
    if (!db) return resolve(null);
    db.get(
      "SELECT * FROM lyrics_cache WHERE cache_key = ?",
      [cacheKey],
      (err, row) => {
        if (err || !row) return resolve(null);
        resolve(row);
      }
    );
  });
}

/**
 * Guarda el resultado en la caché SQLite
 */
function saveLyricsToCache(db, cacheKey, data) {
  return new Promise((resolve) => {
    if (!db) return resolve(false);
    const sql = `
      INSERT OR REPLACE INTO lyrics_cache 
      (cache_key, track_name, artist_name, album_name, duration, synced_lyrics, plain_lyrics, instrumental, is_empty, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      cacheKey,
      data.trackName || "",
      data.artistName || "",
      data.albumName || "",
      data.duration ? Math.round(data.duration) : 0,
      data.syncedLyrics || null,
      data.plainLyrics || null,
      data.instrumental ? 1 : 0,
      data.isEmpty ? 1 : 0,
      Date.now()
    ];
    db.run(sql, params, (err) => {
      if (err) {
        console.error("❌ Error guardando letras en caché:", err.message);
        return resolve(false);
      }
      resolve(true);
    });
  });
}

/**
 * Realiza una petición segura a LRCLIB respetando rate-limits
 */
async function fetchLrclib(url, retryCount = 0) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/json"
      }
    });

    if (res.status === 429) {
      // Manejo de rate limiting con espera progresiva
      if (retryCount < 1) {
        const retryAfterSec = parseInt(res.headers.get("Retry-After") || "2", 10);
        const waitMs = Math.min(Math.max(retryAfterSec * 1000, 1500), 4000);
        console.warn(`[LRCLIB] Rate limit 429 recibido. Esperando ${waitMs}ms...`);
        await new Promise((r) => setTimeout(r, waitMs));
        return fetchLrclib(url, retryCount + 1);
      }
      return { status: 429, data: null, error: "rate_limited" };
    }

    if (res.status === 404) {
      return { status: 404, data: null };
    }

    if (!res.ok) {
      return { status: res.status, data: null, error: `http_${res.status}` };
    }

    const data = await res.json();
    return { status: 200, data };
  } catch (netErr) {
    console.warn("[LRCLIB] Error de red:", netErr.message);
    return { status: 0, data: null, error: "network_error" };
  }
}

/**
 * Evalúa y puntúa candidatos de búsqueda en LRCLIB para evitar versiones incorrectas
 */
function scoreCandidate(candidate, meta, targetDuration) {
  let score = 0;
  const candTrack = normalizeText(candidate.trackName || candidate.name || "");
  const candArtist = normalizeText(candidate.artistName || "");
  const candAlbum = normalizeText(candidate.albumName || "");
  const targetTrack = normalizeText(meta.title);
  const targetArtist = normalizeText(meta.artist);

  // 1. Coincidencia de título
  if (candTrack === targetTrack) {
    score += 50;
  } else if (candTrack.includes(targetTrack) || targetTrack.includes(candTrack)) {
    score += 25;
  } else {
    // Si no coincide el título ni cercanamente, descartar
    return -100;
  }

  // 2. Coincidencia de artista
  if (candArtist === targetArtist) {
    score += 40;
  } else if (candArtist.includes(targetArtist) || targetArtist.includes(candArtist)) {
    score += 20;
  }

  // 3. Evitar falsos positivos (Live / Remix / Cover / Acústico) si el original no lo es
  const candIsLive = /\b(live|en vivo|en directo|acustico|acoustic)\b/i.test(candidate.trackName + " " + candidate.albumName);
  const candIsRemix = /\b(remix|mixed|club mix)\b/i.test(candidate.trackName + " " + candidate.albumName);
  const candIsCover = /\b(cover|tribute|tributo|karaoke)\b/i.test(candidate.trackName + " " + candidate.artistName);

  if (candIsLive && !meta.isLive) score -= 60;
  if (candIsRemix && !meta.isRemix) score -= 60;
  if (candIsCover && !meta.isCover) score -= 80;

  // 4. Comparación de duración (si está disponible)
  if (targetDuration > 0 && candidate.duration > 0) {
    const delta = Math.abs(candidate.duration - targetDuration);
    if (delta <= 4) {
      score += 35; // Muy buena coincidencia de tiempo
    } else if (delta <= 8) {
      score += 15;
    } else if (delta > 25) {
      score -= 40; // Probablemente versión extendida o diferente
    }
  }

  // 5. Prioridad de tipo de letra (synced > plain)
  if (candidate.syncedLyrics && candidate.syncedLyrics.trim().length > 0) {
    score += 30; // Prioridad 1: Sincronizadas
  } else if (candidate.plainLyrics && candidate.plainLyrics.trim().length > 0) {
    score += 10; // Prioridad 2: Sin sincronizar
  } else if (candidate.instrumental) {
    score += 5;
  } else {
    score -= 30; // Sin letra útil
  }

  return score;
}

/**
 * Busca letras en LRCLIB con estrategia en dos fases:
 * Fase 1: Coincidencia directa (/api/get)
 * Fase 2: Búsqueda y filtrado (/api/search)
 */
async function queryLrclib(meta, duration, album) {
  const enc = encodeURIComponent;
  const cleanT = meta.title;
  const cleanA = meta.artist;

  // Fase 1: Intento directo en /api/get
  let getUrl = `https://lrclib.net/api/get?track_name=${enc(cleanT)}&artist_name=${enc(cleanA)}`;
  if (duration && duration > 0) {
    getUrl += `&duration=${Math.round(duration)}`;
  }
  if (album && album.trim()) {
    getUrl += `&album_name=${enc(album.trim())}`;
  }

  const getRes = await fetchLrclib(getUrl);
  if (getRes.status === 200 && getRes.data) {
    const d = getRes.data;
    if (d.syncedLyrics || d.plainLyrics || d.instrumental) {
      return { found: true, data: d };
    }
  }

  if (getRes.status === 429) {
    return { found: false, rateLimited: true };
  }
  if (getRes.error === "network_error") {
    return { found: false, networkError: true };
  }

  // Fase 2: Búsqueda flexible en /api/search
  const searchUrl = `https://lrclib.net/api/search?track_name=${enc(cleanT)}&artist_name=${enc(cleanA)}`;
  const searchRes = await fetchLrclib(searchUrl);

  if (searchRes.status === 200 && Array.isArray(searchRes.data) && searchRes.data.length > 0) {
    const scored = searchRes.data
      .map((item) => ({ item, score: scoreCandidate(item, meta, duration) }))
      .filter((entry) => entry.score >= 40)
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      const best = scored[0].item;
      if (best.syncedLyrics || best.plainLyrics || best.instrumental) {
        return { found: true, data: best };
      }
    }
  }

  if (searchRes.status === 429) {
    return { found: false, rateLimited: true };
  }
  if (searchRes.error === "network_error") {
    return { found: false, networkError: true };
  }

  return { found: false, notAvailable: true };
}

/**
 * Obtiene la letra de una canción con caché persistente SQLite y deduplicación
 * @param {import("sqlite3").Database} db
 * @param {Object} songParams
 * @returns {Promise<Object>}
 */
async function getSongLyrics(db, songParams) {
  const rawTitle = songParams?.title || songParams?.Title || "";
  const rawArtist = songParams?.uploader || songParams?.Uploader || songParams?.artist || "";
  const album = songParams?.album || songParams?.Album || "";
  const duration = typeof songParams?.duration === "number" ? songParams.duration : 0;

  if (!rawTitle.trim()) {
    return { success: false, notAvailable: true };
  }

  const meta = cleanSongMetadata(rawTitle, rawArtist);
  const cacheKey = getLyricsCacheKey(meta.title, meta.artist);

  // 1. Revisar caché persistente en SQLite
  const cached = await getCachedLyrics(db, cacheKey);
  if (cached) {
    // Si era resultado negativo previo
    if (cached.is_empty === 1) {
      const isFresh = Date.now() - (cached.updated_at || 0) < NEGATIVE_CACHE_TTL_MS;
      if (isFresh) {
        return {
          success: true,
          notAvailable: true,
          cached: true
        };
      }
      // Si la caché negativa ya expiró, dejamos que intente de nuevo
    } else {
      // Coincidencia positiva en caché
      return {
        success: true,
        cached: true,
        trackName: cached.track_name,
        artistName: cached.artist_name,
        syncedLyrics: cached.synced_lyrics,
        plainLyrics: cached.plain_lyrics,
        isSynced: !!(cached.synced_lyrics && cached.synced_lyrics.trim()),
        instrumental: cached.instrumental === 1,
        notAvailable: false
      };
    }
  }

  // 2. Deduplicación de peticiones en vuelo (evitar consultas simultáneas duplicadas)
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    try {
      const result = await queryLrclib(meta, duration, album);

      if (result.found && result.data) {
        const d = result.data;
        const hasSynced = !!(d.syncedLyrics && d.syncedLyrics.trim().length > 0);
        const hasPlain = !!(d.plainLyrics && d.plainLyrics.trim().length > 0);

        // Guardar resultado positivo en SQLite
        await saveLyricsToCache(db, cacheKey, {
          trackName: d.trackName || meta.title,
          artistName: d.artistName || meta.artist,
          albumName: d.albumName || album,
          duration: d.duration || duration,
          syncedLyrics: d.syncedLyrics || null,
          plainLyrics: d.plainLyrics || null,
          instrumental: !!d.instrumental,
          isEmpty: false
        });

        return {
          success: true,
          cached: false,
          trackName: d.trackName || meta.title,
          artistName: d.artistName || meta.artist,
          syncedLyrics: d.syncedLyrics || null,
          plainLyrics: d.plainLyrics || null,
          isSynced: hasSynced,
          instrumental: !!d.instrumental,
          notAvailable: !hasSynced && !hasPlain && !d.instrumental
        };
      }

      // Si fue error de red o límite 429, NO guardamos caché negativa para permitir reintento
      if (result.rateLimited) {
        return {
          success: false,
          rateLimited: true,
          notAvailable: true,
          message: "Límite temporal de peticiones alcanzado"
        };
      }

      if (result.networkError) {
        return {
          success: false,
          networkError: true,
          notAvailable: true,
          message: "Sin conexión con el servicio de letras"
        };
      }

      // Canción no disponible de forma definitiva en LRCLIB: guardar en caché negativa
      await saveLyricsToCache(db, cacheKey, {
        trackName: meta.title,
        artistName: meta.artist,
        albumName: album,
        duration: duration,
        isEmpty: true
      });

      return {
        success: true,
        notAvailable: true,
        cached: false
      };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}

/**
 * Parser de formato LRC con soporte para múltiples marcas de tiempo por línea y milisegundos
 * @param {string} lrc
 * @returns {Array<{ time: number, text: string }>}
 */
function parseLRC(lrc) {
  if (!lrc || typeof lrc !== "string") return [];
  const lines = lrc.split("\n");
  const result = [];
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    timeRegex.lastIndex = 0;
    const timestamps = [];
    let match;

    while ((match = timeRegex.exec(trimmed)) !== null) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      let ms = 0;
      if (match[3]) {
        // Normalizar a milisegundos (2 o 3 dígitos)
        ms = match[3].length === 2
          ? parseInt(match[3], 10) * 10
          : parseInt(match[3].padEnd(3, "0").slice(0, 3), 10);
      }
      timestamps.push(min * 60 + sec + ms / 1000);
    }

    if (timestamps.length === 0) continue;

    // Remover las etiquetas [mm:ss.xx] para obtener el texto lírico limpio
    const text = trimmed.replace(/\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/g, "").trim();

    for (const time of timestamps) {
      result.push({ time, text });
    }
  }

  // Ordenar cronológicamente
  result.sort((a, b) => a.time - b.time);
  return result;
}

module.exports = {
  initLyricsTable,
  getSongLyrics,
  parseLRC,
  cleanSongMetadata,
  scoreCandidate,
  getLyricsCacheKey
};
