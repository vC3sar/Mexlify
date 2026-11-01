// ======= Constantes de DOM =======
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchClearBtn = document.getElementById("searchClearBtn");
const resultsList = document.getElementById("resultsList");
const downloadsList = document.getElementById("downloadsList");
const player = document.getElementById("player");
const cover = document.getElementById("cover");
const fcp_cover = document.getElementById("fcp-cover");
const songTitle = document.getElementById("songTitle");
const fcp_songTitle = document.getElementById("fcp-title");
const songArtist = document.getElementById("songArtist");
const fcp_songArtist = document.getElementById("fcp-artist");

const volumeSlider = document.getElementById("volumeSlider");
const fcp_volumeSlider = document.getElementById("fcp-volumeSlider");
const muteBtn = document.getElementById("muteBtn");
const fcp_muteBtn = document.getElementById("fcp_muteBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const fcp_playPauseBtn = document.getElementById("fcp-playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const fcp_prevBtn = document.getElementById("fcp-prevBtn");
const fcp_nextBtn = document.getElementById("fcp-nextBtn");
const repeatBtn = document.getElementById("repeatBtn");
const fcp_repeatBtn = document.getElementById("fcp_repeatBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const fcp_shuffleBtn = document.getElementById("fcp_shuffleBtn");
const progressBar = document.getElementById("progressBar");
const reproduciendoTextContainer = document.querySelector(".reproduciendo-text-container");
const reproduciendoText = document.getElementById("reproduciendoText");
const fcpProgressBar = document.getElementById("fcp-progressbar");
const currentTimeEl = document.getElementById("currentTime");
const fcpCurrentTimeEl = document.getElementById("fcp-time");
const totalTimeEl = document.getElementById("totalTime");
const fcpTotalTimeEl = document.getElementById("fcp-time-total");
const countryMixbtnA = document.getElementById("btnCountryMixA");
const countryMixbtnB = document.getElementById("btnCountryMixB");
const settingsTabButton = document.getElementById("settingsTab");

const homeTab = document.getElementById("homeTab");
const searchTab = document.getElementById("searchTab");
const downloadsTab = document.getElementById("downloadsTab");
const searchContainer = document.getElementById("searchContainer");
const downloadsContainer = document.getElementById("downloadsContainer");
const defaultRegionalHeader = document.getElementById("defaultRegionalHeader");
const playAllRegionalBtn = document.getElementById("playAllRegionalBtn");
const queueTabButton = document.getElementById("queueTabButton");
const queueTab = document.getElementById("queuetab");
const queueCountBadge = document.getElementById("queueCountBadge");
const queueShuffleBtn = document.getElementById("queueShuffleBtn");
const clearQueueBtn = document.getElementById("clearQueueBtn");
const countryTopContainer = document.getElementById("country-top-container");
const settingsContainer = document.getElementById("settings");
// Referencias nuevas — navegación centralizada y queue drawer
const homeView = document.getElementById("homeView");
const queueOverlay = document.getElementById("queueOverlay");
const recentsContainer = document.getElementById("recentsContainer");
const recentsTab = document.getElementById("recentsTab");

// Playlists DOM
const playlistsContainer = document.getElementById("playlistsContainer");
const playlistsTab = document.getElementById("playlistsTab");
const playlistsGrid = document.getElementById("playlistsGrid");
const playlistNameInput = document.getElementById("playlistNameInput");
const createPlaylistBtn = document.getElementById("createPlaylistBtn");
const playlistDetailView = document.getElementById("playlistDetailView");
const backToPlaylistsBtn = document.getElementById("backToPlaylistsBtn");
const currentPlaylistTitle = document.getElementById("currentPlaylistTitle");
const playPlaylistBtn = document.getElementById("playPlaylistBtn");
const renamePlaylistBtn = document.getElementById("renamePlaylistBtn");
const deletePlaylistFromDetailBtn = document.getElementById("deletePlaylistFromDetailBtn");
const queueAllPlaylistBtn = document.getElementById("queueAllPlaylistBtn");
const playlistSongsList = document.getElementById("playlistSongsList");
const importCsvBtn = document.getElementById("importCsvBtn");
const importCsvFileInput = document.getElementById("importCsvFileInput");
const playlistDropZone = document.getElementById("playlistDropZone");
const playlistHeroCover = document.getElementById("playlistHeroCover");
const playlistMetaDuration = document.getElementById("playlistMetaDuration");
const playlistFilterInput = document.getElementById("playlistFilterInput");
const playlistsCountBadge = document.getElementById("playlistsCountBadge");
const shufflePlaylistBtn = document.getElementById("shufflePlaylistBtn");
const downloadAllPlaylistBtn = document.getElementById("downloadAllPlaylistBtn");
const syncPlaylistBtn = document.getElementById("syncPlaylistBtn");

// Modal Selección Playlist DOM
const playlistModalOverlay = document.getElementById("playlistModalOverlay");
const closePlaylistModalBtn = document.getElementById("closePlaylistModalBtn");
const playlistModalSongTitle = document.getElementById("playlistModalSongTitle");
const playlistModalList = document.getElementById("playlistModalList");
const playlistModalNameInput = document.getElementById("playlistModalNameInput");
const playlistModalCreateBtn = document.getElementById("playlistModalCreateBtn");

// ======= Variables globales =======
let currentAudio = null;
let queue = [];
let currentIndex = -1;
let playlists = [];
let selectedSongForPlaylist = null;
let currentSong = null;
let lastVolume = 1;
let isMuted = false;
let repeatMode = "off"; // "off" | "all" | "one"
let isRepeating = false;
let isShuffle = false;
let originalQueueOrder = [];
let recentSongs = [];
let currentlyResolvingSong = null;
let currentResolveSession = 0;

function isSameSong(s1, s2) {
  if (!s1 || !s2) return false;
  const t1 = (s1.title || s1.Title || "").toLowerCase().trim();
  const t2 = (s2.title || s2.Title || "").toLowerCase().trim();
  const u1 = (s1.uploader || s1.Uploader || "").toLowerCase().trim();
  const u2 = (s2.uploader || s2.Uploader || "").toLowerCase().trim();
  if (s1.url && s2.url && s1.url === s2.url) return true;
  if (s1.filename && s2.filename && s1.filename === s2.filename) return true;
  if (t1 && t2 && t1 === t2 && (!u1 || !u2 || u1 === u2)) return true;
  return false;
}

progressBar.disabled = true;
fcpProgressBar.disabled = true;
progressBar.style.setProperty('--value', '0%');
fcpProgressBar.style.setProperty('--value', '0%');

// ======= Utilidades =======
function debugLog(...args) {
  console.log("[DEBUG]", ...args);
}

function showPlayerStatus(message) {
  debugLog("[player]", message);
  if (!message) return;
  
  // Log strictly to our system messages tray to keep the screen clean and avoid toast spam
  if (window.systemTray) {
    window.systemTray.addMessage("Reproductor", message, "info");
  }
}

function setPlaybackBadgeState(state) {
  const container = reproduciendoTextContainer || document.querySelector(".reproduciendo-text-container");
  const textEl = reproduciendoText || document.getElementById("reproduciendoText");
  if (!container || !textEl) return;

  if (state === "obtaining") {
    textEl.textContent = "OBTENIENDO";
    container.classList.add("active");
  } else if (state === "playing") {
    textEl.textContent = "REPRODUCIENDO";
    container.classList.add("active");
  } else if (state === "paused" || state === "stopped" || state === "hidden") {
    container.classList.remove("active");
    textEl.textContent = "REPRODUCIENDO";
  }
}

function cleanSongTitle(title) {
  return title
    .replace(
      /\b(video|oficial|lyrics|clip|feat\.?|ft\.?|remix|version|deluxe)\b/gi,
      ""
    )
    .replace(/[\(\[\{].*?[\)\]\}]/g, "")
    .replace(/[-_|\/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null || seconds === undefined || seconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function normalize(str) {
  return str.replace(/[^\wáéíóúüñ]/gi, "").toLowerCase();
}

// ======= Limpieza de Query =======
function cleanQuery(query) {
  let cleaned = query;
  const maxChars = 28;
  cleaned = cleaned.replace(/\([^)]+\)/g, "");
  cleaned = cleaned.replace(/\[[^\]]+\]/g, "");
  cleaned = cleaned.replace(/feat\.?[^&]*&/gi, "");
  cleaned = cleaned.replace(/feat\.?[^-]*-/gi, "");
  cleaned = cleaned.replace(/feat\.?[^$]*$/gi, "");
  cleaned = cleaned.replace(/\b(remix|mixed|edit|version)\b/gi, "");
  cleaned = cleaned.replace(/\/|\\/g, " ");
  cleaned = cleaned.replace(/,+/g, " ");
  cleaned = cleaned.replace(/\s{2,}/g, " ");
  cleaned = cleaned.trim();

  // Limitar a los primeros N caracteres SIN contar espacios
  let count = 0;
  let result = "";
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] !== " ") {
      count++;
    }
    if (count > maxChars) break;
    result += cleaned[i];
  }
  return result.trim();
}

// ======= Reproducción y manejo de audio =======
async function handleExpiredStream(currentSong) {
  if (!currentSong) return;
  debugLog("Renovando URL de streaming para:", currentSong.title);
  try {
    const newStreamUrl = await window.electronAPI.streamSong(currentSong);
    player.src = newStreamUrl;
    player
      .play()
      .catch((err) => debugLog("Error al reproducir tras renovar:", err));
  } catch (err) {
    debugLog("No se pudo renovar URL:", err);
    new Notify({
      status: "warning",
      title: "Audio expirado",
      text: `El stream de "${currentSong.title}" caducó. Pasando a la siguiente...`,
      effect: "fade",
      autotimeout: 3000,
    });
    playNextInQueue();
  }
}
async function playSong(song, isDownloaded = false, forceIndex = -1) {
  // Solo bloquear si se hace clic repetido en la MISMA canción que ya está cargando
  if (currentlyResolvingSong && isSameSong(song, currentlyResolvingSong)) {
    debugLog("Ya se está cargando esta misma canción. Ignorando clic duplicado:", song.title || song.Title);
    return;
  }

  // Si es una canción distinta, la nueva sesión toma el control inmediatamente
  const sessionToken = ++currentResolveSession;
  currentlyResolvingSong = song;
  setPlaybackBadgeState("obtaining");

  try {
    // Limpiar controlador dinámico de topSongs
    player.onended = null;
    
    // Limpiar cola automática de top country si se reproduce una canción directamente
    if (forceIndex === -1 && song && !song._fromQueue) {
      window.songQueue = null;
    }

    debugLog("Reproduciendo:", song.title || song.Title);

    // Normalizar y guardar en historial de reproducción reciente
    if (song) {
      const normalizedSong = {
        title: song.title || song.Title || "Título desconocido",
        uploader: song.uploader || song.Uploader || "Artista desconocido",
        thumbnail: song.thumbnail || song.Thumbnail || "resources/player.gif",
        duration: song.duration || song.Duration || 0,
        url: song.url || song.Url || null,
        filename: song.filename || song.Filename || null,
        ...song
      };
      recentSongs = recentSongs.filter(s => (s.title || s.Title || "").toLowerCase() !== normalizedSong.title.toLowerCase());
      recentSongs.unshift(normalizedSong);
      if (recentSongs.length > 50) {
        recentSongs.pop();
      }
      
      currentSong = normalizedSong;
      localStorage.setItem("mexlify_last_song", JSON.stringify(normalizedSong));
      localStorage.setItem("mexlify_last_song_local", isDownloaded ? "true" : "false");

      // Incrementar contador de reproducciones en base de datos SQLite
      window.electronAPI.incrementPlayCount(normalizedSong).then(() => {
        // Actualizar la portada de la playlist en tiempo real
        renderMostPlayedCardCover();
      }).catch((err) => {
        console.error("Error al registrar reproducción en SQLite:", err);
      });

      if (window.systemTray) {
        window.systemTray.addMessage("Reproductor", `Reproduciendo: ${normalizedSong.title} - ${normalizedSong.uploader}`, "music");
      }
    }

    progressBar.disabled = false;
    fcpProgressBar.disabled = false;

    // Portada
    let coverImageUrl = song.thumbnail;
    cover.src = coverImageUrl;
    fcp_cover.src = coverImageUrl;

    // Título y artista
    songTitle.textContent = cleanSongTitle(song.title);
    songArtist.textContent = song.uploader;
    fcp_songTitle.textContent = cleanSongTitle(song.title);
    fcp_songArtist.textContent = song.uploader;

    let songTitleText = songTitle.textContent;
    let songArtistText = songArtist.textContent;

    let baseArtist = songArtistText
      .replace(/\b(Jr|Sr|feat\.?|ft\.?)\b/gi, "")
      .trim();

    let regex = new RegExp(baseArtist, "gi");
    let songTitleDC = songTitleText
      .replace(regex, "")
      .replace(/\s{2,}/g, " ")
      .replace(/\s*[-–—]\s*/g, " ")
      .replace(/(^|\s),\s*/g, "$1")
      .replace(/\(\s*\)/g, "")
      .trim();

    // Discord Rich Presence
    setTimeout(async () => {
      const dur = (!isNaN(player.duration) && player.duration > 0) ? player.duration : (song.duration || 0);
      await window.electronAPI.setDiscordActivity(
        `Reproduciendo 🎶 | (${formatTime(dur)})`,
        `${songTitleDC} - ${songArtistText}`,
        coverImageUrl,
        false
      );
    }, 5000);

    // Pausar canción anterior
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.removeAttribute("src");
    }
    setPlaybackBadgeState("obtaining");

    if (song?.filename?.includes(".mp3")) {
      isDownloaded = true;
    }

    // [Fase 4: Opción A - Lazy Resolution inmediata]
    if (!song.url && !song.filename) {
      showPlayerStatus("Buscando audio en YouTube...");
      const resolvedUrl = await resolveSongOnlineUrl(song);
      if (sessionToken !== currentResolveSession) return;
      if (!resolvedUrl) {
        setPlaybackBadgeState("stopped");
        showPlayerStatus("No se encontró audio");
        new Notify({
          status: "error",
          title: "Audio no encontrado",
          text: `No se encontró audio en YouTube para "${song.title}". Pasando a la siguiente...`,
          effect: "fade",
          autotimeout: 3500,
        });
        if (queue.length > 1 && currentIndex < queue.length - 1) {
          setTimeout(() => playNext(), 600);
        }
        return;
      }
    }

    showPlayerStatus("Preparando audio...");

    let streamUrl;
    try {
      streamUrl = await window.electronAPI.streamSong(song);
      if (sessionToken !== currentResolveSession) return;
    } catch (err) {
      if (sessionToken !== currentResolveSession) return;
      debugLog("No se pudo preparar el audio:", err);
      // Auto-recuperación (Auto-heal): Si el video vinculado fue borrado o bloqueado en YouTube,
      // invalidamos el enlace viejo y buscamos una versión alternativa funcional automáticamente.
      if (song.url && !song.filename) {
        debugLog("El enlace vinculado falló. Buscando versión alternativa para:", song.title);
        showPlayerStatus("Buscando versión alternativa...");
        song.url = null;
        song.videoId = null;
        const alternativeUrl = await resolveSongOnlineUrl(song);
        if (alternativeUrl) {
          syncResolvedSongToPlaylists(song);
          try {
            streamUrl = await window.electronAPI.streamSong(song);
          } catch (e2) {
            debugLog("La versión alternativa también falló:", e2);
            streamUrl = null;
          }
        }
      }

      if (!streamUrl) {
        setPlaybackBadgeState("stopped");
        showPlayerStatus("Audio no disponible");
        new Notify({
          status: "warning",
          title: "Audio no disponible",
          text: `"${song.title}" no se pudo reproducir. Pasando a la siguiente...`,
          effect: "fade",
          autotimeout: 3500,
        });
        if (queue.length > 1 && currentIndex < queue.length - 1) {
          setTimeout(() => playNext(), 600);
        }
        return;
      }
    }

    if (sessionToken !== currentResolveSession) return;

    showPlayerStatus("Listo para reproducir");
    player.preload = "auto";
    player.src = streamUrl;
    player.load();
    saySong(`${songTitleText}`);

    player.play().catch((err) => {
      if (err.name === "AbortError") {
        debugLog("Reproducción interrumpida por una nueva carga.");
        return;
      }
      if (err.name === "NotAllowedError") {
        debugLog("Reproducción bloqueada por políticas de reproducción automática.");
        return;
      }
      handleExpiredStream(song);
      if (isDownloaded) {
        return debugLog("Reproduciendo música descargada...");
      }
      debugLog("Error al reproducir stream.", err);
    });

    currentAudio = player;

    // Manejo de cola
    if (forceIndex !== -1) {
      currentIndex = forceIndex;
      saveQueueToStorage();
      renderQueue();
    } else {
      const indexInQueue = queue.findIndex((s) => 
        (s.url && s.url === song.url) || 
        (s.filename && s.filename === song.filename) || 
        (s.title === song.title && s.uploader === song.uploader)
      );
      if (indexInQueue !== -1) {
        currentIndex = indexInQueue;
        renderQueue();
      } else {
        // Insertar después de la canción actual sin destruir la cola existente
        if (currentIndex >= 0 && currentIndex < queue.length) {
          queue.splice(currentIndex + 1, 0, song);
          currentIndex++;
        } else {
          queue.push(song);
          currentIndex = queue.length - 1;
        }
        saveQueueToStorage();
        renderQueue();
      }
    }

    // MediaSession API
    if ("mediaSession" in navigator) {
      let artworkSrc = coverImageUrl || "https://i.ibb.co/CKrdcJTT/logo-app-mexlify-center.png";
      if (!artworkSrc || artworkSrc.startsWith("mexlify:") || artworkSrc.startsWith("file:")) {
        artworkSrc = "https://i.ibb.co/CKrdcJTT/logo-app-mexlify-center.png";
      }
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songTitleDC,
        artist: songArtistText,
        album: isDownloaded ? "Descargada" : "En línea",
        artwork: [
          {
            src: artworkSrc,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        audio.play();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        audio.pause();
      });

      navigator.mediaSession.setActionHandler("previoustrack", () => {
        playPrev();
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        playNext();
      });
    }

    if (queue.length > 0 && currentIndex < queue.length - 1) {
      window.electronAPI.prewarmSongs(queue.slice(currentIndex + 1, currentIndex + 2), 1).catch(debugLog);
    }
    highlightPlayingSong();
  } finally {
    if (sessionToken === currentResolveSession) {
      currentlyResolvingSong = null;
    }
  }
}

// ======= Cola de reproducción y Persistencia =======
function saveQueueToStorage() {
  try {
    localStorage.setItem("mexlify_queue", JSON.stringify(queue));
    localStorage.setItem("mexlify_queue_index", currentIndex.toString());
    localStorage.setItem("mexlify_repeat_mode", repeatMode);
    localStorage.setItem("mexlify_shuffle_mode", isShuffle.toString());
  } catch (err) {
    console.warn("[Queue] Error al persistir la cola:", err);
  }
}

function loadQueueFromStorage() {
  try {
    const raw = localStorage.getItem("mexlify_queue");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        queue = parsed;
      }
    }
    const savedIdx = parseInt(localStorage.getItem("mexlify_queue_index"), 10);
    if (!isNaN(savedIdx) && savedIdx >= 0 && savedIdx < queue.length) {
      currentIndex = savedIdx;
    }
    repeatMode = localStorage.getItem("mexlify_repeat_mode") || "off";
    isRepeating = repeatMode !== "off";
    isShuffle = localStorage.getItem("mexlify_shuffle_mode") === "true";
  } catch (err) {
    console.warn("[Queue] Error al cargar cola persistida:", err);
  }
}

function removeFromQueue(index) {
  if (index < 0 || index >= queue.length) return;
  const wasPlaying = (index === currentIndex);
  queue.splice(index, 1);

  if (queue.length === 0) {
    currentIndex = -1;
    currentSong = null;
    if (wasPlaying && player) {
      player.pause();
      player.src = "";
    }
  } else if (wasPlaying) {
    if (currentIndex >= queue.length) {
      currentIndex = 0;
    }
    const nextSong = queue[currentIndex];
    if (nextSong) {
      playSong(nextSong, !!nextSong.filename, currentIndex);
    }
  } else if (index < currentIndex) {
    currentIndex--;
  }

  saveQueueToStorage();
  renderQueue();
}

function clearQueue() {
  if (queue.length === 0) return;
  queue = [];
  currentIndex = -1;
  originalQueueOrder = [];
  saveQueueToStorage();
  renderQueue();
  if (typeof Notify !== "undefined") {
    new Notify({
      status: "info",
      title: "Cola vaciada",
      text: "Se eliminaron todas las canciones de la cola.",
      effect: "fade",
      autotimeout: 2000,
    });
  }
}

function toggleShuffleMode() {
  if (queue.length <= 1) {
    isShuffle = !isShuffle;
    updateShuffleUI();
    saveQueueToStorage();
    return;
  }

  isShuffle = !isShuffle;
  if (isShuffle) {
    originalQueueOrder = [...queue];
    const currentPlayingSong = (currentIndex >= 0 && currentIndex < queue.length) ? queue[currentIndex] : null;

    let remaining = queue.filter((_, idx) => idx !== currentIndex);
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }

    if (currentPlayingSong) {
      queue = [currentPlayingSong, ...remaining];
      currentIndex = 0;
    } else {
      queue = remaining;
      currentIndex = -1;
    }
  } else {
    if (originalQueueOrder.length === queue.length) {
      const currentPlayingSong = (currentIndex >= 0 && currentIndex < queue.length) ? queue[currentIndex] : null;
      queue = [...originalQueueOrder];
      if (currentPlayingSong) {
        currentIndex = queue.findIndex((s) => isSameSong(s, currentPlayingSong));
        if (currentIndex === -1) currentIndex = 0;
      }
    }
  }

  updateShuffleUI();
  saveQueueToStorage();
  renderQueue();

  if (typeof Notify !== "undefined") {
    new Notify({
      status: "info",
      title: isShuffle ? "Aleatorio activado" : "Aleatorio desactivado",
      text: isShuffle ? "La cola se ha mezclado aleatoriamente." : "Se ha restaurado el orden original de la cola.",
      effect: "fade",
      autotimeout: 2000,
    });
  }
}

function updateShuffleUI() {
  [shuffleBtn, fcp_shuffleBtn, queueShuffleBtn].forEach((btn) => {
    if (!btn) return;
    if (isShuffle) {
      btn.classList.add("is-active");
      btn.style.color = "#00da28";
    } else {
      btn.classList.remove("is-active");
      btn.style.color = "";
    }
  });
}

function cycleRepeatMode() {
  // off -> all -> one -> off
  if (repeatMode === "off") {
    repeatMode = "all";
  } else if (repeatMode === "all") {
    repeatMode = "one";
  } else {
    repeatMode = "off";
  }

  isRepeating = repeatMode !== "off";
  player.loop = (repeatMode === "one");

  updateRepeatUI();
  saveQueueToStorage();

  const labels = {
    off: "Repetición desactivada",
    all: "Repetir toda la lista",
    one: "Repetir esta canción",
  };

  if (typeof Notify !== "undefined") {
    new Notify({
      status: "info",
      title: "Modo repetición",
      text: labels[repeatMode],
      effect: "fade",
      autotimeout: 2000,
    });
  }
}

function updateRepeatUI() {
  const iconClass = (repeatMode === "one") ? "ph ph-repeat-once" : "ph ph-repeat";

  [repeatBtn, fcp_repeatBtn].forEach((btn) => {
    if (!btn) return;
    const icon = btn.querySelector("i");
    if (icon) {
      icon.className = iconClass;
      if (repeatMode === "one") {
        icon.style.fontSize = "larger";
      }
    }
    if (repeatMode === "off") {
      btn.style.backgroundColor = "rgba(255,255,255,0.1)";
      btn.style.color = "";
      btn.classList.remove("is-active");
    } else {
      btn.style.backgroundColor = "#080014";
      btn.style.color = "#00da28";
      btn.classList.add("is-active");
    }
    btn.title = repeatMode === "one" ? "Repetir canción actual" : (repeatMode === "all" ? "Repetir toda la lista" : "Repetición desactivada");
  });
}

function updateQueueUI() {
  renderQueue();
}
window.updateQueueUI = updateQueueUI;

