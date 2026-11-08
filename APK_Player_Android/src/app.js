/**
 * Mexlify Android Player - Main Application Logic (v2.0)
 * Integración de AudioEngine, LyricsEngine, Storage, SyncClient,
 * Gestos táctiles, Navegación Atrás de Android, Notch Safe-Area y Notificaciones MediaSession
 */

import { storage } from "./storage.js";
import { audioEngine } from "./audioEngine.js";
import { LyricsEngine } from "./lyricsEngine.js";
import { syncClient } from "./syncClient.js";
import { fetchSongLyricsFromLRCLIB } from "./lyricsService.js";
import jsQR from "jsqr";

// Instancias y estado global
const lyricsEngine = new LyricsEngine();
let cachedSongsList = [];
let displayedSongsList = [];
let currentDiffPlan = null;
let activeFilter = "all"; // "all" | "lrc"
let isUserScrubbing = false;

// ==========================================
// ELEMENTOS DOM
// ==========================================
const songListContainer = document.getElementById("songListContainer");
const emptyLibraryState = document.getElementById("emptyLibraryState");
const songsCountEl = document.getElementById("songsCountEl");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const filterAllBtn = document.getElementById("filterAllBtn");
const filterLrcBtn = document.getElementById("filterLrcBtn");
const playAllBtn = document.getElementById("playAllBtn");
const quickShuffleAllBtn = document.getElementById("quickShuffleAllBtn");
const dynamicAudioPill = document.getElementById("dynamicAudioPill");
const dynamicPillText = document.getElementById("dynamicPillText");

// Mini Player
const miniPlayer = document.getElementById("miniPlayer");
const miniCoverImg = document.getElementById("miniCoverImg");
const miniTitle = document.getElementById("miniTitle");
const miniArtist = document.getElementById("miniArtist");
const miniPrevBtn = document.getElementById("miniPrevBtn");
const miniPlayPauseBtn = document.getElementById("miniPlayPauseBtn");
const miniNextBtn = document.getElementById("miniNextBtn");
const miniProgressFill = document.getElementById("miniProgressFill");
const miniExpandBtn = document.getElementById("miniExpandBtn");

// Full Player
const fullPlayerModal = document.getElementById("fullPlayerModal");
const fullPlayerAmbientArt = document.getElementById("fullPlayerAmbientArt");
const fullPlayerDragZone = document.getElementById("fullPlayerDragZone");
const closeFullPlayerBtn = document.getElementById("closeFullPlayerBtn");
const fullOpenLyricsTopBtn = document.getElementById("fullOpenLyricsTopBtn");
const fullCoverSwipeArea = document.getElementById("fullCoverSwipeArea");
const fullCoverImg = document.getElementById("fullCoverImg");
const fullTitle = document.getElementById("fullTitle");
const fullArtist = document.getElementById("fullArtist");
const fullLrcBadge = document.getElementById("fullLrcBadge");
const fullScrubber = document.getElementById("fullScrubber");
const fullCurrentTime = document.getElementById("fullCurrentTime");
const fullDurationTime = document.getElementById("fullDurationTime");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const openLyricsBar = document.getElementById("openLyricsBar");
const liveLyricPreviewText = document.getElementById("liveLyricPreviewText");

// Lyrics Modal
const lyricsModal = document.getElementById("lyricsModal");
const lyricsAmbientArt = document.getElementById("lyricsAmbientArt");
const lyricsDragZone = document.getElementById("lyricsDragZone");
const lyricsHeaderZone = document.getElementById("lyricsHeaderZone");
const lyricsHeaderCover = document.getElementById("lyricsHeaderCover");
const closeLyricsModalBtn = document.getElementById("closeLyricsModalBtn");
const refreshLyricsBtn = document.getElementById("refreshLyricsBtn");
const lyricsSongTitle = document.getElementById("lyricsSongTitle");
const lyricsSongArtist = document.getElementById("lyricsSongArtist");
const lyricsContentContainer = document.getElementById("lyricsContentContainer");
const lyricsMiniProgressFill = document.getElementById("lyricsMiniProgressFill");
const lyricsCurrentTime = document.getElementById("lyricsCurrentTime");
const lyricsDurationTime = document.getElementById("lyricsDurationTime");
const lyricsPrevBtn = document.getElementById("lyricsPrevBtn");
const lyricsPlayPauseBtn = document.getElementById("lyricsPlayPauseBtn");
const lyricsNextBtn = document.getElementById("lyricsNextBtn");

