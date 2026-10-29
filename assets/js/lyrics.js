/**
 * Mexlify Music - Synchronized Lyrics Engine (Apple Music Inspired)
 * 
 * - Integración con LRCLIB y caché local/SQLite
 * - Sincronización precisa en tiempo real con player.currentTime
 * - Desplazamiento inteligente que respeta el scroll manual del usuario (con botón "Sincronizar")
 * - Salto directo al pulsar cualquier línea de la canción
 * - Soporte para letras sincronizadas (syncedLyrics), normales (plainLyrics) y estado no disponible
 */

(function () {
  "use strict";

  // Elementos DOM del panel y controles
  const lyricsViewOverlay = document.getElementById("lyricsViewOverlay");
  const lyricsViewPanel = document.getElementById("lyricsViewPanel");
  const lyricsTabButton = document.getElementById("lyricsTabButton");
  const fcpLyricsBtn = document.getElementById("fcp-lyricsBtn");
  const closeLyricsBtn = document.getElementById("closeLyricsBtn");
  const lyricsRetrySearchBtn = document.getElementById("lyricsRetrySearchBtn");

  const lyricsCoverImg = document.getElementById("lyricsCoverImg");
  const lyricsBgArtwork = document.getElementById("lyricsBgArtwork");
  const lyricsTrackTitle = document.getElementById("lyricsTrackTitle");
  const lyricsArtistName = document.getElementById("lyricsArtistName");
  const lyricsAlbumName = document.getElementById("lyricsAlbumName");
  const lyricsModeBadge = document.getElementById("lyricsModeBadge");

  const lyricsScrollViewport = document.getElementById("lyricsScrollViewport");
  const lyricsLinesContainer = document.getElementById("lyricsLinesContainer");
  const lyricsSyncPillBtn = document.getElementById("lyricsSyncPillBtn");

  const player = document.getElementById("player");

  // Estado del motor de letras
  let isPanelOpen = false;
  let currentLyricsData = null; // { isSynced, lines: [], plainLyrics, notAvailable }
  let currentActiveIndex = -1;
  let activeLineElements = [];

  // Manejo de scroll suave y anulación por scroll manual (Apple Music style)
  let isUserScrolling = false;
  let userScrollTimeout = null;
  let isProgrammaticScroll = false;

  // Sesión y caché en memoria para descartar respuestas tardías
  let lyricsRequestSession = 0;
  const memoryCache = new Map();
  let lastSongKey = "";

  /**
   * Parser de LRC para el navegador con soporte de milisegundos y marcas múltiples
   */
  function parseLRC(lrcText) {
    if (!lrcText || typeof lrcText !== "string") return [];
    const lines = lrcText.split("\n");
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
          ms = match[3].length === 2
            ? parseInt(match[3], 10) * 10
            : parseInt(match[3].padEnd(3, "0").slice(0, 3), 10);
        }
        timestamps.push(min * 60 + sec + ms / 1000);
      }

      if (timestamps.length === 0) continue;

      const text = trimmed.replace(/\[\d{1,2}:\d{2}(?:\.\d{1,3})?\]/g, "").trim();

      for (const time of timestamps) {
        result.push({ time, text });
      }
    }

    result.sort((a, b) => a.time - b.time);
    return result;
  }

  /**
   * Obtiene la identidad de la canción actual desde el reproductor
   */
  function getCurrentTrackContext() {
    let title = "";
    let artist = "";
    let duration = 0;
    let coverUrl = "resources/player.gif";
    let album = "";

    if (window.currentSong) {
      title = window.currentSong.title || window.currentSong.Title || "";
      artist = window.currentSong.uploader || window.currentSong.Uploader || window.currentSong.artist || "";
      duration = window.currentSong.duration || window.currentSong.Duration || 0;
      coverUrl = window.currentSong.thumbnail || window.currentSong.Thumbnail || "resources/player.gif";
      album = window.currentSong.album || window.currentSong.Album || "";
    }

    // Fallbacks al DOM del reproductor si no está en variable global
    if (!title) {
      const elTitle = document.getElementById("songTitle") || document.getElementById("fcp-title");
      if (elTitle && elTitle.textContent) title = elTitle.textContent.trim();
    }
    if (!artist) {
      const elArtist = document.getElementById("songArtist") || document.getElementById("fcp-artist");
      if (elArtist && elArtist.textContent) artist = elArtist.textContent.trim();
    }
    if (!duration && player && !isNaN(player.duration) && player.duration > 0) {
      duration = player.duration;
    }
    if (coverUrl === "resources/player.gif") {
      const elCover = document.getElementById("cover") || document.getElementById("fcp-cover");
      if (elCover && elCover.src) coverUrl = elCover.src;
    }

    return { title, artist, duration, coverUrl, album };
  }

  /**
   * Genera clave única para la canción
   */
  function makeKey(track) {
    return `${(track.title || "").toLowerCase()}||${(track.artist || "").toLowerCase()}`;
  }

  /**
   * Actualiza el contexto visual (carátula, título, artista)
   */
  function updateVisualContext(track) {
    if (lyricsTrackTitle) lyricsTrackTitle.textContent = track.title || "Sin título";
    if (lyricsArtistName) lyricsArtistName.textContent = track.artist || "Artista desconocido";
    if (lyricsAlbumName) {
      lyricsAlbumName.textContent = track.album || "";
      lyricsAlbumName.style.display = track.album ? "block" : "none";
    }

    const cover = track.coverUrl || "resources/player.gif";
    if (lyricsCoverImg) lyricsCoverImg.src = cover;
    if (lyricsBgArtwork) lyricsBgArtwork.src = cover;
  }

  /**
   * Abre el panel de letras con animación fluida
   */
  function openLyricsPanel() {
    isPanelOpen = true;
    if (lyricsViewOverlay) lyricsViewOverlay.classList.remove("is-hidden");
    if (lyricsViewPanel) {
      lyricsViewPanel.classList.remove("is-hidden");
      lyricsViewPanel.setAttribute("aria-hidden", "false");
    }

    // Resaltar botones de letras
    if (lyricsTabButton) lyricsTabButton.classList.add("is-active");
    if (fcpLyricsBtn) fcpLyricsBtn.classList.add("is-active");

    const track = getCurrentTrackContext();
    updateVisualContext(track);

    const songKey = makeKey(track);
    if (!currentLyricsData || songKey !== lastSongKey) {
      loadLyricsForCurrentSong(track);
    } else {
      // Re-centrar suavemente en la línea activa si ya existían letras
      centerActiveLine(true);
    }
  }

  /**
   * Cierra el panel de letras
   */
  function closeLyricsPanel() {
    isPanelOpen = false;
    if (document.activeElement && lyricsViewPanel && lyricsViewPanel.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    if (lyricsViewOverlay) lyricsViewOverlay.classList.add("is-hidden");
    if (lyricsViewPanel) {
      lyricsViewPanel.classList.add("is-hidden");
      lyricsViewPanel.setAttribute("aria-hidden", "true");
    }

    if (lyricsTabButton) lyricsTabButton.classList.remove("is-active");
    if (fcpLyricsBtn) fcpLyricsBtn.classList.remove("is-active");

    if (lyricsSyncPillBtn) lyricsSyncPillBtn.classList.add("is-hidden");
    isUserScrolling = false;
  }

  /**
   * Alterna apertura y cierre
   */
  function toggleLyricsPanel() {
    if (isPanelOpen) {
      closeLyricsPanel();
    } else {
      openLyricsPanel();
    }
  }

  /**
   * Carga las letras de la canción actual (con caché en memoria y SQLite)
   */
  async function loadLyricsForCurrentSong(track, forceRefresh = false) {
    if (!track.title) {
      renderEmptyState("Reproduce una canción para ver su letra.");
      return;
    }

    const songKey = makeKey(track);
    lastSongKey = songKey;
    const sessionId = ++lyricsRequestSession;

    // Si ya está en memoria y no es forzado, mostrar instantáneamente
    if (!forceRefresh && memoryCache.has(songKey)) {
      const cachedData = memoryCache.get(songKey);
      renderLyrics(cachedData);
      return;
    }

    renderLoadingState(`Buscando letra de ${track.title}...`);

    try {
      if (!window.electronAPI || !window.electronAPI.getLyrics) {
        throw new Error("API de letras no disponible");
      }

      const res = await window.electronAPI.getLyrics({
        title: track.title,
        uploader: track.artist,
        duration: track.duration,
        album: track.album
      });

      // Si el usuario ya cambió a otra canción mientras cargaba, ignorar respuesta tardía
      if (sessionId !== lyricsRequestSession) {
        return;
      }

      if (res && res.success && !res.notAvailable) {
        let lines = [];
        let isSynced = false;

        if (res.syncedLyrics && res.syncedLyrics.trim().length > 0) {
          lines = parseLRC(res.syncedLyrics);
          isSynced = lines.length > 0;
        }

        const payload = {
          isSynced,
          lines,
          plainLyrics: res.plainLyrics || null,
          instrumental: !!res.instrumental,
          notAvailable: false
        };

        memoryCache.set(songKey, payload);
        currentLyricsData = payload;
        renderLyrics(payload);
      } else {
        const payload = { notAvailable: true, lines: [], isSynced: false };
        memoryCache.set(songKey, payload);
        currentLyricsData = payload;
        renderEmptyState();
      }
    } catch (err) {
      console.warn("[Lyrics] Error al obtener letras:", err.message);
      if (sessionId === lyricsRequestSession) {
        renderEmptyState();
      }
    }
  }

  /**
   * Renderiza el estado de carga
   */
  function renderLoadingState(msg) {
    if (lyricsModeBadge) lyricsModeBadge.classList.add("is-hidden");
    if (!lyricsLinesContainer) return;

    lyricsLinesContainer.innerHTML = `
      <div class="lyrics-loading-state">
        <div class="lyrics-pulse-dot"></div>
        <p style="font-size: 1.15rem; font-weight: 600; color: #fff;">${msg || "Buscando letras..."}</p>
        <span style="font-size: 0.88rem; color: rgba(255, 255, 255, 0.45);">Conectando con LRCLIB</span>
      </div>
    `;
    currentActiveIndex = -1;
    activeLineElements = [];
  }

  /**
   * Renderiza el estado cuando no hay letras disponibles
   */
  function renderEmptyState(customMsg) {
    if (lyricsModeBadge) lyricsModeBadge.classList.add("is-hidden");
    if (!lyricsLinesContainer) return;

    lyricsLinesContainer.innerHTML = `
      <div class="lyrics-empty-state">
        <i class="ph ph-microphone-slash"></i>
        <h3>Letra no disponible</h3>
        <p>${customMsg || "No pudimos encontrar una letra verificada para esta canción en LRCLIB."}</p>
        <button id="lyricsRetryInnerBtn" class="lyrics-retry-btn">
          <i class="ph ph-arrow-clockwise"></i> Buscar de nuevo
        </button>
      </div>
    `;

    currentActiveIndex = -1;
    activeLineElements = [];

    const retryBtn = document.getElementById("lyricsRetryInnerBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        const track = getCurrentTrackContext();
        loadLyricsForCurrentSong(track, true);
      });
    }
  }

  /**
   * Renderiza las letras (sincronizadas o normales)
   */
  function renderLyrics(data) {
    if (!lyricsLinesContainer) return;
    lyricsLinesContainer.innerHTML = "";
    currentActiveIndex = -1;
    activeLineElements = [];

    if (data.isSynced && data.lines && data.lines.length > 0) {
      // 1. Letras Sincronizadas (Apple Music Style)
      if (lyricsModeBadge) {
        lyricsModeBadge.className = "lyrics-mode-badge is-synced";
        lyricsModeBadge.innerHTML = '<i class="ph ph-sparkle"></i> Sincronizada';
        lyricsModeBadge.classList.remove("is-hidden");
      }

      const fragment = document.createDocumentFragment();

      data.lines.forEach((lineObj, idx) => {
        const lineEl = document.createElement("div");
        lineEl.className = "lyrics-line";
        lineEl.textContent = lineObj.text || "♪";
        lineEl.dataset.time = lineObj.time;
        lineEl.dataset.index = idx;

        // Salto directo al pulsar la línea (seeks audio.currentTime)
        lineEl.addEventListener("click", () => {
          const targetSec = parseFloat(lineEl.dataset.time);
          if (!isNaN(targetSec) && player) {
            player.currentTime = targetSec;
            if (player.paused) {
              player.play().catch(() => {});
            }
            resumeAutoScroll();
          }
        });

        fragment.appendChild(lineEl);
        activeLineElements.push(lineEl);
      });

      lyricsLinesContainer.appendChild(fragment);

      // Centrar de inmediato según la posición actual del audio
      if (player && !isNaN(player.currentTime)) {
        syncLyricsWithTime(player.currentTime, true);
      }
    } else if (data.plainLyrics) {
      // 2. Letras Sin Sincronizar (Párrafos limpios y legibles)
      if (lyricsModeBadge) {
        lyricsModeBadge.className = "lyrics-mode-badge is-plain";
        lyricsModeBadge.innerHTML = '<i class="ph ph-text-align-left"></i> Sin sincronizar';
        lyricsModeBadge.classList.remove("is-hidden");
      }

      const plainBox = document.createElement("div");
      plainBox.className = "lyrics-plain-container";

      // Dividir por bloques de párrafos para lectura óptima
      const paragraphs = data.plainLyrics.split(/\n\s*\n/);
      paragraphs.forEach((pText) => {
        if (!pText.trim()) return;
        const pEl = document.createElement("p");
        pEl.className = "lyrics-plain-paragraph";
        pEl.textContent = pText.trim();
        plainBox.appendChild(pEl);
      });

      lyricsLinesContainer.appendChild(plainBox);
    } else if (data.instrumental) {
      renderEmptyState("Esta pista es instrumental (sin voz).");
    } else {
      renderEmptyState();
    }
  }

  /**
   * Sincronización precisa con el tiempo de reproducción
   */
  function syncLyricsWithTime(currentTime, forceScroll = false) {
    if (!currentLyricsData || !currentLyricsData.isSynced || !currentLyricsData.lines) {
      return;
    }

    const lines = currentLyricsData.lines;
    const len = lines.length;
    if (len === 0) return;

    // Búsqueda del índice activo correspondiente a currentTime
    let activeIdx = -1;
    if (currentTime >= lines[0].time) {
      // Búsqueda binaria para máximo rendimiento
      let low = 0;
      let high = len - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (lines[mid].time <= currentTime) {
          activeIdx = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
    }

    // Si la línea activa no ha cambiado, no tocar el DOM
    if (activeIdx === currentActiveIndex && !forceScroll) {
      return;
    }

    currentActiveIndex = activeIdx;

    // Actualizar clases CSS de forma eficiente
    for (let i = 0; i < activeLineElements.length; i++) {
      const el = activeLineElements[i];
      if (i === activeIdx) {
        el.classList.add("active");
        el.classList.remove("passed");
      } else if (i < activeIdx) {
        el.classList.remove("active");
        el.classList.add("passed");
      } else {
        el.classList.remove("active");
        el.classList.remove("passed");
      }
    }

    // Auto-scroll suave (solo si el usuario no está desplazando manualmente)
    if (!isUserScrolling || forceScroll) {
      centerActiveLine(forceScroll);
    }
  }

  /**
   * Centra suavemente la línea activa a ~38% de la parte superior del visor (Sweet spot Apple Music)
   */
  function centerActiveLine(immediate = false) {
    if (currentActiveIndex < 0 || currentActiveIndex >= activeLineElements.length) {
      return;
    }
    if (!lyricsScrollViewport) return;

    const activeEl = activeLineElements[currentActiveIndex];
    if (!activeEl) return;

    const viewportHeight = lyricsScrollViewport.clientHeight;
    // Posicionar a 38% de altura para leer cómodamente hacia adelante
    const targetScroll = activeEl.offsetTop - (viewportHeight * 0.38) + (activeEl.clientHeight / 2);

    isProgrammaticScroll = true;
    lyricsScrollViewport.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: immediate ? "auto" : "smooth"
    });

    setTimeout(() => {
      isProgrammaticScroll = false;
    }, 450);
  }

  /**
   * Reanuda el desplazamiento automático (ocultando el botón flotante "Sincronizar")
   */
  function resumeAutoScroll() {
    isUserScrolling = false;
    if (userScrollTimeout) {
      clearTimeout(userScrollTimeout);
      userScrollTimeout = null;
    }
    if (lyricsSyncPillBtn) {
      lyricsSyncPillBtn.classList.add("is-hidden");
    }
    centerActiveLine(false);
  }

  /**
   * Detección de scroll manual del usuario (Apple Music style)
   */
  function setupUserScrollDetection() {
    if (!lyricsScrollViewport) return;

    const handleUserScrollInteraction = () => {
      if (isProgrammaticScroll) return;
      if (!currentLyricsData || !currentLyricsData.isSynced) return;

      isUserScrolling = true;
      if (lyricsSyncPillBtn) {
        lyricsSyncPillBtn.classList.remove("is-hidden");
      }

      // Reiniciar temporizador de reposo: 4 segundos de inactividad reanudan el auto-scroll
      if (userScrollTimeout) clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => {
        resumeAutoScroll();
      }, 4200);
    };

    lyricsScrollViewport.addEventListener("wheel", handleUserScrollInteraction, { passive: true });
    lyricsScrollViewport.addEventListener("touchstart", handleUserScrollInteraction, { passive: true });
    lyricsScrollViewport.addEventListener("pointerdown", handleUserScrollInteraction, { passive: true });
    lyricsScrollViewport.addEventListener("scroll", () => {
      if (!isProgrammaticScroll && currentLyricsData && currentLyricsData.isSynced) {
        handleUserScrollInteraction();
      }
    }, { passive: true });

    if (lyricsSyncPillBtn) {
      lyricsSyncPillBtn.addEventListener("click", () => {
        resumeAutoScroll();
      });
    }
  }

  /**
   * Configuración de eventos del reproductor de audio
   */
  function setupAudioEvents() {
    if (!player) return;

    // Sincronización en tiempo real
    player.addEventListener("timeupdate", () => {
      if (isPanelOpen) {
        syncLyricsWithTime(player.currentTime);
      }
    });

    // Búsqueda manual de tiempo (seek)
    player.addEventListener("seeked", () => {
      if (isPanelOpen) {
        syncLyricsWithTime(player.currentTime, true);
      }
    });

    // Cambio de canción: detecta nuevo track y actualiza inmediatamente
    player.addEventListener("play", () => {
      const track = getCurrentTrackContext();
      const songKey = makeKey(track);
      if (songKey && songKey !== lastSongKey) {
        updateVisualContext(track);
        if (isPanelOpen) {
          loadLyricsForCurrentSong(track);
        }
      }
    });

    player.addEventListener("loadedmetadata", () => {
      const track = getCurrentTrackContext();
      const songKey = makeKey(track);
      if (songKey && songKey !== lastSongKey) {
        updateVisualContext(track);
        if (isPanelOpen) {
          loadLyricsForCurrentSong(track);
        }
      }
    });
  }

  /**
   * Inicialización global de controles y atajos
   */
  function init() {
    // Botón en el reproductor lateral (aside)
    if (lyricsTabButton) {
      lyricsTabButton.addEventListener("click", () => {
        if (document.activeElement) document.activeElement.blur();
        toggleLyricsPanel();
      });
    }

    // Botón en el footer compact player
    if (fcpLyricsBtn) {
      fcpLyricsBtn.addEventListener("click", () => {
        if (document.activeElement) document.activeElement.blur();
        toggleLyricsPanel();
      });
    }

    // Botón de cerrar (X)
    if (closeLyricsBtn) {
      closeLyricsBtn.addEventListener("click", closeLyricsPanel);
    }

    // Clic en el fondo / overlay cierra el panel
    if (lyricsViewOverlay) {
      lyricsViewOverlay.addEventListener("click", closeLyricsPanel);
    }

    // Botón de reintento en el encabezado
    if (lyricsRetrySearchBtn) {
      lyricsRetrySearchBtn.addEventListener("click", () => {
        const track = getCurrentTrackContext();
        loadLyricsForCurrentSong(track, true);
      });
    }

    // Atajo de teclado: Tecla Escape cierra el panel
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isPanelOpen) {
        closeLyricsPanel();
      }
    });

    setupUserScrollDetection();
    setupAudioEvents();

    // Exponer API global para integración con script.js
    window.mexlifyLyrics = {
      open: openLyricsPanel,
      close: closeLyricsPanel,
      toggle: toggleLyricsPanel,
      reload: () => {
        const track = getCurrentTrackContext();
        loadLyricsForCurrentSong(track, true);
      },
      onSongChange: (newSong) => {
        if (!newSong) return;
        const track = {
          title: newSong.title || newSong.Title || "",
          artist: newSong.uploader || newSong.Uploader || newSong.artist || "",
          duration: newSong.duration || newSong.Duration || 0,
          coverUrl: newSong.thumbnail || newSong.Thumbnail || "resources/player.gif",
          album: newSong.album || newSong.Album || ""
        };
        updateVisualContext(track);
        const songKey = makeKey(track);
        if (isPanelOpen && songKey !== lastSongKey) {
          loadLyricsForCurrentSong(track);
        }
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