function renderQueue() {
  const queueElement = document.getElementById("queueList");
  if (!queueElement) return;

  if (queueCountBadge) {
    queueCountBadge.textContent = `${queue.length} canción${queue.length !== 1 ? 'es' : ''}`;
  }

  queueElement.innerHTML = "";

  if (queue.length === 0) {
    queueElement.innerHTML = `
      <div class="messages-empty-state" style="padding: 40px 15px; text-align: center;">
        <i class="ph ph-queue" style="font-size: 2.5rem; color: rgba(255, 0, 144, 0.4); margin-bottom: 8px; display: block;"></i>
        <p style="font-size: 0.95rem; color: rgba(255,255,255,0.6); margin: 0;">Tu cola de reproducción está vacía.</p>
        <span style="font-size: 0.8rem; color: rgba(255,255,255,0.35);">Añade canciones desde búsqueda, descargas o playlists.</span>
      </div>`;
    return;
  }

  queue.forEach((song, index) => {
    const li = document.createElement("li");
    li.classList.add("queue-item");
    li.setAttribute("draggable", "true");
    li.dataset.index = index;

    if (index === currentIndex) {
      li.classList.add("playing");
    }

    const dur = song.duration
      ? typeof song.duration === "number"
        ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}`
        : song.duration + "s"
      : "";

    li.innerHTML = `
      <span class="queue-drag-handle" title="Arrastrar para reordenar"><i class="ph ph-dots-six-vertical"></i></span>
      <img class="queue-thumb" src="${song.thumbnail || 'resources/player.gif'}" alt="${song.title}" onerror="this.onerror=null; this.src='resources/player.gif';">
      <div class="queue-item-info">
        <span class="queue-item-title" title="${song.title}">${song.title}</span>
        <span class="queue-item-artist">${song.uploader || 'Desconocido'}${dur ? ' • ' + dur : ''}</span>
      </div>
      <button class="queue-item-remove-btn" title="Eliminar de la cola"><i class="ph ph-x"></i></button>
    `;

    const isLocal = !!song.filename;
    const playThis = () => {
      playSong(song, isLocal, index);
      renderQueue();
    };

    li.querySelector(".queue-thumb").addEventListener("click", playThis);
    li.querySelector(".queue-item-info").addEventListener("click", playThis);

    li.querySelector(".queue-item-remove-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromQueue(index);
    });

    // Drag & Drop reordering in Queue
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index.toString());
      e.dataTransfer.effectAllowed = "move";
      li.classList.add("is-dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("is-dragging");
      queueElement.querySelectorAll(".queue-item").forEach((el) => {
        el.classList.remove("drag-over-top", "drag-over-bottom");
      });
    });

    li.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const rect = li.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      if (relY < rect.height / 2) {
        li.classList.add("drag-over-top");
        li.classList.remove("drag-over-bottom");
      } else {
        li.classList.add("drag-over-bottom");
        li.classList.remove("drag-over-top");
      }
    });

    li.addEventListener("dragleave", () => {
      li.classList.remove("drag-over-top", "drag-over-bottom");
    });

    li.addEventListener("drop", (e) => {
      e.preventDefault();
      li.classList.remove("drag-over-top", "drag-over-bottom");
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (isNaN(fromIndex) || fromIndex === index) return;

      const rect = li.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      let targetIndex = index;
      if (relY >= rect.height / 2 && fromIndex < index) {
        // placed on lower half
      } else if (relY >= rect.height / 2 && fromIndex > index) {
        targetIndex = index + 1;
      } else if (relY < rect.height / 2 && fromIndex < index) {
        targetIndex = index - 1;
      }

      const [movedSong] = queue.splice(fromIndex, 1);
      const safeTarget = Math.max(0, Math.min(queue.length, targetIndex));
      queue.splice(safeTarget, 0, movedSong);

      // Adjust currentIndex if necessary
      if (currentIndex === fromIndex) {
        currentIndex = safeTarget;
      } else if (fromIndex < currentIndex && safeTarget >= currentIndex) {
        currentIndex--;
      } else if (fromIndex > currentIndex && safeTarget <= currentIndex) {
        currentIndex++;
      }

      saveQueueToStorage();
      renderQueue();
    });

    queueElement.appendChild(li);
  });
}

function addToQueue(song, isDownloaded = false) {
  let songToplay = song;
  if (isDownloaded) {
    songToplay = {
      title: song.Title || song.title,
      uploader: song.Uploader || song.uploader,
      duration: song.Duration || song.duration,
      filename: song.Filename || song.filename,
      thumbnail: song.Thumbnail || song.thumbnail,
    };
  } else {
    songToplay = {
      title: song.title,
      uploader: song.uploader,
      duration: song.duration,
      thumbnail: song.thumbnail,
      filename: song.filename || null,
      url: song.url || null,
      videoId: song.videoId || null,
    };
  }

  queue.push(songToplay);
  debugLog("Agregada a la cola:", songToplay.title);
  saveQueueToStorage();
  renderQueue();

  if (typeof Notify !== "undefined") {
    new Notify({
      status: "info",
      title: "Cola de reproducción",
      text: `"${songToplay.title}" añadida a la cola.`,
      effect: "fade",
      autotimeout: 2000,
    });
  }

  if (player.src === "" || (player.paused && currentIndex === -1)) {
    playSong(songToplay, !!songToplay.filename, queue.length - 1);
  }
}

function playNext() {
  if (queue.length === 0) {
    currentSong = null;
    return;
  }

  if (repeatMode === "one") {
    if (player) {
      player.currentTime = 0;
      player.play().catch(debugLog);
      return;
    }
  }

  if (currentIndex < queue.length - 1) {
    currentIndex++;
    const nextSong = queue[currentIndex];
    nextSong._fromQueue = true;
    playSong(nextSong, !!nextSong.filename, currentIndex);
  } else {
    // Hemos llegado al final de la cola
    if (repeatMode === "all" && queue.length > 0) {
      currentIndex = 0;
      const nextSong = queue[currentIndex];
      nextSong._fromQueue = true;
      playSong(nextSong, !!nextSong.filename, currentIndex);
      return;
    }

    const autoplayCheckbox = document.getElementById("autoplay");
    const isAutoplayEnabled = autoplayCheckbox ? autoplayCheckbox.checked : true;

    if (isAutoplayEnabled && !window.songQueue) {
      playRandomSongByArtistDirect();
    } else {
      debugLog("Fin de la cola de reproducción.");
    }
  }
}

function playPrev() {
  if (queue.length === 0) return;

  // Si lleva más de 3 segundos reproduciéndose, reiniciar
  if (player && player.currentTime > 3) {
    player.currentTime = 0;
    return;
  }

  if (currentIndex > 0) {
    currentIndex--;
    const prevSong = queue[currentIndex];
    prevSong._fromQueue = true;
    playSong(prevSong, !!prevSong.filename, currentIndex);
  } else {
    if (repeatMode === "all" && queue.length > 1) {
      currentIndex = queue.length - 1;
      const prevSong = queue[currentIndex];
      prevSong._fromQueue = true;
      playSong(prevSong, !!prevSong.filename, currentIndex);
      return;
    }
    // Reiniciar primera canción
    if (player) player.currentTime = 0;
  }
}

function playNextInQueue() {
  playNext();
}

// ======= Descargas =======
async function loadDownloaded() {
  const downloaded = await window.electronAPI.getDownloaded();
  downloadsList.innerHTML = "";

  const offlineCountBadge = document.getElementById("offlineCountBadge");
  if (offlineCountBadge) {
    offlineCountBadge.textContent = `${downloaded.length} guardada${downloaded.length !== 1 ? 's' : ''}`;
  }

  if (downloaded.length === 0) {
    downloadsList.innerHTML = "<li>No hay descargas aún</li>";
    return;
  }

  downloaded.forEach((song, idx) => {
    const li = document.createElement("li");
    const thumbnail = song.Thumbnail || song.thumbnail || "default-thumbnail.png";
    const durRaw = song.Duration || song.duration;
    const duration = durRaw
      ? `${Math.floor(durRaw / 60)}:${String(
          durRaw % 60
        ).padStart(2, "0")}`
      : "N/A";

    li.innerHTML = `
      <img src="${thumbnail}" alt="Thumbnail" class="play-downloaded-thumb" style="cursor: pointer;" onerror="this.onerror=null; this.src='resources/player.gif';">
      <div class="song-info">
        <b style="cursor: pointer;" class="play-downloaded-title">${song.Title || song.title || "Título desconocido"}</b><br>
        ${song.Uploader || song.uploader || "Artista desconocido"} (${duration})
      </div>
      <div class="song-actions">
        <button class="play playbtn" title="Reproducir"><i class="ph ph-play"></i> Reproducir</button>
        <button class="queue" title="Añadir a la cola"><i class="ph ph-list-plus"></i></button>
        <button class="add-to-playlist" title="Añadir a playlist"><i class="ph ph-folder-plus"></i></button>
        <button class="deleteThis" title="Eliminar descarga"><i class="ph ph-trash"></i></button>
      </div>
    `;
    downloadsList.appendChild(li);

    const playDownloadedTrack = async () => {
      // Reemplazar la cola con todas las descargas y olvidar la sección previa
      queue = downloaded.map((s) => ({
        title: s.Title || s.title,
        uploader: s.Uploader || s.uploader,
        duration: s.Duration || s.duration,
        filename: s.Filename || s.filename,
        thumbnail: s.Thumbnail || s.thumbnail || "resources/player.gif",
        url: s.Url || s.url || null,
      }));
      currentIndex = idx;
      saveQueueToStorage();
      renderQueue();
      try {
        await playSong(queue[currentIndex], true, currentIndex);
      } catch (err) {
        console.error("❌ Error en playSong (descargas):", err);
      }
      highlightPlayingSong();
    };

    li.querySelector(".play").addEventListener("click", playDownloadedTrack);
    const thumbImg = li.querySelector(".play-downloaded-thumb");
    if (thumbImg) thumbImg.addEventListener("click", playDownloadedTrack);
    const titleLink = li.querySelector(".play-downloaded-title");
    if (titleLink) titleLink.addEventListener("click", playDownloadedTrack);

    li.querySelector(".queue").addEventListener("click", () => {
      addToQueue(song, true);
    });
    li.querySelector(".deleteThis").addEventListener("click", async () => {
      try {
        await window.electronAPI.deleteDownload(song.Filename || song.filename);
        debugLog(`Eliminada descarga: ${song.Title || song.title}`);
        await loadDownloaded();
      } catch (err) {
        debugLog("Error eliminando descarga:", err);
        alert("Error eliminando la descarga.");
      }
    });
    li.querySelector(".add-to-playlist").addEventListener("click", () => {
      openPlaylistModal({
        title: song.Title || song.title,
        uploader: song.Uploader || song.uploader,
        duration: song.Duration || song.duration,
        thumbnail: thumbnail,
        filename: song.Filename || song.filename,
        url: null
      });
    });
  });
  highlightPlayingSong();
}

// ======= Búsqueda =======
async function searchSongDirectPlay(query = "") {
  const genreEl = document.getElementById("songGenre");
  const searchResultsHeader = document.getElementById("searchResultsHeader");
  if (defaultRegionalHeader) defaultRegionalHeader.style.display = "none";
  navigateTo("search");

  if (!query) {
    query = searchInput.value.trim();
  } else {
    searchInput.value = query;
  }
  if (!query) return;
  resultsList.innerHTML = "<li>Buscando...</li>";
  if (searchResultsHeader) searchResultsHeader.style.display = "none";
  try {
    const results = await window.electronAPI.searchSong(cleanQuery(query));
    resultsList.innerHTML = "";

    if (results.length === 0) {
      resultsList.innerHTML = "<li>No se encontraron canciones</li>";
      if (genreEl) genreEl.textContent = "";
      if (searchResultsHeader) searchResultsHeader.style.display = "none";
      return;
    }

    // Filtrar canciones que NO incluyan "remix" o "remixes" en el título
    const filteredResults = results.filter(
      (song) => !/remix(es)?|choreography|#\w+|@\w+/i.test(song.title) // filtra palabras remix, remixes, choreography, hashtags y arrobas
    );

    let playRandom;
    if (filteredResults.length > 0) {
      playRandom =
        filteredResults[Math.floor(Math.random() * filteredResults.length)];
    } else {
      playRandom = results[Math.floor(Math.random() * results.length)];
    }
    playSong(playRandom);

    if (genreEl) {
      genreEl.textContent = results[0].genre
        ? `Género: ${results[0].genre}`
        : "";
      genreEl.style.display = results[0].genre ? "block" : "none";
    }

    if (searchResultsHeader) searchResultsHeader.style.display = "flex";

    results.forEach((song) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img class="play" src="${song.thumbnail || ""}" onerror="this.onerror=null; this.src='resources/player.gif';">
        <div class="song-info">
            <b>${song.title || "Sin título"}</b><br>
            ${song.uploader || "Desconocido"} (${song.duration || "?"}s)
            ${
              song.genre
                ? `<br><span class="genre-tag">${song.genre}</span>`
                : ""
            }
        </div>
        <div class="song-actions">
            <button class="playbtn"><i class="ph ph-play"></i></button>
            <button class="download downloadButton"><i class="ph ph-download-simple"></i></button>
            <button class="queue" title="Añadir a la cola"><i class="ph ph-list-plus"></i></button>
        </div>
      `;
      resultsList.appendChild(li);

      li.querySelector(".playbtn").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        if (btn.disabled === true) {
          console.log("Este boton esta bloqueado...");
          return new Notify({
            status: "warning",
            title: "Espera...",
            text: "La reproducción es automática, espera un momento.",
            effect: "fade",
          });
        }
        btn.disabled = true;
        btn.style.opacity = "0.6";
        btn.style.cursor = "not-allowed";
        try {
          await playSong(song);
        } finally {
          setTimeout(() => {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
          }, 1500);
        }
      });
      li.querySelector(".download").addEventListener("click", async () => {
        if (li.querySelector(".download").disabled) return;
        li.querySelector(".download").disabled = true;
        li.querySelector(".download").style.opacity = "0.6";
        await new Notify({
          status: "info",
          title: "Descargando...",
          text: `"${song.title}"`,
          effect: "fade",
        });
        try {
          debugLog("Iniciando descarga de:", song.title);
          const res = await window.electronAPI.downloadSong(song);
          if (res.success) {
            if (res.alreadyExists) {
              debugLog(`La canción ya existe: ${song.title}`);
              new Notify({
                status: "warning",
                title: "Descarga existente",
                text: `"${song.title}"`,
                effect: "fade",
              });
            } else {
              debugLog(`Descarga completada: ${song.title}`);
              new Notify({
                status: "success",
                title: "Descarga completada",
                text: `"${song.title}"`,
                effect: "fade",
              });
            }
            await loadDownloaded();
          } else {
            debugLog(`Error descargando ${song.title}: ${res.error}`);
            alert(`Error descargando ${song.title}: ${res.error}`);
          }
        } catch (err) {
          debugLog("Error en download listener:", err);
          alert(`Error inesperado descargando ${song.title}`);
        }
      });
      li.querySelector(".queue").addEventListener("click", () =>
        addToQueue(song)
      );
    });
  } catch (err) {
    resultsList.innerHTML = "<li>Error al buscar canciones</li>";
    if (genreEl) genreEl.textContent = "";
    if (searchResultsHeader) searchResultsHeader.style.display = "none";
    debugLog("Error searchSongDirectPlay:", err);
    console.dir(err);
  }
}