// Sync Modal
const openSyncModalBtn = document.getElementById("openSyncModalBtn");
const emptySyncBtn = document.getElementById("emptySyncBtn");
const syncModal = document.getElementById("syncModal");
const syncSheetBox = document.getElementById("syncSheetBox");
const syncDragZone = document.getElementById("syncDragZone");
const closeSyncModalBtn = document.getElementById("closeSyncModalBtn");
const serverIpInput = document.getElementById("serverIpInput");
const checkDiffBtn = document.getElementById("checkDiffBtn");
const syncDiffSection = document.getElementById("syncDiffSection");
const diffTotalRemote = document.getElementById("diffTotalRemote");
const diffAlreadySynced = document.getElementById("diffAlreadySynced");
const diffToDownload = document.getElementById("diffToDownload");
const startSyncActionBtn = document.getElementById("startSyncActionBtn");
const syncProgressWrapper = document.getElementById("syncProgressWrapper");
const syncProgressBarFill = document.getElementById("syncProgressBarFill");
const syncStatusMsg = document.getElementById("syncStatusMsg");

// ==========================================
// 0. INICIALIZACIÓN DE SAFE AREA / NOTCH
// ==========================================
function initNativeSafeInsets() {
  if (window.MexlifyNative && typeof window.MexlifyNative.getSafeInsets === "function") {
    try {
      const raw = window.MexlifyNative.getSafeInsets();
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.top === "number") {
        document.documentElement.style.setProperty("--safe-top", `${parsed.top}px`);
      }
      if (parsed && typeof parsed.bottom === "number") {
        document.documentElement.style.setProperty("--safe-bottom", `${parsed.bottom}px`);
      }
    } catch (_) {}
  }
}
initNativeSafeInsets();

// Formateador de tiempo mm:ss
function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Actualizador visual del slider de progreso
function updateScrubberVisual(percent0to100) {
  const clamped = Math.max(0, Math.min(100, percent0to100 || 0));
  if (fullScrubber) {
    fullScrubber.value = String(Math.round(clamped * 10));
    fullScrubber.style.setProperty("--seek-percent", `${clamped.toFixed(2)}%`);
  }
}

// ==========================================
// 1. CARGA, FILTRADO Y RENDERIZADO DE BIBLIOTECA
// ==========================================
async function loadLibrary() {
  try {
    cachedSongsList = await storage.getAllSongs();
    // Ordenar más recientes primero
    cachedSongsList.sort((a, b) => {
      const ta = new Date(a.syncedAt || a.mtime || 0).getTime();
      const tb = new Date(b.syncedAt || b.mtime || 0).getTime();
      return tb - ta;
    });
    if (songsCountEl) {
      songsCountEl.textContent = String(cachedSongsList.length);
    }
    applyFiltersAndRender();
  } catch (err) {
    console.error("Error cargando biblioteca offline:", err);
  }
}

function applyFiltersAndRender() {
  const query = (searchInput?.value || "").toLowerCase().trim();
  if (clearSearchBtn) {
    clearSearchBtn.classList.toggle("is-hidden", query.length === 0);
  }

  let filtered = cachedSongsList;
  if (activeFilter === "lrc") {
    filtered = filtered.filter((s) => Boolean(s.hasLyrics || (s.lrcText && s.lrcText.trim().length > 0)));
  }

  if (query) {
    filtered = filtered.filter((s) => {
      return (
        (s.title || "").toLowerCase().includes(query) ||
        (s.artist || "").toLowerCase().includes(query) ||
        (s.filename || "").toLowerCase().includes(query)
      );
    });
  }

  displayedSongsList = filtered;
  renderSongList(displayedSongsList);
}

