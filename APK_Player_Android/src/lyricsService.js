/**
 * Mexlify Android Player - Lyrics Service (LRCLIB Integration & Offline Persistence)
 * 
 * Implementa el mismo algoritmo de búsqueda y puntuación que Mexlify Desktop (Electron):
 * 1. Limpieza inteligente de metadatos (remover sufijos de video, features, etiquetas de calidad)
 * 2. Consulta en dos fases a LRCLIB (/api/get -> /api/search)
 * 3. Puntuación de candidatos (prioridad synced > plain, penalización a covers/remixes no coincidentes)
 * 4. Deduplicación de peticiones concurrentes
 */

const inFlightRequests = new Map();

/**
 * Normaliza cadenas para comparación insensible a mayúsculas, tildes y caracteres especiales
 */
export function normalizeText(str) {
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
export function cleanSongMetadata(rawTitle, rawArtist) {
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
    isCover,
  };
}

/**
 * Evalúa y puntúa candidatos de búsqueda en LRCLIB para evitar versiones incorrectas
 */
export function scoreCandidate(candidate, meta, targetDuration) {
  let score = 0;
  const candTrack = normalizeText(candidate.trackName || candidate.name || "");
  const candArtist = normalizeText(candidate.artistName || "");
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
  const candIsLive = /\b(live|en vivo|en directo|acustico|acoustic)\b/i.test((candidate.trackName || "") + " " + (candidate.albumName || ""));
  const candIsRemix = /\b(remix|mixed|club mix)\b/i.test((candidate.trackName || "") + " " + (candidate.albumName || ""));
  const candIsCover = /\b(cover|tribute|tributo|karaoke)\b/i.test((candidate.trackName || "") + " " + (candidate.artistName || ""));

  if (candIsLive && !meta.isLive) score -= 60;
  if (candIsRemix && !meta.isRemix) score -= 60;
  if (candIsCover && !meta.isCover) score -= 80;

  // 4. Comparación de duración (si está disponible)
  if (targetDuration > 0 && candidate.duration > 0) {
    const delta = Math.abs(candidate.duration - targetDuration);
    if (delta <= 4) {
      score += 35; // Muy buena coincidencia
    } else if (delta <= 8) {
      score += 15;
    } else if (delta > 25) {
      score -= 40;
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
    score -= 30;
  }

  return score;
}

/**
 * Petición HTTP segura a LRCLIB
 */
async function fetchLrclib(url, retryCount = 0) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.status === 429) {
      if (retryCount < 1) {
        const retryAfterSec = parseInt(res.headers.get("Retry-After") || "2", 10);
        const waitMs = Math.min(Math.max(retryAfterSec * 1000, 1500), 3000);
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
    return { status: 0, data: null, error: "network_error" };
  }
}

/**
 * Consulta en dos fases: /api/get -> /api/search
 */
async function queryLrclib(meta, duration, album) {
  const enc = encodeURIComponent;
  const cleanT = meta.title;
  const cleanA = meta.artist;

  // Fase 1: Coincidencia directa /api/get
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

  if (getRes.status === 429) return { found: false, rateLimited: true };
  if (getRes.error === "network_error") return { found: false, networkError: true };

  // Fase 2: Búsqueda flexible /api/search
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

  return { found: false, notAvailable: true };
}

/**
 * Método idéntico al de Electron para encontrar letras vía LRCLIB
 * @param {{ title: string, artist?: string, duration?: number, album?: string }} songParams
 * @returns {Promise<{ success: boolean, syncedLyrics?: string|null, plainLyrics?: string|null, isSynced?: boolean, instrumental?: boolean }>}
 */
export async function fetchSongLyricsFromLRCLIB(songParams) {
  const rawTitle = songParams?.title || "";
  const rawArtist = songParams?.artist || songParams?.uploader || "";
  const album = songParams?.album || "";
  const duration = typeof songParams?.duration === "number" ? songParams.duration : 0;

  if (!rawTitle.trim()) {
    return { success: false, notAvailable: true };
  }

  const meta = cleanSongMetadata(rawTitle, rawArtist);
  const cacheKey = `${normalizeText(meta.title)}||${normalizeText(meta.artist)}`;

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

        return {
          success: true,
          trackName: d.trackName || meta.title,
          artistName: d.artistName || meta.artist,
          syncedLyrics: d.syncedLyrics || null,
          plainLyrics: d.plainLyrics || null,
          isSynced: hasSynced,
          instrumental: !!d.instrumental,
          notAvailable: !hasSynced && !hasPlain && !d.instrumental,
        };
      }

      return {
        success: false,
        notAvailable: true,
      };
    } catch (err) {
      console.warn("fetchSongLyricsFromLRCLIB error:", err);
      return { success: false, error: err.message };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}