// ======= Canciones Mexicanas / Región México Predeterminadas =======
const DEFAULT_MEXICAN_TRACKS = [
  { title: "Volver Al Futuro", uploader: "Oscar Maydon & Junior H", duration: 204, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8d/76/23/8d762346-51e2-ebc7-fead-2a78c334f1dc/196872148862.jpg/600x600bb.jpg" },
  { title: "Diamantes", uploader: "Natanael Cano", duration: 211, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/05/24/4c/05244c75-15f5-3a22-5c3b-835fb254ad04/190296646058.jpg/600x600bb.jpg" },
  { title: "El Azul", uploader: "Junior H & Peso Pluma", duration: 187, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/92/c3/76/92c376a9-5571-132b-2d3d-f18cf7cb367b/5054197559709.jpg/600x600bb.jpg" },
  { title: "Disfruto Lo Malo", uploader: "Natanael Cano", duration: 187, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f9/75/58/f97558cf-9cce-0923-42df-196cc93c901a/050742369545_cover.jpg/600x600bb.jpg" },
  { title: "EXCESOS", uploader: "Fuerza Regida", duration: 187, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/21/e3/b7/21e3b74f-571b-07ce-567b-a2aa8274c7b2/196871548922.jpg/600x600bb.jpg" },
  { title: "Morena", uploader: "Neton Vega & Peso Pluma", duration: 194, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/b8/7b/bfb87bdf-9da6-880f-0fca-f74f22135f5b/1963622918315_cover.jpg/600x600bb.jpg" },
  { title: "TÚ NAME", uploader: "Fuerza Regida", duration: 152, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7c/4f/f5/7c4ff5aa-cf91-1fa1-e630-f8faee15a45b/198391799738.jpg/600x600bb.jpg" },
  { title: "Si No Quieres No", uploader: "Luis R Conriquez & Neton Vega", duration: 147, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/55/79/cb/5579cb20-b8ec-b14e-9824-37059711c210/198500201990.jpg/600x600bb.jpg" },
  { title: "Ella Baila Sola", uploader: "Eslabon Armado & Peso Pluma", duration: 165, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ce/eb/65/ceeb65bb-d130-1b77-50a8-b983aa68b4ad/196871141383.jpg/600x600bb.jpg" },
  { title: "PRC", uploader: "Peso Pluma & Natanael Cano", duration: 184, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/5c/58/fc/5c58fcbe-dfb4-b040-e1c3-294715f487e4/197187843467.jpg/600x600bb.jpg" },
  { title: "AMG", uploader: "Natanael Cano, Peso Pluma & Gabito Ballesteros", duration: 174, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/cb/2d/7e/cb2d7e5b-ef02-550f-e23a-f4efb85ce4fc/197187427490.jpg/600x600bb.jpg" },
  { title: "Que Vuelvas", uploader: "Carin Leon & Grupo Frontera", duration: 169, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/d9/b4/4d/d9b44d32-d1be-4976-b631-15b22304ce3d/197187214731.jpg/600x600bb.jpg" },
  { title: "Ch y la Pizza", uploader: "Fuerza Regida & Natanael Cano", duration: 136, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/a4/d8/9e/a4d89e47-a843-02f0-7bfa-fc2ee87e7be2/197187647898.jpg/600x600bb.jpg" },
  { title: "Fin de Semana", uploader: "Junior H & Oscar Maydon", duration: 211, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/15/d4/06/15d4061a-0724-4fec-d8ee-626a57639f40/197187978275.jpg/600x600bb.jpg" },
  { title: "Harley Quinn", uploader: "Fuerza Regida & Marshmello", duration: 143, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6e/b1/d5/6eb1d5f2-95f1-3315-7798-8b9eb5c17d7e/197189196554.jpg/600x600bb.jpg" },
  { title: "La Diabla", uploader: "Xavi", duration: 172, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/80/7e/40/807e408c-8f96-30ea-6101-38290e29b136/198391394148.jpg/600x600bb.jpg" },
  { title: "LADY GAGA", uploader: "Peso Pluma, Gabito Ballesteros & Junior H", duration: 212, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/91/ee/30/91ee304c-d1f0-dbe9-798c-ec8df7262d9c/197189035655.jpg/600x600bb.jpg" },
  { title: "El Color de Tus Ojos", uploader: "Banda MS de Sergio Lizárraga", duration: 203, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/33/c4/1d/33c41d1a-f761-0b5c-fc02-0e42d765e94b/191773721381.jpg/600x600bb.jpg" },
  { title: "Primera Cita", uploader: "Carin Leon", duration: 184, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/95/92/ff/9592ff33-f7ce-00a4-37ce-4bb9ca7eb2a2/197188734771.jpg/600x600bb.jpg" },
  { title: "Ya Superame", uploader: "Grupo Firme", duration: 199, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/93/bf/82/93bf8223-9568-d010-0938-f58c741e5e6e/196292523293.jpg/600x600bb.jpg" },
  { title: "No Se Va", uploader: "Grupo Frontera", duration: 193, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ea/91/92/ea919246-86d1-417e-c350-a1bd74f46ff7/196925501866.jpg/600x600bb.jpg" },
  { title: "De Los Besos Que Te Di", uploader: "Christian Nodal", duration: 167, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/96/60/eb/9660ebfe-659f-d30e-56e2-2a62d7a96452/19UMGIM22361.rgb.jpg/600x600bb.jpg" },
  { title: "Nunca Es Suficiente", uploader: "Los Ángeles Azules & Natalia Lafourcade", duration: 265, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/48/4f/72/484f728c-bfd3-0ec5-8ee0-2e0e4952077e/886447063462.jpg/600x600bb.jpg" },
  { title: "Labios Rotos", uploader: "Zoé", duration: 251, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/80/7e/6e/807e6e58-e325-1317-a00d-5872719d3ee7/5099909772251.jpg/600x600bb.jpg" }
];

let defaultMexicanSongsList = [];
window.defaultMexicanSongsList = defaultMexicanSongsList;

function createSongListItem(song, options = {}) {
  const li = document.createElement("li");
  const formattedDuration = song.duration
    ? (typeof song.duration === "number"
        ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}`
        : (String(song.duration).includes(":") ? song.duration : `${song.duration}s`))
    : "";
  const durationText = formattedDuration ? `(${formattedDuration})` : "";
  const rankHtml = options.rank ? `<span class="top-chart-rank" style="min-width: 28px; font-weight: 800; color: rgba(255, 255, 255, 0.45); font-family: Poppins, sans-serif; font-size: 0.95rem; text-align: center;">${options.rank}</span>` : "";
  const playCountBadge = (options.playCount !== undefined && options.playCount !== null)
    ? `<span class="song-play-count-badge" title="${options.playCount} reproducciones"><i class="ph-fill ph-headphones"></i> ${options.playCount} ${options.playCount === 1 ? 'reprod.' : 'reprods.'}</span>`
    : "";
  const cleanTitle = (typeof cleanSongTitle === "function") ? cleanSongTitle(song.title) : song.title;
  li.innerHTML = `
    ${rankHtml}
    <img class="play" src="${song.thumbnail || 'resources/player.gif'}" onerror="this.onerror=null; this.src='resources/player.gif';">
    <div class="song-info">
        <b>${cleanTitle}</b>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span>${song.uploader} ${durationText}</span>
            ${playCountBadge}
        </div>
    </div>
    <div class="song-actions">
        <button class="playbtn" title="Reproducir"><i class="ph ph-play"></i></button>
        <button class="download downloadButton" title="Descargar"><i class="ph ph-download-simple"></i></button>
        <button class="queue" title="Añadir a la cola"><i class="ph ph-list-plus"></i></button>
        <button class="add-to-playlist" title="Añadir a playlist"><i class="ph ph-folder-plus"></i></button>
    </div>
  `;

  li.querySelector(".play").addEventListener("click", () => playSong(song));

  li.querySelector(".playbtn").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    if (btn.dataset.locked === "true") {
      new Notify({
        status: "warning",
        title: "Espera...",
        text: "La reproducción es automática, espera un momento.",
        effect: "fade",
        speed: 300,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 3000,
        type: "outline",
        position: "right top",
      });
      return;
    }
    btn.dataset.locked = "true";
    setTimeout(() => {
      btn.dataset.locked = "false";
      btn.disabled = false;
    }, 5000);

    try {
      await playSong(song);
    } catch (err) {
      console.error("Error en playSong:", err);
    }
  });

  const downloadBtn = li.querySelector(".download");
  downloadBtn.addEventListener("click", async () => {
    if (downloadBtn.disabled) return;
    downloadBtn.disabled = true;
    downloadBtn.style.opacity = "0.6";
    await new Notify({
      status: "info",
      title: "Descargando...",
      text: `"${song.title}"`,
      effect: "fade",
    });
    debugLog("Iniciando descarga de:", song.title);
    if (window.systemTray) {
      window.systemTray.addMessage("Descarga", `Descargando: ${song.title}`, "info");
    }
    try {
      if (!song.url && !song.filename) {
        showPlayerStatus("Buscando enlace de audio...");
        await resolveSongOnlineUrl(song);
      }
      const res = await window.electronAPI.downloadSong(song);
      if (res.success) {
        if (res.alreadyExists) {
          debugLog(`La canción ya existe: ${song.title}`);
          if (window.systemTray) {
            window.systemTray.addMessage("Descarga", `La canción ya existe: ${song.title}`, "warning");
          }
          setTimeout(() => {
            new Notify({
              status: "warning",
              title: "Descarga existente",
              text: `"${song.title}"`,
              effect: "fade",
            });
          }, 1000);
        } else {
          debugLog(`Descarga completada: ${song.title}`);
          if (window.systemTray) {
            window.systemTray.addMessage("Descarga", `Descarga completada: ${song.title}`, "success");
          }
          new Notify({
            status: "success",
            title: "Descarga completada",
            text: `"${song.title}"`,
            effect: "fade",
          });
        }
        await loadDownloaded();
      } else {
        debugLog(`Error descargando ${song.title}: ${res.error}`);
        if (window.systemTray) {
          window.systemTray.addMessage("Descarga", `Error al descargar ${song.title}: ${res.error}`, "error");
        }
        alert(`Error descargando ${song.title}: ${res.error}`);
      }
    } catch (err) {
      debugLog("Error en download listener:", err);
      if (window.systemTray) {
        window.systemTray.addMessage("Descarga", `Error inesperado al descargar ${song.title}`, "error");
      }
      alert(`Error inesperado descargando ${song.title}`);
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.style.opacity = "1";
    }
  });

  li.querySelector(".queue").addEventListener("click", () => addToQueue(song));
  li.querySelector(".add-to-playlist").addEventListener("click", () => {
    openPlaylistModal({
      title: song.title,
      uploader: song.uploader,
      duration: song.duration,
      thumbnail: song.thumbnail,
      url: song.url || song.webpage_url || null,
      filename: null
    });
  });

  return li;
}

async function loadDefaultMexicanMusic() {
  if (searchInput && searchInput.value.trim().length > 0) {
    return;
  }
  const searchResultsHeader = document.getElementById("searchResultsHeader");
  if (searchResultsHeader) searchResultsHeader.style.display = "none";
  if (defaultRegionalHeader) defaultRegionalHeader.style.display = "flex";

  // Intentar cargar de caché local para rapidez instantánea
  if (!defaultMexicanSongsList || defaultMexicanSongsList.length === 0) {
    try {
      const cached = localStorage.getItem("mexlify_top_mexico_cache");
      if (cached) {
        defaultMexicanSongsList = JSON.parse(cached);
        window.defaultMexicanSongsList = defaultMexicanSongsList;
      }
    } catch (e) {
      console.warn("Error leyendo caché de top México:", e);
    }
  }

  // Si no hay aún, usar la lista curada predeterminada
  if (!defaultMexicanSongsList || defaultMexicanSongsList.length === 0) {
    defaultMexicanSongsList = [...DEFAULT_MEXICAN_TRACKS];
    window.defaultMexicanSongsList = defaultMexicanSongsList;
  }

  // Renderizar
  resultsList.innerHTML = "";
  defaultMexicanSongsList.forEach((song, idx) => {
    const li = createSongListItem(song);
    const playHandler = async () => {
      queue = defaultMexicanSongsList.map((s) => ({ ...s }));
      currentIndex = idx;
      saveQueueToStorage();
      renderQueue();
      await playSong(queue[currentIndex], !!queue[currentIndex].filename, currentIndex);
      highlightPlayingSong();
    };
    const origPlayBtn = li.querySelector(".playbtn");
    const origImg = li.querySelector(".play");
    const titleLink = li.querySelector(".song-info b");
    if (origPlayBtn) {
      origPlayBtn.replaceWith(origPlayBtn.cloneNode(true));
      li.querySelector(".playbtn").addEventListener("click", playHandler);
    }
    if (origImg) {
      origImg.replaceWith(origImg.cloneNode(true));
      li.querySelector(".play").addEventListener("click", playHandler);
    }
    if (titleLink) {
      titleLink.style.cursor = "pointer";
      titleLink.addEventListener("click", playHandler);
    }
    resultsList.appendChild(li);
  });
  highlightPlayingSong();

  // En segundo plano, buscar tendencias frescas de México
  fetchFreshMexicanMusic();
}

async function fetchFreshMexicanMusic() {
  try {
    const res = await fetch("https://itunes.apple.com/search?term=Regional+Mexicano&country=MX&entity=song&limit=30");
    if (!res.ok) return;
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const freshTracks = data.results.map((r) => ({
        title: r.trackName,
        uploader: r.artistName,
        duration: Math.round((r.trackTimeMillis || 0) / 1000),
        thumbnail: r.artworkUrl100 ? r.artworkUrl100.replace("100x100bb", "600x600bb") : "resources/player.gif",
        url: null,
        filename: null
      }));
      defaultMexicanSongsList = freshTracks;
      window.defaultMexicanSongsList = freshTracks;
      try {
        localStorage.setItem("mexlify_top_mexico_cache", JSON.stringify(freshTracks));
      } catch (e) {}

      // Si el buscador sigue vacío, actualizar suavemente
      if (searchInput && searchInput.value.trim().length === 0 && (!searchResultsHeader || searchResultsHeader.style.display === "none")) {
        resultsList.innerHTML = "";
        defaultMexicanSongsList.forEach((song, idx) => {
          const li = createSongListItem(song);
          const playHandler = async () => {
            queue = defaultMexicanSongsList.map((s) => ({ ...s }));
            currentIndex = idx;
            saveQueueToStorage();
            renderQueue();
            await playSong(queue[currentIndex], !!queue[currentIndex].filename, currentIndex);
            highlightPlayingSong();
          };
          const origPlayBtn = li.querySelector(".playbtn");
          const origImg = li.querySelector(".play");
          const titleLink = li.querySelector(".song-info b");
          if (origPlayBtn) {
            origPlayBtn.replaceWith(origPlayBtn.cloneNode(true));
            li.querySelector(".playbtn").addEventListener("click", playHandler);
          }
          if (origImg) {
            origImg.replaceWith(origImg.cloneNode(true));
            li.querySelector(".play").addEventListener("click", playHandler);
          }
          if (titleLink) {
            titleLink.style.cursor = "pointer";
            titleLink.addEventListener("click", playHandler);
          }
          resultsList.appendChild(li);
        });
        highlightPlayingSong();
      }
    }
  } catch (err) {
    console.warn("No se pudo obtener el top fresco de México:", err);
  }
}

let isSearchingSongs = false;

async function searchSongs() {
  if (isSearchingSongs) return;

  const query = searchInput ? searchInput.value.trim() : "";
  if (!query) {
    if (searchInput) searchInput.focus();
    return;
  }

  isSearchingSongs = true;
  if (searchButton) {
    searchButton.disabled = true;
    searchButton.classList.add("is-loading");
    searchButton.innerHTML = '<i class="ph ph-spinner ph-spin"></i>';
  }

  if (window.songQueue) {
    window.songQueue = null;
    console.log("Se limpió la cola de reproducción automática.");
  }
  navigateTo("search");

  const searchResultsHeader = document.getElementById("searchResultsHeader");
  if (defaultRegionalHeader) defaultRegionalHeader.style.display = "none";
  resultsList.innerHTML = `
    <div class="search-loading-state" style="padding: 40px 20px; text-align: center; color: rgba(255, 255, 255, 0.7); display: flex; flex-direction: column; align-items: center; gap: 12px;">
      <i class="ph ph-spinner ph-spin" style="font-size: 2.2rem; color: #ff0090;"></i>
      <span style="font-size: 0.95rem; font-weight: 500;">Buscando "${query}"...</span>
    </div>`;
  if (searchResultsHeader) searchResultsHeader.style.display = "none";

  try {
    const results = await window.electronAPI.searchSong(cleanQuery(query));
    resultsList.innerHTML = "";
    if (results.length > 0) {
      if (searchResultsHeader) searchResultsHeader.style.display = "flex";
    } else {
      resultsList.innerHTML = `
        <div class="messages-empty-state" style="padding: 40px 20px; text-align: center;">
          <i class="ph ph-magnifying-glass" style="font-size: 2.2rem; color: rgba(255, 0, 144, 0.4); margin-bottom: 8px; display: block;"></i>
          <p style="color: rgba(255, 255, 255, 0.85); font-size: 0.95rem; margin: 0;">No se encontraron canciones para "${query}".</p>
          <span style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); margin-top: 4px; display: block;">Intenta añadir el nombre del artista o revisa la ortografía.</span>
        </div>`;
      if (searchResultsHeader) searchResultsHeader.style.display = "none";
    }
    results.forEach((song) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img class="play" src="${song.thumbnail}" onerror="this.onerror=null; this.src='resources/player.gif';">
        <div class="song-info">
            <b>${song.title}</b>
            <span>${song.uploader} (${song.duration}s)</span>
        </div>
        <div class="song-actions">
            <button class="playbtn"><i class="ph ph-play"></i></button>
            <button class="download downloadButton"><i class="ph ph-download-simple"></i></button>
            <button class="queue" title="Añadir a la cola"><i class="ph ph-list-plus"></i></button>
            <button class="add-to-playlist" title="Añadir a playlist"><i class="ph ph-folder-plus"></i></button>
        </div>
      `;
      resultsList.appendChild(li);

      li.querySelector(".play").addEventListener("click", () => playSong(song));
      // tu listener con bloqueo
      li.querySelector(".playbtn").addEventListener("click", async (e) => {
        const btn = e.currentTarget;

        // si ya está bloqueado -> no ejecutar
        if (btn.dataset.locked === "true") {
          console.log("⏳ Este botón está bloqueado...");
          new Notify({
            status: "warning",
            title: "Espera...",
            text: "La reproducción es automática, espera un momento.",
            effect: "fade",
            speed: 300,
            customClass: "",
            customIcon: "",
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            notificationsGap: null,
            notificationsPadding: null,
            type: "outline",
            position: "right top",
            customWrapper: "",
          });
          btn.disabled = true;
          return; // ⬅️ aquí se detiene
        }

        // bloquear
        btn.dataset.locked = "true";
        //btn.disabled = true;
        console.log("▶️ Botón bloqueado por 5s");

        try {
          await playSong(song); // solo se ejecuta si NO estaba bloqueado
        } catch (err) {
          console.error("❌ Error en playSong:", err);
        }

        // desbloquear a los 5s
        setTimeout(() => {
          btn.dataset.locked = "false";
          btn.disabled = false;
          console.log("✅ Botón desbloqueado");
        }, 5000);
      });

      li.querySelector(".download").addEventListener("click", async () => {
        if (li.querySelector(".download").disabled) return;
        li.querySelector(".download").disabled = true;
        li.querySelector(".download").style.opacity = "0.6";
        await new Notify({
          status: "info",
          title: "Descargando...",
          text: `"${song.title}"`,
          effect: "fade",
        });
        debugLog("Iniciando descarga de:", song.title);
        if (window.systemTray) {
          window.systemTray.addMessage("Descarga", `Descargando: ${song.title}`, "info");
        }
        try {
          const res = await window.electronAPI.downloadSong(song);
          if (res.success) {
            if (res.alreadyExists) {
              debugLog(`La canción ya existe: ${song.title}`);
              if (window.systemTray) {
                window.systemTray.addMessage("Descarga", `La canción ya existe: ${song.title}`, "warning");
              }
              setTimeout(() => {
                new Notify({
                  status: "warning",
                  title: "Descarga existente",
                  text: `"${song.title}"`,
                  effect: "fade",
                });
              }, 1000);
            } else {
              debugLog(`Descarga completada: ${song.title}`);
              if (window.systemTray) {
                window.systemTray.addMessage("Descarga", `Descarga completada: ${song.title}`, "success");
              }
              new Notify({
                status: "success",
                title: "Descarga completada",
                text: `"${song.title}"`,
                effect: "fade",
              });
            }
            await loadDownloaded();
          } else {
            debugLog(`Error descargando ${song.title}: ${res.error}`);
            if (window.systemTray) {
              window.systemTray.addMessage("Descarga", `Error al descargar ${song.title}: ${res.error}`, "error");
            }
            alert(`Error descargando ${song.title}: ${res.error}`);
          }
        } catch (err) {
          debugLog("Error en download listener:", err);
          if (window.systemTray) {
            window.systemTray.addMessage("Descarga", `Error inesperado al descargar ${song.title}`, "error");
          }
          alert(`Error inesperado descargando ${song.title}`);
        } finally {
        }
      });
      li.querySelector(".queue").addEventListener("click", () =>
        addToQueue(song)
      );
      li.querySelector(".add-to-playlist").addEventListener("click", () => {
        openPlaylistModal({
          title: song.title,
          uploader: song.uploader,
          duration: song.duration,
          thumbnail: song.thumbnail,
          url: song.url || song.webpage_url || null,
          filename: null
        });
      });
    });
    highlightPlayingSong();
  } catch (err) {
    resultsList.innerHTML = `
      <div class="messages-empty-state" style="padding: 40px 20px; text-align: center;">
        <i class="ph ph-warning-circle" style="font-size: 2.2rem; color: #ff3366; margin-bottom: 8px; display: block;"></i>
        <p style="color: rgba(255, 255, 255, 0.85); font-size: 0.95rem; margin: 0;">Error al buscar canciones</p>
        <span style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.4); margin-top: 4px; display: block;">Verifica tu conexión a internet o intenta nuevamente.</span>
      </div>`;
    if (searchResultsHeader) searchResultsHeader.style.display = "none";
    debugLog("Error searchSong:", err);
    console.dir(err);
  } finally {
    isSearchingSongs = false;
    if (searchButton) {
      searchButton.disabled = false;
      searchButton.classList.remove("is-loading");
      searchButton.innerHTML = '<i class="ph ph-magnifying-glass"></i>';
    }
  }
}

// ======= iTunes API =======
class ITunesSearch {
  constructor() {
    this.baseUrl = "https://itunes.apple.com/search";
  }

  async searchTracks(query, limit = 15) {
    const response = await fetch(
      `${this.baseUrl}?term=${encodeURIComponent(
        query
      )}&entity=song&limit=${limit}`
    );
    return response.json();
  }

  async searchArtistName(artistName) {
    const response = await fetch(
      `${this.baseUrl}?term=${encodeURIComponent(
        artistName
      )}&entity=musicArtist&limit=5`
    );
    const data = await response.json();
    return data.results; // array de artistas encontrados
  }
}

// Crear instancia
const itunes = new ITunesSearch();

// Función principal para mostrar recomendaciones con diseño Liquid Glass
async function showArtistRecommendations(artistName) {
  const container = document.getElementById("artistRecommends");
  if (!container || !artistName || artistName.trim().length === 0 || artistName.trim() === "Artista") return;

  const cleanArtist = artistName.trim();
  container.classList.add("is-visible");
  container.innerHTML = `
    <div class="ListHeader recommends-header">
      <div class="header-title-group">
        <h2><i class="ph-fill ph-sparkle" style="color: #ff0090; margin-right: 6px;"></i>Recomendaciones</h2>
        <span class="stat-badge" id="recommendsArtistBadge">${cleanArtist}</span>
      </div>
      <div class="header-actions-group">
        <button id="closeRecommendsBtn" class="changeBg" style="padding: 6px 14px; font-size: 0.85rem;" title="Ocultar recomendaciones">
          <i class="ph ph-x"></i> Ocultar
        </button>
      </div>
    </div>
    <div class="recommends-loading" style="padding: 24px; text-align: center; color: rgba(255, 255, 255, 0.65); display: flex; align-items: center; justify-content: center; gap: 10px;">
      <i class="ph ph-spinner ph-spin" style="font-size: 1.5rem; color: #ff0090;"></i>
      <span>Buscando canciones similares de ${cleanArtist}...</span>
    </div>
  `;

  document.getElementById("closeRecommendsBtn")?.addEventListener("click", () => {
    container.classList.remove("is-visible");
    container.innerHTML = "";
  });

  const seenIds = new Set();
  const cleanFirstArtist = cleanArtist.split(/[,&]/)[0].trim();
  const queries = [
    cleanFirstArtist,
    cleanArtist,
    cleanFirstArtist.split(" ").slice(0, 2).join(" "),
    cleanFirstArtist.split(" ")[0],
  ];

  let artistResults = [];
  for (const query of queries) {
    if (!query) continue;
    const results = await itunes.searchArtistName(query);
    if (results && results.length > 0) {
      artistResults = results;
      break;
    }
  }

  const artistCorrectName = (artistResults.length > 0) ? artistResults[0].artistName : cleanFirstArtist;

  // Buscar canciones del artista correcto
  let trackResults = [];
  const trackData = await itunes.searchTracks(artistCorrectName, 20);
  if (trackData.results && trackData.results.length > 0) {
    trackResults = trackData.results;
  }

  const loadingEl = container.querySelector(".recommends-loading");
  if (loadingEl) loadingEl.remove();

  if (trackResults.length === 0) {
    container.innerHTML = `
      <div class="ListHeader recommends-header">
        <div class="header-title-group">
          <h2><i class="ph-fill ph-sparkle" style="color: #ff0090; margin-right: 6px;"></i>Recomendaciones</h2>
          <span class="stat-badge">${cleanArtist}</span>
        </div>
        <div class="header-actions-group">
          <button id="closeRecommendsBtn" class="changeBg" style="padding: 6px 14px; font-size: 0.85rem;" title="Ocultar recomendaciones">
            <i class="ph ph-x"></i> Ocultar
          </button
        </div>
      </div>
      <div class="messages-empty-state" style="padding: 24px 16px; text-align: center; color: rgba(255, 255, 255, 0.65);">
        <i class="ph ph-sparkle" style="font-size: 2rem; color: rgba(255, 0, 144, 0.4); margin-bottom: 6px; display: block;"></i>
        <span>No se encontraron recomendaciones disponibles para este artista.</span>
      </div>
    `;
    document.getElementById("closeRecommendsBtn")?.addEventListener("click", () => {
      container.classList.remove("is-visible");
      container.innerHTML = "";
    });
    return;
  }

  // Actualizar encabezado con botón de reproducción rápida
  const headerActions = container.querySelector(".header-actions-group");
  if (headerActions) {
    headerActions.innerHTML = `
      <button id="playMixRecommendsBtn" class="changeBg" style="padding: 6px 14px; font-size: 0.85rem;" title="Reproducir primera recomendación">
        <i class="ph-fill ph-play"></i> Reproducir mix
      </button>
      <button id="closeRecommendsBtn" class="changeBg" style="padding: 6px 14px; font-size: 0.85rem;" title="Ocultar recomendaciones">
        <i class="ph ph-x"></i> Ocultar
      </button>
    `;
  }

  document.getElementById("closeRecommendsBtn")?.addEventListener("click", () => {
    container.classList.remove("is-visible");
    container.innerHTML = "";
  });

  const ul = document.createElement("ul");
  ul.className = "recommends-list";

  trackResults.forEach((track) => {
    if (seenIds.has(track.trackId)) return;
    seenIds.add(track.trackId);

    const li = document.createElement("li");
    li.className = "recommend-song-item";
    li.setAttribute("data-id", track.trackId);

    const artwork = (track.artworkUrl100 || track.artworkUrl60 || "")
      .replace(/\/\d+x\d+bb\./, "/200x200bb.") || "resources/player.gif";
    const durSec = Math.round((track.trackTimeMillis || 0) / 1000);
    const durText = durSec > 0 ? `(${formatTime(durSec)})` : "";
    const cleanTitle = (typeof cleanSongTitle === "function") ? cleanSongTitle(track.trackName) : track.trackName;

    li.innerHTML = `
      <span class="recommend-rank-icon"><i class="ph-fill ph-sparkle"></i></span>
      <img class="recommend-thumb" src="${artwork}" alt="${track.trackName} cover" onerror="this.onerror=null; this.src='resources/player.gif';" />
      <div class="song-info">
        <b>${cleanTitle}</b>
        <span>${track.artistName} ${durText}</span>
      </div>
      <div class="song-actions">
        <button class="playbtn" title="Reproducir"><i class="ph ph-play"></i></button>
        <button class="queue" title="Añadir a la cola"><i class="ph ph-list-plus"></i></button>
        <button class="add-to-playlist" title="Añadir a playlist"><i class="ph ph-folder-plus"></i></button>
      </div>
    `;

    const playThisRecommendation = () => {
      const query = `${track.artistName} ${track.trackName}`;
      searchSongDirectPlay(query);
    };

    li.querySelector(".playbtn").addEventListener("click", playThisRecommendation);
    li.querySelector(".recommend-thumb").addEventListener("click", playThisRecommendation);
    li.querySelector(".song-info b").addEventListener("click", playThisRecommendation);

    li.querySelector(".queue").addEventListener("click", (e) => {
      e.stopPropagation();
      addToQueue({
        title: track.trackName,
        uploader: track.artistName,
        thumbnail: artwork,
        duration: durSec,
        url: null,
        filename: null
      });
    });

    li.querySelector(".add-to-playlist").addEventListener("click", (e) => {
      e.stopPropagation();
      openPlaylistModal({
        title: track.trackName,
        uploader: track.artistName,
        duration: durSec,
        thumbnail: artwork,
        url: null,
        filename: null
      });
    });

    ul.appendChild(li);
  });

  container.appendChild(ul);

  document.getElementById("playMixRecommendsBtn")?.addEventListener("click", () => {
    const firstItem = ul.querySelector(".recommend-song-item");
    if (firstItem) {
      firstItem.querySelector(".playbtn")?.click();
    }
  });
}

// ======= iTunes y funciones aleatorias =======
async function getRandomSongByArtist(artistName, excludeTrackName = null) {
  // Búsqueda en iTunes
  let data;
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        artistName
      )}&entity=song&limit=10`
    );
    if (!response.ok) return null;
    data = await response.json();
  } catch (err) {
    debugLog("getRandomSongByArtist: error de red:", err);
    return null;
  }
  let songs = data.results;
  if (excludeTrackName) {
    songs = songs.filter(
      (song) => song.trackName.toLowerCase() !== excludeTrackName.toLowerCase()
    );
  }
  const artistParts = artistName
    .split(/,|\s+/)
    .map((part) => normalize(part))
    .filter(Boolean);

  songs = songs.filter((song) => {
    const normalizedArtist = normalize(song.artistName);
    const matches = artistParts.filter((part) =>
      normalizedArtist.includes(part)
    );
    return matches.length >= Math.ceil(artistParts.length / 2);
  });

  if (songs.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * songs.length);
  const selectedSong = songs[randomIndex];
  return {
    trackName: selectedSong.trackName,
    artistName: selectedSong.artistName,
    genre: selectedSong.primaryGenreName || null,
    cover:
      selectedSong.artworkUrl100?.replace("100x100bb.jpg", "500x500bb.jpg") ||
      null,
  };
}

async function playRandomSongByArtistDirect() {
  const title = songTitle.textContent;
  const artist = songArtist.textContent;
  let song = await getRandomSongByArtist(artist);
  if (!song) {
    // Si no encuentra por artista, intenta buscar por partes del título
    const titleParts = title
      .split(/[-–—,]/)
      .map((part) => part.trim())
      .filter(Boolean);
    for (const part of titleParts) {
      song = await getRandomSongByArtist(part);
      if (song) break;
    }
  }
  if (song) {
    await searchSongDirectPlay(title, song.artistName);
  } else {
    console.log("No se encontraron canciones.");
  }
}

// ======= Eventos =======
player.addEventListener("loadstart", () => {
  debugLog("Audio: loadstart");
});

player.addEventListener("canplay", () => {
  clearTimeout(waitingBufferingTimeout);
  debugLog("Audio: canplay");
});

player.addEventListener("playing", () => {
  clearTimeout(waitingBufferingTimeout);
  debugLog("Audio: playing");
});

let waitingBufferingTimeout = null;
player.addEventListener("waiting", () => {
  debugLog("Audio: waiting / buffering");
  clearTimeout(waitingBufferingTimeout);
  waitingBufferingTimeout = setTimeout(() => {
    if (player.paused || player.readyState < 3) {
      showPlayerStatus("Reintentando conexión...");
    }
  }, 2800);
});

player.addEventListener("ended", () => {
  document.querySelector("#progressBar").disabled = true;
  document.querySelector("#fcp-progressbar").disabled = true;
  document.querySelector("#currentTime").textContent = "0:00";
  document.querySelector("#fcp-time").textContent = "0:00";
  document.querySelector("#totalTime").textContent = "0:00";
  document.querySelector("#fcp-time-total").textContent = "0:00";
  document.querySelector("#cover").src =
    "https://i.ibb.co/CKrdcJTT/logo-app-mexlify-center.png";
  document.querySelector("#fcp-cover").src =
    "https://i.ibb.co/CKrdcJTT/logo-app-mexlify-center.png";
  playPauseBtn.innerHTML = '<i class="ph ph-play"></i>';
  fcp_playPauseBtn.innerHTML = '<i class="ph ph-play"></i>';
  if (!currentlyResolvingSong) {
    setPlaybackBadgeState("stopped");
  }
  if (!isRepeating && repeatMode === "off") currentAudio = null;
  progressBar.value = 0;
  progressBar.style.setProperty('--value', '0%');
  fcpProgressBar.value = 0;
  fcpProgressBar.style.setProperty('--value', '0%');
  currentTimeEl.textContent = "0:00";
  fcpCurrentTimeEl.textContent = "0:00";
  setTimeout(async () => {
    await window.electronAPI.setDiscordActivity(
      "En hub",
      "Esperando canción...",
      "logo_app_mexlify_center",
      false
    );
  }, 5 * 1000);
  // Reproducir siguiente en cola o repetir según repeatMode
  if (repeatMode === "one") {
    player.currentTime = 0;
    player.play().catch(debugLog);
    return;
  }
  playNext();

  // Recomendaciones con Spotify
  const songArtist = document.getElementById("songArtist");
  if (!songArtist) return;
  const artistName = songArtist.textContent;
  showArtistRecommendations(artistName);
});

player.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(player.duration);
  fcpTotalTimeEl.textContent = formatTime(player.duration);
});

player.addEventListener("playing", () => {
  setPlaybackBadgeState("playing");
});

player.addEventListener("waiting", () => {
  if (currentlyResolvingSong || player.paused || player.currentTime === 0) {
    setPlaybackBadgeState("obtaining");
  }
});

progressBar.addEventListener("input", () => {
  if (!player.duration) return;
  progressBar.style.setProperty('--value', `${progressBar.value}%`);
  player.currentTime = (progressBar.value / 100) * player.duration;
});
fcpProgressBar.addEventListener("input", () => {
  if (!player.duration) return;
  fcpProgressBar.style.setProperty('--value', `${fcpProgressBar.value}%`);
  player.currentTime = (fcpProgressBar.value / 100) * player.duration;
});

player.addEventListener("play", () => {
  playPauseBtn.innerHTML = '<i class="ph ph-pause"></i>';
  fcp_playPauseBtn.innerHTML = '<i class="ph ph-pause"></i>';
  setPlaybackBadgeState("playing");
  setTimeout(async () => {
    const dur = (!isNaN(player.duration) && player.duration > 0) ? player.duration : (currentSong?.duration || 0);
    await window.electronAPI.setDiscordActivity(
      `En reproducción | (${formatTime(dur)})`,
      `${songTitle.textContent} - ${songArtist.textContent}`,
      `${cover.src}`,
      false
    );
  }, 5 * 1000);
  renderQueue();
});

player.addEventListener("pause", () => {
  setTimeout(async () => {
    const dur = (!isNaN(player.duration) && player.duration > 0) ? player.duration : (currentSong?.duration || 0);
    await window.electronAPI.setDiscordActivity(
      `En pausa | (${formatTime(dur)})`,
      `${songTitle.textContent} - ${songArtist.textContent}`,
      `${cover.src}`,
      false
    );
  }, 5 * 1000);
  playPauseBtn.innerHTML = '<i class="ph ph-play"></i>';
  fcp_playPauseBtn.innerHTML = '<i class="ph ph-play"></i>';
  if (!currentlyResolvingSong) {
    setPlaybackBadgeState("paused");
  }
});

let lastDisplayedSecond = -1;

player.addEventListener("timeupdate", () => {
  const duration = player.duration;
  const currentTime = player.currentTime;

  if (
    typeof duration === "number" &&
    duration > 0 &&
    typeof currentTime === "number" &&
    !isNaN(currentTime)
  ) {
    // Solo actualiza si el segundo entero ha cambiado
    const currentSecond = Math.floor(currentTime);
    if (currentSecond !== lastDisplayedSecond) {
      lastDisplayedSecond = currentSecond;
      const percent = (currentTime / duration) * 100;
      progressBar.value = percent;
      progressBar.style.setProperty('--value', `${percent}%`);
      fcpProgressBar.value = percent;
      fcpProgressBar.style.setProperty('--value', `${percent}%`);
      currentTimeEl.textContent = formatTime(currentTime);
      fcpCurrentTimeEl.textContent = formatTime(currentTime);
    }
  } else {
    if (lastDisplayedSecond !== -1) {
      progressBar.value = 0;
      progressBar.style.setProperty('--value', '0%');
      fcpProgressBar.value = 0;
      fcpProgressBar.style.setProperty('--value', '0%');
      currentTimeEl.textContent = "0:00";
      fcpCurrentTimeEl.textContent = "0:00";
      lastDisplayedSecond = -1;
    }
  }
});

player.addEventListener("error", (e) => {
  const audioError = e.target.error;
  if (!audioError) return;
  switch (audioError.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      debugLog("Audio: Carga abortada intencionalmente");
      break;
    case MediaError.MEDIA_ERR_NETWORK: {
      debugLog("Audio: Error de red detectado (posible ERR_CONNECTION_RESET), recuperando...", audioError);
      // Auto-reconexión fluida si la conexión con googlevideo se interrumpió
      if (currentSong && !currentSong.isDownloaded && player.currentTime > 0) {
        const resumePosition = player.currentTime;
        showPlayerStatus("Reanudando conexión de audio...");
        setTimeout(async () => {
          try {
            const freshUrl = await window.electronAPI.streamSong(currentSong);
            if (freshUrl) {
              player.src = freshUrl;
              player.currentTime = resumePosition;
              player.play().catch(debugLog);
            } else {
              player.load();
              player.currentTime = resumePosition;
              player.play().catch(debugLog);
            }
          } catch (recErr) {
            debugLog("Error al recuperar stream:", recErr);
          }
        }, 800);
      }
      break;
    }
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      if (player.src === "" || !player.src) {
        debugLog("Audio: src vacío o no soportado", audioError);
        alert(
          "No se pudo reproducir la canción (src vacío o formato no soportado)."
        );
        if (queue.length > 0 && currentIndex < queue.length - 1) {
          currentIndex++;
          playSong(queue[currentIndex]);
        }
      } else {
        debugLog("Audio: Formato no soportado", audioError);
        console.dir(audioError);
      }
      break;
    default:
      debugLog("Audio: Error real", audioError);
  }
});

// ---- Eventos del Buscador de canciones ----
if (searchButton) {
  searchButton.addEventListener("click", () => searchSongs());
}

if (searchClearBtn) {
  searchClearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchClearBtn.classList.add("is-hidden");
    searchInput.focus();
    loadDefaultMexicanMusic();
  });
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchSongs();
  }
  if (e.key === "Escape") {
    searchInput.value = "";
    if (searchClearBtn) searchClearBtn.classList.add("is-hidden");
    loadDefaultMexicanMusic();
  }
});

searchInput.addEventListener("input", () => {
  if (searchClearBtn) {
    searchClearBtn.classList.toggle("is-hidden", searchInput.value.length === 0);
  }
  if (searchInput.value.trim().length === 0) {
    loadDefaultMexicanMusic();
  }
});

if (playAllRegionalBtn) {
  playAllRegionalBtn.addEventListener("click", async () => {
    if (!defaultMexicanSongsList || defaultMexicanSongsList.length === 0) {
      defaultMexicanSongsList = [...DEFAULT_MEXICAN_TRACKS];
    }
    queue = defaultMexicanSongsList.map((s) => ({ ...s }));
    renderQueue();
    currentIndex = 0;
    new Notify({
      status: "info",
      title: "Tendencias en México",
      text: `Reproduciendo ${queue.length} canciones del Top México.`,
      effect: "fade",
      autotimeout: 3000
    });
    await playSong(queue[0]);
  });
}

const shuffleRegionalBtn = document.getElementById("shuffleRegionalBtn");
if (shuffleRegionalBtn) {
  shuffleRegionalBtn.addEventListener("click", async () => {
    if (!defaultMexicanSongsList || defaultMexicanSongsList.length === 0) {
      defaultMexicanSongsList = [...DEFAULT_MEXICAN_TRACKS];
    }
    const shuffled = [...defaultMexicanSongsList].sort(() => Math.random() - 0.5);
    queue = shuffled.map((s) => ({ ...s }));
    renderQueue();
    currentIndex = 0;
    new Notify({
      status: "info",
      title: "Tendencias en México (Aleatorio)",
      text: `Reproduciendo ${queue.length} canciones mezcladas.`,
      effect: "fade",
      autotimeout: 3000
    });
    await playSong(queue[0]);
  });
}

[playPauseBtn, fcp_playPauseBtn].forEach((btn) => {
  btn.addEventListener("click", () => {
    if (player.paused) {
      if ((!player.src || player.src === "") && currentSong) {
        playSong(currentSong, currentSong.isDownloaded || false);
      } else {
        player.play();
        playPauseBtn.innerHTML = '<i class="ph ph-pause"></i>';
        fcp_playPauseBtn.innerHTML = '<i class="ph ph-pause"></i>';
      }
    } else {
      player.pause();
      playPauseBtn.innerHTML = '<i class="ph ph-play"></i>';
      fcp_playPauseBtn.innerHTML = '<i class="ph ph-play"></i>';
    }
  });
});

[prevBtn, fcp_prevBtn].forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", () => {
      playPrev();
    });
  }
});

[nextBtn, fcp_nextBtn].forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", () => {
      playNext();
    });
  }
});

[repeatBtn, fcp_repeatBtn].forEach((btn) => {
  if (btn) btn.addEventListener("click", cycleRepeatMode);
});
[shuffleBtn, fcp_shuffleBtn].forEach((btn) => {
  if (btn) btn.addEventListener("click", toggleShuffleMode);
});

[muteBtn, fcp_muteBtn].forEach((btn) => {
  btn.addEventListener("click", () => {
    if (isMuted) {
      player.volume = lastVolume;
      volumeSlider.value = lastVolume;
      fcp_volumeSlider.value = lastVolume;
      const percent = (lastVolume / 0.95) * 100;
      volumeSlider.style.setProperty('--value', `${percent}%`);
      fcp_volumeSlider.style.setProperty('--value', `${percent}%`);
      muteBtn.innerHTML =
        '<i style="font-size: larger;" class="ph ph-speaker-high"></i>';
      fcp_muteBtn.innerHTML =
        '<i style="font-size: larger;" class="ph ph-speaker-high"></i>';
      isMuted = false;
      muteBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    } else {
      lastVolume = player.volume;
      player.volume = 0;
      volumeSlider.value = 0;
      volumeSlider.style.setProperty('--value', '0%');
      fcp_volumeSlider.value = 0;
      fcp_volumeSlider.style.setProperty('--value', '0%');
      muteBtn.innerHTML =
        '<i style="font-size: larger;" class="ph ph-speaker-simple-slash"></i>';
      fcp_muteBtn.innerHTML =
        '<i style="font-size: larger;" class="ph ph-speaker-simple-slash"></i>';
      isMuted = true;
      muteBtn.style.backgroundColor = "#080014";
    }
    localStorage.setItem("mexlify_volume", isMuted ? 0 : lastVolume);
    localStorage.setItem("mexlify_muted", isMuted ? "true" : "false");
  });
});

// ======= Ajustes de Sensibilidad de Volumen (Touchpad y Ratón) =======
let touchpadSensFactor = parseFloat(localStorage.getItem("mexlify_touchpad_sens")) || 0.035;
let mouseWheelSensFactor = parseFloat(localStorage.getItem("mexlify_mouse_sens")) || 0.04;

function initAccessibilitySettings() {
  const touchpadInput = document.getElementById("touchpadSensitivity");
  const touchpadValueLabel = document.getElementById("touchpadSensitivityValue");
  const mouseInput = document.getElementById("mouseWheelSensitivity");
  const mouseValueLabel = document.getElementById("mouseWheelSensitivityValue");
  const resetBtn = document.getElementById("resetSensitivityBtn");

  if (touchpadInput && touchpadValueLabel) {
    touchpadInput.value = touchpadSensFactor;
    touchpadValueLabel.textContent = (touchpadSensFactor * 100).toFixed(1);

    touchpadInput.addEventListener("input", (e) => {
      touchpadSensFactor = parseFloat(e.target.value);
      touchpadValueLabel.textContent = (touchpadSensFactor * 100).toFixed(1);
      localStorage.setItem("mexlify_touchpad_sens", touchpadSensFactor);
    });
  }

  if (mouseInput && mouseValueLabel) {
    mouseInput.value = mouseWheelSensFactor;
    mouseValueLabel.textContent = (mouseWheelSensFactor * 100).toFixed(1);

    mouseInput.addEventListener("input", (e) => {
      mouseWheelSensFactor = parseFloat(e.target.value);
      mouseValueLabel.textContent = (mouseWheelSensFactor * 100).toFixed(1);
      localStorage.setItem("mexlify_mouse_sens", mouseWheelSensFactor);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      touchpadSensFactor = 0.035;
      mouseWheelSensFactor = 0.04;
      localStorage.setItem("mexlify_touchpad_sens", touchpadSensFactor);
      localStorage.setItem("mexlify_mouse_sens", mouseWheelSensFactor);

      if (touchpadInput && touchpadValueLabel) {
        touchpadInput.value = touchpadSensFactor;
        touchpadValueLabel.textContent = (touchpadSensFactor * 100).toFixed(1);
      }
      if (mouseInput && mouseValueLabel) {
        mouseInput.value = mouseWheelSensFactor;
        mouseValueLabel.textContent = (mouseWheelSensFactor * 100).toFixed(1);
      }

      if (window.systemTray) {
        window.systemTray.addMessage("Accesibilidad", "Sensibilidad de volumen restablecida a los valores predeterminados.", "info");
      }
    });
  }
}

const volumeContainers = [
  document.querySelector(".volume-controls-row"),
  fcp_volumeSlider ? fcp_volumeSlider.parentElement : null,
  volumeSlider,
  fcp_volumeSlider
].filter(Boolean);

// Escuchar wheel en sliders y en el contenedor del volumen para facilitar el gesto en touchpad
const boundVolumeElements = new Set(volumeContainers);
boundVolumeElements.forEach((el) => {
  el.addEventListener("wheel", function (event) {
    event.preventDefault();

    // Soportar tanto scroll vertical como horizontal del touchpad
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? -event.deltaY : event.deltaX;
    if (delta === 0) return;

    // Sensibilidad calibrada para touchpad y rueda de ratón (ajustable en Ajustes > Accesibilidad):
    // deltaMode 0: píxeles (touchpad o ratones de alta resolución)
    // deltaMode 1: líneas (ratón convencional)
    // deltaMode 2: páginas
    let change = 0;
    if (event.deltaMode === 1) {
      change = (delta / 3) * mouseWheelSensFactor;
    } else if (event.deltaMode === 2) {
      change = delta * mouseWheelSensFactor * 2.5;
    } else {
      // Modo píxeles (típico de touchpads)
      change = (delta / 120) * touchpadSensFactor;
    }

    // Limitar el paso máximo por evento según la sensibilidad configurada
    const maxStep = Math.max(0.04, Math.min(0.15, touchpadSensFactor * 2));
    change = Math.max(-maxStep, Math.min(maxStep, change));

    let current = parseFloat(volumeSlider.value) || 0;
    let nextVal = Math.max(0, Math.min(0.95, current + change));

    // Redondear a 4 decimales para mantener fluidez y evitar imprecisión flotante
    nextVal = Math.round(nextVal * 10000) / 10000;

    handleVolumeChange({ target: { value: nextVal } });
  }, { passive: false });
});

function handleVolumeChange(e) {
  const value = parseFloat(e.target.value);
  const percent = (value / 0.95) * 100;

  // Cambia ambos sliders y ambos players
  volumeSlider.value = value;
  volumeSlider.style.setProperty('--value', `${percent}%`);
  fcp_volumeSlider.value = value;
  fcp_volumeSlider.style.setProperty('--value', `${percent}%`);
  player.volume = value;

  // Guardar volumen antes de mutear
  if (value > 0) {
    lastVolume = value;
    isMuted = false;
    muteBtn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  }

  // Guardar en localStorage
  localStorage.setItem("mexlify_volume", value);
  localStorage.setItem("mexlify_muted", (value === 0 || isMuted) ? "true" : "false");

  // Determinar el ícono del botón mute según el volumen
  let iconHtml;
  let volume = Math.max(0, Math.min(value, 1)); // Asegura que 0 <= volume <= 1
  if (volume === 0) {
    // Muteado
    iconHtml =
      "<i style='font-size: larger;' class='ph ph-speaker-simple-slash'></i>";
    isMuted = true;
    muteBtn.style.backgroundColor = "#080014";
  } else if (volume > 0 && volume <= 0.5) {
    // Volumen bajo
    iconHtml = "<i style='font-size: larger;' class='ph ph-speaker-low'></i>";
    isMuted = false;
  } else if (volume > 0.5 && volume <= 1.0) {
    // Volumen alto
    iconHtml = "<i style='font-size: larger;' class='ph ph-speaker-high'></i>";
    isMuted = false;
  } else {
    // Fallback
    iconHtml =
      "<i style='font-size: larger;' class='ph ph-speaker-simple-slash'></i>";
    isMuted = true;
  }

  // Solo actualiza el HTML si cambió
  if (muteBtn.innerHTML !== iconHtml) muteBtn.innerHTML = iconHtml;
  if (fcp_muteBtn.innerHTML !== iconHtml) fcp_muteBtn.innerHTML = iconHtml;
}

volumeSlider.addEventListener("input", handleVolumeChange);
fcp_volumeSlider.addEventListener("input", handleVolumeChange);

// ======= Navegación centralizada =======
// Todas las vistas de contenido central que navigateTo controla
const ALL_CONTENT_VIEWS = [searchContainer, downloadsContainer, settingsContainer, countryTopContainer, recentsContainer, playlistsContainer];
// Todos los nav-links del navbar superior y sidebar
const ALL_NAV_LINKS = [homeTab, searchTab, downloadsTab, settingsTabButton, playlistsTab];

/**
 * navigateTo — fuente única de verdad para mostrar/ocultar vistas.
 * @param {string} view - "home" | "search" | "downloads" | "settings" | "countryTop" | "recents" | "playlists"
 */
function navigateTo(view) {
  // 1. Ocultar TODAS las vistas de contenido
  ALL_CONTENT_VIEWS.forEach((el) => {
    if (el) el.classList.add("is-hidden");
  });

  // 2. Quitar activo de todos los nav-links
  ALL_NAV_LINKS.forEach((el) => {
    if (el) el.classList.remove("is-active");
  });

  // 3. Mostrar/ocultar el homeView (las cards de inicio + bienvenida)
  if (homeView) homeView.classList.toggle("is-hidden", view !== "home");

  // 4. Activar la vista correcta
  switch (view) {
    case "home":
      searchContainer.classList.remove("is-hidden");
      homeTab.classList.add("is-active");
      if (searchInput && searchInput.value.trim().length === 0 && (!resultsList || resultsList.children.length === 0)) {
        loadDefaultMexicanMusic();
      }
      break;
    case "search":
      searchContainer.classList.remove("is-hidden");
      searchTab.classList.add("is-active");
      if (searchInput && searchInput.value.trim().length === 0 && (!resultsList || resultsList.children.length === 0)) {
        loadDefaultMexicanMusic();
      }
      break;
    case "downloads":
      downloadsContainer.classList.remove("is-hidden");
      downloadsTab.classList.add("is-active");
      break;
    case "settings":
      settingsContainer.classList.remove("is-hidden");
      settingsTabButton.classList.add("is-active");
      // Activar tab General por defecto si ninguna está activa
      if (!document.querySelector(".tablinkSettings.is-active")) {
        const defaultTab = document.getElementById("defaultTab");
        if (defaultTab) defaultTab.click();
      }
      break;
    case "countryTop":
      countryTopContainer.classList.remove("is-hidden");
      if (homeTab) homeTab.classList.add("is-active");
      break;
    case "recents":
      if (recentsContainer) recentsContainer.classList.remove("is-hidden");
      renderRecents();
      break;
    case "playlists":
      if (playlistsContainer) playlistsContainer.classList.remove("is-hidden");
      if (playlistsTab) playlistsTab.classList.add("is-active");
      
      // Hide detail view by default and show playlists grid
      if (playlistDetailView) playlistDetailView.classList.add("is-hidden");
      const createRow = document.querySelector(".playlist-create-row");
      if (createRow) createRow.classList.remove("is-hidden");
      if (playlistsGrid) playlistsGrid.classList.remove("is-hidden");
      renderPlaylists();
      break;
  }
  highlightPlayingSong();
  scrollToTop(true);
}

// ======= Función universal para desplazar al top =======
function scrollToTop(smooth = true) {
  const behavior = smooth ? "smooth" : "auto";
  window.scrollTo({ top: 0, left: 0, behavior });
  if (document.documentElement) document.documentElement.scrollTo({ top: 0, left: 0, behavior });
  if (document.body) document.body.scrollTo({ top: 0, left: 0, behavior });

  const scrollContainers = [
    document.getElementById("resultsList"),
    document.getElementById("downloadsList"),
    document.getElementById("recentsList"),
    document.getElementById("country-top-container"),
    document.getElementById("searchContainer"),
    document.getElementById("downloadsContainer"),
    document.getElementById("settings"),
    document.getElementById("playlistsContainer"),
    document.querySelector(".top-chart-songs-list"),
    document.querySelector(".content.glass-box"),
    document.querySelector(".tab-content"),
    document.getElementById("homeView")
  ];
  scrollContainers.forEach((el) => {
    if (el) {
      if (typeof el.scrollTo === "function") {
        el.scrollTo({ top: 0, left: 0, behavior });
      }
      el.scrollTop = 0;
    }
  });
}
window.scrollToTop = scrollToTop;

// ======= Listeners de navegación (navbar y sidebar) =======
// Siempre que se toque alguno de los elementos en .nav-right, llevar al top
document.querySelectorAll(".nav-right a").forEach((link) => {
  link.addEventListener("click", () => {
    scrollToTop(true);
  });
});

const navTitleEl = document.querySelector(".nav-title");
if (navTitleEl) {
  navTitleEl.style.cursor = "pointer";
  navTitleEl.addEventListener("click", () => {
    navigateTo("home");
    scrollToTop(true);
  });
}

homeTab.addEventListener("click", (e) => {
  e.preventDefault();
  navigateTo("home");
  scrollToTop(true);
});

searchTab.addEventListener("click", (e) => {
  e.preventDefault();
  navigateTo("search");
  scrollToTop(true);
});

downloadsTab.addEventListener("click", (e) => {
  e.preventDefault();
  navigateTo("downloads");
  scrollToTop(true);
});

settingsTabButton.addEventListener("click", (e) => {
  e.preventDefault();
  navigateTo("settings");
  scrollToTop(true);
});

if (recentsTab) {
  recentsTab.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("recents");
  });
}

if (playlistsTab) {
  playlistsTab.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("playlists");
  });
}

// ======= Renderizador de Recientes =======
function renderRecents() {
  const recentsList = document.getElementById("recentsList");
  if (!recentsList) return;
  recentsList.innerHTML = "";

  const recentsCountBadge = document.getElementById("recentsCountBadge");
  if (recentsCountBadge) {
    recentsCountBadge.textContent = `${recentSongs.length} reproducida${recentSongs.length !== 1 ? 's' : ''}`;
  }

  if (recentSongs.length === 0) {
    recentsList.innerHTML = "<li style='color: rgba(255,255,255,0.6); padding: 20px; text-align: center; font-family: Poppins, sans-serif;'>No has reproducido ninguna canción en esta sesión aún.</li>";
    return;
  }

  recentSongs.forEach((song) => {
    const li = document.createElement("li");
    const formattedDuration = typeof song.duration === "number"
      ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}`
      : song.duration || "N/A";

    li.innerHTML = `
      <img class="play" src="${song.thumbnail}" style="cursor: pointer;" onerror="this.onerror=null; this.src='resources/player.gif';">
      <div class="song-info">
          <b>${song.title}</b><br>
          ${song.uploader} (${formattedDuration})
      </div>
      <div class="song-actions">
          <button class="playbtn"><i class="ph ph-play"></i></button>
          <button class="queue" title="Añadir a la cola"><i class="ph ph-list-plus"></i></button>
      </div>
    `;
    recentsList.appendChild(li);

    li.querySelector(".play").addEventListener("click", () => playSong(song));
    
    const playBtn = li.querySelector(".playbtn");
    playBtn.addEventListener("click", async (e) => {
      const btn = e.currentTarget;

      if (btn.dataset.locked === "true") {
        console.log("⏳ Este botón está bloqueado...");
        new Notify({
          status: "warning",
          title: "Espera...",
          text: "La reproducción es automática, espera un momento.",
          effect: "fade",
        });
        return;
      }

      btn.dataset.locked = "true";

      try {
        await playSong(song);
      } catch (err) {
        console.error("❌ Error en playSong:", err);
      }

      setTimeout(() => {
        btn.dataset.locked = "false";
      }, 5000);
    });

    li.querySelector(".queue").addEventListener("click", () => addToQueue(song));
  });
  highlightPlayingSong();
}

// ======= Queue Drawer =======
function openQueueDrawer() {
  if (queueTab) queueTab.classList.add("is-open");
  if (queueOverlay) queueOverlay.classList.add("is-open");
  renderQueue(); // refrescar la lista al abrir
}

function closeQueueDrawer() {
  if (queueTab) queueTab.classList.remove("is-open");
  if (queueOverlay) queueOverlay.classList.remove("is-open");
}

function toggleQueueDrawer() {
  if (queueTab && queueTab.classList.contains("is-open")) {
    closeQueueDrawer();
  } else {
    openQueueDrawer();
  }
}

// Botón "Lista de reproducción" en el player aside
queueTabButton.addEventListener("click", toggleQueueDrawer);

// Botón queue en el footer compact player
const fcpQueueBtn = document.getElementById("fcp-queueBtn");
if (fcpQueueBtn) fcpQueueBtn.addEventListener("click", toggleQueueDrawer);

// Botones de acciones en cabecera de la cola
if (queueShuffleBtn) queueShuffleBtn.addEventListener("click", toggleShuffleMode);
if (clearQueueBtn) clearQueueBtn.addEventListener("click", clearQueue);

// Botón X para cerrar el drawer
const closeQueueBtn = document.getElementById("closeQueueBtn");
if (closeQueueBtn) closeQueueBtn.addEventListener("click", closeQueueDrawer);

// Clic en el overlay cierra el drawer
if (queueOverlay) queueOverlay.addEventListener("click", closeQueueDrawer);


// ======= Curated Global Fallback Tracks =======
const DEFAULT_GLOBAL_TRACKS = [
  { title: "Thriller", uploader: "Michael Jackson", duration: 357, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/32/4f/fd/324ffda2-9e51-8f6a-0c2d-c6fd2b41ac55/074643811224.jpg/600x600bb.png" },
  { title: "Monster Mash", uploader: "Bobby Boris Pickett & The Crypt-Kickers", duration: 194, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/96/4e/2e/964e2e34-975a-f9da-ea23-326fdce09941/07UMGIM07880.rgb.jpg/600x600bb.png" },
  { title: "Choosin' Texas", uploader: "Ella Langley", duration: 188, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e2/91/4d/e2914d0a-7f1d-f04c-fbf4-c50b38548838/196873638690.jpg/600x600bb.png" },
  { title: "Ghostbusters", uploader: "Ray Parker Jr.", duration: 245, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/9a/70/43/9a704362-976d-ec4b-0367-54d368cb0ef8/886445902204.jpg/600x600bb.png" },
  { title: "Lies (feat. Lana Del Rey)", uploader: "Zach Bryan & Lana Del Rey", duration: 236, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ea/98/f2/ea98f2b8-5131-29ae-2064-997234ef13bc/093624812647.jpg/600x600bb.png" },
  { title: "Patient Zero", uploader: "Taylor Swift", duration: 215, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a0/dd/fd/a0ddfd72-ee9e-f046-6466-a5dbefc696fa/26UM1IM21436.rgb.jpg/600x600bb.png" },
  { title: "POKITO", uploader: "Daddy Yankee & Diljit Dosanjh", duration: 180, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/24/2a/a4/242aa4a9-808f-419f-289c-e7e6a1517c08/4593106.jpg/600x600bb.png" },
  { title: "ADDICTED", uploader: "JISOO", duration: 198, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6e/7d/c6/6e7dc611-3961-7a16-58d6-68c567745703/054391222435.jpg/600x600bb.png" },
  { title: "Housewife", uploader: "Tate McRae", duration: 172, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ce/c8/05/cec805c6-5f81-a897-a53e-f42025b9cd5a/196874840146.jpg/600x600bb.png" },
  { title: "Die With A Smile", uploader: "Lady Gaga & Bruno Mars", duration: 251, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7c/4f/f5/7c4ff5aa-cf91-1fa1-e630-f8faee15a45b/198391799738.jpg/600x600bb.jpg" },
  { title: "Birds of a Feather", uploader: "Billie Eilish", duration: 194, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ca/23/20/ca23209c-b8a6-bd08-12f1-14db7396c806/artwork.jpg/600x600bb.png" },
  { title: "Taste", uploader: "Sabrina Carpenter", duration: 157, thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cd/92/3f/cd923fbb-21e8-3a9f-fa0f-3c2e47ad4ad1/artwork.jpg/600x600bb.png" }
];

async function getChartTracks(chartType = "mexico") {
  const isMexico = chartType.toLowerCase().includes("mex");
  const cacheKey = isMexico ? "mexlify_top_mexico_full_cache" : "mexlify_top_global_full_cache";

  // 1. Intentar caché local
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        fetchAndCacheChart(chartType, cacheKey).catch(() => {});
        return parsed;
      }
    }
  } catch (e) {}

  // 2. Fetch en vivo desde iTunes RSS
  try {
    const fetched = await fetchAndCacheChart(chartType, cacheKey);
    if (fetched && fetched.length > 0) return fetched;
  } catch (e) {
    console.warn("Error obteniendo chart en vivo:", e);
  }

  // 3. Fallback curado
  return isMexico ? [...DEFAULT_MEXICAN_TRACKS] : [...DEFAULT_GLOBAL_TRACKS];
}

async function fetchAndCacheChart(chartType, cacheKey) {
  const isMexico = chartType.toLowerCase().includes("mex");
  const url = isMexico
    ? "https://itunes.apple.com/mx/rss/topsongs/limit=50/json"
    : "https://itunes.apple.com/us/rss/topsongs/limit=50/json";

  const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  const entries = data.feed?.entry || [];
  if (entries.length === 0) return null;

  const tracks = entries.map((e) => ({
    title: e["im:name"]?.label || "Título desconocido",
    uploader: e["im:artist"]?.label || "Artista desconocido",
    duration: 0,
    thumbnail: e["im:image"]?.[2]?.label
      ? e["im:image"][2].label.replace(/\/\d+x\d+bb/, "/600x600bb")
      : "resources/player.gif",
    url: null,
    filename: null
  }));

  try {
    localStorage.setItem(cacheKey, JSON.stringify(tracks));
  } catch (e) {}
  return tracks;
}

async function showTopChartList(chartType = "mexico") {
  const isMexico = chartType.toLowerCase().includes("mex");
  navigateTo("countryTop");

  const container = document.getElementById("country-top-container");
  if (!container) return;

  const title = isMexico ? "Más escuchadas de México" : "Playlist del Día - Mix Global";
  const tag = isMexico ? "Top Nacional" : "Mix Global";
  const desc = isMexico ? "El Top 50 más popular de México" : "Las 50 canciones en tendencia mundial";
  const coverImg = isMexico ? "assets/top_mexico.jpg" : "assets/top_global.jpg";

  container.innerHTML = `
    <div class="playlist-detail-topbar" style="margin-bottom: 16px;">
      <button class="backtop-premium" id="btnBackFromTop" title="Volver a Inicio">
        <i class="ph ph-arrow-left"></i>
        <span>Volver a Inicio</span>
      </button>
    </div>
    <div class="top-chart-hero">
      <img src="${coverImg}" class="top-chart-hero-cover" onerror="this.onerror=null; this.src='resources/player.gif';">
      <div class="top-chart-hero-info">
        <span class="vaen-card-tag">${tag}</span>
        <h2 style="margin: 0; color: #fff; font-size: 1.5rem; font-weight: 800; font-family: Poppins, sans-serif;">${title}</h2>
        <p style="margin: 0; color: rgba(255, 255, 255, 0.65); font-size: 0.9rem;">${desc}</p>
        <div class="top-chart-hero-actions">
          <button id="btnPlayAllChart" class="changeBg" style="padding: 8px 18px; font-weight: 700; margin: 0;">
            <i class="ph ph-play"></i> Reproducir todo
          </button>
          <button id="btnShuffleChart" class="changeBg" style="padding: 8px 18px; font-weight: 700; margin: 0;">
            <i class="ph ph-shuffle"></i> Mezclar
          </button>
        </div>
      </div>
    </div>
    <div class="search-loading-state" style="padding: 30px; text-align: center; color: rgba(255, 255, 255, 0.7); display: flex; flex-direction: column; align-items: center; gap: 10px;">
      <i class="ph ph-spinner ph-spin" style="font-size: 2rem; color: #ff0090;"></i>
      <span>Cargando canciones...</span>
    </div>
    <ul id="topChartSongsList" class="top-chart-songs-list" style="list-style: none; padding: 0; margin: 0;"></ul>
  `;

  container.scrollIntoView({ behavior: "smooth" });

  document.getElementById("btnBackFromTop")?.addEventListener("click", () => {
    navigateTo("home");
    if (typeof scrollToTop === "function") scrollToTop(true);
  });

  const songs = await getChartTracks(chartType);
  const loadingEl = container.querySelector(".search-loading-state");
  if (loadingEl) loadingEl.remove();

  const ul = container.querySelector("#topChartSongsList");
  if (!ul) return;

  songs.forEach((song, idx) => {
    const li = createSongListItem(song, { rank: idx + 1 });
    const playHandler = async () => {
      queue = songs.map((s) => ({ ...s }));
      currentIndex = idx;
      saveQueueToStorage();
      renderQueue();
      await playSong(queue[currentIndex], !!queue[currentIndex].filename, currentIndex);
      highlightPlayingSong();
    };

    const origPlayBtn = li.querySelector(".playbtn");
    const origImg = li.querySelector(".play");
    if (origPlayBtn) {
      origPlayBtn.replaceWith(origPlayBtn.cloneNode(true));
      li.querySelector(".playbtn").addEventListener("click", playHandler);
    }
    if (origImg) {
      origImg.replaceWith(origImg.cloneNode(true));
      li.querySelector(".play").addEventListener("click", playHandler);
    }
    const titleLink = li.querySelector(".song-info b");
    if (titleLink) {
      titleLink.style.cursor = "pointer";
      titleLink.addEventListener("click", playHandler);
    }
    ul.appendChild(li);
  });

  container.querySelector("#btnPlayAllChart")?.addEventListener("click", async () => {
    queue = songs.map((s) => ({ ...s }));
    currentIndex = 0;
    renderQueue();
    new Notify({
      status: "info",
      title: title,
      text: `Reproduciendo ${queue.length} canciones.`,
      effect: "fade",
      autotimeout: 3000
    });
    await playSong(queue[0]);
  });

  container.querySelector("#btnShuffleChart")?.addEventListener("click", async () => {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    queue = shuffled.map((s) => ({ ...s }));
    currentIndex = 0;
    renderQueue();
    new Notify({
      status: "info",
      title: `${title} (Aleatorio)`,
      text: `Reproduciendo ${queue.length} canciones mezcladas.`,
      effect: "fade",
      autotimeout: 3000
    });
    await playSong(queue[0]);
  });

  highlightPlayingSong();
}

async function playTopChart(chartType = "mexico", autoPlay = true) {
  const isMexico = chartType.toLowerCase().includes("mex");
  const title = isMexico ? "Más escuchadas de México" : "Playlist del Día - Mix Global";

  new Notify({
    status: "info",
    title: title,
    text: "Cargando canciones para reproducir...",
    effect: "fade",
    autotimeout: 2500
  });

  const songs = await getChartTracks(chartType);
  if (!songs || songs.length === 0) return;

  queue = songs.map((s) => ({ ...s }));
  currentIndex = 0;
  saveQueueToStorage();
  renderQueue();

  if (autoPlay) {
    await playSong(queue[0], !!queue[0].filename, 0);
    highlightPlayingSong();
  }
}

window.showTopChartList = showTopChartList;
window.playTopChart = playTopChart;

// ======= renderCountryTop =======
function renderCountryTop(countryCode = "mexico") {
  showTopChartList(countryCode);
}

if (countryMixbtnA) {
  countryMixbtnA.addEventListener("click", (e) => {
    e.stopPropagation();
    playTopChart("global", true);
  });
}
if (countryMixbtnB) {
  countryMixbtnB.addEventListener("click", (e) => {
    e.stopPropagation();
    playTopChart("mexico", true);
  });
}

const backtopBtnEl = document.getElementById("backtop");
if (backtopBtnEl) {
  backtopBtnEl.addEventListener("click", () => {
    navigateTo("countryTop");
    countryTopContainer.scrollIntoView({ behavior: "smooth" });
  });
}



// Listener para actualizaciones de yt-dlp
function showUpdateStatus(message, sub_message) {
  new Notify({
    status: "info",
    title: message,
    text: sub_message,
    effect: "fade",
    speed: 300,
    customClass: "",
    customIcon: "",
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 3000,
    notificationsGap: null,
    notificationsPadding: null,
    type: "outline",
    position: "right top",
    customWrapper: "",
  });
}
window.electronAPI.onYtdlpUpdate((status) => {
  console.log("Estado de actualización de yt-dlp:", status);

  // Usamos la función showModal que ya existe en tu proyecto
  // para notificar al usuario de una forma más elegante que un alert.
  if (status.message.includes("is up to date")) {
    // No mostramos nada si ya está actualizado para no molestar.
    console.log("yt-dlp ya está actualizado.");
    showUpdateStatus(
      "El motor está actualizado",
      "La APP funciona correctamente."
    );
    if (window.systemTray) {
      window.systemTray.addMessage("Motor de descargas", "El motor yt-dlp está actualizado.", "success");
    }
    // guardar estado en localStorage
    localStorage.setItem("engineStatus", "Actualizada");
  } else if (status.message.includes("yt-dlp version:")) {
    const version = status.message.replace("yt-dlp version:", "Version:");
    showUpdateStatus(
      "Motor detectado",
      version
    );
    if (window.systemTray) {
      window.systemTray.addMessage("Motor de descargas", `Motor detectado: ${version}`, "info");
    }
    localStorage.setItem("engineStatus", status.message);
  } else if (status.message.includes("Updating to")) {
    showModal(
      "Actualización",
      "Se está actualizando el motor de descargas (yt-dlp)...",
      "info"
    );
    if (window.systemTray) {
      window.systemTray.addMessage("Motor de descargas", `Iniciando actualización a la versión más reciente...`, "info");
    }
  } else if (status.type === "error") {
    showModal(
      "Error de Actualización",
      `No se pudo actualizar yt-dlp: <br><pre>${status.message}</pre>`,
      "error"
    );
    if (window.systemTray) {
      window.systemTray.addMessage("Motor de descargas", `Error al actualizar: ${status.message}`, "error");
    }
  }
});
// ======= Inicializar =======
loadDownloaded();
loadDefaultMexicanMusic();
debugLog("Aplicación iniciada");
// Opcional: FPS real del renderer
/*
let frames = 0;
let lastTime = performance.now();
function measureFPS() {
  frames++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    console.log("[Renderer] FPS real:", frames);
    frames = 0;
    lastTime = now;
  }
  requestAnimationFrame(measureFPS);
}
measureFPS();
*/
const audio = document.getElementById("player");
audio.preload = "auto"; // carga inmediata
audio.autoplay = true; // sin clic
audio.crossOrigin = "anonymous"; // evita bloqueos
audio.disableRemotePlayback = true;
audio.setAttribute("playsinline", "true");

// ============================================================
//  PLAYLISTS ENGINE
// ============================================================

// ---- Persistence ----
function loadPlaylistsFromStorage() {
  try {
    const raw = localStorage.getItem("mexlify_playlists");
    playlists = raw ? JSON.parse(raw) : [];
  } catch (e) {
    playlists = [];
  }
}

function savePlaylistsToStorage() {
  localStorage.setItem("mexlify_playlists", JSON.stringify(playlists));
}

// ---- Exportify CSV Parser (Fase 1 - Ultra Robusto) ----
function detectCsvDelimiter(text) {
  const firstLine = text.split(/\r\n|\n|\r/)[0] || "";
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semicolonCount > commaCount && semicolonCount > tabCount) return ";";
  if (tabCount > commaCount && tabCount > semicolonCount) return "\t";
  return ",";
}

function parseCSV(text) {
  if (!text) return [];
  // Eliminar BOM de UTF-8 si existe
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const delimiter = detectCsvDelimiter(text);
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentField = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // escapar comilla doble ""
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      row.push(currentField);
      currentField = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      row.push(currentField);
      currentField = "";
      if (row.some((field) => field.trim() !== "")) {
        lines.push(row);
      }
      row = [];
    } else {
      currentField += char;
    }
  }
  if (currentField || row.length > 0) {
    row.push(currentField);
    if (row.some((field) => field.trim() !== "")) {
      lines.push(row);
    }
  }
  return lines;
}

function cleanHeaderStr(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/["']/g, "")
    .trim();
}

function parseExportifyCsv(csvText) {
  const rows = parseCSV(csvText);
  if (!rows || rows.length < 2) {
    throw new Error("El archivo CSV está vacío o no contiene filas de datos.");
  }

  const rawHeaders = rows[0].map(cleanHeaderStr);

  let titleIdx = rawHeaders.findIndex(
    (h) =>
      !h.includes("uri") &&
      !h.includes("artista") &&
      !h.includes("album") &&
      !h.includes("image") &&
      !h.includes("imagen") &&
      !h.includes("duracion") &&
      !h.includes("duration") &&
      !h.includes("number") &&
      !h.includes("numero") &&
      !h.includes("preview") &&
      (h.includes("nombre") ||
        h.includes("track") ||
        h.includes("cancion") ||
        h.includes("canci") ||
        h.includes("title") ||
        h === "song" ||
        h === "tema")
  );

  let artistIdx = rawHeaders.findIndex(
    (h) =>
      !h.includes("uri") &&
      !h.includes("album") &&
      (h.includes("artist") || h.includes("artista"))
  );

  let albumIdx = rawHeaders.findIndex(
    (h) =>
      !h.includes("uri") &&
      !h.includes("artist") &&
      !h.includes("artista") &&
      !h.includes("image") &&
      !h.includes("imagen") &&
      !h.includes("fecha") &&
      !h.includes("release") &&
      h.includes("album")
  );

  let imageIdx = rawHeaders.findIndex(
    (h) =>
      h.includes("image") ||
      h.includes("imagen") ||
      h.includes("cover") ||
      h.includes("portada") ||
      h.includes("artwork")
  );

  let durationIdx = rawHeaders.findIndex(
    (h) =>
      h.includes("duracion") ||
      h.includes("duration") ||
      h.includes("time") ||
      h.includes("tiempo") ||
      h.includes("ms")
  );

  let uriIdx = rawHeaders.findIndex(
    (h) =>
      h.includes("uri") &&
      (h.includes("cancion") ||
        h.includes("canci") ||
        h.includes("track") ||
        h === "uri")
  );

  let isrcIdx = rawHeaders.findIndex((h) => h.includes("isrc"));

  // Fallbacks de seguridad si el CSV no tiene cabeceras legibles o fue alterado
  if (titleIdx === -1) {
    titleIdx = rawHeaders.length >= 2 ? 1 : 0;
  }
  if (artistIdx === -1 && rawHeaders.length >= 4) artistIdx = 3;
  if (albumIdx === -1 && rawHeaders.length >= 6) albumIdx = 5;
  if (imageIdx === -1 && rawHeaders.length >= 10) imageIdx = 9;
  if (durationIdx === -1 && rawHeaders.length >= 13) durationIdx = 12;

  const songs = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const title = (row[titleIdx] || "").trim();
    if (!title) continue;

    const artist =
      artistIdx !== -1 && row[artistIdx]
        ? row[artistIdx].trim()
        : "Desconocido";
    const album =
      albumIdx !== -1 && row[albumIdx] ? row[albumIdx].trim() : "";
    const thumbnail =
      imageIdx !== -1 && row[imageIdx] ? row[imageIdx].trim() : "";

    let durationSec = 0;
    if (durationIdx !== -1 && row[durationIdx]) {
      const durNum = parseInt(row[durationIdx], 10);
      if (!isNaN(durNum) && durNum > 0) {
        durationSec = durNum > 10000 ? Math.round(durNum / 1000) : durNum;
      }
    }

    const spotifyUri =
      uriIdx !== -1 && row[uriIdx] ? row[uriIdx].trim() : "";
    const isrc = isrcIdx !== -1 && row[isrcIdx] ? row[isrcIdx].trim() : "";

    songs.push({
      title,
      uploader: artist,
      album,
      duration: durationSec,
      thumbnail: thumbnail || "resources/player.gif",
      url: null,
      filename: null,
      spotifyUri,
      isrc,
    });
  }

  return songs;
}

// ---- Cover & Duration Helpers (Fase 3) ----
function getPlaylistCoverHTML(pl) {
  const thumbs = [];
  if (pl.songs && pl.songs.length > 0) {
    for (const s of pl.songs) {
      if (
        s.thumbnail &&
        !thumbs.includes(s.thumbnail) &&
        !s.thumbnail.includes("player.gif")
      ) {
        thumbs.push(s.thumbnail);
      }
      if (thumbs.length === 4) break;
    }
  }

  if (thumbs.length >= 4) {
    return `
      <div class="playlist-card-cover">
        <div class="spotify-cover-collage">
          <img src="${thumbs[0]}" onerror="this.onerror=null; this.src='resources/player.gif';">
          <img src="${thumbs[1]}" onerror="this.onerror=null; this.src='resources/player.gif';">
          <img src="${thumbs[2]}" onerror="this.onerror=null; this.src='resources/player.gif';">
          <img src="${thumbs[3]}" onerror="this.onerror=null; this.src='resources/player.gif';">
        </div>
      </div>
    `;
  } else if (thumbs.length > 0) {
    return `
      <div class="playlist-card-cover">
        <img src="${thumbs[0]}" class="single-cover-img" onerror="this.onerror=null; this.src='resources/player.gif';">
      </div>
    `;
  } else {
    return `<div class="playlist-card-icon"><i class="ph ph-playlist"></i></div>`;
  }
}

function getPlaylistTotalDuration(pl) {
  if (!pl.songs || pl.songs.length === 0) return "0 min";
  const totalSeconds = pl.songs.reduce((acc, s) => {
    return acc + (typeof s.duration === "number" ? s.duration : 0);
  }, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} min`;
}

// ---- CRUD helpers ----
function createPlaylist(name) {
  if (!name || !name.trim()) return null;
  const pl = { id: Date.now().toString(), name: name.trim(), songs: [] };
  playlists.push(pl);
  savePlaylistsToStorage();
  return pl;
}

function deletePlaylist(id) {
  playlists = playlists.filter((p) => p.id !== id);
  savePlaylistsToStorage();
}

function addSongToPlaylist(playlistId, song) {
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl) return false;
  const already = pl.songs.some(
    (s) =>
      (s.url && s.url === song.url) ||
      (s.filename && s.filename === song.filename) ||
      (s.title === song.title && s.uploader === song.uploader)
  );
  if (already) return false;
  pl.songs.push(song);
  savePlaylistsToStorage();
  return true;
}

// ---- Acciones de Playlist seguras con SweetAlert2 ----
async function handleRenamePlaylist(playlistId) {
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl) return;

  const { value: newName } = await Swal.fire({
    title: "Renombrar playlist",
    input: "text",
    inputValue: pl.name,
    inputPlaceholder: "Nombre de la playlist",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Guardar",
    confirmButtonColor: "#ff0090",
    background: "#161622",
    color: "#fff",
    inputValidator: (val) => {
      if (!val || !val.trim()) {
        return "El nombre no puede estar vacío";
      }
    },
  });

  if (newName && newName.trim() && newName.trim() !== pl.name) {
    pl.name = newName.trim();
    savePlaylistsToStorage();
    if (currentPlaylistTitle) currentPlaylistTitle.textContent = pl.name;
    renderPlaylists();
    if (typeof Notify !== "undefined") {
      new Notify({
        status: "success",
        title: "Playlist renombrada",
        text: `Ahora se llama "${pl.name}".`,
        effect: "fade",
      });
    }
  }
}

async function handleDeletePlaylist(playlistId) {
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl) return;

  const result = await Swal.fire({
    title: `¿Eliminar "${pl.name}"?`,
    text: "Esta acción eliminará la playlist. Las canciones guardadas en tu disco no se borrarán.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e63946",
    cancelButtonColor: "#333",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    background: "#161622",
    color: "#fff",
  });

  if (result.isConfirmed) {
    deletePlaylist(playlistId);
    activePlaylistDetail = null;
    if (playlistDetailView) playlistDetailView.classList.add("is-hidden");
    const createRow = document.querySelector(".playlist-create-row");
    if (createRow) createRow.classList.remove("is-hidden");
    if (playlistsGrid) playlistsGrid.classList.remove("is-hidden");
    renderPlaylists();

    if (typeof Notify !== "undefined") {
      new Notify({
        status: "info",
        title: "Playlist eliminada",
        text: `Se eliminó "${pl.name}".`,
        effect: "fade",
      });
    }
  }
}

async function openMoveSongModal(song, songIndex, sourcePl) {
  const otherPlaylists = playlists.filter((p) => p.id !== sourcePl.id);
  if (otherPlaylists.length === 0) {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "No hay otras playlists",
        text: "Crea otra playlist primero para poder mover canciones.",
        icon: "info",
        background: "#161622",
        color: "#fff",
        confirmButtonColor: "#ff0090",
      });
    }
    return;
  }

  const inputOptions = {};
  otherPlaylists.forEach((p) => {
    inputOptions[p.id] = p.name;
  });

  const { value: targetPlaylistId } = await Swal.fire({
    title: `Mover "${song.title}"`,
    text: "Selecciona la playlist de destino:",
    input: "select",
    inputOptions: inputOptions,
    inputPlaceholder: "Selecciona una playlist...",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Mover canción",
    confirmButtonColor: "#ff0090",
    background: "#161622",
    color: "#fff",
  });

  if (targetPlaylistId) {
    const targetPl = playlists.find((p) => p.id === targetPlaylistId);
    if (!targetPl) return;

    sourcePl.songs.splice(songIndex, 1);
    targetPl.songs.push(song);
    savePlaylistsToStorage();

    renderPlaylistSongs(sourcePl, playlistFilterInput ? playlistFilterInput.value : "");
    if (playlistHeroCover) playlistHeroCover.innerHTML = getPlaylistCoverHTML(sourcePl);
    if (playlistMetaCount) playlistMetaCount.textContent = `${sourcePl.songs.length} canciones`;
    if (playlistMetaDuration) playlistMetaDuration.textContent = getPlaylistTotalDuration(sourcePl);

    if (typeof Notify !== "undefined") {
      new Notify({
        status: "success",
        title: "Canción movida",
        text: `"${song.title}" se movió a "${targetPl.name}".`,
        effect: "fade",
      });
    }
  }
}

// ---- Grid renderer ----
function renderPlaylists() {
  if (playlistsCountBadge) {
    playlistsCountBadge.textContent = `${playlists.length} creada${playlists.length !== 1 ? "s" : ""}`;
  }

  if (!playlistsGrid) return;
  playlistsGrid.innerHTML = "";

  if (playlists.length === 0) {
    playlistsGrid.innerHTML = `
      <div class="messages-empty-state" style="grid-column: 1/-1;">
        <i class="ph ph-playlist" style="font-size:2.5rem; color:rgba(255,0,144,0.4);"></i>
        <p>No tienes playlists todavía. ¡Crea una o importa un CSV de Exportify!</p>
      </div>`;
    return;
  }

  playlists.forEach((pl) => {
    const card = document.createElement("div");
    card.className = "playlist-card";
    const coverHtml = getPlaylistCoverHTML(pl);
    const durationText = getPlaylistTotalDuration(pl);

    card.innerHTML = `
      <button class="playlist-card-delete-btn" title="Eliminar playlist"><i class="ph ph-trash"></i></button>
      ${coverHtml}
      <p class="playlist-card-name" title="${pl.name}">${pl.name}</p>
      <span class="playlist-card-count">${pl.songs.length} canción${pl.songs.length !== 1 ? "es" : ""} • ${durationText}</span>
    `;
    card
      .querySelector(".playlist-card-delete-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        handleDeletePlaylist(pl.id);
      });
    card.addEventListener("click", () => openPlaylistDetail(pl.id));
    playlistsGrid.appendChild(card);
  });
}

// Variable para la playlist actualmente visualizada
let activePlaylistDetail = null;

// ---- Detail view ----
function openPlaylistDetail(playlistId) {
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl || !playlistDetailView) return;
  activePlaylistDetail = pl;

  // Switch visibility
  if (playlistsGrid) playlistsGrid.classList.add("is-hidden");
  const createRow = document.querySelector(".playlist-create-row");
  if (createRow) createRow.classList.add("is-hidden");
  if (playlistDropZone) playlistDropZone.classList.add("is-hidden");
  playlistDetailView.classList.remove("is-hidden");

  if (currentPlaylistTitle) currentPlaylistTitle.textContent = pl.name;

  if (playlistHeroCover) {
    playlistHeroCover.innerHTML = getPlaylistCoverHTML(pl);
  }

  if (playlistMetaCount) {
    playlistMetaCount.textContent = `${pl.songs.length} canción${pl.songs.length !== 1 ? "es" : ""}`;
  }

  if (playlistMetaDuration) {
    playlistMetaDuration.textContent = getPlaylistTotalDuration(pl);
  }

  if (playlistFilterInput) {
    playlistFilterInput.value = "";
  }

  if (syncPlaylistBtn) {
    if (isSyncingPlaylist && syncingPlaylistId === pl.id) {
      syncPlaylistBtn.disabled = true;
      syncPlaylistBtn.innerHTML = syncProgressText || `<i class="ph ph-spinner ph-spin"></i> Vinculando...`;
    } else {
      const pendingCount = pl.songs.filter((s) => !s.url && !s.filename).length;
      if (pendingCount === 0) {
        syncPlaylistBtn.innerHTML = '<i class="ph ph-check-circle"></i> Vinculadas';
        syncPlaylistBtn.style.opacity = "0.6";
        syncPlaylistBtn.disabled = true;
      } else {
        const linkedCount = pl.songs.length - pendingCount;
        syncPlaylistBtn.innerHTML = `<i class="ph ph-arrows-clockwise"></i> Vincular (${linkedCount}/${pl.songs.length})`;
        syncPlaylistBtn.style.opacity = "1";
        syncPlaylistBtn.disabled = isSyncingPlaylist;
      }
    }
  }

  if (downloadAllPlaylistBtn) {
    if (isDownloadingAllPlaylist && downloadingPlaylistId === pl.id) {
      downloadAllPlaylistBtn.disabled = true;
      downloadAllPlaylistBtn.innerHTML = downloadAllProgressBtnHTML || `<i class="ph ph-spinner ph-spin"></i> Descargando...`;
    } else {
      downloadAllPlaylistBtn.disabled = isDownloadingAllPlaylist;
      downloadAllPlaylistBtn.innerHTML = `<i class="ph ph-download-simple"></i> Descargar Todo`;
    }
  }

  // Store current playlist id on the play button
  if (playPlaylistBtn) playPlaylistBtn.dataset.playlistId = playlistId;

  renderPlaylistSongs(pl);

  // Asegurar siempre posición inicial al tope sin saltos a la segunda canción
  if (playlistSongsList) playlistSongsList.scrollTop = 0;
  if (playlistDetailView) playlistDetailView.scrollTop = 0;
  const plContainer = document.getElementById("playlistsContainer");
  if (plContainer) plContainer.scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function playPlaylistSong(playlist, clickedIndex) {
  // Configurar la cola con todas las canciones de la playlist y olvidar la seccion previa
  queue = playlist.songs.map((s) => ({
    title: s.title,
    uploader: s.uploader,
    duration: s.duration,
    thumbnail: s.thumbnail,
    filename: s.filename || null,
    url: s.url || null,
  }));

  currentIndex = clickedIndex;
  saveQueueToStorage();
  renderQueue();

  const song = queue[clickedIndex];
  if (song) {
    playSong(song, !!song.filename, clickedIndex);
  }
  highlightPlayingSong();
}

function renderPlaylistSongs(pl, filterQuery = "") {
  if (!playlistSongsList) return;
  playlistSongsList.innerHTML = "";
  playlistSongsList.scrollTop = 0;

  const query = filterQuery ? filterQuery.toLowerCase() : "";
  const filteredSongs = query
    ? pl.songs.filter(
        (s) =>
          (s.title && s.title.toLowerCase().includes(query)) ||
          (s.uploader && s.uploader.toLowerCase().includes(query)) ||
          (s.album && s.album.toLowerCase().includes(query))
      )
    : pl.songs;

  if (filteredSongs.length === 0) {
    playlistSongsList.innerHTML = `
      <div class="messages-empty-state">
        <i class="ph ph-music-notes" style="font-size:2rem; color:rgba(255,0,144,0.4);"></i>
        <p>${query ? "No se encontraron canciones coincidentes con el filtro." : "Esta playlist está vacía. Añade canciones o importa un .csv de Exportify."}</p>
      </div>`;
    return;
  }

  filteredSongs.forEach((song) => {
    // Buscar índice real en la playlist original
    const origIndex = pl.songs.indexOf(song);
    const li = document.createElement("li");
    const isLocal = !!song.filename;
    const thumb = song.thumbnail || "resources/player.gif";
    const dur = song.duration
      ? typeof song.duration === "number"
        ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, "0")}`
        : song.duration + "s"
      : "";

    li.setAttribute("draggable", "true");
    li.dataset.origIndex = origIndex;

    li.innerHTML = `
      <span class="song-drag-handle" title="Arrastrar para reordenar"><i class="ph ph-dots-six-vertical"></i></span>
      <img class="play" src="${thumb}" alt="${song.title}" style="cursor:pointer;" onerror="this.onerror=null; this.src='resources/player.gif';">
      <div class="song-info">
        <b>${song.title}</b>
        <span>${song.uploader || ""} ${dur ? "(" + dur + ")" : ""}</span>
      </div>
      <div class="song-actions">
        <button class="playbtn"><i class="ph ph-play"></i></button>
        <button class="queue" title="Añadir a la cola"><i class="ph ph-list-plus"></i></button>
        <button class="move-from-pl" title="Mover a otra playlist"><i class="ph ph-folder-notch-minus"></i></button>
        ${
          !isLocal && song.url
            ? `<button class="relink-pl" title="Cambiar versión vinculada (buscar pista de estudio)"><i class="ph ph-arrows-clockwise"></i></button>`
            : ""
        }
        ${
          !isLocal
            ? `<button class="download-pl" title="Descargar fuera de línea"><i class="ph ph-download-simple"></i></button>`
            : `<span title="Disponible offline" style="color:#00d170; font-size:1.1rem; display:flex; align-items:center;"><i class="ph ph-check-circle"></i></span>`
        }
        <button class="remove-from-pl" title="Quitar de playlist"><i class="ph ph-x"></i></button>
      </div>
    `;
    playlistSongsList.appendChild(li);

    const songObj = isLocal
      ? {
          title: song.title,
          uploader: song.uploader,
          duration: song.duration,
          thumbnail: song.thumbnail,
          filename: song.filename,
        }
      : song;

    li.querySelector(".play").addEventListener("click", () =>
      playPlaylistSong(pl, origIndex)
    );
    li.querySelector(".playbtn").addEventListener("click", () =>
      playPlaylistSong(pl, origIndex)
    );
    const plTitleEl = li.querySelector(".song-info b");
    if (plTitleEl) {
      plTitleEl.style.cursor = "pointer";
      plTitleEl.addEventListener("click", () => playPlaylistSong(pl, origIndex));
    }
    li.querySelector(".queue").addEventListener("click", () =>
      addToQueue(songObj, isLocal)
    );

    const moveBtn = li.querySelector(".move-from-pl");
    if (moveBtn) {
      moveBtn.addEventListener("click", () => openMoveSongModal(song, origIndex, pl));
    }

    const removeBtn = li.querySelector(".remove-from-pl");
    removeBtn.addEventListener("click", () => {
      pl.songs.splice(origIndex, 1);
      savePlaylistsToStorage();
      renderPlaylistSongs(pl, playlistFilterInput ? playlistFilterInput.value : "");
      if (playlistHeroCover) playlistHeroCover.innerHTML = getPlaylistCoverHTML(pl);
      if (playlistMetaCount) playlistMetaCount.textContent = `${pl.songs.length} canciones`;
      if (playlistMetaDuration) playlistMetaDuration.textContent = getPlaylistTotalDuration(pl);
    });

    // Drag & Drop reorder within Playlist
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", origIndex.toString());
      e.dataTransfer.effectAllowed = "move";
      li.classList.add("is-dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("is-dragging");
      playlistSongsList.querySelectorAll("li").forEach((el) => {
        el.classList.remove("drag-over-top", "drag-over-bottom");
      });
    });

    li.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const rect = li.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      if (relY < rect.height / 2) {
        li.classList.add("drag-over-top");
        li.classList.remove("drag-over-bottom");
      } else {
        li.classList.add("drag-over-bottom");
        li.classList.remove("drag-over-top");
      }
    });

    li.addEventListener("dragleave", () => {
      li.classList.remove("drag-over-top", "drag-over-bottom");
    });

    li.addEventListener("drop", (e) => {
      e.preventDefault();
      li.classList.remove("drag-over-top", "drag-over-bottom");
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      if (isNaN(fromIndex) || fromIndex === origIndex) return;

      const rect = li.getBoundingClientRect();
      const relY = e.clientY - rect.top;
      let targetIndex = origIndex;
      if (relY >= rect.height / 2 && fromIndex < origIndex) {
        // dropped on bottom half
      } else if (relY >= rect.height / 2 && fromIndex > origIndex) {
        targetIndex = origIndex + 1;
      } else if (relY < rect.height / 2 && fromIndex < origIndex) {
        targetIndex = origIndex - 1;
      }

      const [movedSong] = pl.songs.splice(fromIndex, 1);
      const safeTarget = Math.max(0, Math.min(pl.songs.length, targetIndex));
      pl.songs.splice(safeTarget, 0, movedSong);

      savePlaylistsToStorage();
      renderPlaylistSongs(pl, playlistFilterInput ? playlistFilterInput.value : "");
      if (playlistHeroCover) playlistHeroCover.innerHTML = getPlaylistCoverHTML(pl);
    });

    const relinkBtn = li.querySelector(".relink-pl");
    if (relinkBtn) {
      relinkBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        relinkBtn.disabled = true;
        relinkBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i>';
        const newUrl = await resolveSongOnlineUrl(song, true);
        if (newUrl) {
          savePlaylistsToStorage();
          new Notify({
            status: "success",
            title: "Versión actualizada",
            text: `"${song.title}" se vinculó con la versión de estudio limpia.`,
            effect: "fade",
          });
          renderPlaylistSongs(pl, playlistFilterInput ? playlistFilterInput.value : "");
        } else {
          relinkBtn.disabled = false;
          relinkBtn.innerHTML = '<i class="ph ph-arrows-clockwise"></i>';
          new Notify({
            status: "warning",
            title: "Sin cambios",
            text: `No se encontró otra versión para "${song.title}".`,
            effect: "fade",
          });
        }
      });
    }

    if (!isLocal) {
      li.querySelector(".download-pl").addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        btn.style.opacity = "0.5";
        try {
          // Si no tiene url, resolver bajo demanda
          if (!song.url) {
            const query = `${song.title} ${song.uploader || ""}`.trim();
            const searchResults = await window.electronAPI.searchSong(query);
            if (searchResults && searchResults.length > 0) {
              song.url = searchResults[0].url || searchResults[0].sourceUrl || `https://www.youtube.com/watch?v=${searchResults[0].videoId}`;
              song.videoId = searchResults[0].videoId;
              syncResolvedSongToPlaylists(song);
            }
          }

          const res = await window.electronAPI.downloadSong({
            title: song.title,
            uploader: song.uploader,
            duration: song.duration,
            thumbnail: song.thumbnail,
            url: song.url || song.webpage_url,
          });
          if (res.success) {
            song.filename = res.filename || song.title;
            savePlaylistsToStorage();
            new Notify({
              status: "success",
              title: "Descarga completada",
              text: `"${song.title}"`,
              effect: "fade",
            });
            await loadDownloaded();
            renderPlaylistSongs(pl, playlistFilterInput ? playlistFilterInput.value : "");
          } else {
            btn.disabled = false;
            btn.style.opacity = "1";
            new Notify({
              status: "error",
              title: "Error",
              text: res.error || "No se pudo descargar",
              effect: "fade",
            });
          }
        } catch (err) {
          btn.disabled = false;
          btn.style.opacity = "1";
          console.error("Download from playlist error:", err);
        }
      });
    }
  });
  highlightPlayingSong(false);
}

// ---- Play entire playlist ----
function playPlaylist(playlistId) {
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl || pl.songs.length === 0) return;

  queue = pl.songs.map((s) => ({
    title: s.title,
    uploader: s.uploader,
    duration: s.duration,
    thumbnail: s.thumbnail,
    filename: s.filename || null,
    url: s.url || null,
  }));

  renderQueue();

  // Reproducir la primera canción de la cola
  playSong(queue[0], !!queue[0].filename, 0);
}

// ---- Ranking Inteligente de Candidatos de YouTube ----
function pickBestCandidate(candidates, song) {
  if (!candidates || candidates.length === 0) return null;
  if (candidates.length === 1 && !song.duration) return candidates[0];

  const targetTitle = (song.title || "").toLowerCase();
  const targetArtist = (song.uploader || "").toLowerCase();
  const targetDuration = typeof song.duration === "number" ? song.duration : parseInt(song.duration);

  const scored = candidates.map((cand) => {
    let score = 100;
    const cTitle = (cand.title || "").toLowerCase();
    const cChannel = (cand.uploader || cand.artist || "").toLowerCase();
    const cDur = cand.duration || 0;

    // 1. Duración exacta de la canción (Coincidencia con Spotify/Metadata)
    if (targetDuration > 0 && cDur > 0) {
      const diff = Math.abs(cDur - targetDuration);
      if (diff <= 3) score += 65; // Coincidencia milimétrica
      else if (diff <= 8) score += 45;
      else if (diff <= 16) score += 20;
      else if (diff > 35) score -= 55; // Desviación grande: videoclip con intro hablada o versión extendida
    }

    // 2. Canales oficiales "Topic" (YouTube Music / Pistas de estudio)
    if (cChannel.includes("topic")) score += 45;
    if (targetArtist && cChannel.includes(targetArtist)) score += 20;

    // 3. Audio oficial o Lyrics
    if (cTitle.includes("audio")) score += 25;
    if (cTitle.includes("letra") || cTitle.includes("lyrics")) score += 15;

    // 4. Exclusión estricta de remixes, directos, covers no solicitados
    if (!targetTitle.includes("remix") && cTitle.includes("remix")) score -= 75;
    if (!targetTitle.includes("live") && !targetTitle.includes("en vivo") && (cTitle.includes("live") || cTitle.includes("en vivo") || cTitle.includes("concierto") || cTitle.includes("festival"))) score -= 65;
    if (cTitle.includes("cover") || cTitle.includes("tributo") || cTitle.includes("parodia")) score -= 65;
    if (cTitle.includes("slowed") || cTitle.includes("reverb") || cTitle.includes("sped up") || cTitle.includes("speed up") || cTitle.includes("nightcore")) score -= 75;
    if (cTitle.includes("mashup") || cTitle.includes("session")) score -= 40;

    // 5. Videoclip oficial con duración que no cuadra (típica intro o escena hablada al inicio)
    if ((cTitle.includes("official video") || cTitle.includes("video oficial") || cTitle.includes("music video")) && targetDuration > 0 && Math.abs(cDur - targetDuration) > 15) {
      score -= 40;
    }

    return { cand, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].cand;
}

// ---- Resolutor Robusto de Audio Online para Canciones ----
async function resolveSongOnlineUrl(song, force = false, excludeVideoId = null) {
  if (!force && (song.url || song.filename)) return song.url || null;

  try {
    let query = `${song.title} ${song.uploader || ""}`.trim();
    // Intento 1: Buscar directamente título + artista
    let results = await window.electronAPI.searchSong(query);

    // Intento 2: Probar con palabra clave "audio" para forzar pista de estudio
    if (!results || results.length === 0) {
      results = await window.electronAPI.searchSong(`${query} audio`);
    }

    // Intento 3: Si tiene comas (múltiples artistas), probar con el artista principal
    if ((!results || results.length === 0) && song.uploader && song.uploader.includes(",")) {
      const primaryArtist = song.uploader.split(",")[0].trim();
      results = await window.electronAPI.searchSong(`${song.title} ${primaryArtist}`.trim());
    }

    // Intento 4: Buscar solo por el título de la canción
    if (!results || results.length === 0) {
      results = await window.electronAPI.searchSong(song.title.trim());
    }

    if (results && results.length > 0) {
      let candidatePool = results;
      if (excludeVideoId) {
        candidatePool = results.filter(
          (r) => r.videoId !== excludeVideoId && !r.url?.includes(excludeVideoId)
        );
        if (candidatePool.length === 0) {
          // Si el filtro descartó todos, hacer una búsqueda con audio alternativo
          const audioFallback = await window.electronAPI.searchSong(`${query} audio`);
          if (audioFallback && audioFallback.length > 0) {
            candidatePool = audioFallback.filter(
              (r) => r.videoId !== excludeVideoId && !r.url?.includes(excludeVideoId)
            );
          }
        }
      }

      const matched = pickBestCandidate(candidatePool.length > 0 ? candidatePool : results, song);
      if (matched) {
        song.url = matched.url || matched.sourceUrl || `https://www.youtube.com/watch?v=${matched.videoId}`;
        song.videoId = matched.videoId;
        if (!song.duration && matched.duration) {
          song.duration = matched.duration;
        }
        syncResolvedSongToPlaylists(song);
        return song.url;
      }
    }
  } catch (err) {
    console.warn(`Error al resolver URL de "${song.title}":`, err);
  }

  return null;
}

// ---- Sincronizador de canciones resueltas en playlists (Opción A) ----
function syncResolvedSongToPlaylists(resolvedSong) {
  if (!resolvedSong || !resolvedSong.title) return;
  let changed = false;
  playlists.forEach((pl) => {
    pl.songs.forEach((s) => {
      if (
        !s.url &&
        s.title.toLowerCase() === resolvedSong.title.toLowerCase() &&
        (!s.uploader ||
          !resolvedSong.uploader ||
          s.uploader.toLowerCase() === resolvedSong.uploader.toLowerCase())
      ) {
        s.url = resolvedSong.url;
        s.videoId = resolvedSong.videoId;
        if (!s.duration && resolvedSong.duration) {
          s.duration = resolvedSong.duration;
        }
        changed = true;
      }
    });
  });
  if (changed) {
    savePlaylistsToStorage();
    if (activePlaylistDetail && syncPlaylistBtn) {
      const pendingCount = activePlaylistDetail.songs.filter((s) => !s.url && !s.filename).length;
      if (pendingCount === 0) {
        syncPlaylistBtn.innerHTML = '<i class="ph ph-check-circle"></i> Vinculadas';
        syncPlaylistBtn.style.opacity = "0.6";
        syncPlaylistBtn.disabled = true;
      } else {
        const linkedCount = activePlaylistDetail.songs.length - pendingCount;
        syncPlaylistBtn.innerHTML = `<i class="ph ph-arrows-clockwise"></i> Vincular (${linkedCount}/${activePlaylistDetail.songs.length})`;
      }
    }
  }
}

// ---- Reproducción Aleatoria / Shuffle (Fase 5) ----
function shufflePlaylist(playlistId) {
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl || pl.songs.length === 0) return;

  // Clona y baraja con Fisher-Yates
  const shuffled = [...pl.songs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  queue = shuffled.map((s) => ({
    title: s.title,
    uploader: s.uploader,
    duration: s.duration,
    thumbnail: s.thumbnail,
    filename: s.filename || null,
    url: s.url || null,
  }));

  renderQueue();
  new Notify({
    status: "info",
    title: "Modo Aleatorio",
    text: `Reproduciendo "${pl.name}" en orden aleatorio.`,
    effect: "fade",
    autotimeout: 2500,
  });
  playSong(queue[0], !!queue[0].filename, 0);
}

// ---- Descarga completa de Playlist Fuera de Línea con Control Anti-Sobrecarga ----
let isDownloadingAllPlaylist = false;
let downloadingPlaylistId = null;
let downloadAllProgressBtnHTML = "";

const playlistBatchState = {
  isPaused: false,
  isCancelled: false,
  pauseResolvers: [],
};

window.playlistDownloadController = {
  pause() {
    if (!isDownloadingAllPlaylist || playlistBatchState.isPaused) return;
    playlistBatchState.isPaused = true;
    if (window.systemTray && window.systemTray.activeDownloadTask) {
      window.systemTray.updateDownloadTask({
        isPaused: true,
        status: "paused",
        statusText: "En pausa por el usuario",
      });
    }
  },
  resume() {
    if (!isDownloadingAllPlaylist || !playlistBatchState.isPaused) return;
    playlistBatchState.isPaused = false;
    while (playlistBatchState.pauseResolvers.length > 0) {
      const r = playlistBatchState.pauseResolvers.shift();
      r();
    }
    if (window.systemTray && window.systemTray.activeDownloadTask) {
      window.systemTray.updateDownloadTask({
        isPaused: false,
        status: "downloading",
        statusText: "Reanudando descargas...",
      });
    }
  },
  togglePause() {
    if (playlistBatchState.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  },
  cancel() {
    if (!isDownloadingAllPlaylist) return;
    playlistBatchState.isCancelled = true;
    playlistBatchState.isPaused = false;
    while (playlistBatchState.pauseResolvers.length > 0) {
      const r = playlistBatchState.pauseResolvers.shift();
      r();
    }
  },
};

function updatePlaylistRowDownloadUI(playlistId, origIndex, state) {
  if (!activePlaylistDetail || activePlaylistDetail.id !== playlistId || !playlistSongsList) return;
  const row = playlistSongsList.querySelector(`li[data-orig-index="${origIndex}"]`);
  if (!row) return;
  const actionsDiv = row.querySelector(".song-actions");
  if (!actionsDiv) return;
  const dlBtn = actionsDiv.querySelector(".download-pl");

  if (state === "active") {
    if (dlBtn) {
      dlBtn.disabled = true;
      dlBtn.style.opacity = "0.85";
      dlBtn.innerHTML = `<i class="ph ph-spinner ph-spin"></i>`;
      dlBtn.title = "Descargando...";
    }
  } else if (state === "done") {
    const relinkBtn = actionsDiv.querySelector(".relink-pl");
    if (relinkBtn) relinkBtn.remove();
    if (dlBtn) {
      const checkSpan = document.createElement("span");
      checkSpan.title = "Disponible offline";
      checkSpan.style.cssText = "color:#00d170; font-size:1.1rem; display:flex; align-items:center;";
      checkSpan.innerHTML = `<i class="ph ph-check-circle"></i>`;
      dlBtn.replaceWith(checkSpan);
    }
  } else if (state === "error") {
    if (dlBtn) {
      dlBtn.disabled = false;
      dlBtn.style.opacity = "1";
      dlBtn.innerHTML = `<i class="ph ph-download-simple"></i>`;
      dlBtn.title = "Reintentar descarga";
    }
  }
}

async function waitIfBatchPausedOrYielding(syncUiCallback) {
  while (playlistBatchState.isPaused && !playlistBatchState.isCancelled) {
    await new Promise((resolve) => playlistBatchState.pauseResolvers.push(resolve));
  }
  if (playlistBatchState.isCancelled) return false;

  // Priorizar siempre la reproducción de música del usuario:
  // si el reproductor está resolviendo una canción para reproducir, esperar sin saturar yt-dlp
  if (typeof isResolvingSong !== "undefined" && isResolvingSong) {
    if (syncUiCallback) {
      syncUiCallback("playback-yield", "Priorizando reproducción de música...");
    }
    while (typeof isResolvingSong !== "undefined" && isResolvingSong && !playlistBatchState.isCancelled) {
      await new Promise((r) => setTimeout(r, 450));
    }
    // Pequeño margen adicional para que el buffer de audio inicie limpio
    await new Promise((r) => setTimeout(r, 1000));
  }

  return !playlistBatchState.isCancelled;
}

async function sleepInterruptible(ms) {
  const step = 250;
  let elapsed = 0;
  while (elapsed < ms && !playlistBatchState.isCancelled) {
    if (playlistBatchState.isPaused) {
      await waitIfBatchPausedOrYielding();
    }
    await new Promise((r) => setTimeout(r, Math.min(step, ms - elapsed)));
    elapsed += step;
  }
}

async function downloadAllPlaylist(playlistId) {
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl || pl.songs.length === 0) return;

  if (isDownloadingAllPlaylist) {
    if (window.systemTray) {
      window.systemTray.open();
    }
    return;
  }

  const unDownloaded = pl.songs.filter((s) => !s.filename);
  if (unDownloaded.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Todo descargado",
      text: "Todas las canciones de esta playlist ya están disponibles fuera de línea.",
      confirmButtonColor: "#ff0090",
    });
    return;
  }

  const result = await Swal.fire({
    title: `¿Descargar "${pl.name}"?`,
    html: `Se procesarán <b>${unDownloaded.length} canciones</b> con control inteligente anti-saturación para evitar bloqueos de <code>yt-dlp</code>.<br><small style="color: #888;">Puedes seguir escuchando música con normalidad y ver o pausar el avance desde la Bandeja del Sistema.</small>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: '<i class="ph ph-download-simple"></i> Iniciar descarga segura',
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ff0090",
  });

  if (!result.isConfirmed) return;

  isDownloadingAllPlaylist = true;
  downloadingPlaylistId = playlistId;
  playlistBatchState.isPaused = false;
  playlistBatchState.isCancelled = false;
  playlistBatchState.pauseResolvers = [];

  const totalCount = unDownloaded.length;
  let processedCount = 0;
  let downloadedCount = 0;
  let cachedCount = 0;
  let failedCount = 0;
  let consecutiveNetworkDownloads = 0;

  const updateProgressVisibility = (status, statusText, currentSongTitle = "") => {
    downloadAllProgressBtnHTML = `<i class="ph ph-spinner ph-spin"></i> Descargando (${processedCount}/${totalCount})`;
    if (downloadAllPlaylistBtn && activePlaylistDetail && activePlaylistDetail.id === playlistId) {
      downloadAllPlaylistBtn.disabled = true;
      downloadAllPlaylistBtn.innerHTML = downloadAllProgressBtnHTML;
    }
    if (window.systemTray) {
      window.systemTray.updateDownloadTask({
        playlistId,
        playlistName: pl.name,
        processedCount,
        totalCount,
        downloadedCount,
        cachedCount,
        failedCount,
        currentSongTitle,
        status,
        statusText,
        isPaused: playlistBatchState.isPaused,
        isFinished: status === "completed" || status === "cancelled",
      });
    }
  };

  if (window.systemTray) {
    window.systemTray.addMessage(
      "Descarga Masiva",
      `Iniciando descarga controlada de ${totalCount} canciones de "${pl.name}".`,
      "music",
      false
    );
  }

  updateProgressVisibility("downloading", "Preparando cola de descarga...", "");

  new Notify({
    status: "info",
    title: "Descarga inteligente iniciada",
    text: `Descargando ${totalCount} canciones. Abre la Bandeja del Sistema para ver el progreso en vivo.`,
    effect: "fade",
  });

  const BATCH_COOLDOWN_EVERY = 12; // Cada 12 descargas reales de red, pausa preventiva
  const BATCH_COOLDOWN_SECONDS = 10;

  for (let i = 0; i < unDownloaded.length; i++) {
    const song = unDownloaded[i];
    const origIndex = pl.songs.indexOf(song);
    const displaySongName = `${song.title}${song.uploader ? " - " + song.uploader : ""}`;

    const canContinue = await waitIfBatchPausedOrYielding((st, txt) =>
      updateProgressVisibility(st, txt, displaySongName)
    );
    if (!canContinue) break;

    updatePlaylistRowDownloadUI(playlistId, origIndex, "active");

    let trackSucceeded = false;
    let wasAlreadyCached = false;

    for (let attempt = 1; attempt <= 2; attempt++) {
      if (playlistBatchState.isCancelled) break;

      const okToRun = await waitIfBatchPausedOrYielding((st, txt) =>
        updateProgressVisibility(st, txt, displaySongName)
      );
      if (!okToRun) break;

      try {
        if (!song.url) {
          updateProgressVisibility(
            "resolving",
            attempt > 1 ? `Reintentando búsqueda (${attempt}/2)...` : "Buscando fuente de audio...",
            displaySongName
          );
          await resolveSongOnlineUrl(song);
        }

        if (!song.url) {
          throw new Error("No se encontró URL válida para la pista");
        }

        const okBeforeDl = await waitIfBatchPausedOrYielding((st, txt) =>
          updateProgressVisibility(st, txt, displaySongName)
        );
        if (!okBeforeDl) break;

        updateProgressVisibility(
          "downloading",
          attempt > 1 ? `Reintentando descarga (${attempt}/2)...` : "Descargando audio...",
          displaySongName
        );

        const res = await window.electronAPI.downloadSong({
          title: song.title,
          uploader: song.uploader,
          duration: song.duration,
          thumbnail: song.thumbnail,
          url: song.url,
        });

        if (res && res.success) {
          const safeFallback = `${song.title.replace(/[<>:"/\\|?*]+/g, "_")}.mp3`;
          song.filename = res.filename || safeFallback;
          trackSucceeded = true;
          wasAlreadyCached = !!res.alreadyExists;
          break;
        } else {
          throw new Error((res && res.error) || "Fallo en yt-dlp");
        }
      } catch (err) {
        const errMsg = String(err?.message || err || "");
        console.warn(`Intento ${attempt} fallido para "${song.title}":`, errMsg);

        const isAgeOrUnplayable = /sign in|confirm your age|age.?restrict|private video|not available|unplayable/i.test(errMsg);
        if (isAgeOrUnplayable) {
          const badVideoId = song.videoId || (song.url ? song.url.match(/(?:v=|\/)([\w-]{11})/)?.[1] : null);
          song.url = null;
          song.videoId = null;
          updateProgressVisibility(
            "resolving",
            "Pista con restricción de edad. Buscando versión alternativa...",
            displaySongName
          );
          await resolveSongOnlineUrl(song, true, badVideoId);
        }

        if (attempt < 2 && !playlistBatchState.isCancelled) {
          const isRateLimit = /429|too many requests|rate.?limit|bot/i.test(errMsg);
          const backoffSeconds = isRateLimit ? 20 : (isAgeOrUnplayable ? 3 : 5);
          for (let sec = backoffSeconds; sec > 0; sec--) {
            if (playlistBatchState.isCancelled) break;
            updateProgressVisibility(
              "cooldown",
              isAgeOrUnplayable
                ? `Cambiando a pista alternativa (${sec}s)...`
                : `Enfriando conexión antes de reintentar (${sec}s)...`,
              displaySongName
            );
            await sleepInterruptible(1000);
          }
        }
      }
    }

    if (playlistBatchState.isCancelled) {
      updatePlaylistRowDownloadUI(playlistId, origIndex, "error");
      break;
    }

    processedCount++;

    if (trackSucceeded) {
      if (wasAlreadyCached) {
        cachedCount++;
      } else {
        downloadedCount++;
        consecutiveNetworkDownloads++;
      }
      savePlaylistsToStorage();
      updatePlaylistRowDownloadUI(playlistId, origIndex, "done");

      // Actualizar biblioteca offline periódicamente sin saturar disco en cada canción
      if (downloadedCount > 0 && downloadedCount % 15 === 0) {
        loadDownloaded().catch(() => {});
      }
    } else {
      failedCount++;
      updatePlaylistRowDownloadUI(playlistId, origIndex, "error");
      if (window.systemTray) {
        window.systemTray.addMessage(
          "Canción omitida",
          `No se pudo descargar "${song.title}" tras 2 intentos.`,
          "warning",
          true
        );
      }
    }

    updateProgressVisibility("downloading", "Procesando cola...", displaySongName);

    // Si quedan más canciones, aplicar control de ritmo (pacing) para no sobrecargar yt-dlp
    if (i < unDownloaded.length - 1 && !playlistBatchState.isCancelled) {
      if (wasAlreadyCached) {
        await sleepInterruptible(120);
      } else if (
        consecutiveNetworkDownloads > 0 &&
        consecutiveNetworkDownloads % BATCH_COOLDOWN_EVERY === 0
      ) {
        for (let sec = BATCH_COOLDOWN_SECONDS; sec > 0; sec--) {
          if (playlistBatchState.isCancelled) break;
          updateProgressVisibility(
            "cooldown",
            `Pausa preventiva anti-saturación (${sec}s)...`,
            displaySongName
          );
          await sleepInterruptible(1000);
        }
      } else {
        // Espera con jitter natural entre 2.2s y 3.4s entre descargas reales
        const jitterMs = 2200 + Math.floor(Math.random() * 1200);
        await sleepInterruptible(jitterMs);
      }
    }
  }

  const wasCancelled = playlistBatchState.isCancelled;
  isDownloadingAllPlaylist = false;
  downloadingPlaylistId = null;
  downloadAllProgressBtnHTML = "";

  if (downloadAllPlaylistBtn) {
    downloadAllPlaylistBtn.disabled = false;
    downloadAllPlaylistBtn.innerHTML = `<i class="ph ph-download-simple"></i> Descargar Todo`;
  }

  await loadDownloaded();

  if (wasCancelled) {
    updateProgressVisibility(
      "cancelled",
      `Cancelado (${downloadedCount + cachedCount} listas, ${failedCount} fallos)`,
      ""
    );
    if (window.systemTray) {
      window.systemTray.addMessage(
        "Descarga cancelada",
        `Se detuvo la descarga de "${pl.name}". ${downloadedCount + cachedCount} canciones quedaron disponibles offline.`,
        "warning",
        false
      );
    }
    new Notify({
      status: "warning",
      title: "Descarga detenida",
      text: `Se guardaron ${downloadedCount + cachedCount} canciones antes de cancelar.`,
      effect: "fade",
    });
  } else {
    updateProgressVisibility(
      "completed",
      `Completado (${downloadedCount} nuevas, ${cachedCount} en caché${failedCount > 0 ? `, ${failedCount} fallos` : ""})`,
      ""
    );
    if (window.systemTray) {
      window.systemTray.addMessage(
        "Playlist descargada",
        `"${pl.name}" finalizó: ${downloadedCount} descargadas, ${cachedCount} en caché${failedCount > 0 ? ` y ${failedCount} omitidas` : ""}.`,
        failedCount > 0 ? "warning" : "success",
        false
      );
    }
    new Notify({
      status: failedCount > 0 ? "warning" : "success",
      title: "Descargas completadas",
      text: `Playlist "${pl.name}": ${downloadedCount + cachedCount} disponibles offline${failedCount > 0 ? ` (${failedCount} fallos)` : ""}.`,
      effect: "fade",
    });
  }
}

// ---- Sincronizador en Segundo Plano con YouTube (Opción B) ----
let isSyncingPlaylist = false;
let syncingPlaylistId = null;
let syncProgressText = "";

async function syncPlaylistWithYouTube(playlistId) {
  const pl = playlists.find((p) => p.id === playlistId);
  if (!pl || isSyncingPlaylist) return;

  const pendingSongs = pl.songs.filter((s) => !s.url && !s.filename);
  if (pendingSongs.length === 0) {
    new Notify({
      status: "info",
      title: "Todo listo",
      text: "Todas las canciones de esta playlist ya están vinculadas con YouTube.",
      effect: "fade",
    });
    return;
  }

  isSyncingPlaylist = true;
  syncingPlaylistId = pl.id;
  syncProgressText = `<i class="ph ph-spinner ph-spin"></i> Vinculando (0/${pendingSongs.length})`;

  if (syncPlaylistBtn) {
    syncPlaylistBtn.disabled = true;
    syncPlaylistBtn.innerHTML = syncProgressText;
  }

  new Notify({
    status: "info",
    title: "Vinculando en segundo plano",
    text: `"${pl.name}" (${pendingSongs.length} canciones). Puedes seguir usando la app libremente.`,
    effect: "fade",
    autotimeout: 4500,
  });

  if (window.systemTray) {
    window.systemTray.addMessage(
      "Vinculación en fondo",
      `Iniciando vinculación de "${pl.name}" (${pendingSongs.length} canciones)...`,
      "info"
    );
  }

  let resolvedCount = 0;
  for (const song of pendingSongs) {
    // Si fue resuelta mientras tanto por reproducción on-demand
    if (song.url || song.filename) {
      resolvedCount++;
      continue;
    }

    try {
      await resolveSongOnlineUrl(song);
    } catch (e) {
      console.warn(`Error vinculando "${song.title}":`, e);
    }

    resolvedCount++;
    savePlaylistsToStorage();

    const totalResolved = pl.songs.length - (pendingSongs.length - resolvedCount);
    syncProgressText = `<i class="ph ph-spinner ph-spin"></i> Vinculando (${totalResolved}/${pl.songs.length})`;

    if (activePlaylistDetail && activePlaylistDetail.id === pl.id && syncPlaylistBtn) {
      syncPlaylistBtn.innerHTML = syncProgressText;
    }

    // Pausa prudente entre consultas a YouTube para evitar límites y redirecciones
    await new Promise((r) => setTimeout(r, 1000));
  }

  isSyncingPlaylist = false;
  syncingPlaylistId = null;
  syncProgressText = "";
  savePlaylistsToStorage();

  if (activePlaylistDetail && activePlaylistDetail.id === pl.id && syncPlaylistBtn) {
    syncPlaylistBtn.disabled = true;
    syncPlaylistBtn.style.opacity = "0.6";
    syncPlaylistBtn.innerHTML = '<i class="ph ph-check-circle"></i> Vinculadas';
  }

  new Notify({
    status: "success",
    title: "Vinculación finalizada",
    text: `Canciones de "${pl.name}" vinculadas correctamente.`,
    effect: "fade",
  });

  if (window.systemTray) {
    window.systemTray.addMessage(
      "Vinculación completada",
      `Se completó la vinculación con YouTube de "${pl.name}".`,
      "success"
    );
  }
}

// ---- Modal Selección de Playlist para Agregar Canción ----
function openPlaylistModal(song) {
  selectedSongForPlaylist = song;
  if (playlistModalSongTitle) playlistModalSongTitle.textContent = song.title;
  renderPlaylistModalList();
  if (playlistModalOverlay) playlistModalOverlay.classList.remove("is-hidden");
}

function closePlaylistModal() {
  if (playlistModalOverlay) playlistModalOverlay.classList.add("is-hidden");
  selectedSongForPlaylist = null;
  if (playlistModalNameInput) playlistModalNameInput.value = "";
}

function renderPlaylistModalList() {
  if (!playlistModalList) return;
  playlistModalList.innerHTML = "";

  if (playlists.length === 0) {
    playlistModalList.innerHTML = `<p style="color:rgba(255,255,255,0.4); font-size:0.85rem; text-align:center;">No hay playlists. Crea una abajo.</p>`;
    return;
  }

  playlists.forEach((pl) => {
    const item = document.createElement("div");
    item.className = "playlist-modal-item";
    item.innerHTML = `<i class="ph ph-playlist"></i> ${pl.name} <span style="margin-left:auto; color:rgba(255,255,255,0.4); font-size:0.8rem;">${pl.songs.length} canciones</span>`;
    item.addEventListener("click", () => {
      if (!selectedSongForPlaylist) return;
      const added = addSongToPlaylist(pl.id, selectedSongForPlaylist);
      if (added) {
        new Notify({
          status: "success",
          title: "Añadida",
          text: `"${selectedSongForPlaylist.title}" → ${pl.name}`,
          effect: "fade",
        });
      } else {
        new Notify({
          status: "warning",
          title: "Ya existe",
          text: `"${selectedSongForPlaylist.title}" ya está en "${pl.name}"`,
          effect: "fade",
        });
      }
      closePlaylistModal();
    });
    playlistModalList.appendChild(item);
  });
}

async function readFileTextWithEncoding(file) {
  try {
    const buffer = await file.arrayBuffer();
    let decoder = new TextDecoder("utf-8", { fatal: false });
    let text = decoder.decode(buffer);

    // Si tiene caracteres corruptos de decodificación, probar windows-1252
    if (text.includes("\ufffd")) {
      try {
        const winDecoder = new TextDecoder("windows-1252");
        const winText = winDecoder.decode(buffer);
        if (!winText.includes("\ufffd")) {
          text = winText;
        }
      } catch {}
    }

    if (text.charCodeAt(0) === 0xfeff) {
      text = text.slice(1);
    }
    return text;
  } catch {
    return await file.text();
  }
}

// ---- Procesador e importador de archivos CSV (Fase 1 y 2) ----
async function handleCsvFile(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".csv")) {
    new Notify({
      status: "error",
      title: "Archivo inválido",
      text: "Por favor selecciona un archivo con formato .csv de Exportify.",
      effect: "fade",
    });
    return;
  }

  try {
    const text = await readFileTextWithEncoding(file);
    const songs = parseExportifyCsv(text);

    if (!songs || songs.length === 0) {
      new Notify({
        status: "warning",
        title: "Sin canciones",
        text: "No se encontraron canciones válidas en el archivo CSV.",
        effect: "fade",
      });
      return;
    }

    // Nombre sugerido a partir del nombre del archivo sin .csv
    const defaultName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    // Previsualización de portadas (primeras 4 carátulas de Spotify)
    const previewThumbs = [];
    for (const s of songs) {
      if (s.thumbnail && !previewThumbs.includes(s.thumbnail) && !s.thumbnail.includes("player.gif")) {
        previewThumbs.push(s.thumbnail);
      }
      if (previewThumbs.length === 4) break;
    }

    const previewImagesHtml = previewThumbs.length > 0
      ? `<div style="display: flex; gap: 8px; justify-content: center; margin: 15px 0;">
          ${previewThumbs.map((t) => `<img src="${t}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">`).join("")}
         </div>`
      : "";

    const { value: formValues } = await Swal.fire({
      title: "Importar Playlist de Spotify",
      html: `
        <div style="text-align: left; font-family: 'Poppins', sans-serif;">
          <p style="margin-bottom: 12px; color: #444; font-size: 0.95rem;">
            Se detectaron <b>${songs.length} canciones</b> en <code>${file.name}</code>.
          </p>
          ${previewImagesHtml}
          <label style="font-size: 0.85rem; font-weight: 600; color: #333; display: block; margin-bottom: 6px;">Nombre de la Playlist:</label>
          <input id="swalPlaylistName" class="swal2-input" value="${defaultName}" style="margin: 0; width: 100%; box-sizing: border-box; font-size: 0.95rem;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="ph ph-check"></i> Crear e Importar',
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ff0090",
      cancelButtonColor: "#666",
      background: "rgba(255, 255, 255, 0.98)",
      preConfirm: () => {
        const input = document.getElementById("swalPlaylistName");
        const val = input ? input.value.trim() : "";
        if (!val) {
          Swal.showValidationMessage("Por favor ingresa un nombre para la playlist.");
          return false;
        }
        return val;
      },
    });

    if (formValues) {
      const pl = createPlaylist(formValues);
      if (pl) {
        pl.songs = songs;
        savePlaylistsToStorage();
        renderPlaylists();
        new Notify({
          status: "success",
          title: "¡Playlist importada con éxito!",
          text: `"${pl.name}" creada con ${pl.songs.length} canciones.`,
          effect: "fade",
          autotimeout: 4000,
        });
        openPlaylistDetail(pl.id);
      }
    }
  } catch (err) {
    console.error("Error al importar CSV:", err);
    Swal.fire({
      icon: "error",
      title: "Error al importar CSV",
      text: err.message || "No se pudo procesar el archivo.",
      confirmButtonColor: "#ff0090",
    });
  }
}

// ---- Wire up all playlist & queue event listeners ----
loadPlaylistsFromStorage();
loadQueueFromStorage();
renderQueue();
updateRepeatUI();
updateShuffleUI();

// Botón e input para importar CSV
if (importCsvBtn && importCsvFileInput) {
  importCsvBtn.addEventListener("click", () => {
    importCsvFileInput.value = "";
    importCsvFileInput.click();
  });

  importCsvFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleCsvFile(e.target.files[0]);
    }
  });
}

// Drag and drop para archivos .csv sobre la vista de Playlists
if (playlistsContainer) {
  ["dragenter", "dragover"].forEach((eventName) => {
    playlistsContainer.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (playlistDropZone) {
        playlistDropZone.classList.remove("is-hidden");
        playlistDropZone.classList.add("dragover");
      }
    });
  });

  ["dragleave", "dragend"].forEach((eventName) => {
    playlistsContainer.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (playlistDropZone && !playlistDropZone.contains(e.relatedTarget)) {
        playlistDropZone.classList.remove("dragover");
        if (activePlaylistDetail) {
          playlistDropZone.classList.add("is-hidden");
        }
      }
    });
  });

  playlistsContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (playlistDropZone) {
      playlistDropZone.classList.remove("dragover");
      playlistDropZone.classList.add("is-hidden");
    }

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCsvFile(e.dataTransfer.files[0]);
    }
  });
}

// Filtro buscador dentro de la playlist activa
if (playlistFilterInput) {
  playlistFilterInput.addEventListener("input", (e) => {
    if (activePlaylistDetail) {
      renderPlaylistSongs(activePlaylistDetail, e.target.value.trim());
    }
  });
}

// Create playlist from main view
if (createPlaylistBtn) {
  createPlaylistBtn.addEventListener("click", () => {
    const name = playlistNameInput ? playlistNameInput.value.trim() : "";
    if (!name) return;
    createPlaylist(name);
    if (playlistNameInput) playlistNameInput.value = "";
    renderPlaylists();
  });
  if (playlistNameInput) {
    playlistNameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") createPlaylistBtn.click();
    });
  }
}

// Back button in detail view
if (backToPlaylistsBtn) {
  backToPlaylistsBtn.addEventListener("click", () => {
    activePlaylistDetail = null;
    playlistDetailView.classList.add("is-hidden");
    const createRow = document.querySelector(".playlist-create-row");
    if (createRow) createRow.classList.remove("is-hidden");
    if (playlistsGrid) playlistsGrid.classList.remove("is-hidden");
    renderPlaylists();
  });
}

// Rename playlist button
if (renamePlaylistBtn) {
  renamePlaylistBtn.addEventListener("click", () => {
    const id = playPlaylistBtn ? playPlaylistBtn.dataset.playlistId : (activePlaylistDetail ? activePlaylistDetail.id : null);
    if (id) handleRenamePlaylist(id);
  });
}

// Delete playlist from detail view button
if (deletePlaylistFromDetailBtn) {
  deletePlaylistFromDetailBtn.addEventListener("click", () => {
    const id = playPlaylistBtn ? playPlaylistBtn.dataset.playlistId : (activePlaylistDetail ? activePlaylistDetail.id : null);
    if (id) handleDeletePlaylist(id);
  });
}

// Queue all playlist button
if (queueAllPlaylistBtn) {
  queueAllPlaylistBtn.addEventListener("click", () => {
    const id = playPlaylistBtn ? playPlaylistBtn.dataset.playlistId : (activePlaylistDetail ? activePlaylistDetail.id : null);
    const pl = playlists.find((p) => p.id === id);
    if (!pl || pl.songs.length === 0) return;

    const songsToQueue = pl.songs.map((s) => ({
      title: s.title,
      uploader: s.uploader,
      duration: s.duration,
      thumbnail: s.thumbnail,
      filename: s.filename || null,
      url: s.url || null,
    }));

    queue.push(...songsToQueue);
    saveQueueToStorage();
    renderQueue();

    if (typeof Notify !== "undefined") {
      new Notify({
        status: "success",
        title: "Añadidas a la cola",
        text: `${songsToQueue.length} canciones añadidas a la cola.`,
        effect: "fade",
        autotimeout: 2500,
      });
    }

    if (player.src === "" || (player.paused && currentIndex === -1)) {
      playSong(queue[0], !!queue[0].filename, 0);
    }
  });
}

// Play entire playlist button
if (playPlaylistBtn) {
  playPlaylistBtn.addEventListener("click", () => {
    const id = playPlaylistBtn.dataset.playlistId;
    if (id) playPlaylist(id);
  });
}

// Shuffle playlist button
if (shufflePlaylistBtn) {
  shufflePlaylistBtn.addEventListener("click", () => {
    const id = playPlaylistBtn ? playPlaylistBtn.dataset.playlistId : (activePlaylistDetail ? activePlaylistDetail.id : null);
    if (id) shufflePlaylist(id);
  });
}

// Download all playlist button
if (downloadAllPlaylistBtn) {
  downloadAllPlaylistBtn.addEventListener("click", () => {
    const id = playPlaylistBtn ? playPlaylistBtn.dataset.playlistId : (activePlaylistDetail ? activePlaylistDetail.id : null);
    if (id) downloadAllPlaylist(id);
  });
}

// Background sync button
if (syncPlaylistBtn) {
  syncPlaylistBtn.addEventListener("click", () => {
    const id = playPlaylistBtn ? playPlaylistBtn.dataset.playlistId : (activePlaylistDetail ? activePlaylistDetail.id : null);
    if (id) syncPlaylistWithYouTube(id);
  });
}

// Local filter input for playlist songs
if (playlistFilterInput) {
  playlistFilterInput.addEventListener("input", () => {
    if (activePlaylistDetail) {
      renderPlaylistSongs(activePlaylistDetail, playlistFilterInput.value);
      if (playlistSongsList) playlistSongsList.scrollTop = 0;
    }
  });
}

// Close modal button
if (closePlaylistModalBtn) {
  closePlaylistModalBtn.addEventListener("click", closePlaylistModal);
}

// Close modal on overlay click
if (playlistModalOverlay) {
  playlistModalOverlay.addEventListener("click", (e) => {
    if (e.target === playlistModalOverlay) closePlaylistModal();
  });
}

// Create playlist directly from the modal
if (playlistModalCreateBtn) {
  playlistModalCreateBtn.addEventListener("click", () => {
    const name = playlistModalNameInput ? playlistModalNameInput.value.trim() : "";
    if (!name) return;
    const pl = createPlaylist(name);
    if (pl && selectedSongForPlaylist) {
      addSongToPlaylist(pl.id, selectedSongForPlaylist);
      new Notify({ status: "success", title: "Playlist creada", text: `"${selectedSongForPlaylist.title}" añadida a "${name}"`, effect: "fade" });
      closePlaylistModal();
    }
  });
  if (playlistModalNameInput) {
    playlistModalNameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") playlistModalCreateBtn.click();
    });
  }
}

// ======= Sidebar Collapsible Logic =======
const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
const sidebarToggleIcon = document.getElementById("sidebarToggleIcon");
const sidebar = document.querySelector(".sidebar");

if (sidebarToggleBtn && sidebarToggleIcon && sidebar) {
  const updateSidebarState = (shouldCollapse) => {
    if (shouldCollapse) {
      sidebar.classList.add("collapsed");
      sidebarToggleIcon.className = "ph ph-caret-double-right";
      sidebarToggleBtn.title = "Expandir menú";
    } else {
      sidebar.classList.remove("collapsed");
      sidebarToggleIcon.className = "ph ph-caret-double-left";
      sidebarToggleBtn.title = "Colapsar menú";
    }
  };

  sidebarToggleBtn.addEventListener("click", () => {
    const isCollapsed = sidebar.classList.contains("collapsed");
    updateSidebarState(!isCollapsed);
  });

  const handleResize = () => {
    if (window.innerWidth <= 1024) {
      updateSidebarState(true);
    } else {
      updateSidebarState(false);
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize(); // Ejecutar al inicio para ajustar al tamaño actual
}

// ======= Cargar Volumen Guardado =======
function initVolume() {
  const savedVolume = localStorage.getItem("mexlify_volume");
  const savedMuted = localStorage.getItem("mexlify_muted");

  let volume = 0.5; // fallback predeterminado
  if (savedVolume !== null) {
    volume = parseFloat(savedVolume);
  }

  lastVolume = volume > 0 ? volume : 0.5;
  isMuted = savedMuted === "true";

  if (isMuted) {
    player.volume = 0;
    volumeSlider.value = 0;
    fcp_volumeSlider.value = 0;
  } else {
    player.volume = volume;
    volumeSlider.value = volume;
    fcp_volumeSlider.value = volume;
  }

  handleVolumeChange({ target: { value: isMuted ? 0 : volume } });
}

// ======= Cargar Última Canción Reproducida =======
function initLastSong() {
  const savedSongJson = localStorage.getItem("mexlify_last_song");
  const isLocal = localStorage.getItem("mexlify_last_song_local") === "true";

  if (savedSongJson) {
    try {
      const song = JSON.parse(savedSongJson);
      currentSong = song;
      currentSong.isDownloaded = isLocal;

      // Actualizar UI
      let coverImageUrl = song.thumbnail || "resources/player.gif";
      cover.src = coverImageUrl;
      fcp_cover.src = coverImageUrl;

      songTitle.textContent = cleanSongTitle(song.title);
      songArtist.textContent = song.uploader;
      fcp_songTitle.textContent = cleanSongTitle(song.title);
      fcp_songArtist.textContent = song.uploader;

      // Habilitar barra de progreso
      progressBar.disabled = false;
      fcpProgressBar.disabled = false;

      debugLog("Última canción cargada:", song.title);
    } catch (e) {
      debugLog("Error cargando última canción:", e);
    }
  }
}

// ======= Exportar música a ZIP & Sistema de Referencias .mexref =======
const exportZipBtn = document.getElementById("exportZipBtn");
const exportZipModalOverlay = document.getElementById("exportZipModalOverlay");
const closeExportZipModalBtn = document.getElementById("closeExportZipModalBtn");
const exportCancelBtn = document.getElementById("exportCancelBtn");
const exportConfirmBtn = document.getElementById("exportConfirmBtn");
const exportSongsList = document.getElementById("exportSongsList");
const exportModalSearchInput = document.getElementById("exportModalSearchInput");

const exportStatTotal = document.getElementById("exportStatTotal");
const exportStatNew = document.getElementById("exportStatNew");
const exportStatOld = document.getElementById("exportStatOld");
const exportStatSelected = document.getElementById("exportStatSelected");

const exportSelectOnlyNewBtn = document.getElementById("exportSelectOnlyNewBtn");
const exportSelectAllBtn = document.getElementById("exportSelectAllBtn");
const exportDeselectAllBtn = document.getElementById("exportDeselectAllBtn");
const exportResetHistoryBtn = document.getElementById("exportResetHistoryBtn");

// Elementos de la sección .mexref
const importMexrefBtn = document.getElementById("importMexrefBtn");
const mexrefFileInput = document.getElementById("mexrefFileInput");
const mexrefFilesList = document.getElementById("mexrefFilesList");
const mexrefExclusionSummary = document.getElementById("mexrefExclusionSummary");
const mexrefTotalLoadedBadge = document.getElementById("mexrefTotalLoadedBadge");
const mexrefOrigCount = document.getElementById("mexrefOrigCount");
const mexrefExcludedCount = document.getElementById("mexrefExcludedCount");
const mexrefRemainingCount = document.getElementById("mexrefRemainingCount");

// Elementos del modal de progreso UI/UX
const exportProgressModalOverlay = document.getElementById("exportProgressModalOverlay");
const exportProgressBarFill = document.getElementById("exportProgressBarFill");
const exportProgressSongTitle = document.getElementById("exportProgressSongTitle");
const exportProgressSongStep = document.getElementById("exportProgressSongStep");
const exportProgressCounterText = document.getElementById("exportProgressCounterText");
const exportProgressPercentText = document.getElementById("exportProgressPercentText");
const exportProgressStatusText = document.getElementById("exportProgressStatusText");

let exportCurrentSongs = [];
let exportSelectedFilenames = new Set();
// Mapa de archivos .mexref cargados: fileName -> { fileName, filePath, data }
let importedMexrefFiles = new Map();

// ---- Historial LocalStorage ----
function getExportedSongsHistory() {
  try {
    const raw = localStorage.getItem("mexlify_exported_songs");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExportedSongsHistory(filenames) {
  try {
    const history = new Set(getExportedSongsHistory());
    filenames.forEach((f) => history.add(f));
    localStorage.setItem("mexlify_exported_songs", JSON.stringify([...history]));
  } catch (err) {
    console.error("Error al guardar historial de canciones exportadas:", err);
  }
}

// ---- Helpers de normalización y extracción de IDs ----
function normalizeMexrefTitle(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(official\s*(music)?\s*video|official\s*audio|video\s*oficial|audio\s*oficial|lyric\s*video|lyrics|closed-captioned|audio)\b/gi, "")
    .replace(/\[.*?\]|\(.*?\)/g, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanArtist(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(feat\.?|ft\.?)\b.*/gi, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  const match = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([0-9A-Za-z_-]{6,16})/);
  return match ? match[1] : null;
}

// ---- Validación y Parseo de .mexref ----
function validateMexrefContent(parsed, filename = "archivo.mexref") {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`El archivo "${filename}" no contiene un documento JSON válido.`);
  }
  if (parsed.format !== "mexref") {
    throw new Error(`El archivo "${filename}" no es un archivo .mexref válido (formato esperado: "mexref", recibido: "${parsed.format || 'ninguno'}").`);
  }
  if (typeof parsed.version !== "number") {
    throw new Error(`El archivo "${filename}" no especifica una versión numérica válida.`);
  }
  if (parsed.version > 1) {
    throw new Error(`El archivo "${filename}" tiene la versión ${parsed.version}, pero esta versión de Mexlify solo soporta la versión 1 o anterior.`);
  }
  if (!Array.isArray(parsed.tracks)) {
    throw new Error(`El archivo "${filename}" no contiene una lista de pistas válida ("tracks" debe ser un arreglo).`);
  }

  // Sanitizar cada pista sin ejecutar nada como código
  const validTracks = [];
  for (let i = 0; i < parsed.tracks.length; i++) {
    const t = parsed.tracks[i];
    if (!t || typeof t !== "object") continue;

    const title = typeof t.title === "string" ? t.title.trim() : "";
    const id = typeof t.id === "string" ? t.id.trim() : "";
    if (!title && !id) continue;

    let artists = [];
    if (Array.isArray(t.artists)) {
      artists = t.artists.filter((a) => typeof a === "string" && a.trim()).map((a) => a.trim());
    } else if (typeof t.artists === "string" && t.artists.trim()) {
      artists = [t.artists.trim()];
    } else if (typeof t.uploader === "string" && t.uploader.trim()) {
      artists = [t.uploader.trim()];
    }

    validTracks.push({
      id: id || null,
      source: typeof t.source === "string" ? t.source.toLowerCase().trim() : "mexlify",
      title: title || id,
      artists: artists.length > 0 ? artists : ["Desconocido"],
      album: typeof t.album === "string" && t.album.trim() ? t.album.trim() : undefined,
      durationMs: typeof t.durationMs === "number" && t.durationMs > 0 ? t.durationMs : undefined
    });
  }

  return {
    format: "mexref",
    version: 1,
    app: parsed.app || "Mexlify Music",
    createdAt: parsed.createdAt || new Date().toISOString(),
    export: parsed.export || {},
    tracks: validTracks
  };
}

// Combinar referencias de múltiples archivos .mexref sin duplicados
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

      const normTitle = normalizeMexrefTitle(track.title);
      const normArtist = cleanArtist(track.artists && track.artists[0] ? track.artists[0] : "");
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

// Comparación precisa de canciones con referencias .mexref
function matchSongWithMexref(song, mexrefTracks) {
  if (!mexrefTracks || mexrefTracks.length === 0) return { match: false };

  // 1. Priorizar identificadores estables de plataforma (Spotify / YouTube)
  const songSpotifyUri = song.spotifyUri || (song.SpotifyUri && song.SpotifyUri !== "N/A" ? song.SpotifyUri : null);
  const songUrl = song.url || (song.Url && song.Url !== "N/A" ? song.Url : null);
  const songVideoId = song.videoId || (song.VideoId && song.VideoId !== "N/A" ? song.VideoId : null) || extractYouTubeId(songUrl);

  for (const ref of mexrefTracks) {
    // Coincidencia por Spotify ID
    if (songSpotifyUri && ref.source === "spotify" && ref.id) {
      if (ref.id === songSpotifyUri || ref.id === songSpotifyUri.replace("spotify:track:", "")) {
        return { match: true, reason: "ID Spotify", ref };
      }
    }
    // Coincidencia por YouTube Video ID
    if (songVideoId && ref.source === "youtube" && ref.id) {
      const refVid = ref.id.replace(/^youtube:/, "");
      if (refVid === songVideoId) {
        return { match: true, reason: "ID YouTube", ref };
      }
    }
  }

  // 2. Estrategia secundaria: Título y Artista normalizados (ambos deben coincidir)
  const rawTitle = song.title || song.Title || "";
  let rawArtist = song.uploader || song.Uploader || "";

  // Si no hay artista explícito pero el nombre tiene ' - ', extraer ambas partes
  if (!rawArtist && rawTitle.includes(" - ")) {
    const parts = rawTitle.split(" - ");
    rawArtist = parts[0].trim();
  }

  const normSongTitle = normalizeMexrefTitle(rawTitle);
  const normSongArtist = cleanArtist(rawArtist);

  // Evitar falsos positivos: si no hay artista o es desconocido, no excluir a ciegas solo por título
  if (!normSongTitle || !normSongArtist || normSongArtist === "desconocido" || normSongArtist === "n a") {
    return { match: false, ambiguous: true };
  }

  for (const ref of mexrefTracks) {
    const normRefTitle = normalizeMexrefTitle(ref.title);
    if (!normRefTitle) continue;

    // Verificar si los títulos coinciden de manera segura
    const titleMatch = normSongTitle === normRefTitle ||
      (normSongTitle.length > 5 && normRefTitle.length > 5 && (normSongTitle.includes(normRefTitle) || normRefTitle.includes(normSongTitle)));

    if (titleMatch) {
      const refArtists = (Array.isArray(ref.artists) ? ref.artists : [ref.artists]).map(cleanArtist);
      const artistMatch = refArtists.some((ra) => ra && (ra === normSongArtist || ra.includes(normSongArtist) || normSongArtist.includes(ra)));

      if (artistMatch) {
        return { match: true, reason: "Título y Artista", ref };
      }
    }
  }

  return { match: false };
}

// Generador oficial del documento .mexref
function generateMexrefDocument({ playlistName, source, sourcePlaylistId, tracks }) {
  const uniqueTracks = [];
  const seenIds = new Set();
  const seenTitleArtist = new Set();

  for (const t of tracks) {
    if (t.id && t.source) {
      const key = `${t.source}:${t.id}`;
      if (seenIds.has(key)) continue;
      seenIds.add(key);
    }
    const titleKey = `${normalizeMexrefTitle(t.title)}|${cleanArtist(t.artists ? t.artists[0] : "")}`;
    if (seenTitleArtist.has(titleKey)) continue;
    seenTitleArtist.add(titleKey);

    uniqueTracks.push({
      id: t.id || `mexlify:local:${normalizeMexrefTitle(t.title)}`,
      source: t.source || "mexlify",
      title: t.title,
      artists: Array.isArray(t.artists) ? t.artists : [t.artists || "Desconocido"],
      album: t.album || undefined,
      durationMs: t.durationMs || undefined
    });
  }

  return {
    format: "mexref",
    version: 1,
    app: "Mexlify Music",
    createdAt: new Date().toISOString(),
    export: {
      name: playlistName || "Exportación Mexlify Offline",
      source: source || "Mexlify",
      sourcePlaylistId: sourcePlaylistId || undefined,
      totalTracks: uniqueTracks.length
    },
    tracks: uniqueTracks
  };
}

// ---- Actualización de la sección .mexref y resumen de exclusión ----
function updateMexrefExclusions() {
  const mergedTracks = mergeMexrefTracks(importedMexrefFiles);

  // 1. Actualizar badge de total de referencias
  if (mexrefTotalLoadedBadge) {
    mexrefTotalLoadedBadge.textContent = `${mergedTracks.length} ${mergedTracks.length === 1 ? 'referencia' : 'referencias'} cargadas`;
  }

  // 2. Renderizar lista de chips de archivos importados
  if (mexrefFilesList) {
    if (importedMexrefFiles.size === 0) {
      mexrefFilesList.innerHTML = "";
      mexrefFilesList.classList.add("is-hidden");
    } else {
      mexrefFilesList.innerHTML = "";
      mexrefFilesList.classList.remove("is-hidden");

      for (const [fn, fileObj] of importedMexrefFiles.entries()) {
        const chip = document.createElement("div");
        chip.className = "mexref-file-chip";
        chip.innerHTML = `
          <i class="ph ph-file-code"></i>
          <span class="mexref-chip-name" title="${fileObj.filePath || fn}">${fn}</span>
          <span class="mexref-chip-badge">${fileObj.data.tracks.length} ref</span>
          <button class="mexref-chip-remove-btn" data-filename="${fn}" title="Retirar este archivo">&times;</button>
        `;

        chip.querySelector(".mexref-chip-remove-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          importedMexrefFiles.delete(fn);
          updateMexrefExclusions();
        });

        mexrefFilesList.appendChild(chip);
      }
    }
  }

  // 3. Evaluar coincidencias sobre exportCurrentSongs
  let excludedCount = 0;
  exportCurrentSongs.forEach((song) => {
    const fn = song.Filename || song.filename || "";
    const matchRes = matchSongWithMexref(song, mergedTracks);

    if (matchRes.match) {
      song._mexrefExcluded = true;
      song._mexrefReason = matchRes.reason;
      excludedCount++;
      // Deseleccionar automáticamente para evitar duplicar en el iPod / MP3
      exportSelectedFilenames.delete(fn);
    } else {
      song._mexrefExcluded = false;
      song._mexrefReason = null;
    }
  });

  // 4. Actualizar resumen de exclusión
  const total = exportCurrentSongs.length;
  const remainingCount = total - excludedCount;

  if (mexrefExclusionSummary) {
    if (importedMexrefFiles.size > 0) {
      mexrefExclusionSummary.classList.remove("is-hidden");
      if (mexrefOrigCount) mexrefOrigCount.textContent = total;
      if (mexrefExcludedCount) mexrefExcludedCount.textContent = excludedCount;
      if (mexrefRemainingCount) mexrefRemainingCount.textContent = remainingCount;
    } else {
      mexrefExclusionSummary.classList.add("is-hidden");
    }
  }

  // 5. Refrescar la lista de canciones en pantalla y contadores
  renderExportSongsList(exportModalSearchInput ? exportModalSearchInput.value : "");
  updateExportCounters();
}

// Procesar texto de archivo .mexref importado
function handleLoadedMexrefFile(fileName, content, filePath = "") {
  try {
    const parsed = JSON.parse(content);
    const validDoc = validateMexrefContent(parsed, fileName);
    importedMexrefFiles.set(fileName, {
      fileName,
      filePath: filePath || fileName,
      data: validDoc
    });
    return { success: true, count: validDoc.tracks.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Botón para importar archivos .mexref
if (importMexrefBtn) {
  importMexrefBtn.addEventListener("click", async () => {
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
    try {
      if (window.electronAPI && window.electronAPI.readMexrefFiles) {
        const res = await window.electronAPI.readMexrefFiles();
        if (res.cancelled) return;
        if (res.success && Array.isArray(res.files)) {
          let loadedTotal = 0;
          let errors = [];

          for (const f of res.files) {
            const result = handleLoadedMexrefFile(f.fileName, f.content, f.filePath);
            if (result.success) {
              loadedTotal += result.count;
            } else {
              errors.push(result.error);
            }
          }

          updateMexrefExclusions();

          if (errors.length > 0) {
            Swal.fire({
              icon: "warning",
              title: "Atención al importar",
              html: `Se cargaron referencias con algunas advertencias:<br><br>${errors.join("<br>")}`,
              confirmButtonColor: "#000",
              background: "rgba(255, 255, 255, 0.95)"
            });
          } else if (loadedTotal > 0) {
            new Notify({
              status: "success",
              title: "Referencias importadas",
              text: `Se cargaron ${loadedTotal} pistas desde ${res.files.length} archivo(s) .mexref`,
              effect: "fade"
            });
          }
          return;
        }
      }

      // Fallback a input file estándar si fuera necesario
      if (mexrefFileInput) {
        mexrefFileInput.value = "";
        mexrefFileInput.click();
      }
    } catch (err) {
      console.error("Error al importar .mexref:", err);
      Swal.fire({
        icon: "error",
        title: "Error al importar",
        text: err.message || "No se pudo leer el archivo .mexref seleccionado.",
        confirmButtonColor: "#d33",
        background: "rgba(255, 255, 255, 0.95)"
      });
    }
  });
}

// Input file fallback para .mexref
if (mexrefFileInput) {
  mexrefFileInput.addEventListener("change", async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let loadedTotal = 0;
    let errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const text = await file.text();
        const result = handleLoadedMexrefFile(file.name, text, file.name);
        if (result.success) {
          loadedTotal += result.count;
        } else {
          errors.push(result.error);
        }
      } catch (fErr) {
        errors.push(`Error leyendo "${file.name}": ${fErr.message}`);
      }
    }

    updateMexrefExclusions();

    if (errors.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención al importar",
        html: errors.join("<br>"),
        confirmButtonColor: "#000",
        background: "rgba(255, 255, 255, 0.95)"
      });
    } else if (loadedTotal > 0) {
      new Notify({
        status: "success",
        title: "Referencias importadas",
        text: `Se cargaron ${loadedTotal} pistas desde ${files.length} archivo(s) .mexref`,
        effect: "fade"
      });
    }
  });
}

// ---- Actualizar Contadores de la Ventana ----
function updateExportCounters() {
  const history = new Set(getExportedSongsHistory());
  const total = exportCurrentSongs.length;
  let newCount = 0;
  let oldCount = 0;

  exportCurrentSongs.forEach((song) => {
    const fn = song.Filename || song.filename || "";
    if (history.has(fn)) {
      oldCount++;
    } else {
      newCount++;
    }
  });

  if (exportStatTotal) exportStatTotal.textContent = total;
  if (exportStatNew) exportStatNew.textContent = newCount;
  if (exportStatOld) exportStatOld.textContent = oldCount;
  if (exportStatSelected) exportStatSelected.textContent = exportSelectedFilenames.size;

  if (exportConfirmBtn) {
    const count = exportSelectedFilenames.size;
    exportConfirmBtn.disabled = count === 0;
    exportConfirmBtn.innerHTML = `<i class="ph ph-download-simple"></i> Exportar ${count} ${count === 1 ? "canción" : "canciones"} (.zip)`;
  }
}

// ---- Renderizado de la Lista de Canciones ----
function renderExportSongsList(filterText = "") {
  if (!exportSongsList) return;
  const history = new Set(getExportedSongsHistory());
  const query = filterText.toLowerCase().trim();

  exportSongsList.innerHTML = "";

  const filtered = exportCurrentSongs.filter((song) => {
    if (!query) return true;
    const title = (song.Title || song.title || "").toLowerCase();
    const artist = (song.Uploader || song.uploader || "").toLowerCase();
    const fn = (song.Filename || song.filename || "").toLowerCase();
    return title.includes(query) || artist.includes(query) || fn.includes(query);
  });

  if (filtered.length === 0) {
    exportSongsList.innerHTML = `
      <div style="text-align: center; padding: 28px; color: rgba(255, 255, 255, 0.5); font-size: 0.9rem;">
        No se encontraron canciones que coincidan con la búsqueda.
      </div>
    `;
    return;
  }

  filtered.forEach((song) => {
    const fn = song.Filename || song.filename || "";
    const isExported = history.has(fn);
    const isSelected = exportSelectedFilenames.has(fn);
    const isMexrefExcluded = Boolean(song._mexrefExcluded);

    const row = document.createElement("div");
    row.className = `export-song-row ${isSelected ? "is-selected" : ""} ${isMexrefExcluded ? "is-mexref-excluded" : ""}`;

    const thumb = song.Thumbnail || song.thumbnail || "resources/player.gif";
    const title = song.Title || song.title || fn.replace(/\.mp3$/, "");
    const artist = song.Uploader || song.uploader || "Artista desconocido";

    let tagHtml = "";
    if (isMexrefExcluded) {
      tagHtml = `<span class="export-song-tag tag-mexref-excluded" title="Excluida automáticamente al coincidir en tu archivo .mexref (${song._mexrefReason})"><i class="ph ph-prohibit"></i> Excluida (.mexref)</span>`;
    } else if (isExported) {
      tagHtml = `<span class="export-song-tag tag-old"><i class="ph ph-check"></i> Exportada antes</span>`;
    } else {
      tagHtml = `<span class="export-song-tag tag-new"><i class="ph ph-sparkle"></i> Nueva</span>`;
    }

    row.innerHTML = `
      <input type="checkbox" class="export-song-checkbox" ${isSelected ? "checked" : ""} data-filename="${fn}">
      <img src="${thumb}" alt="Cover" class="export-song-thumb" onerror="this.onerror=null; this.src='resources/player.gif';">
      <div class="export-song-meta">
        <span class="export-song-title" title="${title}">${title}</span>
        <span class="export-song-artist" title="${artist}">${artist}</span>
      </div>
      ${tagHtml}
    `;

    const checkbox = row.querySelector(".export-song-checkbox");

    const toggleSelection = (checked) => {
      if (checked) {
        exportSelectedFilenames.add(fn);
        row.classList.add("is-selected");
      } else {
        exportSelectedFilenames.delete(fn);
        row.classList.remove("is-selected");
      }
      checkbox.checked = checked;
      updateExportCounters();
    };

    checkbox.addEventListener("change", (e) => {
      e.stopPropagation();
      toggleSelection(checkbox.checked);
    });

    row.addEventListener("click", (e) => {
      if (e.target !== checkbox) {
        toggleSelection(!checkbox.checked);
      }
    });

    exportSongsList.appendChild(row);
  });
}

function closeExportModal() {
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }
  if (exportZipModalOverlay) {
    exportZipModalOverlay.classList.add("is-hidden");
  }
}

if (closeExportZipModalBtn) {
  closeExportZipModalBtn.addEventListener("click", closeExportModal);
}
if (exportCancelBtn) {
  exportCancelBtn.addEventListener("click", closeExportModal);
}
if (exportZipModalOverlay) {
  exportZipModalOverlay.addEventListener("click", (e) => {
    if (e.target === exportZipModalOverlay) {
      closeExportModal();
    }
  });
}

if (exportSelectOnlyNewBtn) {
  exportSelectOnlyNewBtn.addEventListener("click", () => {
    const history = new Set(getExportedSongsHistory());
    exportSelectedFilenames.clear();
    exportCurrentSongs.forEach((song) => {
      const fn = song.Filename || song.filename || "";
      if (!history.has(fn) && !song._mexrefExcluded) {
        exportSelectedFilenames.add(fn);
      }
    });
    exportSelectOnlyNewBtn.classList.add("active");
    if (exportSelectAllBtn) exportSelectAllBtn.classList.remove("active");
    if (exportDeselectAllBtn) exportDeselectAllBtn.classList.remove("active");
    renderExportSongsList(exportModalSearchInput ? exportModalSearchInput.value : "");
    updateExportCounters();
  });
}

if (exportSelectAllBtn) {
  exportSelectAllBtn.addEventListener("click", () => {
    exportSelectedFilenames.clear();
    exportCurrentSongs.forEach((song) => {
      const fn = song.Filename || song.filename || "";
      if (fn && !song._mexrefExcluded) exportSelectedFilenames.add(fn);
    });
    exportSelectAllBtn.classList.add("active");
    if (exportSelectOnlyNewBtn) exportSelectOnlyNewBtn.classList.remove("active");
    if (exportDeselectAllBtn) exportDeselectAllBtn.classList.remove("active");
    renderExportSongsList(exportModalSearchInput ? exportModalSearchInput.value : "");
    updateExportCounters();
  });
}

if (exportDeselectAllBtn) {
  exportDeselectAllBtn.addEventListener("click", () => {
    exportSelectedFilenames.clear();
    exportDeselectAllBtn.classList.add("active");
    if (exportSelectOnlyNewBtn) exportSelectOnlyNewBtn.classList.remove("active");
    if (exportSelectAllBtn) exportSelectAllBtn.classList.remove("active");
    renderExportSongsList(exportModalSearchInput ? exportModalSearchInput.value : "");
    updateExportCounters();
  });
}

if (exportResetHistoryBtn) {
  exportResetHistoryBtn.addEventListener("click", () => {
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
    Swal.fire({
      title: "¿Reiniciar historial de exportación?",
      text: "Todas las canciones volverán a marcarse como 'Nuevas'. Ningún archivo de música será eliminado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#888",
      confirmButtonText: "Sí, reiniciar",
      cancelButtonText: "Cancelar",
      background: "rgba(255, 255, 255, 0.95)",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem("mexlify_exported_songs");
        exportSelectedFilenames.clear();
        exportCurrentSongs.forEach((song) => {
          const fn = song.Filename || song.filename || "";
          if (fn && !song._mexrefExcluded) exportSelectedFilenames.add(fn);
        });
        if (exportSelectOnlyNewBtn) exportSelectOnlyNewBtn.classList.add("active");
        renderExportSongsList(exportModalSearchInput ? exportModalSearchInput.value : "");
        updateExportCounters();
      }
    });
  });
}

if (exportModalSearchInput) {
  exportModalSearchInput.addEventListener("input", (e) => {
    renderExportSongsList(e.target.value);
  });
}

// Confirmar exportación con barra de progreso moderna UI/UX y creación de .mexref
if (exportConfirmBtn) {
  exportConfirmBtn.addEventListener("click", async () => {
    if (document.activeElement && typeof document.activeElement.blur === "function") {
      document.activeElement.blur();
    }
    const filenamesToExport = [...exportSelectedFilenames];
    if (filenamesToExport.length === 0) return;

    closeExportModal();

    // Mostrar modal moderno de progreso de exportación
    if (exportProgressModalOverlay) {
      exportProgressModalOverlay.classList.remove("is-hidden");
      if (exportProgressBarFill) exportProgressBarFill.style.width = "0%";
      if (exportProgressCounterText) exportProgressCounterText.textContent = `0 / ${filenamesToExport.length} canciones`;
      if (exportProgressPercentText) exportProgressPercentText.textContent = "0%";
      if (exportProgressSongTitle) exportProgressSongTitle.textContent = "Iniciando proceso...";
      if (exportProgressSongStep) exportProgressSongStep.textContent = "Preparando empaquetado";
    }

    // Configurar listener para actualizar la barra en tiempo real
    if (window.electronAPI && window.electronAPI.onExportProgress) {
      window.electronAPI.onExportProgress((progress) => {
        if (exportProgressBarFill) exportProgressBarFill.style.width = `${progress.percent}%`;
        if (exportProgressPercentText) exportProgressPercentText.textContent = `${progress.percent}%`;
        if (exportProgressCounterText) exportProgressCounterText.textContent = `${progress.current} / ${progress.total} canciones`;
        if (exportProgressSongTitle && progress.songTitle) exportProgressSongTitle.textContent = progress.songTitle;
        if (exportProgressSongStep) {
          if (progress.phase === "embedding") {
            exportProgressSongStep.innerHTML = '<i class="ph ph-sparkle"></i> Incrustando carátula HD y etiquetas ID3v2';
          } else if (progress.phase === "zipping") {
            exportProgressSongStep.innerHTML = '<i class="ph ph-file-zip"></i> Comprimiendo archivo ZIP...';
          } else {
            exportProgressSongStep.innerHTML = '<i class="ph ph-check-circle"></i> Finalizando exportación...';
          }
        }
      });
    }

    try {
      const res = await window.electronAPI.exportDownloadsToZip(filenamesToExport);

      if (window.electronAPI && window.electronAPI.removeExportProgressListener) {
        window.electronAPI.removeExportProgressListener();
      }

      if (exportProgressModalOverlay) {
        exportProgressModalOverlay.classList.add("is-hidden");
      }

      if (res.success) {
        // Guardar las canciones exportadas en el historial para evitar duplicados en el siguiente dump
        saveExportedSongsHistory(filenamesToExport);

        const exportedCount = res.totalExported || filenamesToExport.length;
        const defaultBaseName = res.path
          ? res.path.split(/[/\\]/).pop().replace(/\.zip$/i, "")
          : "mexlify-export";

        // Preguntar al usuario si desea guardar el archivo .mexref de referencias
        Swal.fire({
          icon: "success",
          title: "¡Exportación exitosa!",
          html: `Se empaquetaron <b>${exportedCount}</b> canciones con carátulas HD en:<br><code style="word-break: break-all; font-size: 0.85rem;">${res.path}</code><br><br>¿Deseas guardar un archivo <b>.mexref</b> para guardar estas referencias y poder excluirlas en futuras exportaciones?`,
          showCancelButton: true,
          confirmButtonColor: "#9333ea",
          cancelButtonColor: "#64748b",
          confirmButtonText: '<i class="ph ph-file-code"></i> Guardar .mexref',
          cancelButtonText: 'Ahora no',
          background: "rgba(255, 255, 255, 0.95)",
        }).then(async (choice) => {
          if (choice.isConfirmed) {
            const mexrefDocument = generateMexrefDocument({
              playlistName: defaultBaseName,
              source: "Mexlify Offline",
              tracks: res.exportedTracks || []
            });

            const saveRes = await window.electronAPI.saveMexrefFile({
              defaultName: defaultBaseName,
              content: mexrefDocument
            });

            if (saveRes && saveRes.success) {
              new Notify({
                status: "success",
                title: "Archivo .mexref guardado",
                text: `Guardado en: ${saveRes.path}`,
                effect: "fade",
              });
            } else if (saveRes && saveRes.error) {
              Swal.fire({
                icon: "error",
                title: "Error al guardar .mexref",
                text: saveRes.error,
                confirmButtonColor: "#d33",
                background: "rgba(255, 255, 255, 0.95)"
              });
            }
          }
        });
      } else {
        if (res.error === "Operación cancelada por el usuario") {
          // No mostrar error si el usuario simplemente canceló el diálogo de guardado
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al exportar",
            text: res.error || "Ocurrió un error desconocido al exportar.",
            confirmButtonColor: "#d33",
            confirmButtonText: "Cerrar",
            background: "rgba(255, 255, 255, 0.95)",
          });
        }
      }
    } catch (err) {
      if (window.electronAPI && window.electronAPI.removeExportProgressListener) {
        window.electronAPI.removeExportProgressListener();
      }
      if (exportProgressModalOverlay) {
        exportProgressModalOverlay.classList.add("is-hidden");
      }
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: err.message || "Ocurrió un error inesperado al procesar la exportación.",
        confirmButtonColor: "#d33",
        confirmButtonText: "Cerrar",
        background: "rgba(255, 255, 255, 0.95)",
      });
    }
  });
}

// Abrir modal de exportación al pulsar #exportZipBtn
if (exportZipBtn) {
  exportZipBtn.addEventListener("click", async () => {
    try {
      const downloadedSongs = await window.electronAPI.getDownloaded();
      if (!downloadedSongs || downloadedSongs.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Sin descargas",
          text: "No tienes canciones descargadas para exportar.",
          confirmButtonColor: "#000",
          confirmButtonText: "Entendido",
          background: "rgba(255, 255, 255, 0.95)",
        });
        return;
      }

      exportCurrentSongs = downloadedSongs;
      const history = new Set(getExportedSongsHistory());
      exportSelectedFilenames.clear();

      // Por defecto: pre-seleccionar solo las canciones NUEVAS (no exportadas antes)
      let hasNew = false;
      downloadedSongs.forEach((song) => {
        const fn = song.Filename || song.filename || "";
        if (!history.has(fn)) {
          exportSelectedFilenames.add(fn);
          hasNew = true;
        }
      });

      // Si todas ya fueron exportadas previamente, marcarlas todas por defecto para que no salga en 0
      if (!hasNew) {
        downloadedSongs.forEach((song) => {
          const fn = song.Filename || song.filename || "";
          if (fn) exportSelectedFilenames.add(fn);
        });
        if (exportSelectAllBtn) exportSelectAllBtn.classList.add("active");
        if (exportSelectOnlyNewBtn) exportSelectOnlyNewBtn.classList.remove("active");
      } else {
        if (exportSelectOnlyNewBtn) exportSelectOnlyNewBtn.classList.add("active");
        if (exportSelectAllBtn) exportSelectAllBtn.classList.remove("active");
      }

      if (exportModalSearchInput) exportModalSearchInput.value = "";

      // Aplicar exclusiones si ya había archivos .mexref cargados
      updateMexrefExclusions();

      if (exportZipModalOverlay) {
        exportZipModalOverlay.classList.remove("is-hidden");
      }
    } catch (err) {
      console.error("Error al preparar exportación:", err);
    }
  });
}

// Inicializar configuraciones guardadas
initVolume();
initAccessibilitySettings();
initLastSong();
renderMostPlayedCardCover();

// ======= PLAYLIST: MIS MÁS ESCUCHADAS (SQLite) =======
async function showMostPlayedList() {
  try {
    navigateTo("countryTop");
    if (typeof scrollToTop === "function") scrollToTop(true);

    const container = document.getElementById("country-top-container");
    if (!container) return;

    container.innerHTML = `
      <div class="playlist-detail-topbar" style="margin-bottom: 16px;">
        <button class="backtop-premium" id="btnBackFromMostPlayed" title="Volver a Inicio">
          <i class="ph ph-arrow-left"></i>
          <span>Volver a Inicio</span>
        </button>
      </div>
      <div class="top-chart-hero">
        <img src="resources/player.gif" class="top-chart-hero-cover" id="mostPlayedHeroCover" onerror="this.onerror=null; this.src='resources/player.gif';">
        <div class="top-chart-hero-info">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="vaen-card-tag">Mi Playlist</span>
          </div>
          <h2 style="margin: 0; color: #fff; font-size: 1.5rem; font-weight: 800; font-family: Poppins, sans-serif;">Mis Más Escuchadas</h2>
          <p style="margin: 0; color: rgba(255, 255, 255, 0.65); font-size: 0.9rem;">Lo que más reproduces en Mexlify</p>
        </div>
      </div>
      <div class="search-loading-state" style="padding: 30px; text-align: center; color: rgba(255, 255, 255, 0.7); display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <i class="ph ph-spinner ph-spin" style="font-size: 2rem; color: #ff0090;"></i>
        <span>Cargando tus canciones más escuchadas...</span>
      </div>
      <ul id="mostPlayedSongsList" class="top-chart-songs-list" style="list-style: none; padding: 0; margin: 0;"></ul>
    `;

    document.getElementById("btnBackFromMostPlayed")?.addEventListener("click", () => {
      navigateTo("home");
      if (typeof scrollToTop === "function") scrollToTop(true);
    });

    // 2. Obtener canciones de SQLite
    const songs = await window.electronAPI.getMostPlayedSongs();

    const loadingEl = container.querySelector(".search-loading-state");
    if (loadingEl) loadingEl.remove();

    if (!songs || songs.length === 0) {
      container.innerHTML = `
        <div class="playlist-detail-topbar" style="margin-bottom: 16px;">
          <button class="backtop-premium" id="btnBackFromMostPlayedEmpty" title="Volver a Inicio">
            <i class="ph ph-arrow-left"></i>
            <span>Volver a Inicio</span>
          </button>
        </div>
        <div class="top-chart-hero">
          <img src="resources/player.gif" class="top-chart-hero-cover" onerror="this.onerror=null; this.src='resources/player.gif';">
          <div class="top-chart-hero-info">
            <span class="vaen-card-tag">Mi Playlist</span>
            <h2 style="margin: 0; color: #fff; font-size: 1.5rem; font-weight: 800; font-family: Poppins, sans-serif;">Mis Más Escuchadas</h2>
            <p style="margin: 0; color: rgba(255, 255, 255, 0.65); font-size: 0.9rem;">Tu top personal basado en lo que reproduces en la app</p>
          </div>
        </div>
        <div class="messages-empty-state" style="padding: 48px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; background: rgba(255, 255, 255, 0.02); border-radius: 16px; border: 1px dashed rgba(255, 255, 255, 0.08); margin-top: 10px;">
          <i class="ph ph-music-notes" style="font-size: 3rem; color: #ff0090; opacity: 0.6;"></i>
          <p style="color: #fff; font-family: Poppins, sans-serif; font-size: 1.1rem; font-weight: 600; margin: 0;">Aún no tienes canciones en tu top personal</p>
          <small style="color: rgba(255, 255, 255, 0.6); max-width: 360px; line-height: 1.5;">¡Reproduce tus canciones favoritas en Mexlify para verlas listadas automáticamente aquí!</small>
        </div>
      `;
      document.getElementById("btnBackFromMostPlayedEmpty")?.addEventListener("click", () => {
        navigateTo("home");
        if (typeof scrollToTop === "function") scrollToTop(true);
      });
      return;
    }

    const heroCover = songs[0]?.thumbnail || "resources/player.gif";
    const heroCoverEl = document.getElementById("mostPlayedHeroCover");
    if (heroCoverEl) heroCoverEl.src = heroCover;

    const heroInfo = container.querySelector(".top-chart-hero-info");
    if (heroInfo) {
      heroInfo.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="vaen-card-tag">Mi Playlist</span>
          <span class="stat-badge">${songs.length} canción${songs.length !== 1 ? "es" : ""}</span>
        </div>
        <h2 style="margin: 0; color: #fff; font-size: 1.5rem; font-weight: 800; font-family: Poppins, sans-serif;">Mis Más Escuchadas</h2>
        <p style="margin: 0; color: rgba(255, 255, 255, 0.65); font-size: 0.9rem;">Tus canciones más reproducidas en Mexlify • Ordenadas por frecuencia</p>
        <div class="top-chart-hero-actions">
          <button id="btnPlayAllMostPlayed" class="changeBg" style="padding: 8px 18px; font-weight: 700; margin: 0;">
            <i class="ph-fill ph-play"></i> Reproducir todo
          </button>
          <button id="btnShuffleMostPlayed" class="changeBg" style="padding: 8px 18px; font-weight: 700; margin: 0;">
            <i class="ph ph-shuffle"></i> Mezclar
          </button>
        </div>
      `;
    }

    const ul = document.getElementById("mostPlayedSongsList");
    if (!ul) return;
    ul.innerHTML = "";

    songs.forEach((song, idx) => {
      const li = createSongListItem(song, { rank: idx + 1, playCount: song.playCount });
      const playHandler = async () => {
        queue = songs.map(s => ({
          title: s.title,
          uploader: s.uploader,
          duration: s.duration,
          thumbnail: s.thumbnail,
          filename: s.filename || null,
          url: s.url || null
        }));
        currentIndex = idx;
        saveQueueToStorage();
        renderQueue();
        await playSong(queue[currentIndex], !!queue[currentIndex].filename, currentIndex);
        highlightPlayingSong();
      };

      const origPlayBtn = li.querySelector(".playbtn");
      const origImg = li.querySelector(".play");
      const titleLink = li.querySelector(".song-info b");
      if (origPlayBtn) {
        origPlayBtn.replaceWith(origPlayBtn.cloneNode(true));
        li.querySelector(".playbtn").addEventListener("click", playHandler);
      }
      if (origImg) {
        origImg.replaceWith(origImg.cloneNode(true));
        li.querySelector(".play").addEventListener("click", playHandler);
      }
      if (titleLink) {
        titleLink.style.cursor = "pointer";
        titleLink.addEventListener("click", playHandler);
      }
      ul.appendChild(li);
    });

    container.querySelector("#btnPlayAllMostPlayed")?.addEventListener("click", async () => {
      queue = songs.map(s => ({
        title: s.title,
        uploader: s.uploader,
        duration: s.duration,
        thumbnail: s.thumbnail,
        filename: s.filename || null,
        url: s.url || null
      }));
      currentIndex = 0;
      renderQueue();
      new Notify({
        status: "info",
        title: "Mis Más Escuchadas",
        text: `Reproduciendo ${queue.length} canciones.`,
        effect: "fade",
        autotimeout: 3000
      });
      if (queue.length > 0) {
        await playSong(queue[0], !!queue[0].filename, 0);
        highlightPlayingSong();
      }
    });

    container.querySelector("#btnShuffleMostPlayed")?.addEventListener("click", async () => {
      const shuffled = [...songs].sort(() => Math.random() - 0.5);
      queue = shuffled.map(s => ({
        title: s.title,
        uploader: s.uploader,
        duration: s.duration,
        thumbnail: s.thumbnail,
        filename: s.filename || null,
        url: s.url || null
      }));
      currentIndex = 0;
      renderQueue();
      new Notify({
        status: "info",
        title: "Mis Más Escuchadas (Aleatorio)",
        text: `Reproduciendo ${queue.length} canciones mezcladas.`,
        effect: "fade",
        autotimeout: 3000
      });
      if (queue.length > 0) {
        await playSong(queue[0], !!queue[0].filename, 0);
        highlightPlayingSong();
      }
    });

    highlightPlayingSong();
  } catch (err) {
    console.error("Error al cargar la playlist de más escuchadas:", err);
  }
}

async function playMostPlayedList(autoPlay = true) {
  try {
    const songs = await window.electronAPI.getMostPlayedSongs();
    if (!songs || songs.length === 0) {
      new Notify({
        status: "warning",
        title: "Playlist vacía",
        text: "¡Reproduce canciones en la app para llenar tu playlist!",
        effect: "fade",
      });
      await showMostPlayedList(); // Show empty state
      return;
    }
    
    // Renders the list
    await showMostPlayedList();
    
    // If autoPlay requested, start playing first track immediately
    if (autoPlay) {
      queue = songs.map(s => ({
        title: s.title,
        uploader: s.uploader,
        duration: s.duration,
        thumbnail: s.thumbnail,
        filename: s.filename || null,
        url: s.url || null
      }));
      currentIndex = 0;
      renderQueue();
      new Notify({
        status: "info",
        title: "Mis Más Escuchadas",
        text: `Reproduciendo ${queue.length} canciones.`,
        effect: "fade",
        autotimeout: 3000
      });
      await playSong(queue[0], !!queue[0].filename, 0);
      highlightPlayingSong();
    }
  } catch (err) {
    console.error("Error al reproducir más escuchadas:", err);
  }
}

// Export functions to global scope
window.showMostPlayedList = showMostPlayedList;
window.playMostPlayedList = playMostPlayedList;
window.renderMostPlayedCardCover = renderMostPlayedCardCover;

async function renderMostPlayedCardCover() {
  try {
    const coverContainer = document.getElementById("myMostPlayedCover");
    if (!coverContainer) return;
    
    const songs = await window.electronAPI.getMostPlayedSongs();
    
    if (!songs || songs.length === 0) {
      coverContainer.innerHTML = `<img src="resources/player.gif" class="spotify-cover-single">`;
      return;
    }
    
    const uniqueThumbs = [];
    for (const song of songs) {
      if (song.thumbnail && !uniqueThumbs.includes(song.thumbnail)) {
        uniqueThumbs.push(song.thumbnail);
      }
      if (uniqueThumbs.length === 4) break;
    }
    
    if (uniqueThumbs.length >= 4) {
      coverContainer.innerHTML = `
        <div class="spotify-cover-collage">
          <img src="${uniqueThumbs[0]}" onerror="this.onerror=null; this.src='resources/player.gif';">
          <img src="${uniqueThumbs[1]}" onerror="this.onerror=null; this.src='resources/player.gif';">
          <img src="${uniqueThumbs[2]}" onerror="this.onerror=null; this.src='resources/player.gif';">
          <img src="${uniqueThumbs[3]}" onerror="this.onerror=null; this.src='resources/player.gif';">
        </div>
      `;
    } else {
      const primaryCover = uniqueThumbs[0] || "resources/player.gif";
      coverContainer.innerHTML = `<img src="${primaryCover}" class="spotify-cover-single" onerror="this.onerror=null; this.src='resources/player.gif';">`;
    }
  } catch (err) {
    console.error("Error al renderizar la portada de más escuchadas:", err);
  }
}

// ======= Funciones de Rediseño Premium (Mexlify UI/UX) =======

/**
 * highlightPlayingSong - Busca en todas las listas la canción actualmente reproducida y le añade clases/visualizador.
 * @param {boolean} autoScroll - Si es true, hace scroll hacia la canción activa (solo en reproducción explícita)
 */
function highlightPlayingSong(autoScroll = false) {
  const currentTitle = currentSong ? (currentSong.title || currentSong.Title || "").toLowerCase() : "";
  if (!currentTitle) return;

  const lists = ["#resultsList", "#downloadsList", "#recentsList", "#playlistSongsList", "#topChartSongsList", "#mostPlayedSongsList"];
  lists.forEach((listId) => {
    const list = document.querySelector(listId);
    if (!list) return;
    const items = list.querySelectorAll("li");
    items.forEach((li) => {
      const bTag = li.querySelector(".song-info b");
      if (bTag) {
        const titleText = bTag.textContent.toLowerCase();
        if (titleText === currentTitle) {
          li.classList.add("is-playing");
          if (!li.querySelector(".active-playing-indicator")) {
            const indicator = document.createElement("div");
            indicator.className = "active-playing-indicator";
            indicator.innerHTML = `
              <span class="bar bar1"></span>
              <span class="bar bar2"></span>
              <span class="bar bar3"></span>
              <span class="bar bar4"></span>
            `;
            const infoContainer = li.querySelector(".song-info");
            if (infoContainer) {
              infoContainer.appendChild(indicator);
            }
          }
          // Solo hacer scroll automático si se especificó explícitamente durante la reproducción activa
          if (autoScroll && (listId === "#playlistSongsList" || listId === "#resultsList")) {
            try {
              li.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } catch (_) {}
          }
        } else {
          li.classList.remove("is-playing");
          const indicator = li.querySelector(".active-playing-indicator");
          if (indicator) indicator.remove();
        }
      }
    });
  });
}

// Inicialización de escuchadores interactivos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  // 2. Filtro local para descargas
    // Botones de acción para descargas (Reproducir todo y Mezclar)
  const playAllDownloadedBtn = document.getElementById("playAllDownloadedBtn");
  if (playAllDownloadedBtn) {
    playAllDownloadedBtn.addEventListener("click", async () => {
      const downloaded = await window.electronAPI.getDownloaded();
      if (!downloaded || downloaded.length === 0) return;
      queue = downloaded.map((s) => ({
        title: s.Title || s.title,
        uploader: s.Uploader || s.uploader,
        duration: s.Duration || s.duration,
        filename: s.Filename || s.filename,
        thumbnail: s.Thumbnail || s.thumbnail || "resources/player.gif",
        url: s.Url || s.url || null,
      }));
      currentIndex = 0;
      saveQueueToStorage();
      renderQueue();
      new Notify({
        status: "info",
        title: "Fuera de línea",
        text: `Reproduciendo ${queue.length} canciones descargadas.`,
        effect: "fade",
        autotimeout: 3000
      });
      await playSong(queue[0], true, 0);
      highlightPlayingSong();
    });
  }

  const shuffleDownloadedBtn = document.getElementById("shuffleDownloadedBtn");
  if (shuffleDownloadedBtn) {
    shuffleDownloadedBtn.addEventListener("click", async () => {
      const downloaded = await window.electronAPI.getDownloaded();
      if (!downloaded || downloaded.length === 0) return;
      const shuffled = [...downloaded].sort(() => Math.random() - 0.5);
      queue = shuffled.map((s) => ({
        title: s.Title || s.title,
        uploader: s.Uploader || s.uploader,
        duration: s.Duration || s.duration,
        filename: s.Filename || s.filename,
        thumbnail: s.Thumbnail || s.thumbnail || "resources/player.gif",
        url: s.Url || s.url || null,
      }));
      currentIndex = 0;
      saveQueueToStorage();
      renderQueue();
      new Notify({
        status: "info",
        title: "Fuera de línea (Aleatorio)",
        text: `Reproduciendo ${queue.length} canciones mezcladas.`,
        effect: "fade",
        autotimeout: 3000
      });
      await playSong(queue[0], true, 0);
      highlightPlayingSong();
    });
  }

  const offlineFilterInput = document.getElementById("offlineFilterInput");
  if (offlineFilterInput) {
    offlineFilterInput.addEventListener("input", () => {
      const query = offlineFilterInput.value.toLowerCase().trim();
      const items = downloadsList.querySelectorAll("li");
      items.forEach((item) => {
        const titleElement = item.querySelector(".song-info b");
        const infoElement = item.querySelector(".song-info");
        const titleText = titleElement ? titleElement.textContent.toLowerCase() : "";
        const infoText = infoElement ? infoElement.textContent.toLowerCase() : "";
        
        if (titleText.includes(query) || infoText.includes(query)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  // 3. Botón para limpiar historial de recents
  const clearRecentsBtn = document.getElementById("clearRecentsBtn");
  if (clearRecentsBtn) {
    clearRecentsBtn.addEventListener("click", () => {
      recentSongs = [];
      renderRecents();
      new Notify({
        status: "success",
        title: "Historial Limpiado",
        text: "Se ha vaciado la lista de canciones recientes.",
        effect: "fade",
        autotimeout: 2500
      });
    });
  }

  // 4. Color pickers sincronizados con etiquetas hex
  const color1Input = document.getElementById("color1");
  const color2Input = document.getElementById("color2");
  const color1HexLabel = document.getElementById("color1Hex");
  const color2HexLabel = document.getElementById("color2Hex");

  if (color1Input && color1HexLabel) {
    color1Input.addEventListener("input", () => {
      color1HexLabel.textContent = color1Input.value.toUpperCase();
    });
  }
  if (color2Input && color2HexLabel) {
    color2Input.addEventListener("input", () => {
      color2HexLabel.textContent = color2Input.value.toUpperCase();
    });
  }

  // Comprobar estado de red
  if (!navigator.onLine) {
    setTimeout(() => {
      if (typeof Notify !== 'undefined') {
        new Notify({
          status: "warning",
          title: "Modo Sin Conexión",
          text: "Funciones limitadas. Solo puedes escuchar música descargada.",
          effect: "fade",
          speed: 300,
          showIcon: true,
          showCloseButton: true,
          autoclose: false,
          type: "outline",
          position: "right top"
        });
      } else if (typeof Swal !== 'undefined') {
        Swal.fire('Modo Sin Conexión', 'Funciones limitadas.', 'warning');
      }
    }, 1000);
  }

  window.addEventListener('offline', () => {
    if (typeof Notify !== 'undefined') {
      new Notify({
        status: "warning",
        title: "Conexión Perdida",
        text: "Modo sin conexión activado.",
        effect: "fade",
        position: "right top",
        autoclose: true,
        autotimeout: 5000
      });
    }
  });

  window.addEventListener('online', () => {
    if (typeof Notify !== 'undefined') {
      new Notify({
        status: "success",
        title: "Conexión Restaurada",
        text: "Estás en línea nuevamente.",
        effect: "fade",
        position: "right top",
        autoclose: true,
        autotimeout: 5000
      });
    }
  });
});