function renderSongList(songs) {
  songListContainer.innerHTML = "";

  if (cachedSongsList.length === 0) {
    emptyLibraryState.style.display = "block";
    return;
  }

  emptyLibraryState.style.display = "none";

  if (songs.length === 0) {
    songListContainer.innerHTML = `
      <div class="lyrics-empty" style="padding: 36px 12px;">
        <i class="ph ph-magnifying-glass"></i>
        <p>No se encontraron canciones con ese filtro</p>
      </div>
    `;
    return;
  }

  const currentSong = audioEngine.getCurrentSong();
  const isPaused = !audioEngine.isPlaying;

  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "song-card";
    const isThisPlaying = currentSong && currentSong.id === song.id;
    if (isThisPlaying) {
      card.classList.add("is-playing");
    }

    const coverUrl = storage.getCoverUrl(song);
    const hasLrc = Boolean(song.hasLyrics || (song.lrcText && song.lrcText.trim().length > 0));

    card.innerHTML = `
      <div class="song-left">
        <div class="song-thumb-container">
          <img class="song-cover-thumb" src="${coverUrl}" alt="Cover" onerror="this.src='assets/default_cover.png'">
          <div class="song-playing-overlay">
            <span class="eq-bars ${isPaused ? "is-paused" : ""}">
              <i></i><i></i><i></i>
            </span>
          </div>
        </div>
        <div class="song-meta">
          <div class="song-title-text">${song.title || song.filename}</div>
          <div class="song-artist-text">${song.artist || "Desconocido"}</div>
        </div>
      </div>
      <div class="song-right">
        ${hasLrc ? '<span class="lyrics-tag">LRC</span>' : ""}
        <span class="song-duration">${formatTime(song.duration || 0)}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      if (currentSong && currentSong.id === song.id) {
        openFullPlayer();
      } else {
        audioEngine.setQueue(songs, index);
      }
    });

    songListContainer.appendChild(card);
  });
}

// Búsqueda y Filtros
if (searchInput) {
  searchInput.addEventListener("input", () => applyFiltersAndRender());
}

if (clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    applyFiltersAndRender();
  });
}

if (filterAllBtn) {
  filterAllBtn.addEventListener("click", () => {
    activeFilter = "all";
    filterAllBtn.classList.add("is-active");
    filterLrcBtn?.classList.remove("is-active");
    applyFiltersAndRender();
  });
}

if (filterLrcBtn) {
  filterLrcBtn.addEventListener("click", () => {
    activeFilter = "lrc";
    filterLrcBtn.classList.add("is-active");
    filterAllBtn?.classList.remove("is-active");
    applyFiltersAndRender();
  });
}

if (playAllBtn) {
  playAllBtn.addEventListener("click", () => {
    const targetList = displayedSongsList.length > 0 ? displayedSongsList : cachedSongsList;
    if (targetList.length === 0) {
      openSyncModal();
      return;
    }
    if (audioEngine.isShuffle) {
      audioEngine.toggleShuffle();
    }
    audioEngine.setQueue(targetList, 0);
    openFullPlayer();
  });
}

if (quickShuffleAllBtn) {
  quickShuffleAllBtn.addEventListener("click", () => {
    const targetList = displayedSongsList.length > 0 ? displayedSongsList : cachedSongsList;
    if (targetList.length === 0) {
      openSyncModal();
      return;
    }
    const randomStart = Math.floor(Math.random() * targetList.length);
    if (!audioEngine.isShuffle) {
      audioEngine.toggleShuffle();
    }
    audioEngine.setQueue(targetList, randomStart);
    openFullPlayer();
  });
}

if (dynamicAudioPill) {
  dynamicAudioPill.addEventListener("click", () => {
    openFullPlayer();
  });
}

// ==========================================
// 2. CONEXIÓN DE AUDIO ENGINE, BARRA DE PROGRESO & UI
// ==========================================
function syncPlayPauseIcons(isPlaying) {
  const iconHtml = isPlaying ? '<i class="ph-fill ph-pause"></i>' : '<i class="ph-fill ph-play"></i>';
  if (miniPlayPauseBtn) miniPlayPauseBtn.innerHTML = iconHtml;
  if (playPauseBtn) playPauseBtn.innerHTML = iconHtml;
  if (lyricsPlayPauseBtn) lyricsPlayPauseBtn.innerHTML = iconHtml;

  if (fullCoverImg) {
    fullCoverImg.classList.toggle("is-paused", !isPlaying);
  }

  document.querySelectorAll(".eq-bars").forEach((el) => {
    el.classList.toggle("is-paused", !isPlaying);
  });
}

audioEngine.on("trackchange", (song) => {
  if (!song) return;
  miniPlayer.classList.remove("is-hidden");
  if (dynamicAudioPill) {
    dynamicAudioPill.classList.remove("is-hidden");
  }
  if (dynamicPillText) {
    dynamicPillText.textContent = song.title || "Sonando";
  }

  const coverUrl = storage.getCoverUrl(song);
  const titleText = song.title || song.filename || "Sin título";
  const artistText = song.artist || "Desconocido";
  const hasLrc = Boolean(song.hasLyrics || (song.lrcText && song.lrcText.trim().length > 0));

  // Actualizar Mini Player
  miniTitle.textContent = titleText;
  miniArtist.textContent = artistText;
  miniCoverImg.src = coverUrl;

  // Actualizar Full Player y Fondo Ambiental Difuminado (Apple Music Style)
  fullTitle.textContent = titleText;
  fullArtist.textContent = artistText;
  fullCoverImg.src = coverUrl;
  if (fullPlayerAmbientArt) fullPlayerAmbientArt.src = coverUrl;
  if (lyricsAmbientArt) lyricsAmbientArt.src = coverUrl;
  if (fullLrcBadge) {
    fullLrcBadge.classList.toggle("is-hidden", !hasLrc);
  }

  // Reiniciar Scrubber para la nueva pista
  const initialDur = song.duration || 0;
  fullCurrentTime.textContent = "0:00";
  fullDurationTime.textContent = formatTime(initialDur);
  if (lyricsCurrentTime) lyricsCurrentTime.textContent = "0:00";
  if (lyricsDurationTime) lyricsDurationTime.textContent = formatTime(initialDur);
  if (!isUserScrubbing) {
    updateScrubberVisual(0);
  }
  miniProgressFill.style.width = "0%";
  if (lyricsMiniProgressFill) lyricsMiniProgressFill.style.width = "0%";

  // Actualizar Modal de Letras
  lyricsSongTitle.textContent = titleText;
  lyricsSongArtist.textContent = artistText;
  if (lyricsHeaderCover) lyricsHeaderCover.src = coverUrl;

  if (song.lrcText && song.lrcText.trim().length > 0) {
    lyricsEngine.parseLRC(song.lrcText);
    lyricsEngine.render(lyricsContentContainer, (seekTime) => {
      audioEngine.seek(seekTime);
    });
    if (liveLyricPreviewText) {
      liveLyricPreviewText.textContent = lyricsEngine.getActiveLineText() || "Letras sincronizadas";
    }
  } else {
    lyricsEngine.parseLRC("");
    lyricsEngine.render(lyricsContentContainer, (seekTime) => {
      audioEngine.seek(seekTime);
    });
    if (liveLyricPreviewText) {
      liveLyricPreviewText.textContent = "Buscando letra sincronizada...";
    }
    fetchAndSaveLyricsForSong(song);
  }

  applyFiltersAndRender();
});

audioEngine.on("loadedmetadata", ({ duration }) => {
  if (duration > 0) {
    fullDurationTime.textContent = formatTime(duration);
    if (lyricsDurationTime) lyricsDurationTime.textContent = formatTime(duration);
  }
});

audioEngine.on("play", () => {
  syncPlayPauseIcons(true);
});

audioEngine.on("pause", () => {
  syncPlayPauseIcons(false);
});

audioEngine.on("timeupdate", ({ currentTime, duration }) => {
  const effectiveDur = duration > 0 ? duration : audioEngine.getEffectiveDuration();

  if (effectiveDur > 0) {
    fullDurationTime.textContent = formatTime(effectiveDur);
    if (lyricsDurationTime) lyricsDurationTime.textContent = formatTime(effectiveDur);

    const percent = Math.max(0, Math.min(100, (currentTime / effectiveDur) * 100));
    miniProgressFill.style.width = `${percent}%`;
    if (lyricsMiniProgressFill) lyricsMiniProgressFill.style.width = `${percent}%`;

    // Solo actualizar el slider si el usuario NO lo está arrastrando con el dedo
    if (!isUserScrubbing) {
      fullCurrentTime.textContent = formatTime(currentTime);
      updateScrubberVisual(percent);
    }
  } else if (!isUserScrubbing) {
    fullCurrentTime.textContent = formatTime(currentTime);
  }

  if (lyricsCurrentTime) {
    lyricsCurrentTime.textContent = formatTime(currentTime);
  }

  // Sincronizar letras activas y vista previa en vivo
  lyricsEngine.syncTime(currentTime);
  if (liveLyricPreviewText && lyricsEngine.lines.length > 0) {
    const activeText = lyricsEngine.getActiveLineText();
    if (activeText) {
      liveLyricPreviewText.textContent = activeText;
    }
  }
});

// ==========================================
// BARRA DE PROGRESO / SCRUBBER REPARADA (SIN SALTOS)
// ==========================================
function beginScrub() {
  isUserScrubbing = true;
}

function moveScrub() {
  isUserScrubbing = true;
  const val = parseFloat(fullScrubber.value) || 0; // 0..1000
  const percent = val / 10; // 0..100
  fullScrubber.style.setProperty("--seek-percent", `${percent.toFixed(2)}%`);

  const dur = audioEngine.getEffectiveDuration();
  if (dur > 0) {
    const previewTime = (percent / 100) * dur;
    fullCurrentTime.textContent = formatTime(previewTime);
  }
}

function endScrub() {
  if (!isUserScrubbing) return;
  const val = parseFloat(fullScrubber.value) || 0;
  const percent = val / 10;
  const dur = audioEngine.getEffectiveDuration();
  isUserScrubbing = false;

  if (dur > 0) {
    const targetTime = (percent / 100) * dur;
    audioEngine.seek(targetTime);
  }
}

if (fullScrubber) {
  fullScrubber.addEventListener("pointerdown", beginScrub);
  fullScrubber.addEventListener("touchstart", beginScrub, { passive: true });
  fullScrubber.addEventListener("mousedown", beginScrub);

  fullScrubber.addEventListener("input", moveScrub);

  fullScrubber.addEventListener("change", endScrub);
  fullScrubber.addEventListener("pointerup", endScrub);
  fullScrubber.addEventListener("touchend", endScrub);
  fullScrubber.addEventListener("mouseup", endScrub);
}

// Controles de transporte (Mini Player, Full Player y Lyrics Modal)
if (miniPrevBtn) {
  miniPrevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    audioEngine.prev();
  });
}

if (miniPlayPauseBtn) {
  miniPlayPauseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    audioEngine.togglePlay();
  });
}

if (miniNextBtn) {
  miniNextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    audioEngine.next();
  });
}

playPauseBtn?.addEventListener("click", () => audioEngine.togglePlay());
nextBtn?.addEventListener("click", () => audioEngine.next());
prevBtn?.addEventListener("click", () => audioEngine.prev());

lyricsPlayPauseBtn?.addEventListener("click", () => audioEngine.togglePlay());
lyricsNextBtn?.addEventListener("click", () => audioEngine.next());
lyricsPrevBtn?.addEventListener("click", () => audioEngine.prev());

shuffleBtn?.addEventListener("click", () => audioEngine.toggleShuffle());
repeatBtn?.addEventListener("click", () => audioEngine.toggleRepeat());

audioEngine.on("shufflechange", (isShuffle) => {
  shuffleBtn?.classList.toggle("is-active", isShuffle);
});

audioEngine.on("repeatchange", (repeatMode) => {
  if (!repeatBtn) return;
  if (repeatMode === "off") {
    repeatBtn.classList.remove("is-active");
    repeatBtn.innerHTML = '<i class="ph ph-repeat"></i>';
  } else if (repeatMode === "all") {
    repeatBtn.classList.add("is-active");
    repeatBtn.innerHTML = '<i class="ph-fill ph-repeat"></i>';
  } else if (repeatMode === "one") {
    repeatBtn.classList.add("is-active");
    repeatBtn.innerHTML = '<i class="ph-fill ph-repeat-once"></i>';
  }
});

// ==========================================
// NAVEGACIÓN DE MODALES, BOTÓN ATRÁS Y GESTOS TÁCTILES
// ==========================================
function pushModalHistory(modalName) {
  try {
    window.history.pushState({ mexlifyModal: modalName }, "");
  } catch (_) {}
}

function openFullPlayer() {
  if (!fullPlayerModal.classList.contains("is-open")) {
    fullPlayerModal.style.transform = "";
    fullPlayerModal.classList.add("is-open");
    pushModalHistory("fullPlayer");
  }
}

function closeFullPlayer() {
  fullPlayerModal.style.transform = "";
  fullPlayerModal.classList.remove("is-open");
}

function openLyricsModal() {
  if (!lyricsModal.classList.contains("is-open")) {
    lyricsModal.style.transform = "";
    lyricsModal.classList.add("is-open");
    pushModalHistory("lyrics");
  }
  const cur = audioEngine.getCurrentSong();
  if (cur && (!cur.lrcText || cur.lrcText.trim().length === 0)) {
    fetchAndSaveLyricsForSong(cur);
  } else {
    setTimeout(() => lyricsEngine.scrollToActive(), 120);
  }
}

function closeLyricsModal() {
  lyricsModal.style.transform = "";
  lyricsModal.classList.remove("is-open");
}

function openSyncModal() {
  const savedIp = localStorage.getItem("mexlify_last_sync_ip") || "";
  if (savedIp) serverIpInput.value = savedIp;
  if (!syncModal.classList.contains("is-open")) {
    if (syncSheetBox) syncSheetBox.style.transform = "";
    syncModal.classList.add("is-open");
    pushModalHistory("sync");
  }
}

function closeSyncModal() {
  if (syncSheetBox) syncSheetBox.style.transform = "";
  syncModal.classList.remove("is-open");
}

miniExpandBtn?.addEventListener("click", openFullPlayer);
closeFullPlayerBtn?.addEventListener("click", closeFullPlayer);
openLyricsBar?.addEventListener("click", openLyricsModal);
fullOpenLyricsTopBtn?.addEventListener("click", openLyricsModal);
closeLyricsModalBtn?.addEventListener("click", closeLyricsModal);
openSyncModalBtn?.addEventListener("click", openSyncModal);
emptySyncBtn?.addEventListener("click", openSyncModal);
closeSyncModalBtn?.addEventListener("click", closeSyncModal);

// Cerrar syncModal al tocar el fondo oscuro
syncModal?.addEventListener("click", (e) => {
  if (e.target === syncModal) {
    closeSyncModal();
  }
});

// Manejador global del gesto / botón "Volver" de Android (Invocado desde MainActivity.java y popstate)
window.__handleAndroidBack = function () {
  if (scannerModal && scannerModal.classList.contains("is-open")) {
    stopQrScanner();
    return true;
  }
  if (lyricsModal && lyricsModal.classList.contains("is-open")) {
    closeLyricsModal();
    return true;
  }
  if (syncModal && syncModal.classList.contains("is-open")) {
    closeSyncModal();
    return true;
  }
  if (fullPlayerModal && fullPlayerModal.classList.contains("is-open")) {
    closeFullPlayer();
    return true;
  }
  if (searchInput && (document.activeElement === searchInput || searchInput.value.trim().length > 0)) {
    searchInput.value = "";
    searchInput.blur();
    applyFiltersAndRender();
    return true;
  }
  if (activeFilter !== "all") {
    activeFilter = "all";
    filterAllBtn?.classList.add("is-active");
    filterLrcBtn?.classList.remove("is-active");
    applyFiltersAndRender();
    return true;
  }
  return false;
};

window.addEventListener("popstate", () => {
  window.__handleAndroidBack();
});

// Helper para configurar gestos de deslizar hacia abajo (Swipe Down to Dismiss)
function attachSwipeDownDismiss(triggerEl, targetModalEl, onDismiss) {
  if (!triggerEl || !targetModalEl) return;
  let startY = 0;
  let startX = 0;
  let currentDeltaY = 0;
  let tracking = false;

  triggerEl.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
    currentDeltaY = 0;
    tracking = true;
    targetModalEl.style.transition = "none";
  }, { passive: true });

  triggerEl.addEventListener("touchmove", (e) => {
    if (!tracking || !e.touches || e.touches.length !== 1) return;
    const dy = e.touches[0].clientY - startY;
    const dx = e.touches[0].clientX - startX;

    if (dy > 0 && Math.abs(dy) > Math.abs(dx)) {
      currentDeltaY = dy;
      targetModalEl.style.transform = `translateY(${Math.min(dy, 420)}px)`;
    }
  }, { passive: true });

  triggerEl.addEventListener("touchend", () => {
    if (!tracking) return;
    tracking = false;
    targetModalEl.style.transition = "";
    if (currentDeltaY > 75) {
      onDismiss();
    } else {
      targetModalEl.style.transform = "";
    }
    currentDeltaY = 0;
  }, { passive: true });
}

attachSwipeDownDismiss(fullPlayerDragZone, fullPlayerModal, closeFullPlayer);
attachSwipeDownDismiss(lyricsDragZone, lyricsModal, closeLyricsModal);
attachSwipeDownDismiss(lyricsHeaderZone, lyricsModal, closeLyricsModal);
attachSwipeDownDismiss(syncDragZone, syncSheetBox, closeSyncModal);

// Gestos en la carátula del Full Player (Swipe Izquierda/Derecha = Siguiente/Anterior, Swipe Abajo = Minimizar, Swipe Arriba = Letras)
if (fullCoverSwipeArea) {
  let cStartX = 0;
  let cStartY = 0;

  fullCoverSwipeArea.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    cStartX = e.touches[0].clientX;
    cStartY = e.touches[0].clientY;
  }, { passive: true });

  fullCoverSwipeArea.addEventListener("touchend", (e) => {
    if (!e.changedTouches || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - cStartX;
    const dy = e.changedTouches[0].clientY - cStartY;

    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (dx < 0) {
        audioEngine.next();
      } else {
        audioEngine.prev();
      }
    } else if (dy > 80 && Math.abs(dy) > Math.abs(dx) * 1.25) {
      closeFullPlayer();
    } else if (dy < -75 && Math.abs(dy) > Math.abs(dx) * 1.25) {
      openLyricsModal();
    }
  }, { passive: true });
}

// Gestos en el Mini Player (Swipe Arriba = Abrir Full Player, Swipe Izquierda/Derecha = Cambiar canción)
if (miniPlayer) {
  let mStartX = 0;
  let mStartY = 0;

  miniPlayer.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    mStartX = e.touches[0].clientX;
    mStartY = e.touches[0].clientY;
  }, { passive: true });

  miniPlayer.addEventListener("touchend", (e) => {
    if (!e.changedTouches || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - mStartX;
    const dy = e.changedTouches[0].clientY - mStartY;

    if (dy < -35 && Math.abs(dy) > Math.abs(dx)) {
      openFullPlayer();
    } else if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      if (dx < 0) {
        audioEngine.next();
      } else {
        audioEngine.prev();
      }
    }
  }, { passive: true });
}

// ==========================================
// 2.5 BUSCADOR DE LETRAS ONLINE (MISMO MÉTODO ELECTRON LRCLIB)
// ==========================================
async function fetchAndSaveLyricsForSong(song, forceRefresh = false) {
  if (!song) return;
  if (!forceRefresh && song.lrcText && song.lrcText.trim().length > 0) return;

  const current = audioEngine.getCurrentSong();
  const isCurrent = current && current.id === song.id;

  if (isCurrent && (!song.lrcText || forceRefresh)) {
    lyricsContentContainer.innerHTML = `
      <div class="lyrics-empty lyrics-loading">
        <i class="ph ph-circle-notch ph-spin" style="font-size: 2rem; color: rgba(255,255,255,0.75);"></i>
        <p style="margin-top: 12px; font-weight: 600; color: #fff;">Buscando letra...</p>
      </div>
    `;
  }

  try {
    const res = await fetchSongLyricsFromLRCLIB({
      title: song.title || song.filename,
      artist: song.artist,
      duration: song.duration,
    });

    if (res && res.success && (res.syncedLyrics || res.plainLyrics)) {
      const lrc = res.syncedLyrics || res.plainLyrics;
      const isSynced = Boolean(res.syncedLyrics);

      song.lrcText = lrc;
      song.hasLyrics = isSynced;

      await storage.updateSongLyrics(song.id, lrc, isSynced);

      const activeNow = audioEngine.getCurrentSong();
      if (activeNow && activeNow.id === song.id) {
        if (fullLrcBadge) fullLrcBadge.classList.remove("is-hidden");
        lyricsEngine.parseLRC(lrc);
        lyricsEngine.render(lyricsContentContainer, (seekTime) => {
          audioEngine.seek(seekTime);
        });
        lyricsEngine.syncTime(audioEngine.currentTime);
        lyricsEngine.scrollToActive();
        if (liveLyricPreviewText) {
          liveLyricPreviewText.textContent = lyricsEngine.getActiveLineText() || "Letras sincronizadas";
        }
      }

      applyFiltersAndRender();
    } else {
      const activeNow = audioEngine.getCurrentSong();
      if (activeNow && activeNow.id === song.id) {
        lyricsEngine.parseLRC("");
        lyricsEngine.render(lyricsContentContainer);
        if (liveLyricPreviewText) {
          liveLyricPreviewText.textContent = "Letra no disponible";
        }
      }
    }
  } catch (err) {
    console.warn("Error al obtener letra de LRCLIB en Android:", err);
    const activeNow = audioEngine.getCurrentSong();
    if (activeNow && activeNow.id === song.id) {
      lyricsEngine.parseLRC("");
      lyricsEngine.render(lyricsContentContainer);
      if (liveLyricPreviewText) {
        liveLyricPreviewText.textContent = "Letras sincronizadas";
      }
    }
  }
}

if (refreshLyricsBtn) {
  refreshLyricsBtn.addEventListener("click", async () => {
    const cur = audioEngine.getCurrentSong();
    if (!cur) return;
    const icon = refreshLyricsBtn.querySelector("i");
    if (icon) icon.classList.add("ph-spin");
    await fetchAndSaveLyricsForSong(cur, true);
    if (icon) icon.classList.remove("ph-spin");
  });
}

// ==========================================
// 3. CENTRO DE SINCRONIZACIÓN LAN (PC SYNC)
// ==========================================
checkDiffBtn?.addEventListener("click", async () => {
  const ip = serverIpInput.value.trim();
  if (!ip) {
    alert("Ingresa la IP local que muestra tu Mexlify en la PC");
    return;
  }

  checkDiffBtn.disabled = true;
  checkDiffBtn.textContent = "Conectando...";
  syncDiffSection.style.display = "none";

  try {
    const diffPlan = await syncClient.checkDifferences(ip);
    currentDiffPlan = diffPlan;
    localStorage.setItem("mexlify_last_sync_ip", ip);

    diffTotalRemote.textContent = diffPlan.totalRemote;
    diffAlreadySynced.textContent = diffPlan.alreadySyncedCount;
    diffToDownload.textContent = diffPlan.toDownloadCount;

    syncDiffSection.style.display = "block";
    syncProgressWrapper.style.display = "none";

    if (diffPlan.toDownloadCount === 0) {
      startSyncActionBtn.disabled = true;
      startSyncActionBtn.innerHTML = '<i class="ph ph-check"></i> Todo al día (0 duplicados)';
    } else {
      startSyncActionBtn.disabled = false;
      startSyncActionBtn.innerHTML = `<i class="ph ph-download-simple"></i> Sincronizar ${diffPlan.toDownloadCount} Canciones`;
    }
  } catch (err) {
    alert(`No se pudo conectar a Mexlify PC (${err.message}). Verifica que ambos dispositivos estén en el mismo Wi-Fi.`);
  } finally {
    checkDiffBtn.disabled = false;
    checkDiffBtn.textContent = "Conectar";
  }
});

startSyncActionBtn?.addEventListener("click", async () => {
  if (!currentDiffPlan || currentDiffPlan.toDownload.length === 0) return;

  startSyncActionBtn.disabled = true;
  syncProgressWrapper.style.display = "block";
  syncProgressBarFill.style.width = "0%";
  syncStatusMsg.textContent = "Iniciando transferencia...";

  try {
    const result = await syncClient.syncTracks(
      currentDiffPlan.baseUrl,
      currentDiffPlan.toDownload,
      ({ current, total, percent, trackTitle }) => {
        syncProgressBarFill.style.width = `${percent}%`;
        syncStatusMsg.textContent = `Descargando (${current}/${total}): ${trackTitle}`;
      }
    );

    syncStatusMsg.textContent = `✅ ¡Sincronizadas ${result.completed} canciones con éxito!`;
    syncProgressBarFill.style.width = "100%";

    await loadLibrary();

    setTimeout(() => {
      closeSyncModal();
    }, 1500);
  } catch (err) {
    syncStatusMsg.textContent = `❌ Error en sincronización: ${err.message}`;
  } finally {
    startSyncActionBtn.disabled = false;
  }
});

// ==========================================
// 4. ESCÁNER DE CÓDIGO QR ULTRA RÁPIDO (HARDWARE + jsQR)
// ==========================================
const openScannerBtn = document.getElementById("openScannerBtn");
const scannerModal = document.getElementById("scannerModal");
const closeScannerBtn = document.getElementById("closeScannerBtn");
const scannerVideo = document.getElementById("scannerVideo");

let scannerStream = null;
let scannerAnimFrame = null;
let isScanFrameActive = false;
const scanCanvas = document.createElement("canvas");
const scanCtx = scanCanvas.getContext("2d", { willReadFrequently: true });

let barcodeDetector = null;
if ("BarcodeDetector" in window) {
  try {
    barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });
  } catch (_) {
    barcodeDetector = null;
  }
}

async function startQrScanner() {
  try {
    scannerStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });
    scannerVideo.srcObject = scannerStream;
    await scannerVideo.play();
    scannerModal.classList.add("is-open");
    pushModalHistory("scanner");
    isScanFrameActive = false;
    scanLoop();
  } catch (err) {
    alert("No se pudo acceder a la cámara para escanear el código QR (" + err.message + "). Puedes ingresar la IP manualmente.");
  }
}

function stopQrScanner() {
  if (scannerAnimFrame) {
    cancelAnimationFrame(scannerAnimFrame);
    scannerAnimFrame = null;
  }
  if (scannerStream) {
    scannerStream.getTracks().forEach((track) => track.stop());
    scannerStream = null;
  }
  scannerModal.classList.remove("is-open");
}

function onQrDetected(rawData) {
  if (!rawData) return;

  if (navigator.vibrate) {
    try {
      navigator.vibrate([45, 30, 45]);
    } catch (_) {}
  }

  stopQrScanner();

  let scannedUrl = rawData.trim();
  if (!scannedUrl.startsWith("http://") && !scannedUrl.startsWith("https://")) {
    scannedUrl = "http://" + scannedUrl;
  }

  serverIpInput.value = scannedUrl;
  if (checkDiffBtn) {
    checkDiffBtn.click();
  }
}

async function scanLoop() {
  if (!scannerStream || !scannerModal.classList.contains("is-open")) return;

  if (scannerVideo.readyState === scannerVideo.HAVE_ENOUGH_DATA && !isScanFrameActive) {
    isScanFrameActive = true;

    if (barcodeDetector) {
      try {
        const barcodes = await barcodeDetector.detect(scannerVideo);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          onQrDetected(barcodes[0].rawValue);
          isScanFrameActive = false;
          return;
        }
      } catch (_) {}
    }

    try {
      const vw = scannerVideo.videoWidth;
      const vh = scannerVideo.videoHeight;
      const cropSize = Math.min(vw, vh) * 0.75;
      const cropX = (vw - cropSize) / 2;
      const cropY = (vh - cropSize) / 2;

      scanCanvas.width = 380;
      scanCanvas.height = 380;
      scanCtx.drawImage(scannerVideo, cropX, cropY, cropSize, cropSize, 0, 0, 380, 380);

      const croppedData = scanCtx.getImageData(0, 0, 380, 380);
      let code = jsQR(croppedData.data, croppedData.width, croppedData.height, {
        inversionAttempts: "attemptBoth",
      });

      if (!code) {
        const fullW = 480;
        const fullH = Math.round(480 * (vh / vw));
        scanCanvas.width = fullW;
        scanCanvas.height = fullH;
        scanCtx.drawImage(scannerVideo, 0, 0, fullW, fullH);
        const fullData = scanCtx.getImageData(0, 0, fullW, fullH);
        code = jsQR(fullData.data, fullData.width, fullData.height, {
          inversionAttempts: "attemptBoth",
        });
      }

      if (code && code.data) {
        onQrDetected(code.data);
        isScanFrameActive = false;
        return;
      }
    } catch (err) {
      console.warn("Error en frame de escaneo:", err);
    }

    isScanFrameActive = false;
  }

  scannerAnimFrame = requestAnimationFrame(scanLoop);
}

openScannerBtn?.addEventListener("click", startQrScanner);
closeScannerBtn?.addEventListener("click", stopQrScanner);

// Inicialización de la aplicación
loadLibrary();
