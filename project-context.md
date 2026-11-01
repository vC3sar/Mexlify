This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
.github/
  workflows/
    node.js.yml
assets/
  css/
    modal.css
    style.css
  images/
    my_playlist_bg.png
  js/
    equalizer.js
    lyrics.js
    messages.js
    modal.js
    script.js
    style.js
    topSongs.js
  top_global.jpg
  top_mexico.jpg
resources/
  ahoraseestareproduciendunanuevacancion.mp3
  background.jpeg
  ChatGPT Image 9 sept 2025, 06_38_09 p.m..png
  Logo de Mexlify sobre fondo rojo.png
  logo.png
  logonb.png
  player.gif
services/
  lyricsService.js
  ytdlpResolver.js
tests/
  test_lyrics.js
  test_mexref.js
  test_playlists_queue.js
  variado.csv
.gitignore
fix_slash.js
index.html
logo.png
main.js
package.json
preload.js
readme.md
renderer.js
script copy.js
````

# Files

## File: assets/css/modal.css
````css

````

## File: assets/js/lyrics.js
````javascript
/**
 * Mexlify Music - Synchronized Lyrics Engine (Apple Music Inspired)
 * 
 * - Integración con LRCLIB y caché local/SQLite
 * - Sincronización precisa en tiempo real con player.currentTime
 * - Desplazamiento inteligente que respeta el scroll manual del usuario (con botón "Sincronizar")
 * - Salto directo al pulsar cualquier línea de la canción
 * - Soporte para letras sincronizadas (syncedLyrics), normales (plainLyrics) y estado no disponible
 */
⋮----
// Elementos DOM del panel y controles
⋮----
// Estado del motor de letras
⋮----
let currentLyricsData = null; // { isSynced, lines: [], plainLyrics, notAvailable }
⋮----
// Manejo de scroll suave y anulación por scroll manual (Apple Music style)
⋮----
// Sesión y caché en memoria para descartar respuestas tardías
⋮----
/**
   * Parser de LRC para el navegador con soporte de milisegundos y marcas múltiples
   */
function parseLRC(lrcText)
⋮----
/**
   * Obtiene la identidad de la canción actual desde el reproductor
   */
function getCurrentTrackContext()
⋮----
// Fallbacks al DOM del reproductor si no está en variable global
⋮----
/**
   * Genera clave única para la canción
   */
function makeKey(track)
⋮----
/**
   * Actualiza el contexto visual (carátula, título, artista)
   */
function updateVisualContext(track)
⋮----
/**
   * Abre el panel de letras con animación fluida
   */
function openLyricsPanel()
⋮----
// Resaltar botones de letras
⋮----
// Re-centrar suavemente en la línea activa si ya existían letras
⋮----
/**
   * Cierra el panel de letras
   */
function closeLyricsPanel()
⋮----
/**
   * Alterna apertura y cierre
   */
function toggleLyricsPanel()
⋮----
/**
   * Carga las letras de la canción actual (con caché en memoria y SQLite)
   */
async function loadLyricsForCurrentSong(track, forceRefresh = false)
⋮----
// Si ya está en memoria y no es forzado, mostrar instantáneamente
⋮----
// Si el usuario ya cambió a otra canción mientras cargaba, ignorar respuesta tardía
⋮----
/**
   * Renderiza el estado de carga
   */
function renderLoadingState(msg)
⋮----
/**
   * Renderiza el estado cuando no hay letras disponibles
   */
function renderEmptyState(customMsg)
⋮----
/**
   * Renderiza las letras (sincronizadas o normales)
   */
function renderLyrics(data)
⋮----
// 1. Letras Sincronizadas (Apple Music Style)
⋮----
// Salto directo al pulsar la línea (seeks audio.currentTime)
⋮----
// Centrar de inmediato según la posición actual del audio
⋮----
// 2. Letras Sin Sincronizar (Párrafos limpios y legibles)
⋮----
// Dividir por bloques de párrafos para lectura óptima
⋮----
/**
   * Sincronización precisa con el tiempo de reproducción
   */
function syncLyricsWithTime(currentTime, forceScroll = false)
⋮----
// Búsqueda del índice activo correspondiente a currentTime
⋮----
// Búsqueda binaria para máximo rendimiento
⋮----
// Si la línea activa no ha cambiado, no tocar el DOM
⋮----
// Actualizar clases CSS de forma eficiente
⋮----
// Auto-scroll suave (solo si el usuario no está desplazando manualmente)
⋮----
/**
   * Centra suavemente la línea activa a ~38% de la parte superior del visor (Sweet spot Apple Music)
   */
function centerActiveLine(immediate = false)
⋮----
// Posicionar a 38% de altura para leer cómodamente hacia adelante
⋮----
/**
   * Reanuda el desplazamiento automático (ocultando el botón flotante "Sincronizar")
   */
function resumeAutoScroll()
⋮----
/**
   * Detección de scroll manual del usuario (Apple Music style)
   */
function setupUserScrollDetection()
⋮----
const handleUserScrollInteraction = () =>
⋮----
// Reiniciar temporizador de reposo: 4 segundos de inactividad reanudan el auto-scroll
⋮----
/**
   * Configuración de eventos del reproductor de audio
   */
function setupAudioEvents()
⋮----
// Sincronización en tiempo real
⋮----
// Búsqueda manual de tiempo (seek)
⋮----
// Cambio de canción: detecta nuevo track y actualiza inmediatamente
⋮----
/**
   * Inicialización global de controles y atajos
   */
function init()
⋮----
// Botón en el reproductor lateral (aside)
⋮----
// Botón en el footer compact player
⋮----
// Botón de cerrar (X)
⋮----
// Clic en el fondo / overlay cierra el panel
⋮----
// Botón de reintento en el encabezado
⋮----
// Atajo de teclado: Tecla Escape cierra el panel
⋮----
// Exponer API global para integración con script.js
⋮----
reload: () =>
onSongChange: (newSong) =>
````

## File: assets/js/modal.js
````javascript
function showModal(
  title = "Mexlify",
  message = "Se ha generado un mensaje, sin embargo no se ha especificado el contenido",
  type = "info",
  id = null
)
⋮----
// show terms and conditions on first use
⋮----
// first use accept terms and conditions
function showTermsAndConditions()
````

## File: services/lyricsService.js
````javascript
/**
 * Mexlify Music - Lyrics Service (LRCLIB Integration & SQLite Cache)
 * 
 * - Fuente principal: LRCLIB (gratuito, sin API key)
 * - Prioridad: 1) syncedLyrics -> 2) plainLyrics -> 3) no disponible
 * - Normalización inteligente de título y artista (evita falsos positivos con covers/remixes/en vivo)
 * - Caché persistente en SQLite con distinción entre resultado negativo y error de red
 * - Deduplicación de peticiones en vuelo y gestión de límites HTTP 429
 */
⋮----
const NEGATIVE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días para caché de canciones sin letra
⋮----
// Mapa para deduplicar peticiones en vuelo
⋮----
/**
 * Inicializa la tabla de caché de letras en la base de datos SQLite de Mexlify
 * @param {import("sqlite3").Database} db
 */
function initLyricsTable(db)
⋮----
/**
 * Normaliza cadenas para comparación insensible a mayúsculas, tildes y caracteres especiales
 */
function normalizeText(str)
⋮----
/**
 * Limpieza inteligente de metadatos de canción (YouTube / Spotify / Local)
 */
function cleanSongMetadata(rawTitle, rawArtist)
⋮----
// Detección de variantes antes de limpiar
⋮----
// Si el título viene en formato "Artista - Canción"
⋮----
// Eliminar palabras de video/calidad innecesarias
⋮----
// Limpiar artista
⋮----
/**
 * Genera la clave única de caché SQLite para una canción
 */
function getLyricsCacheKey(title, artist)
⋮----
/**
 * Consulta la caché SQLite
 */
function getCachedLyrics(db, cacheKey)
⋮----
/**
 * Guarda el resultado en la caché SQLite
 */
function saveLyricsToCache(db, cacheKey, data)
⋮----
/**
 * Realiza una petición segura a LRCLIB respetando rate-limits
 */
async function fetchLrclib(url, retryCount = 0)
⋮----
// Manejo de rate limiting con espera progresiva
⋮----
/**
 * Evalúa y puntúa candidatos de búsqueda en LRCLIB para evitar versiones incorrectas
 */
function scoreCandidate(candidate, meta, targetDuration)
⋮----
// 1. Coincidencia de título
⋮----
// Si no coincide el título ni cercanamente, descartar
⋮----
// 2. Coincidencia de artista
⋮----
// 3. Evitar falsos positivos (Live / Remix / Cover / Acústico) si el original no lo es
⋮----
// 4. Comparación de duración (si está disponible)
⋮----
score += 35; // Muy buena coincidencia de tiempo
⋮----
score -= 40; // Probablemente versión extendida o diferente
⋮----
// 5. Prioridad de tipo de letra (synced > plain)
⋮----
score += 30; // Prioridad 1: Sincronizadas
⋮----
score += 10; // Prioridad 2: Sin sincronizar
⋮----
score -= 30; // Sin letra útil
⋮----
/**
 * Busca letras en LRCLIB con estrategia en dos fases:
 * Fase 1: Coincidencia directa (/api/get)
 * Fase 2: Búsqueda y filtrado (/api/search)
 */
async function queryLrclib(meta, duration, album)
⋮----
// Fase 1: Intento directo en /api/get
⋮----
// Fase 2: Búsqueda flexible en /api/search
⋮----
/**
 * Obtiene la letra de una canción con caché persistente SQLite y deduplicación
 * @param {import("sqlite3").Database} db
 * @param {Object} songParams
 * @returns {Promise<Object>}
 */
async function getSongLyrics(db, songParams)
⋮----
// 1. Revisar caché persistente en SQLite
⋮----
// Si era resultado negativo previo
⋮----
// Si la caché negativa ya expiró, dejamos que intente de nuevo
⋮----
// Coincidencia positiva en caché
⋮----
// 2. Deduplicación de peticiones en vuelo (evitar consultas simultáneas duplicadas)
⋮----
// Guardar resultado positivo en SQLite
⋮----
// Si fue error de red o límite 429, NO guardamos caché negativa para permitir reintento
⋮----
// Canción no disponible de forma definitiva en LRCLIB: guardar en caché negativa
⋮----
/**
 * Parser de formato LRC con soporte para múltiples marcas de tiempo por línea y milisegundos
 * @param {string} lrc
 * @returns {Array<{ time: number, text: string }>}
 */
function parseLRC(lrc)
⋮----
// Normalizar a milisegundos (2 o 3 dígitos)
⋮----
// Remover las etiquetas [mm:ss.xx] para obtener el texto lírico limpio
⋮----
// Ordenar cronológicamente
````

## File: tests/test_lyrics.js
````javascript
/**
 * Test Suite: Mexlify Music - Lyrics Engine & LRCLIB System
 */
⋮----
// Test 1: Limpieza de metadatos de YouTube / Spotify
⋮----
// Test 2: Parser de formato LRC
⋮----
// Test 3: Puntuación de candidatos (Score) y prevención de versiones erróneas
⋮----
// Test 4: Prioridad de letras (syncedLyrics > plainLyrics)
⋮----
// Test 5: Clave de caché normalizada
⋮----
// Test 6: Integración con base de datos SQLite en memoria (Caché Positiva y Negativa)
async function runDbTests()
⋮----
// 6.1 Guardar y recuperar canción
⋮----
// 6.2 Segunda llamada: debe responder desde la caché SQLite instantáneamente
⋮----
// 6.3 Canción inexistente: debe registrar en caché negativa para evitar reintentos continuos
````

## File: tests/test_mexref.js
````javascript
function cleanSongTitle(str)
⋮----
function cleanArtist(str)
⋮----
function extractYouTubeId(url)
⋮----
function validateMexrefContent(parsed, filename = 'archivo.mexref')
⋮----
function mergeMexrefTracks(filesMap)
⋮----
function matchSongWithMexref(song, mexrefTracks)
⋮----
// Test 1: Validation
⋮----
// Test 2: Merging & Deduplication across multiple files
⋮----
// Duplicate of Song 1
⋮----
// New song
⋮----
// Test 3: Match by Spotify ID
⋮----
// Test 4: Match by YouTube Video ID
⋮----
// Test 5: Isolation of different platforms (Spotify ID should NOT match YouTube ID)
⋮----
// Test 6: Fallback matching by Normalized Title + Artist
⋮----
// Test 7: Prevent matching by title only
⋮----
// Test 8: Ambiguity handling when artist is unknown
````

## File: tests/test_playlists_queue.js
````javascript
/**
 * Test Suite: Mexlify Music - Playlists Engine & Queue System
 */
⋮----
// Simulación de almacenamiento localStorage para pruebas
⋮----
getItem: (key)
setItem: (key, val)
removeItem: (key)
clear: ()
⋮----
// ==========================================
// MÓDULO DE LÓGICA DE PLAYLISTS & COLA PURA
// ==========================================
class PlaylistQueueManager
⋮----
this.repeatMode = "off"; // "off" | "all" | "one"
⋮----
load()
⋮----
savePlaylists()
⋮----
saveQueue()
⋮----
// --- CRUD Playlists ---
createPlaylist(name)
⋮----
renamePlaylist(id, newName)
⋮----
deletePlaylist(id)
⋮----
addSongToPlaylist(playlistId, song)
⋮----
removeSongFromPlaylist(playlistId, songIndex)
⋮----
reorderPlaylistSong(playlistId, fromIndex, toIndex)
⋮----
moveSongBetweenPlaylists(fromPlId, toPlId, songIndex)
⋮----
// Añadir a destino
⋮----
// Quitar de origen
⋮----
// --- COLA DE REPRODUCCIÓN (QUEUE) ---
addToQueue(song)
⋮----
playPlaylist(playlistId, startIndex = 0)
⋮----
playSongDirect(song)
⋮----
// Si la canción ya está en la cola, ir a su posición
⋮----
// Si ya hay cola activa, insertar justo después de la actual para no borrar la playlist
⋮----
playNext()
⋮----
// Repite la misma
⋮----
// Bucle de toda la cola
⋮----
// Fin de la cola
⋮----
playPrev()
⋮----
removeFromQueue(index)
⋮----
reorderQueue(fromIndex, toIndex)
⋮----
// Reajustar currentIndex para que la canción sonando no cambie
⋮----
toggleShuffle()
⋮----
// Mezclar las canciones que vienen después de la actual
⋮----
// Restaurar orden original si estaba guardado
⋮----
cycleRepeat()
⋮----
clearQueue()
⋮----
// ==========================================
// EJECUCIÓN DE PRUEBAS DE REGRESIÓN
// ==========================================
⋮----
// Test 1: Crear, renombrar y eliminar playlists
⋮----
// Test 2: Agregar, quitar, mover y reordenar canciones en playlist
⋮----
// Prevención de duplicados
⋮----
// Reordenar canciones (Drag & Drop en playlist)
mgr.reorderPlaylistSong(plTarget.id, 2, 0); // Mover Stairway to Heaven a posición 0
⋮----
// Mover canción entre playlists
const plDest = mgr.playlists[0]; // Cumbia
mgr.moveSongBetweenPlaylists(plTarget.id, plDest.id, 1); // Mover Bohemian Rhapsody a Cumbia
⋮----
// Test 3: Persistencia entre sesiones simuladas
⋮----
const mgr2 = new PlaylistQueueManager(); // Nueva instancia simulando reinicio
⋮----
// Test 4: Cola de reproducción (Queue) sin destruir la playlist activa
⋮----
// Reproducir una canción externa: NO debe borrar toda la cola, debe insertarse a continuación
⋮----
// Test 5: Navegación Next / Prev y modos de repetición (off, all, one)
⋮----
const next1 = mgr.playNext(); // Hotel California
⋮----
const nextEnd = mgr.playNext(); // Fin de la cola en modo off
⋮----
// Modo repeat:all (Bucle de la lista)
⋮----
// Modo repeat:one (Bucle de la misma pista)
⋮----
// Test 6: Reordenar y eliminar canciones de la cola activa
⋮----
mgr.currentSong = mgr.queue[1]; // Imagine
// Eliminar un elemento anterior (índice 0)
⋮----
// Eliminar la que está sonando actualmente
⋮----
// Vaciar cola
⋮----
// Test 7: Modo Shuffle sin perder el orden original
⋮----
// Activar Shuffle
⋮----
// Desactivar Shuffle: debe restaurar el orden original
````

## File: tests/variado.csv
````
"URI de la canción","Nombre de la canción","URI(s) del artista","Nombre(s) del artista","URI del álbum","Nombre del álbum","URI(s) del artista del álbum","Nombre(s) del artista del álbum","Fecha de lanzamiento del álbum","URL de la imagen del álbum","Número de disco","Número de la canción","Duración de la canción (ms)","URL de vista previa de la canción","Explícito","Popularidad","ISRC","Añadido por","Añadido en"
"spotify:track:0lYBSQXN6rCTvUZvg9S0lU","Let Me Love You","spotify:artist:540vIaP2JwjQb9dm3aArA4, spotify:artist:1uNFoZAHBGtllmzznpCI3s","DJ Snake, Justin Bieber","spotify:album:02sEJTj1sye1JaqxqpcSCp","Encore","spotify:artist:540vIaP2JwjQb9dm3aArA4","DJ Snake","2016-08-05","https://i.scdn.co/image/ab67616d0000b273212d776c31027c511f0ee3bc","1","13","205946","","false","90","QMZSY1600015","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0myRViRgmQ3J8izICXEAVO","I Thought I Saw Your Face Today","spotify:artist:3CIRif6ZAedT7kZSPvj2A4","She & Him","spotify:album:4eeQtydrFe5HEIgzNkX4S7","Volume One","spotify:artist:3CIRif6ZAedT7kZSPvj2A4","She & Him","2008-03-18","https://i.scdn.co/image/ab67616d0000b273a47c6d8a934b4833c0916cc9","1","5","170333","https://p.scdn.co/mp3-preview/a90ca82468d0612991195e07a87c628d86b3a932?cid=9950ac751e34487dbbe027c4fd7f8e99","false","89","USMRG0832405","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:1eunv1DeEi29UfAcVEoLTt","POR SUS BESOS","spotify:artist:5eumcnUkdmGvkvcsx1WFNG","Tito Double P","spotify:album:4cSbE15ekeLLRncLno6AJI","POR SUS BESOS","spotify:artist:5eumcnUkdmGvkvcsx1WFNG","Tito Double P","2025-07-11","https://i.scdn.co/image/ab67616d0000b2730072b075cd6ba3f7d6944c62","1","1","186142","https://p.scdn.co/mp3-preview/89c9ebb0e0b90febf0c0ca66baefd3ebcdb29120?cid=9950ac751e34487dbbe027c4fd7f8e99","true","77","QMDA62505214","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:5BKKy9fIJL5uM9fz1SnqyP","Chicago","spotify:artist:3fMbdgg4jU18AjLCKBhRSm","Michael Jackson","spotify:album:7pomP86PUhoJpY3fsC0WDQ","XSCAPE","spotify:artist:3fMbdgg4jU18AjLCKBhRSm","Michael Jackson","2014-05-09","https://i.scdn.co/image/ab67616d0000b27335f36cb686b0d5a12ab3a9f0","1","2","245565","https://p.scdn.co/mp3-preview/2e6e2753fa6ff7e93b3f975b1585de80f1148f03?cid=9950ac751e34487dbbe027c4fd7f8e99","false","90","USSM11401745","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:7J1uxwnxfQLu4APicE5Rnj","Billie Jean","spotify:artist:3fMbdgg4jU18AjLCKBhRSm","Michael Jackson","spotify:album:2ANVost0y2y52ema1E9xAZ","Thriller","spotify:artist:3fMbdgg4jU18AjLCKBhRSm","Michael Jackson","1982-11-30","https://i.scdn.co/image/ab67616d0000b27332a7d87248d1b75463483df5","1","6","293802","https://p.scdn.co/mp3-preview/84c7d8302cebe916b8a02392ece9b2c72ce95d34?cid=9950ac751e34487dbbe027c4fd7f8e99","false","93","USSM19902991","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:7hNgSEQ4Ho7kWBA2rKpDd9","Amigos? No.","spotify:artist:3l9G1G9MxH6DaRhwLklaf5, spotify:artist:6pV5zH2LzjOUHaAvENdMMa","Oscar Maydon, Neton Vega","spotify:album:4b2QIGSCXrUQSURm2PnbUT","Amigos? No.","spotify:artist:3l9G1G9MxH6DaRhwLklaf5, spotify:artist:6pV5zH2LzjOUHaAvENdMMa","Oscar Maydon, Neton Vega","2025-03-06","https://i.scdn.co/image/ab67616d0000b2737a03d3effa94ed9aeac7a19f","1","1","226816","https://p.scdn.co/mp3-preview/df8beaf9cb66a026232154772350317c16b9365d?cid=9950ac751e34487dbbe027c4fd7f8e99","true","73","QZ9QQ2500119","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:4tQofG51E0juZBBVr6pral","Tuyo","spotify:artist:0Q8NcsJwoCbZOHHW63su5S","Mora","spotify:album:5r8T7S23cVDSd7a045h4N5","Primer Dia de Clases","spotify:artist:0Q8NcsJwoCbZOHHW63su5S","Mora","2021-02-05","https://i.scdn.co/image/ab67616d0000b27345aae7e257a0026e3909b803","1","3","269714","https://p.scdn.co/mp3-preview/dff149fd07628d9a3ca475fe595733c4aa4d19b7?cid=9950ac751e34487dbbe027c4fd7f8e99","true","80","QM4TW2165659","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:7KbF6AdprOXEEHlsq11Z6d","11 PM","spotify:artist:1r4hJ1h58CWwUQe3MxPuau","Maluma","spotify:album:3YIUNL7qFE8NP3X3zaYSND","11:11","spotify:artist:1r4hJ1h58CWwUQe3MxPuau","Maluma","2019-05-17","https://i.scdn.co/image/ab67616d0000b27390a2bafda8d3147d3ff98502","1","1","175733","https://p.scdn.co/mp3-preview/43b0d49077356133cff8af780690d095aa3734ee?cid=9950ac751e34487dbbe027c4fd7f8e99","false","79","USSD11900166","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2qpacEyFxmbxCpIEqZkqvC","You Are the Right One","spotify:artist:4AGNJdJiVltImYk1UTLE0K","Sports","spotify:album:4QcHsIfSbjgNzZmxqfRP7N","Naked All the Time","spotify:artist:4AGNJdJiVltImYk1UTLE0K","Sports","2015-07-24","https://i.scdn.co/image/ab67616d0000b2731192eb9f894b18f0de2682f1","1","1","172506","https://p.scdn.co/mp3-preview/8dfa0f5fdef3b34a91e7f1f285f493f857829d62?cid=9950ac751e34487dbbe027c4fd7f8e99","false","79","QMAAK1594503","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:4Hkp1TiYqGYhknFwtUsbqd","ME GUSTAS CC","spotify:artist:4cYbf45YbZptNISnhay0xH","ROA","spotify:album:07Rj5RQ0ZRrq11wiajvRv9","Private Suite (Vol. 2)","spotify:artist:4cYbf45YbZptNISnhay0xH","ROA","2024-12-13","https://i.scdn.co/image/ab67616d0000b273b2c0e9901d01c15c4cf8fed6","1","8","173573","","true","33","USUM72414373","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0QhuHgIOqN0JzABAPTemCM","Cuando No Era Cantante","spotify:artist:3S9Hg7sRKhmtWunFZ2yAYP, spotify:artist:1rTUwYS38LkQTlT2fhikch","El Bogueto, Yung Beef","spotify:album:7dsiKYO5M05C9ge1Qoe1fC","Cuando No Era Cantante","spotify:artist:3S9Hg7sRKhmtWunFZ2yAYP, spotify:artist:1rTUwYS38LkQTlT2fhikch","El Bogueto, Yung Beef","2024-12-16","https://i.scdn.co/image/ab67616d0000b273dd65ca2ecff057f960d804d5","1","1","211084","https://p.scdn.co/mp3-preview/ec046d3bb883d8c4c2d013e8ed9e8b9ae2fb8549?cid=9950ac751e34487dbbe027c4fd7f8e99","true","14","AEA3A2366094","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6q8onrzcka32nGVrnWYGBQ","Lovers","spotify:artist:1mSJCvDX0W7Dn7S9C6vmvI","Anna of the North","spotify:album:5kopWecrOCWIxpgpukVfct","Lovers","spotify:artist:1mSJCvDX0W7Dn7S9C6vmvI","Anna of the North","2017-09-08","https://i.scdn.co/image/ab67616d0000b273ee52821d214e70851ac26702","1","3","215773","https://p.scdn.co/mp3-preview/b78142d33132b001ccda9a6db8087c35f20bc491?cid=9950ac751e34487dbbe027c4fd7f8e99","false","72","USLGZ1700007","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3D24ErT1MMmUfXWotSj2A2","ME JALO","spotify:artist:0ys2OFYzWYB5hRDLCsBqxt, spotify:artist:6XkjpgcEsYab502Vr1bBeW","Fuerza Regida, Grupo Frontera","spotify:album:5utxE1ImIDJFXRHf137hoy","MALA MÍA","spotify:artist:0ys2OFYzWYB5hRDLCsBqxt, spotify:artist:6XkjpgcEsYab502Vr1bBeW","Fuerza Regida, Grupo Frontera","2024-12-19","https://i.scdn.co/image/ab67616d0000b27304874856f3c501181d060128","1","1","212002","https://p.scdn.co/mp3-preview/3901558087b2965288ed445ec3788819e3b600eb?cid=9950ac751e34487dbbe027c4fd7f8e99","true","87","QZ9QQ2400744","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:45jM2fuCq0NHD9p7xn0ptd","¿Cual Es Tu Plan?","spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:2OHKEe204spO7G7NcbeO2o, spotify:artist:0AdjzZxHJ4MfbImx2rD0Df, spotify:artist:2ydZrTy8U3kOMOzx20s3dg","Bad Bunny, Ñejo, Pj Sin Suela, DJ Nelson","spotify:album:5tYl7Wcb6TIVB3gs7tuBu8","¿Cual Es Tu Plan?","spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:2OHKEe204spO7G7NcbeO2o, spotify:artist:0AdjzZxHJ4MfbImx2rD0Df","Bad Bunny, Ñejo, Pj Sin Suela","2018-08-17","https://i.scdn.co/image/ab67616d0000b273341b4de2eb74ee18d282df0a","1","1","243700","https://p.scdn.co/mp3-preview/0d54765c6105cceee9a46e3560e4b934723feab6?cid=9950ac751e34487dbbe027c4fd7f8e99","true","72","QM24S1830276","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0sXvAOmXgjR2QUqLK1MltU","La Bicicleta","spotify:artist:4vhNDa5ycK0ST968ek7kRr, spotify:artist:0EmeFodog0BfCgMzAIvKQp","Carlos Vives, Shakira","spotify:album:6bUxh58rYTL67FS8dyTKMN","El Dorado","spotify:artist:0EmeFodog0BfCgMzAIvKQp","Shakira","2017-05-26","https://i.scdn.co/image/ab67616d0000b273eec120f35546507f59f05c41","1","10","228467","https://p.scdn.co/mp3-preview/33256626ff169a0714bfbf747de818c2eca8315e?cid=9950ac751e34487dbbe027c4fd7f8e99","false","70","USSD11600112","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:1EWsVHU4FNAdtN4R8FETag","Push The Feeling On - Mk Dub Revisited Edit","spotify:artist:1gALaWbNDnwS2ECV09sn2A, spotify:artist:1yqxFtPHKcGcv6SXZNdyT9","Nightcrawlers, MK","spotify:album:5JVyNX3e2hGoOttoe7B8QL","Push The Feeling On","spotify:artist:1gALaWbNDnwS2ECV09sn2A","Nightcrawlers","1995","https://i.scdn.co/image/ab67616d0000b2733b1e6a6f5aa7c01b433779fe","1","1","243160","","false","73","GBANY9500081","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:5hcisvFMidkMJlElTO9Qmw","Sensualidad","spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:3MHaV05u0io8fQbZ2XPtlC, spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5, spotify:artist:2T1aUibqR2QC2sINIDQOAK, spotify:artist:64aJYyrXljOodnUG6jvhRD","Bad Bunny, Prince Royce, J Balvin, Mambo Kingz, DJ Luian","spotify:album:287ZdmXv5M5YH5xxdGLhbY","Sensualidad","spotify:artist:0LyfQWJT6nXafLPZqxe9Of","Varios Artistas","2017-11-03","https://i.scdn.co/image/ab67616d0000b273c0ca1263b2966ddff794d3bb","1","1","297485","https://p.scdn.co/mp3-preview/9d45aea39cb2816ed16e18b84ca749f65beae392?cid=9950ac751e34487dbbe027c4fd7f8e99","false","74","QZ7B81700004","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0PhL7aecZxj0wLXIdjmNft","Mr. Saxobeat - Radio Edit","spotify:artist:0BmLNz4nSLfoWYW1cYsElL","Alexandra Stan","spotify:album:5CssLYC0Tw5zjaH6sVLNeZ","Sundown (Original Motion Picture Soundtrack)","spotify:artist:0LyfQWJT6nXafLPZqxe9Of","Varios Artistas","2016-05-06","https://i.scdn.co/image/ab67616d0000b273b9b49e11904a8c231a7ce3a7","1","13","195105","","false","52","ROCRP1002864","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2XHzzp1j4IfTNp1FTn7YFg","Love Me","spotify:artist:55Aa2cqylxrFIXC767Z865, spotify:artist:3TVXtAsR1Inumwj472S9r4, spotify:artist:1RyvyyTE3xzB2ZywiAwp0i","Lil Wayne, Drake, Future","spotify:album:6Pqlfg42Sc3ElNuyt5NUiK","I Am Not A Human Being II (Deluxe)","spotify:artist:55Aa2cqylxrFIXC767Z865","Lil Wayne","2013-01-01","https://i.scdn.co/image/ab67616d0000b27380c64a084164867806ea617a","1","11","255053","","true","88","USCM51300001","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:67jm6nWkkJUsiJ6zedlYng","Canasteo","spotify:artist:6sbrrDwFdWvTLiq8NUykqm, spotify:artist:3l9G1G9MxH6DaRhwLklaf5, spotify:artist:6pV5zH2LzjOUHaAvENdMMa","Régulo Molina, Oscar Maydon, Neton Vega","spotify:album:6cyXOfudBl4rNtTmkrwaj7","Canasteo","spotify:artist:6sbrrDwFdWvTLiq8NUykqm, spotify:artist:3l9G1G9MxH6DaRhwLklaf5, spotify:artist:6pV5zH2LzjOUHaAvENdMMa","Régulo Molina, Oscar Maydon, Neton Vega","2026-01-16","https://i.scdn.co/image/ab67616d0000b273fa1098648e3b35c7b6d2b36a","1","1","270697","https://p.scdn.co/mp3-preview/120c92912f4cc72acff1971861d918291921b159?cid=9950ac751e34487dbbe027c4fd7f8e99","true","79","USA2P2600508","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0UiHc5ZOzGqgUr10MbJiIv","plan","spotify:artist:2rtnKY7iQJHIEBnOd66DCO","Alex Ponce","spotify:album:4JdXxSuPmZMfIdAzmwrQVC","plan v2","spotify:artist:2rtnKY7iQJHIEBnOd66DCO, spotify:artist:1h3ucVy2E3Feh5LGO7agfW","Alex Ponce, Leon Leiden","2023-05-12","https://i.scdn.co/image/ab67616d0000b2731147d7b24e481f261311b03f","1","2","199384","https://p.scdn.co/mp3-preview/3a0794aaab5ec57fba8e5059f00e635113afd518?cid=9950ac751e34487dbbe027c4fd7f8e99","false","38","USA2P2305978","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:4PhsKqMdgMEUSstTDAmMpg","Often","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","The Weeknd","spotify:album:0P3oVJBFOv3TDXlYRhGL7s","Beauty Behind The Madness","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","The Weeknd","2015-08-28","https://i.scdn.co/image/ab67616d0000b2737fcead687e99583072cc217b","1","4","249040","","true","83","USUG11401323","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6DUdDIRgLqCGq1DwkNWQTN","Borro Cassette","spotify:artist:1r4hJ1h58CWwUQe3MxPuau","Maluma","spotify:album:3PomvFR694SrCSZzDWMWV7","Pretty Boy, Dirty Boy","spotify:artist:1r4hJ1h58CWwUQe3MxPuau","Maluma","2015-10-30","https://i.scdn.co/image/ab67616d0000b273c7b78f86d070f52f45ad125f","1","1","207296","https://p.scdn.co/mp3-preview/20c49c1d294c400281716d0d3cdadcfcd95b0b5d?cid=9950ac751e34487dbbe027c4fd7f8e99","false","87","USSD11500124","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:7cioKB5CHVzk09SOtTyn0T","Haunted","spotify:artist:6vWDO969PvNqNYHIOW5v0m","Beyoncé","spotify:album:2UJwKSBUz6rtW4QLK74kQu","BEYONCÉ [Platinum Edition]","spotify:artist:6vWDO969PvNqNYHIOW5v0m","Beyoncé","2014-11-24","https://i.scdn.co/image/ab67616d0000b2730d1d6e9325275f104f8e33f3","1","2","369040","https://p.scdn.co/mp3-preview/d653e747231b00947af7650dab1607e43d93e5c9?cid=9950ac751e34487dbbe027c4fd7f8e99","true","75","USSM11307799","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2xBlRUPXw1qnYA4gurM6ls","La Camisa Negra","spotify:artist:0UWZUmn7sybxMCqrw9tGa7","Juanes","spotify:album:5CxZB33jmFwYq4rrxUmVB1","Las Mejores de Juanes","spotify:artist:0UWZUmn7sybxMCqrw9tGa7","Juanes","2023-05-09","https://i.scdn.co/image/ab67616d0000b2730384733667e5e8d61c11ec14","1","4","216866","","false","40","USUL10400965","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3pevHGhwL0brjFQfPABwns","Verte De Cerca","spotify:artist:1wKDGglKV4FsFS85r2Dmpr","Airbag","spotify:album:2tS4bTMTcGhnQSFp4rmflf","El Club de la Pelea I","spotify:artist:1wKDGglKV4FsFS85r2Dmpr","Airbag","2025-05-28","https://i.scdn.co/image/ab67616d0000b27324e38237536babf15b81483a","1","7","183500","https://p.scdn.co/mp3-preview/eb838eb867e4d37d4f6c414521499d5e84459c1a?cid=9950ac751e34487dbbe027c4fd7f8e99","false","65","UYB282444929","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2ouyMGnaKxz6t4vhxrgzvQ","Oye Mi Amor - 2019 Remasterizado","spotify:artist:7okwEbXzyT2VffBmyQBWLz","Maná","spotify:album:580f6Sd8rODuvhokE00vWa","¿Dónde Jugarán Los Niños? (2019 Remasterizado)","spotify:artist:7okwEbXzyT2VffBmyQBWLz","Maná","1992-03-06","https://i.scdn.co/image/ab67616d0000b2731fd3b2329921896f7999fd84","1","2","273096","https://p.scdn.co/mp3-preview/074e21d60a327650c1a5a2dcbce44a1edfc00f5c?cid=9950ac751e34487dbbe027c4fd7f8e99","false","53","MXF151900129","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0STW8nw4lNN4TEQ8KmNer6","Parte & Choke","spotify:artist:3Y9A8EQQtWU8RStiTlzErv, spotify:artist:1YZcJWydWAbSpknMUKtD9m, spotify:artist:2wnVvfvSkFJbtOinte4sC3","Jombriel, Alex Krack, Jøtta","spotify:album:2rzk1ZW9Lpj3SilWEL31pg","Parte & Choke","spotify:artist:3Y9A8EQQtWU8RStiTlzErv, spotify:artist:1YZcJWydWAbSpknMUKtD9m, spotify:artist:2wnVvfvSkFJbtOinte4sC3","Jombriel, Alex Krack, Jøtta","2024-11-05","https://i.scdn.co/image/ab67616d0000b2731d11aeb3e9ae476d77ff3c20","1","1","205264","https://p.scdn.co/mp3-preview/cce8cf8744797762bf84c702d644af101cc8dcf6?cid=9950ac751e34487dbbe027c4fd7f8e99","false","73","QZW9K2470856","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6PSKhwo0mVcOdjUOhVJd5p","Bailando - Spanish Version","spotify:artist:7qG3b048QCHVRO5Pv1T5lw, spotify:artist:5luyt0SUvGkDMY4ILP6Qhl, spotify:artist:2cy1zPcrFcXAJTP0APWewL","Enrique Iglesias, Descemer Bueno, Gente De Zona","spotify:album:3lIHHrdS4kzUgqvMXgPEKP","SEX AND LOVE","spotify:artist:7qG3b048QCHVRO5Pv1T5lw","Enrique Iglesias","2014-03-14","https://i.scdn.co/image/ab67616d0000b27390b2ea6298a6e5d98e60d6ec","1","3","242920","","false","83","GBUM71400955","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6NfrH0ANGmgBXyxgV2PeXt","La Difícil","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","spotify:album:5lJqux7orBlA1QzyiBGti1","YHLQMDLG","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","2020-02-29","https://i.scdn.co/image/ab67616d0000b273548f7ec52da7313de0c5e4a0","1","2","163084","https://p.scdn.co/mp3-preview/9809bdcf8cdeda1a0569e596214a40026fad16c8?cid=9950ac751e34487dbbe027c4fd7f8e99","true","74","QM4TX2030889","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:35KmOEIUqAGn02t7n4qaIr","Morado","spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5","J Balvin","spotify:album:2mX8ktJoWvyidWBU9U8Jis","Colores","spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5","J Balvin","2020-03-19","https://i.scdn.co/image/ab67616d0000b27335692baca45542527d742d0d","1","5","200266","","false","71","USUM71924691","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0uqt3MShCD4uYCIRNm6d4o","Columbia","spotify:artist:52iwsT98xCoGgiGntTiR7K","Quevedo","spotify:album:7mxdTElQPU15fNSi8X7CFx","Columbia","spotify:artist:52iwsT98xCoGgiGntTiR7K","Quevedo","2023-07-07","https://i.scdn.co/image/ab67616d0000b273a935d458be0651a13d87d612","1","1","186000","https://p.scdn.co/mp3-preview/d6d0374b97e5c077c6c2a29b85f5dbf7ad647d4d?cid=9950ac751e34487dbbe027c4fd7f8e99","false","23","BK4DA2310533","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2sTDlCxmuZCTDKKk9f1qus","WHERE SHE GOES","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","spotify:album:4FftCsAcXXD1nFO9RFUNFO","nadie sabe lo que va a pasar mañana","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","2023-10-13","https://i.scdn.co/image/ab67616d0000b2732ea1f035463d11e1fc3b193d","1","17","231704","https://p.scdn.co/mp3-preview/d13f86369842c076b63e11f67e0a563c55197486?cid=9950ac751e34487dbbe027c4fd7f8e99","true","76","QM6P42352188","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:5fKF6SFeDBmZoUj1TGZLYL","James Crow","spotify:artist:6ZGf9hyQy1jpBZFb7nBWcP","Mobley","spotify:album:2cfRCXC5tkrjKEGptCISnd","Young & Dying In The Occident Supreme","spotify:artist:6ZGf9hyQy1jpBZFb7nBWcP","Mobley","2024-02-09","https://i.scdn.co/image/ab67616d0000b273be09f34cf51e867a22619e7a","1","2","174600","https://p.scdn.co/mp3-preview/092c9fcdc5ced2abe2a29123399e4de31a57cb2c?cid=9950ac751e34487dbbe027c4fd7f8e99","false","25","CAL452063002","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:5IVuqXILoxVWvWEPm82Jxr","Crazy In Love (feat. JAŸ-Z)","spotify:artist:6vWDO969PvNqNYHIOW5v0m, spotify:artist:3nFkdlSjzX9mRTtwJOzDYB","Beyoncé, JAŸ-Z","spotify:album:6oxVabMIqCMJRYN1GqR3Vf","Dangerously In Love","spotify:artist:6vWDO969PvNqNYHIOW5v0m","Beyoncé","2003-06-24","https://i.scdn.co/image/ab67616d0000b27345680a4a57c97894490a01c1","1","1","236133","https://p.scdn.co/mp3-preview/28d167ea8ccdb4740f163bf0cf44df80ad69f980?cid=9950ac751e34487dbbe027c4fd7f8e99","false","81","USSM10305425","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2tTmW7RDtMQtBk7m2rYeSw","Quevedo: Bzrp Music Sessions, Vol. 52/66","spotify:artist:716NhGYqD1jl2wI1Qkgq36, spotify:artist:52iwsT98xCoGgiGntTiR7K","Bizarrap, Quevedo","spotify:album:4PNqWiJAfjj32hVvlchV5u","Quevedo: Bzrp Music Sessions, Vol. 52/66","spotify:artist:716NhGYqD1jl2wI1Qkgq36, spotify:artist:52iwsT98xCoGgiGntTiR7K","Bizarrap, Quevedo","2022-07-06","https://i.scdn.co/image/ab67616d0000b273946f1ea32cc7681e7a86e9ca","1","1","198937","https://p.scdn.co/mp3-preview/05747746b6d13a0a7c9dcea6bdd717f7a32a68ea?cid=9950ac751e34487dbbe027c4fd7f8e99","false","83","UYB282201028","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0VKkyBKCXyR99navhVRqcP","La player (Bandolera)","spotify:artist:21451j1KhjAiaYKflxBjr1","Zion & Lennox","spotify:album:57BGq6lpz8RK1cqr2fPVIi","La player (Bandolera)","spotify:artist:21451j1KhjAiaYKflxBjr1","Zion & Lennox","2018-02-23","https://i.scdn.co/image/ab67616d0000b273300e1b3b6b6904d84e76bb14","1","1","249608","https://p.scdn.co/mp3-preview/e21b298c2a748ffc53c4d7da989e776b2cbab13b?cid=9950ac751e34487dbbe027c4fd7f8e99","false","83","USWL11700273","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:62NeZ2Vtrz5HgtQibleMNs","Diablita (feat. Anuel AA & Baby Rasta)","spotify:artist:2pQAUIesBqfT87PaM1ijtk, spotify:artist:3RtNN1VnooWEn3KQk03DUL, spotify:artist:2R21vXR83lH98kGeO99Y66, spotify:artist:0GgyFUpOyzWDRDqx8FCTDN","Trap Capos, Noriel, Anuel AA, Baby Rasta","spotify:album:74vYzfJqytyzhahNopSwtg","Trap Capos: Season 1","spotify:artist:2pQAUIesBqfT87PaM1ijtk, spotify:artist:3RtNN1VnooWEn3KQk03DUL","Trap Capos, Noriel","2016-10-07","https://i.scdn.co/image/ab67616d0000b27377ecc981b6490db46a2aecae","1","3","213613","https://p.scdn.co/mp3-preview/a62d40443ff7f8d590e4392d04242b317acb28c2?cid=9950ac751e34487dbbe027c4fd7f8e99","true","73","USSD11600151","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:578Eooad7oUyn4stovZiPg","Good For You","spotify:artist:0C8ZW7ezQVs4URX5aX7Kqx, spotify:artist:13ubrt8QOOCPljQ2FL1Kca","Selena Gomez, A$AP Rocky","spotify:album:7lDBDk8OQarV5dBMu3qrdz","Revival (Deluxe)","spotify:artist:0C8ZW7ezQVs4URX5aX7Kqx","Selena Gomez","2015-10-09","https://i.scdn.co/image/ab67616d0000b273e6f5ed9a9059f686965ba90a","1","6","221280","","false","70","USUM71508741","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:748yv6bb3l3CcKS45a6SZ8","Head Over Heels","spotify:artist:4bthk9UfsYUYdcFyqxmSUU","Tears For Fears","spotify:album:2HyJKdwnnaM156kvcPDwr8","Rule The World: The Greatest Hits","spotify:artist:4bthk9UfsYUYdcFyqxmSUU","Tears For Fears","2017-11-10","https://i.scdn.co/image/ab67616d0000b273a9fac36898dc1302b5f642b3","1","7","256146","","false","64","GBF088590112","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:1pjvlYOMIg1NhGQbM6iwrY","Light It Up","spotify:artist:738wLrAtLtCtFOLvQBXOXp, spotify:artist:4VZY0nxYMSNotbS7WjNVQy, spotify:artist:374sWpAJsbZckf98df2jJJ","Major Lazer, Nyla, Fuse ODG","spotify:album:2U0b5MfkMUgzdvRUI69mya","Peace Is The Mission : Extended","spotify:artist:738wLrAtLtCtFOLvQBXOXp","Major Lazer","2015-11-27","https://i.scdn.co/image/ab67616d0000b273ed17a14e09145f2986a42726","1","10","166138","https://p.scdn.co/mp3-preview/d4295fdb8fdce9232e70daf8084cc36d744d6a0b?cid=9950ac751e34487dbbe027c4fd7f8e99","false","77","QMUY41500182","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:75Ci0jUY2QPYZbzBstAqL5","TINIEBLA","spotify:artist:01xT96R53sPUyEf0xXPDLn","Pumpky","spotify:album:1Y8bKYQ2Oxd4VU53bvsofd","TINIEBLA","spotify:artist:01xT96R53sPUyEf0xXPDLn","Pumpky","2026-01-08","https://i.scdn.co/image/ab67616d0000b2736c21f165aa6903ddfad4f8ac","1","1","72150","","false","36","GXD7G2693090","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6y6jbcPG4Yn3Du4moXaenr","idfc","spotify:artist:5WFiezOJkvmDmEWdwij3l4","blackbear","spotify:album:1TkwzY3l4LqAfrQwBAx45Q","deadroses","spotify:artist:5WFiezOJkvmDmEWdwij3l4","blackbear","2015-02-14","https://i.scdn.co/image/ab67616d0000b2739bd9040e92f79ffb58eb9dbd","1","6","245172","https://p.scdn.co/mp3-preview/046d4cfc385964ad6a5ed3dccea6cdd61040e949?cid=9950ac751e34487dbbe027c4fd7f8e99","true","65","TCACB1407069","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:307kaV2BoOC4pRRzwJUJxf","Mil Veces","spotify:artist:7FNnA9vBm6EKceENgCGRMb","Anitta","spotify:album:6BTWoZ4XMhTaLD547Mpc7S","Mil Veces","spotify:artist:7FNnA9vBm6EKceENgCGRMb","Anitta","2023-10-20","https://i.scdn.co/image/ab67616d0000b273e1a34ecaa62279f6226c8589","1","1","154023","","false","58","USUG12307259","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0MGGSLk5473zXpYhEdxHT1","Gabriela","spotify:artist:3c0gDdb9lhnHGFtP4prQpn","KATSEYE","spotify:album:7zDBcYSeMAVESJXnVJnzM4","BEAUTIFUL CHAOS","spotify:artist:3c0gDdb9lhnHGFtP4prQpn","KATSEYE","2025-06-26","https://i.scdn.co/image/ab67616d0000b2739b80360cc75177c9f7cd3990","1","2","197226","","false","51","USUM72503465","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6DXLO8LndZMVOHM0wNbpzg","Danza Kuduro","spotify:artist:33ScadVnbm2X8kkUqOkC6Z, spotify:artist:5bv5RplEOwdCvhq0EILh9E","Don Omar, Lucenzo","spotify:album:3F41BssbVvfFnh6DdDODeO","Meet The Orphans","spotify:artist:33ScadVnbm2X8kkUqOkC6Z","Don Omar","2010-01-01","https://i.scdn.co/image/ab67616d0000b273d4c273fe23a0950d7ac9fce2","1","12","198786","","false","57","USUM71020778","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:25ZAibhr3bdlMCLmubZDVt","QUE PRETENDES","spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5, spotify:artist:4q3ewBCX7sLwd24euuV69X","J Balvin, Bad Bunny","spotify:album:6ylFfzx32ICw4L1A7YWNLN","OASIS","spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5, spotify:artist:4q3ewBCX7sLwd24euuV69X","J Balvin, Bad Bunny","2019-06-28","https://i.scdn.co/image/ab67616d0000b2734891d9b25d8919448388f3bb","1","4","222346","","false","81","USUM71912318","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3JsydWaf2Ev4ehaLUjj3SY","Confident","spotify:artist:1uNFoZAHBGtllmzznpCI3s, spotify:artist:1anyVhU62p31KFi8MEzkbf","Justin Bieber, Chance the Rapper","spotify:album:1rknZw4cyL9NInAqSwc8AA","Journals","spotify:artist:1uNFoZAHBGtllmzznpCI3s","Justin Bieber","2014-05-13","https://i.scdn.co/image/ab67616d0000b27358ae8fddecbd2630005409c9","1","10","248133","","false","89","USUM71319306","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0Imc5xRXd0eV9Ln55M1kz6","More","spotify:artist:1pgDilWYDWLoOgGjf1iHNu, spotify:artist:5lFhCi03HDneWzvCxGctrT, spotify:artist:4DYFVNKZ1uixa6SQTvzQwJ","Zion, Jory Boy, Ken-Y","spotify:album:4TFYUZbcQWhBHPK1aZikSO","La Fórmula","spotify:artist:0LyfQWJT6nXafLPZqxe9Of","Varios Artistas","2012-08-21","https://i.scdn.co/image/ab67616d0000b2734b75a11f3a4272bcd853b2ed","1","5","240733","https://p.scdn.co/mp3-preview/6a4f0d80738c3cc8d63bb32d50f9a46d3236b0e7?cid=9950ac751e34487dbbe027c4fd7f8e99","false","79","USB271200704","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3gE4eQH3K83Sght0ZLvuBK","MIA","spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:3TVXtAsR1Inumwj472S9r4","Bad Bunny, Drake","spotify:album:7CjJb2mikwAWA1V6kewFBF","X 100PRE","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","2018-12-23","https://i.scdn.co/image/ab67616d0000b273519266cd05491a5b5bc22d1e","1","15","210367","https://p.scdn.co/mp3-preview/16d353203889bd30097912a96e2788a097e5e328?cid=9950ac751e34487dbbe027c4fd7f8e99","false","78","USWB11802236","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:4f5Bw7pvjyCW5mEeyyoKve","Ganas","spotify:artist:2t7vyRN71qtQT18frElAnV","Maikel Delacalle","spotify:album:2atbau8pIwRzcTvSUT7TGu","Ganas","spotify:artist:2t7vyRN71qtQT18frElAnV","Maikel Delacalle","2016-01-09","https://i.scdn.co/image/ab67616d0000b2736ebbaf626d0d28eb2469ea58","1","1","237047","https://p.scdn.co/mp3-preview/9707ab17b844e2874f27cc1a5f27c79acfce2f2d?cid=9950ac751e34487dbbe027c4fd7f8e99","false","14","TCACN1645156","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:7sChwC2NZjGc2Kdni3hlDg","Talento","spotify:artist:6TKygPpVT29oGUogu4J9Ec, spotify:artist:1QcutbFtA6u8A2ZFTZuLSL","Yan Block, Panda Black","spotify:album:0OPj1ePYra9uwgebE6HHpU","Talento","spotify:artist:6TKygPpVT29oGUogu4J9Ec, spotify:artist:1QcutbFtA6u8A2ZFTZuLSL","Yan Block, Panda Black","2025-09-18","https://i.scdn.co/image/ab67616d0000b273a858c8f0dbd738907c98fb22","1","1","150857","https://p.scdn.co/mp3-preview/d7bd178e586afa3e451ccda5d9247b35cfb662b0?cid=9950ac751e34487dbbe027c4fd7f8e99","true","81","QMDA72575168","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3nOjFj0WWbsci9foo3o2tk","Sueños","spotify:artist:4UGA0TDpRVVt2SCz8FZOMm, spotify:artist:5njxJJEEXE6Kxkr4yiFeJi","Un Corazón, Kim Richards","spotify:album:6Etivewzt1lcrYkWUAqnd9","Todos A La Mesa","spotify:artist:4UGA0TDpRVVt2SCz8FZOMm","Un Corazón","2021-09-03","https://i.scdn.co/image/ab67616d0000b273d7f78ba9e530313b13d2c82b","1","1","269314","https://p.scdn.co/mp3-preview/ee8667190657e90eeda82a977954966d29539411?cid=9950ac751e34487dbbe027c4fd7f8e99","false","64","USCG62100118","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:5XUKgxwI3WF0qLOdFYbzsK","Labios Rotos - En Vivo Desde México / 2010","spotify:artist:6IdtcAwaNVAggwd6sCKgTI","Zoé","spotify:album:19iPSmKMoGEDaW1CdePOSc","MTV Unplugged Música De Fondo","spotify:artist:6IdtcAwaNVAggwd6sCKgTI","Zoé","2011-01-01","https://i.scdn.co/image/ab67616d0000b27372e3de3eeba9e298a4fd0f27","1","5","243066","","false","50","MXF061100006","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3qhlB30KknSejmIvZZLjOD","End of Beginning","spotify:artist:5p9HO3XC5P3BLxJs5Mtrhm","Djo","spotify:album:4JDXBZdRPId4devseaAOKH","DECIDE","spotify:artist:5p9HO3XC5P3BLxJs5Mtrhm","Djo","2022-09-16","https://i.scdn.co/image/ab67616d0000b273987466cc3363ea26094ca3c4","1","6","159245","https://p.scdn.co/mp3-preview/dcebd3075a93171a92cad9b3228c8c4e80ffcd8d?cid=9950ac751e34487dbbe027c4fd7f8e99","false","94","GBKPL2205058","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:44xDy4h27s4ENaC8fKnCoC","Cuando No Era Cantante","spotify:artist:3S9Hg7sRKhmtWunFZ2yAYP, spotify:artist:1rTUwYS38LkQTlT2fhikch","El Bogueto, Yung Beef","spotify:album:4HRbWvdFSp49raypicZyXS","No Hay Loco Que No Corone","spotify:artist:3S9Hg7sRKhmtWunFZ2yAYP","El Bogueto","2024-09-26","https://i.scdn.co/image/ab67616d0000b27315110c9ad66e065592cc3496","1","19","211084","https://p.scdn.co/mp3-preview/ec046d3bb883d8c4c2d013e8ed9e8b9ae2fb8549?cid=9950ac751e34487dbbe027c4fd7f8e99","true","13","AEA3A2366094","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:5EJ2THuhAapEIeQOtXUQ0x","Oye Mi Amor","spotify:artist:7okwEbXzyT2VffBmyQBWLz","Maná","spotify:album:2G0I22upYkTLYxfoAHiwBK","¿Dónde Jugarán Los Niños?","spotify:artist:7okwEbXzyT2VffBmyQBWLz","Maná","1992","https://i.scdn.co/image/ab67616d0000b27363f3b7f5abf86ad483b57b77","1","2","263306","https://p.scdn.co/mp3-preview/cef458b685e1f3e88950633e25b947ccd4b3d30e?cid=9950ac751e34487dbbe027c4fd7f8e99","false","85","MXF159200061","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:129lYDVKnWtlJc2PZJviuA","A Dios Le Pido","spotify:artist:0UWZUmn7sybxMCqrw9tGa7","Juanes","spotify:album:2UJCnSqpR3AIuTvWYZLCp1","Un Día Normal","spotify:artist:0UWZUmn7sybxMCqrw9tGa7","Juanes","2002-01-01","https://i.scdn.co/image/ab67616d0000b27323a1613112c1ecf946f51177","1","1","205373","","false","77","USUL10200158","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0wkdwCzRl2exob3l0g5ul2","Amárrame","spotify:artist:4boI7bJtmB1L3b1cuL75Zr, spotify:artist:0UWZUmn7sybxMCqrw9tGa7","Mon Laferte, Juanes","spotify:album:4heSwh4OgqS8CX2D4v7vnz","La Trenza (Deluxe)","spotify:artist:4boI7bJtmB1L3b1cuL75Zr","Mon Laferte","2017-11-10","https://i.scdn.co/image/ab67616d0000b2736c303804ba7fe053607fe8c6","1","5","207333","","false","38","MXUM71602718","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2EM9zpAc7PVeoAydmbfVIL","La Camisa Negra","spotify:artist:0UWZUmn7sybxMCqrw9tGa7","Juanes","spotify:album:2HbvQeJXke68tjwOcsj8ne","Mi Sangre","spotify:artist:0UWZUmn7sybxMCqrw9tGa7","Juanes","2004-01-01","https://i.scdn.co/image/ab67616d0000b273c091c40987e92a9256d2f210","1","4","216706","","false","77","USUL10400965","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:4WFgvKVfEhb3IUAFGrutTR","Love Me Not","spotify:artist:5RTLRtXjbXI2lSXc6jxlAz","Ravyn Lenae","spotify:album:1uE3dRPe3SrGdNhd1nWlSa","Bird's Eye","spotify:artist:5RTLRtXjbXI2lSXc6jxlAz","Ravyn Lenae","2024-08-09","https://i.scdn.co/image/ab67616d0000b2730e62daaea2c7b94053e1c142","1","7","213466","https://p.scdn.co/mp3-preview/c660e524e84990f7687728af3ba09f9e071e585d?cid=9950ac751e34487dbbe027c4fd7f8e99","false","91","USAT22401137","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2mdrVnxEnPR6iFijakkxQS","QLOO*","spotify:artist:0Yg29FX1M4ayqjXs0ttZFq, spotify:artist:3g9MKjIP9xrMTY5Pbwr6Nk","Young Cister, Kreamly","spotify:album:2GgT2TLwb9WzzYcUuspH5L","QLOO*","spotify:artist:0Yg29FX1M4ayqjXs0ttZFq, spotify:artist:3g9MKjIP9xrMTY5Pbwr6Nk","Young Cister, Kreamly","2025-05-22","https://i.scdn.co/image/ab67616d0000b27313189b29e3f97c1e7442508e","1","1","146460","https://p.scdn.co/mp3-preview/47f1996f51f1c03cdbd4b00dcdec83ca27082659?cid=9950ac751e34487dbbe027c4fd7f8e99","false","78","CLPP22500021","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3qdeRGn9erK9sjs1kUtBys","CHAVALITAS","spotify:artist:0ys2OFYzWYB5hRDLCsBqxt","Fuerza Regida","spotify:album:1JpJzuM4uncCfCimVozkmy","111XPANTIA","spotify:artist:0ys2OFYzWYB5hRDLCsBqxt","Fuerza Regida","2025-05-02","https://i.scdn.co/image/ab67616d0000b273a2e90fbdec84b25e46573469","1","5","164482","https://p.scdn.co/mp3-preview/efaa33afb5a114055d9bf302a12dcd2d373ba100?cid=9950ac751e34487dbbe027c4fd7f8e99","true","82","QZ9QQ2500155","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0PA6wI9DZ0bWMaSpXyTrAW","PUES QUE LE HAGO ?","spotify:artist:5c8ZR64evQ00Spl73s76fo","Chuyin","spotify:album:0gnl1AOeHUQwaqVexifCGT","PUES QUE LE HAGO ?","spotify:artist:5c8ZR64evQ00Spl73s76fo","Chuyin","2025-07-04","https://i.scdn.co/image/ab67616d0000b273d0b6ce1fd34e7c4969f5c0c2","1","1","141607","https://p.scdn.co/mp3-preview/b97444f7e1fc8cbc9bf4939f347dd3b884947a20?cid=9950ac751e34487dbbe027c4fd7f8e99","true","73","QT4HX2500074","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:71wFwRo8xGc4lrcyKwsvba","Callaita","spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:0GM7qgcRCORpGnfcN2tCiB","Bad Bunny, Tainy","spotify:album:3RQQmkQEvNCY4prGKE6oc5","Un Verano Sin Ti","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","2022-05-06","https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72","1","23","250533","https://p.scdn.co/mp3-preview/83b943b589f8fc441a1e7696c241d9199367547e?cid=9950ac751e34487dbbe027c4fd7f8e99","true","81","QM6N21919851","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6UtWwuheJr5LLDeVypPNx7","EXCESOS","spotify:artist:0ys2OFYzWYB5hRDLCsBqxt","Fuerza Regida","spotify:album:3zu0hJJew2qXZNlselIQk8","Pa las Baby's Y Belikeada","spotify:artist:0ys2OFYzWYB5hRDLCsBqxt","Fuerza Regida","2023-10-20","https://i.scdn.co/image/ab67616d0000b273ad57982065339f7dc2058efe","1","10","187076","https://p.scdn.co/mp3-preview/1fc9004f675048053a6a7b2e9aa3069a848448b3?cid=9950ac751e34487dbbe027c4fd7f8e99","false","86","QZ9QQ2300776","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:26w9NTiE9NGjW1ZvIOd1So","BOOKER T","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","spotify:album:2d9BCZeAAhiZWPpbX9aPCW","EL ÚLTIMO TOUR DEL MUNDO","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","2020-11-27","https://i.scdn.co/image/ab67616d0000b273005ee342f4eef2cc6e8436ab","1","9","156430","https://p.scdn.co/mp3-preview/996387af6f281d065ca89ef0713dbf1565bb108a?cid=9950ac751e34487dbbe027c4fd7f8e99","true","77","QMFME2066844","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:1lBtesQvkn4IC5RSl8oTaE","Verte De Cerca","spotify:artist:1wKDGglKV4FsFS85r2Dmpr","Airbag","spotify:album:3R4rjFVmhme3gYwdRXTaSD","Verte De Cerca","spotify:artist:1wKDGglKV4FsFS85r2Dmpr","Airbag","2024-12-12","https://i.scdn.co/image/ab67616d0000b273529375eb62089100a9620ba8","1","1","183500","https://p.scdn.co/mp3-preview/2cd57dff68868d7815305e2ebd4a5c94ed1191a0?cid=9950ac751e34487dbbe027c4fd7f8e99","false","67","UYB282444929","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0DMJz677XfXiiruhIELu2e","VITAMINA","spotify:artist:3Y9A8EQQtWU8RStiTlzErv, spotify:artist:6ndLrsgT3MV5CNxIrW71fw, spotify:artist:2wnVvfvSkFJbtOinte4sC3","Jombriel, DFZM, Jøtta","spotify:album:6jf5qinEHzsxyBQgvrW916","VITAMINA","spotify:artist:3Y9A8EQQtWU8RStiTlzErv, spotify:artist:6ndLrsgT3MV5CNxIrW71fw, spotify:artist:2wnVvfvSkFJbtOinte4sC3","Jombriel, DFZM, Jøtta","2025-02-27","https://i.scdn.co/image/ab67616d0000b2734b11635cbdec6917dd2c58b1","1","1","208743","https://p.scdn.co/mp3-preview/82c6daf29bd3d4f3430cc4d6063fcda8d9cd862b?cid=9950ac751e34487dbbe027c4fd7f8e99","false","77","USWL12500632","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2lCkncy6bIB0LTMT7kvrD1","Azul","spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5","J Balvin","spotify:album:2mX8ktJoWvyidWBU9U8Jis","Colores","spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5","J Balvin","2020-03-19","https://i.scdn.co/image/ab67616d0000b27335692baca45542527d742d0d","1","2","205933","","false","79","USUM72001731","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0Sr7ssScx54yxdM2ols7nW","Q U E V A S H A C E R H O Y ?","spotify:artist:3E12tRURRvPfHz0hAMCFYc, spotify:artist:54seKvtsZauR1iauN0ptpo","Omar Courtz, De La Rose","spotify:album:3C5uwdRE5QRoXSGPPxpDd4","PRIMERA MUSA","spotify:artist:3E12tRURRvPfHz0hAMCFYc","Omar Courtz","2024-09-20","https://i.scdn.co/image/ab67616d0000b273996764071dbd5240eefb2422","1","15","224022","https://p.scdn.co/mp3-preview/6108826ceba143d45da7ca982dd8b067427d9a14?cid=9950ac751e34487dbbe027c4fd7f8e99","true","84","USNPW2400899","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3sK8wGT43QFpWrvNQsrQya","DtMF","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","spotify:album:5K79FLRUCSysQnVESLcTdb","DeBÍ TiRAR MáS FOToS","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","2025-01-05","https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411","1","16","237117","https://p.scdn.co/mp3-preview/e41ce6b82410d81c08baacca2a7169e5ace4287d?cid=9950ac751e34487dbbe027c4fd7f8e99","true","93","QMFMF2447070","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2lTm559tuIvatlT1u0JYG2","BAILE INoLVIDABLE","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","spotify:album:5K79FLRUCSysQnVESLcTdb","DeBÍ TiRAR MáS FOToS","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","2025-01-05","https://i.scdn.co/image/ab67616d0000b273bbd45c8d36e0e045ef640411","1","3","367725","https://p.scdn.co/mp3-preview/31078ee4e5d1705665fa46d8b68afc297031f54f?cid=9950ac751e34487dbbe027c4fd7f8e99","true","92","QMFMF2447057","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0fea68AdmYNygeTGI4RC18","LA CANCIÓN","spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5, spotify:artist:4q3ewBCX7sLwd24euuV69X","J Balvin, Bad Bunny","spotify:album:6ylFfzx32ICw4L1A7YWNLN","OASIS","spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5, spotify:artist:4q3ewBCX7sLwd24euuV69X","J Balvin, Bad Bunny","2019-06-28","https://i.scdn.co/image/ab67616d0000b2734891d9b25d8919448388f3bb","1","5","242573","","false","88","USUM71911618","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6pnzUCBMwMT5rvx6PyhusZ","Triste","spotify:artist:6w9ToX5slZ4uIdmD17hJ3c, spotify:artist:4q3ewBCX7sLwd24euuV69X","Bryant Myers, Bad Bunny","spotify:album:0F7m8664oTaF5SbaqoDINb","La Oscuridad","spotify:artist:6w9ToX5slZ4uIdmD17hJ3c","Bryant Myers","2018-07-27","https://i.scdn.co/image/ab67616d0000b2732fdd0a9ae1bd6385667cc1e7","1","6","264905","https://p.scdn.co/mp3-preview/b1ff51a5839f8d229001dd262f086f5852bdaccc?cid=9950ac751e34487dbbe027c4fd7f8e99","true","74","USKO11800613","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3BJe4B8zGnqEdQPMvfVjuS","Summertime Sadness","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","spotify:album:5VoeRuTrGhTbKelUfwymwu","Born To Die - The Paradise Edition","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","2012-01-01","https://i.scdn.co/image/ab67616d0000b273ebc8cfac8b586bc475b04918","1","11","265427","","false","86","GBUM71111565","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2mdEsXPu8ZmkHRRtAdC09e","Cinnamon Girl","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","spotify:album:5XpEKORZ4y6OrCZSKsi46A","Norman Fucking Rockwell!","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","2019-08-30","https://i.scdn.co/image/ab67616d0000b273879e9318cb9f4e05ee552ac9","1","7","300683","","false","89","GBUM71903147","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:21qg0IBZf8R12qHd9A3AA4","Salvatore","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","spotify:album:2DpEBrjCur1ythIZ10gJWw","Honeymoon","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","2015-09-18","https://i.scdn.co/image/ab67616d0000b273a3b3f48ca81acacb3ad4ec8a","1","10","281093","","false","84","GBUM71503927","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2YWjW3wwQIBLNhxWKBQd16","Lean On","spotify:artist:738wLrAtLtCtFOLvQBXOXp, spotify:artist:540vIaP2JwjQb9dm3aArA4, spotify:artist:0bdfiayQAKewqEvaU6rXCv","Major Lazer, DJ Snake, MØ","spotify:album:2U0b5MfkMUgzdvRUI69mya","Peace Is The Mission : Extended","spotify:artist:738wLrAtLtCtFOLvQBXOXp","Major Lazer","2015-11-27","https://i.scdn.co/image/ab67616d0000b273ed17a14e09145f2986a42726","1","4","176561","https://p.scdn.co/mp3-preview/5cdeec9f8b351372aa5e9f36f39d03d7bb58cef8?cid=9950ac751e34487dbbe027c4fd7f8e99","false","72","QMUY41500008","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:5DdLSEyKh8zgCrJq2hFj92","Yo sé","spotify:artist:6TKygPpVT29oGUogu4J9Ec, spotify:artist:34PYzJSu4DHKEyhdBfsn0E","Yan Block, TORRRES","spotify:album:4NHI7kUT9UsxlgKgDnaJdv","Yo sé","spotify:artist:6TKygPpVT29oGUogu4J9Ec, spotify:artist:34PYzJSu4DHKEyhdBfsn0E","Yan Block, TORRRES","2024-05-23","https://i.scdn.co/image/ab67616d0000b2730ba9580b90b07d30d5547697","1","1","129705","https://p.scdn.co/mp3-preview/1a93291d085877b48bac43e04c069e4e63096437?cid=9950ac751e34487dbbe027c4fd7f8e99","true","81","QM6N22474397","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:1PPnOTtaxRaY3LWao2HPRU","TU SANCHO","spotify:artist:0ys2OFYzWYB5hRDLCsBqxt","Fuerza Regida","spotify:album:5h9OPxhByc4FaeqeNM6rCT","111XPANTIA (Deluxe)","spotify:artist:0ys2OFYzWYB5hRDLCsBqxt","Fuerza Regida","2025-05-05","https://i.scdn.co/image/ab67616d0000b273e55f248af535c50cbe869288","1","8","177994","https://p.scdn.co/mp3-preview/3915a91ea8b74f916d45b97e013ea1feb6627a27?cid=9950ac751e34487dbbe027c4fd7f8e99","true","65","QZ9QQ2500157","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:7MVIfkyzuUmQ716j8U7yGR","Rara Vez","spotify:artist:19HM5j0ULGSmEoRcrSe5x3, spotify:artist:5szJHKg5xeUlQ9pTqzdpic","Milo j, Taiu","spotify:album:26wRfIX4WqKLKHll9O3KnF","Rara Vez","spotify:artist:19HM5j0ULGSmEoRcrSe5x3, spotify:artist:5szJHKg5xeUlQ9pTqzdpic","Milo j, Taiu","2023-02-08","https://i.scdn.co/image/ab67616d0000b273591c9792502c7e80778de64b","1","1","128677","","false","81","ARUM72300004","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:22mek4IiqubGD9ctzxc69s","How Deep Is Your Love","spotify:artist:7CajNmpbOovFoOoasH2HaY, spotify:artist:5EehXjjMktLuJmbRsM7YfB","Calvin Harris, Disciples","spotify:album:3cG32DOXJoYlOHMmJIaQsm","How Deep Is Your Love","spotify:artist:7CajNmpbOovFoOoasH2HaY, spotify:artist:5EehXjjMktLuJmbRsM7YfB","Calvin Harris, Disciples","2015-07-17","https://i.scdn.co/image/ab67616d0000b27304983fd825ffccc2828f5f5b","1","1","212495","https://p.scdn.co/mp3-preview/608e9972378861ca98ca8ed24d338f39943da073?cid=9950ac751e34487dbbe027c4fd7f8e99","false","79","GBARL1500704","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2ECIwi1a7mfokdDkkJ08Ne","Loca - Remix","spotify:artist:4m6ubhNsdwF4psNf3R8kwR, spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:1bAftSH8umNcGZ0uyV7LMg, spotify:artist:6w3SkAHYPsQ1bxV7VDlG5y","KHEA, Bad Bunny, Duki, Cazzu","spotify:album:5EuK2rW0iPINmt21KPbIUQ","Loca Remix","spotify:artist:4m6ubhNsdwF4psNf3R8kwR, spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:1bAftSH8umNcGZ0uyV7LMg","KHEA, Bad Bunny, Duki","2018-03-16","https://i.scdn.co/image/ab67616d0000b27360a1b828beab034f65ad785b","1","1","346460","https://p.scdn.co/mp3-preview/5f7f2484a64309e423dda93918187b9857ad8bdc?cid=9950ac751e34487dbbe027c4fd7f8e99","true","73","QM24S1804919","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2UW7JaomAMuX9pZrjVpHAU","La Bebe - Remix","spotify:artist:1NNRWkhwmcXRimFYSBpB1y, spotify:artist:12GqGscKJx3aE4t07u7eVZ","Yng Lvcas, Peso Pluma","spotify:album:6aBVGuOUEuX18rHxyDWbti","La Bebe (Remix)","spotify:artist:1NNRWkhwmcXRimFYSBpB1y, spotify:artist:12GqGscKJx3aE4t07u7eVZ","Yng Lvcas, Peso Pluma","2023-03-17","https://i.scdn.co/image/ab67616d0000b273ca5819be231847ef7744f841","1","1","234352","https://p.scdn.co/mp3-preview/b187955ebfefe309d1db25e851470822cba82157?cid=9950ac751e34487dbbe027c4fd7f8e99","true","82","MXF152300159","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6KI1ZpZWYAJLvmVhCJz65G","You Don't Own Me (feat. G-Eazy)","spotify:artist:6y5amJcTjeDgLXIjtQLMst, spotify:artist:02kJSzxNuaWGqwubyUba0Z","SAYGRACE, G-Eazy","spotify:album:2AUhyBQANk5FKHD6WCbxja","FMA","spotify:artist:6y5amJcTjeDgLXIjtQLMst","SAYGRACE","2016-07-01","https://i.scdn.co/image/ab67616d0000b2732da2cda6fe3a9fa9ab49b252","1","5","201489","https://p.scdn.co/mp3-preview/634bf80482bdc2f86733a4d25071c0398ddee44f?cid=9950ac751e34487dbbe027c4fd7f8e99","true","79","USRC11500344","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2ksyzVfU0WJoBpu8otr4pz","METAMORPHOSIS","spotify:artist:5hKGLu4Ik88FzWcTPhWNTN","INTERWORLD","spotify:album:3apQZbgVql9mHJlp43jk5D","METAMORPHOSIS","spotify:artist:5hKGLu4Ik88FzWcTPhWNTN","INTERWORLD","2021-11-25","https://i.scdn.co/image/ab67616d0000b273b852a616ae3a49a1f6b0f16e","1","1","142839","https://p.scdn.co/mp3-preview/61baac6cfee58ae57f9f767a86fa5e99f9797664?cid=9950ac751e34487dbbe027c4fd7f8e99","true","76","QZS642102633","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2rnvFmtBu8L32HcFXgBf9F","La Paso Cabrón (feat. Gigolo y La Exce, Falsetto y Sammy, Mike Duran & Baby Angel)","spotify:artist:2pQAUIesBqfT87PaM1ijtk, spotify:artist:3RtNN1VnooWEn3KQk03DUL, spotify:artist:7lCRuW6BSXGAsxuQV9lR0i, spotify:artist:6AT27ojKlBuZToFIGwQZDc, spotify:artist:24VUJbr0R77uc4by6MgLxU, spotify:artist:0pHyxisI4C5RZxeEZYly0s","Trap Capos, Noriel, Gigolo Y La Exce, Sammy & Falsetto, Mike Duran, Baby Angel","spotify:album:74vYzfJqytyzhahNopSwtg","Trap Capos: Season 1","spotify:artist:2pQAUIesBqfT87PaM1ijtk, spotify:artist:3RtNN1VnooWEn3KQk03DUL","Trap Capos, Noriel","2016-10-07","https://i.scdn.co/image/ab67616d0000b27377ecc981b6490db46a2aecae","1","9","303640","https://p.scdn.co/mp3-preview/760f7672f23f08c1f0c70d17b6d45e7a2f644570?cid=9950ac751e34487dbbe027c4fd7f8e99","true","79","USSD11600238","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:4DPx5423HjiwbHZ7WEBN2t","Those Years Are Over","spotify:artist:374oLUCju3HTjpggU9W31Y","The Sha La Das","spotify:album:5wDxHx4iZf2hXHMfANu6DG","Love in the Wind","spotify:artist:374oLUCju3HTjpggU9W31Y","The Sha La Das","2018-09-21","https://i.scdn.co/image/ab67616d0000b273ff8a3a7c710a30f4ccf2add3","1","6","238280","https://p.scdn.co/mp3-preview/0863c2993e42c5159d6637b134a4d7253f4e1cc1?cid=9950ac751e34487dbbe027c4fd7f8e99","false","78","US4GZ1805306","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6kls8cSlUyHW2BUOkDJIZE","Hate Me (with Juice WRLD)","spotify:artist:0X2BH1fck6amBIoJhDVmmJ, spotify:artist:4MCBfE4596Uoi2O4DtmEMz","Ellie Goulding, Juice WRLD","spotify:album:29FoTD5vBY3Fq1QWhbl3FM","Hate Me (with Juice WRLD)","spotify:artist:0X2BH1fck6amBIoJhDVmmJ, spotify:artist:4MCBfE4596Uoi2O4DtmEMz","Ellie Goulding, Juice WRLD","2019-06-26","https://i.scdn.co/image/ab67616d0000b273dc854e032e8588d5e75eebc6","1","1","186223","","false","71","GBUM71902944","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:4JJ2ilNOmZoFlrElSAb8MM","MAKINE","spotify:artist:1BhLxRoavLY73pYXyMYM8x, spotify:artist:4yURrK9HEczFPGPya2yBu2","Cojo Crazy, Floyd","spotify:album:2iezj9CIx7ml4eGERtdPyO","MAKINE","spotify:artist:1BhLxRoavLY73pYXyMYM8x","Cojo Crazy","2020-11-22","https://i.scdn.co/image/ab67616d0000b273c156b45f124a2fb2c88407ce","1","1","282723","https://p.scdn.co/mp3-preview/9a71a5450dffa2ab9c6fe273439a3bef85bc4e89?cid=9950ac751e34487dbbe027c4fd7f8e99","false","64","QZNWU2012809","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6Qs4SXO9dwPj5GKvVOv8Ki","Dancing With A Stranger (with Normani)","spotify:artist:2wY79sveU1sp5g7SokKOiI, spotify:artist:2cWZOOzeOm4WmBJRnD5R7I","Sam Smith, Normani","spotify:album:1V9oE8bVilClrk5naqyyvL","Dancing With A Stranger (with Normani)","spotify:artist:2wY79sveU1sp5g7SokKOiI, spotify:artist:2cWZOOzeOm4WmBJRnD5R7I","Sam Smith, Normani","2019-01-11","https://i.scdn.co/image/ab67616d0000b2733b52eca47232bedfbb5e9443","1","1","171029","","false","74","GBUM71807386","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3ScaLvfm2RJvLaXETbIYut","La Guerita","spotify:artist:1gW6pz5n1aK249L0GvfQCC","Grupo Marca Registrada","spotify:album:5rlkSYkSIuJQ6Kycoo5pPi","La Guerita","spotify:artist:1gW6pz5n1aK249L0GvfQCC","Grupo Marca Registrada","2024-04-26","https://i.scdn.co/image/ab67616d0000b273d9a5d05010c2d30715e3f25e","1","1","184165","https://p.scdn.co/mp3-preview/296bea1bdadd8a5da855125ba710977e5f453d5f?cid=9950ac751e34487dbbe027c4fd7f8e99","false","73","BK4DA2412746","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2QrGCbW0ylj94JfkgLZFlA","Pa Ti","spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:6w9ToX5slZ4uIdmD17hJ3c","Bad Bunny, Bryant Myers","spotify:album:7t1OLE6jYXpJBRBDhgrG6A","Pa Ti","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","2017-01-02","https://i.scdn.co/image/ab67616d0000b273660c5caa0c4dd308f940aca1","1","1","191294","https://p.scdn.co/mp3-preview/87431e2f0df3bfe606c10fbc7d21d5f3f1b1f6ef?cid=9950ac751e34487dbbe027c4fd7f8e99","true","76","USLZJ1700464","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:7F5oktn5YOsR9eR5YsFtqb","New Year’s Day","spotify:artist:06HL4z0CvFAxyc27GXpf02","Taylor Swift","spotify:album:6DEjYFkNZh67HP7R9PSZvv","reputation","spotify:artist:06HL4z0CvFAxyc27GXpf02","Taylor Swift","2017-11-10","https://i.scdn.co/image/ab67616d0000b273da5d5aeeabacacc1263c0f4b","1","15","235466","","false","69","USCJY1750016","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:0aL5jEWqfIwNDB3tdzyzH4","Cola","spotify:artist:240wlM8vDrf6S4zCyzGj2W, spotify:artist:2vf4pRsEY6LpL5tKmqWb64","CAMELPHAT, Elderbrook","spotify:album:50mIxTR0ErViEATyLXRyni","Cola","spotify:artist:240wlM8vDrf6S4zCyzGj2W, spotify:artist:2vf4pRsEY6LpL5tKmqWb64","CAMELPHAT, Elderbrook","2017-06-17","https://i.scdn.co/image/ab67616d0000b273fd6dd905ddb6816ec0f1ee75","1","1","223869","https://p.scdn.co/mp3-preview/9603c2f084eacf76ccd786b58e4f24309ac8ebf0?cid=9950ac751e34487dbbe027c4fd7f8e99","false","77","GBCPZ1711555","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:3HWWpvOckCUKe1mpWU4juB","Breathe","spotify:artist:22wk9Gi41j7I8N7wiAysXm","W. AVE","spotify:album:5QD4UzkxAnRamtMvEldAGU","House Parties","spotify:artist:22wk9Gi41j7I8N7wiAysXm","W. AVE","2025-10-31","https://i.scdn.co/image/ab67616d0000b273bd3f11dc5054e3ec2ed51f2c","1","7","233090","https://p.scdn.co/mp3-preview/cf25ef6e5a8fdaf3c56abe8d53de06583c84f6e2?cid=9950ac751e34487dbbe027c4fd7f8e99","true","60","QT6EA2531942","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6rY5FAWxCdAGllYEOZMbjW","SLOW DANCING IN THE DARK","spotify:artist:3MZsBdqDrRTJihTHQrO6Dq","Joji","spotify:album:5mIImcsuqpiSXg8XvFr81I","BALLADS 1","spotify:artist:3MZsBdqDrRTJihTHQrO6Dq","Joji","2018-10-26","https://i.scdn.co/image/ab67616d0000b2734cc52cd7a712842234e4fce2","1","2","209273","https://p.scdn.co/mp3-preview/5c6f77f32a2917a103d6deba176930f2c335abd7?cid=9950ac751e34487dbbe027c4fd7f8e99","true","88","ZZOPM1800452","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:5Sb4ZJPj2xIfScofa4Uqtg","What Is Love - 7"" Mix - Remastered 2025","spotify:artist:0Suv0tRrNrUlRzAy8aXjma","Haddaway","spotify:album:7eCobnGTYr0DRJurzl7Lnv","The Album (Remastered 2025)","spotify:artist:0Suv0tRrNrUlRzAy8aXjma","Haddaway","2025-04-04","https://i.scdn.co/image/ab67616d0000b273b6eb4c87f3bbd89cfce44f35","1","1","268990","https://p.scdn.co/mp3-preview/4882221120416879e89f96906d147ca6335076c0?cid=9950ac751e34487dbbe027c4fd7f8e99","false","36","DELV42401319","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:2wgDAPgBhFA7pnIbm0YOhP","Me Mata","spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:2T1aUibqR2QC2sINIDQOAK, spotify:artist:64aJYyrXljOodnUG6jvhRD, spotify:artist:4SsVbpTthjScTS7U2hmr1X, spotify:artist:6P6GTRTigHBp8ZesNtpCKH, spotify:artist:6w9ToX5slZ4uIdmD17hJ3c, spotify:artist:3RtNN1VnooWEn3KQk03DUL, spotify:artist:0GgyFUpOyzWDRDqx8FCTDN, spotify:artist:00XhexlJEXQstHimpZN910","Bad Bunny, Mambo Kingz, DJ Luian, Arcángel, Almighty, Bryant Myers, Noriel, Baby Rasta, Brytiago","spotify:album:711Ewqb91hqv9aKXWPaBTI","Me Mata","spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:2T1aUibqR2QC2sINIDQOAK, spotify:artist:64aJYyrXljOodnUG6jvhRD","Bad Bunny, Mambo Kingz, DJ Luian","2017-04-11","https://i.scdn.co/image/ab67616d0000b273da715f86aef7d0e7d716ef94","1","1","412631","https://p.scdn.co/mp3-preview/08f6aa3e41a3b905bb778e166491feb8d4eceb9d?cid=9950ac751e34487dbbe027c4fd7f8e99","false","76","QZ7B81700001","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:37Z"
"spotify:track:6sGIMrtIzQjdzNndVxe397","So Easy (To Fall In Love)","spotify:artist:00x1fYSGhdqScXBRpSj3DW","Olivia Dean","spotify:album:0l8zYqoUeBYg47Gmevq9HZ","The Art of Loving","spotify:artist:00x1fYSGhdqScXBRpSj3DW","Olivia Dean","2025-09-26","https://i.scdn.co/image/ab67616d0000b2739a336bfb6d40bbd90a507417","1","5","169000","","false","93","GBUM72503087","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:4eWQlBRaTjPPUlzacqEeoQ","Never Be the Same","spotify:artist:4nDoRrQiYLoBzwC5BhVJzF","Camila Cabello","spotify:album:2vD3zSQr8hNlg0obNel4TE","Camila","spotify:artist:4nDoRrQiYLoBzwC5BhVJzF","Camila Cabello","2018-01-12","https://i.scdn.co/image/ab67616d0000b273652c9f55dfbf3cfe1800daea","1","1","226986","https://p.scdn.co/mp3-preview/db947b4c6ddffd4d80cdfa5fd5a8e005fda81c7e?cid=9950ac751e34487dbbe027c4fd7f8e99","false","83","USSM11710323","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:4r9jkMEnArtWGH2rL2FZl0","A Tu Merced","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","spotify:album:5lJqux7orBlA1QzyiBGti1","YHLQMDLG","spotify:artist:4q3ewBCX7sLwd24euuV69X","Bad Bunny","2020-02-29","https://i.scdn.co/image/ab67616d0000b273548f7ec52da7313de0c5e4a0","1","12","175918","https://p.scdn.co/mp3-preview/9872be2c533a2cb1d3b008de6eeae63be63bfd9b?cid=9950ac751e34487dbbe027c4fd7f8e99","false","78","QM4TX2030959","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:1ShRHPAiiIrh0arZbSFmx1","Heavy","spotify:artist:2sSGPbdZJkaSE2AbcGOACx","The Marías","spotify:album:5TkaDC4mYSLBvdG6UrIB0v","CINEMA","spotify:artist:2sSGPbdZJkaSE2AbcGOACx","The Marías","2021-06-25","https://i.scdn.co/image/ab67616d0000b273657d6776f64aa731c8d1748b","1","7","253213","https://p.scdn.co/mp3-preview/506abc0b8872f25532144491c71f6ae17116feeb?cid=9950ac751e34487dbbe027c4fd7f8e99","false","83","USAT22100694","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:2SuziWYkjneRr2V9iMcDY8","Montagem Sexyback - Slowed Down","spotify:artist:5RLeOjVBLjszghnQ29ZdiW, spotify:artist:2HJSiNpktv9DF0gKMQp5PB","POODEE, Noah Leonard","spotify:album:13eBYLJeiuz7eWVFfzFjHG","Montagem Sexyback","spotify:artist:5RLeOjVBLjszghnQ29ZdiW","POODEE","2025-10-13","https://i.scdn.co/image/ab67616d0000b273182236eeaaee58ccb09d51c0","1","2","205235","https://p.scdn.co/mp3-preview/1972f6fd619dd6aa61124056dd50f5813ccc00af?cid=9950ac751e34487dbbe027c4fd7f8e99","false","0","GXHUT2519850","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:4yVO0wOhXsZC1RuPgHP524","Amigos Con Derechos","spotify:artist:0vR2qb8m9WHeZ5ByCbimq2, spotify:artist:1r4hJ1h58CWwUQe3MxPuau","Reik, Maluma","spotify:album:4BvD9caT3ZohqNQFcR8dVD","Ahora","spotify:artist:0vR2qb8m9WHeZ5ByCbimq2","Reik","2019-05-31","https://i.scdn.co/image/ab67616d0000b273fa5655f082592103c81d003a","1","2","227480","https://p.scdn.co/mp3-preview/5c5bc9699af1d70c6d45f1b7345a59dc474eefd8?cid=9950ac751e34487dbbe027c4fd7f8e99","false","75","MXF011800409","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:7ghKr0pCYyPPyp7t1FH8k4","Les","spotify:artist:73sIBHcqh3Z3NyqHKZ7FOL","Childish Gambino","spotify:album:01MRGgNbfWrE291tQjw9ta","Camp","spotify:artist:73sIBHcqh3Z3NyqHKZ7FOL","Childish Gambino","2011-11-15","https://i.scdn.co/image/ab67616d0000b2736182cfe2e2a090d125c81dc0","1","8","317293","https://p.scdn.co/mp3-preview/4ecc9d1562c2626d17aefe7f927e028ab48bfb0b?cid=9950ac751e34487dbbe027c4fd7f8e99","true","89","USYAH1100353","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:0tAX3EBK7aZpvmv0tb7qbE","Headlock","spotify:artist:6Xb4ezwoAQC4516kI89nWz","Imogen Heap","spotify:album:4Is0raRF9P6wWFZjXO6P9K","Speak for Yourself","spotify:artist:6Xb4ezwoAQC4516kI89nWz","Imogen Heap","2005-07-18","https://i.scdn.co/image/ab67616d0000b273568c7a2b3a5528a045320ae2","1","1","215338","https://p.scdn.co/mp3-preview/136e557ae6600e8e43a2a12c95fb9e166055d602?cid=9950ac751e34487dbbe027c4fd7f8e99","false","3","GBJPX0500001","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:5wG3HvLhF6Y5KTGlK0IW3J","Trance (with Travis Scott & Young Thug)","spotify:artist:0iEtIxbK0KxaSlF7G42ZOp, spotify:artist:0Y5tJX1MQlPlqiwlOH1tJY, spotify:artist:50co4Is1HCEo8bhOyUWKpn","Metro Boomin, Travis Scott, Young Thug","spotify:album:7txGsnDSqVMoRl6RQ9XyZP","HEROES & VILLAINS","spotify:artist:0iEtIxbK0KxaSlF7G42ZOp","Metro Boomin","2022-12-02","https://i.scdn.co/image/ab67616d0000b273c4fee55d7b51479627c31f89","1","6","194786","","true","83","USUG12208787","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:57RHMnLMQx8Qz5V6c0E8dF","We Are The People","spotify:artist:67hb7towEyKvt5Z8Bx306c","Empire Of The Sun","spotify:album:1GoqBRUPZzBKvMKZxSQ1mp","Walking On A Dream (Special Edition)","spotify:artist:67hb7towEyKvt5Z8Bx306c","Empire Of The Sun","2009-01-01","https://i.scdn.co/image/ab67616d0000b273fffbc6bb8f405c2dacf8d64b","1","4","267354","","false","50","AUEI10800041","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:0zlAdYVolFsNZrQb1c28BR","Can't Get You out of My Head","spotify:artist:4RVnAU35WRWra6OZ3CbbMA","Kylie Minogue","spotify:album:1zjuWiovPW0Z3faqevG0mg","Hits of the 00s","spotify:artist:0LyfQWJT6nXafLPZqxe9Of","Varios Artistas","2016-03-04","https://i.scdn.co/image/ab67616d0000b273dcd5c93ca6a609d59ac3eed7","1","6","230640","https://p.scdn.co/mp3-preview/5437b83a0d129e3884826ae2df1b775249b76fb2?cid=9950ac751e34487dbbe027c4fd7f8e99","false","42","GBAYE0100913","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:63hHlajVLQnlFMAqSyePxO","Black Beauty","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","spotify:album:1ORxRsK3MrSLvh7VQTF01F","Ultraviolence (Deluxe)","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","2014-01-01","https://i.scdn.co/image/ab67616d0000b2731624590458126fc8b8c64c2f","1","12","314533","","false","74","GBUM71402114","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:2zFF6jG5hQArbzcXz3KUWk","Cool for the Summer","spotify:artist:6S2OmqARrzebs0tKUEyXyp","Demi Lovato","spotify:album:3HV3ecmJJ2GmHM93vVVKXF","Confident (Deluxe Edition)","spotify:artist:6S2OmqARrzebs0tKUEyXyp","Demi Lovato","2015-10-16","https://i.scdn.co/image/ab67616d0000b2734e4f7c7ec167ec30c1c66e69","1","2","214739","","true","63","USHR11536621","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:502iJvcXNph5p8oPqjg0M8","Cuando quieres","spotify:artist:74vaJbyevarSTbReSCVlbO","SinVoz","spotify:album:5lR85ogxhi291P1h5Lpczk","A Destiempo","spotify:artist:74vaJbyevarSTbReSCVlbO","SinVoz","2026-01-15","https://i.scdn.co/image/ab67616d0000b273b13cd3bf5f9deef280e39bf0","1","4","214920","https://p.scdn.co/mp3-preview/59b06cbc85ff002233adfb1a6224275c2f043a24?cid=9950ac751e34487dbbe027c4fd7f8e99","false","56","QZZEB2562146","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:7nknACKxjFp1vVlELzdHp3","Hasta Que Te Conoci","spotify:artist:2MRBDr0crHWE5JwPceFncq","Juan Gabriel","spotify:album:0I23whq0YCOR8Z7eDTZJFv","La Historia Del Divo","spotify:artist:2MRBDr0crHWE5JwPceFncq","Juan Gabriel","2018-01-11","https://i.scdn.co/image/ab67616d0000b2731b5305475f9bc3fed2fd1632","1","15","432920","https://p.scdn.co/mp3-preview/5bdc2199bc04f9f5fa6f3db37cbbade3fc30517f?cid=9950ac751e34487dbbe027c4fd7f8e99","false","39","MXF018700163","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:7bYZBVrnRfqeaPbhRyEvK3","Thrift Shop (feat. Wanz)","spotify:artist:5BcAKTbp20cv7tC5VqPFoC, spotify:artist:3JhNCzhSMTxs9WLGJJxWOY, spotify:artist:4myTppRgh0rojLxx8RycOp, spotify:artist:56xTxG4nQMAs1GW9kvn0uA","Macklemore & Ryan Lewis, Macklemore, Ryan Lewis, Wanz","spotify:album:2pFX16u42q0e5F5vRmmzYT","The Heist (Deluxe Edition)","spotify:artist:5BcAKTbp20cv7tC5VqPFoC, spotify:artist:3JhNCzhSMTxs9WLGJJxWOY, spotify:artist:4myTppRgh0rojLxx8RycOp","Macklemore & Ryan Lewis, Macklemore, Ryan Lewis","2012-10-09","https://i.scdn.co/image/ab67616d0000b273938f1c0cc7d36a671ed226a7","1","3","235613","https://p.scdn.co/mp3-preview/aa64e01779ed8b6d1362bd8bfc170c8a4fa85773?cid=9950ac751e34487dbbe027c4fd7f8e99","true","70","GMM881200003","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:0CokSRCu5hZgPxcZBaEzVE","Glorious (feat. Skylar Grey)","spotify:artist:3JhNCzhSMTxs9WLGJJxWOY, spotify:artist:4utLUGcTvOJFr6aqIJtYWV","Macklemore, Skylar Grey","spotify:album:72qA6s4fjF8Y2VX1UDMfp2","GEMINI","spotify:artist:3JhNCzhSMTxs9WLGJJxWOY","Macklemore","2017-09-22","https://i.scdn.co/image/ab67616d0000b2732e94b668c60b06deb1c3a05c","1","2","220454","https://p.scdn.co/mp3-preview/d5955286b6e230880c24b0b8c8eab30162eaeca7?cid=9950ac751e34487dbbe027c4fd7f8e99","true","79","QZ8TY1700001","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:2pbSCYzxrG0wa6qcj8IyiE","Cuando No Era Cantante - Remix","spotify:artist:3S9Hg7sRKhmtWunFZ2yAYP, spotify:artist:2R21vXR83lH98kGeO99Y66, spotify:artist:0ys2OFYzWYB5hRDLCsBqxt, spotify:artist:1rTUwYS38LkQTlT2fhikch","El Bogueto, Anuel AA, Fuerza Regida, Yung Beef","spotify:album:544ufGb3kucRiYrB93cteJ","Cuando No Era Cantante (Remix)","spotify:artist:3S9Hg7sRKhmtWunFZ2yAYP, spotify:artist:2R21vXR83lH98kGeO99Y66, spotify:artist:0ys2OFYzWYB5hRDLCsBqxt, spotify:artist:1rTUwYS38LkQTlT2fhikch","El Bogueto, Anuel AA, Fuerza Regida, Yung Beef","2025-12-10","https://i.scdn.co/image/ab67616d0000b27376ca2bb969e79a911090df63","1","1","327488","https://p.scdn.co/mp3-preview/b8108103b0259fa95d6071f5cd9d12a0e6bd8482?cid=9950ac751e34487dbbe027c4fd7f8e99","true","78","GXD7V2653123","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:43YYipBo70QDNycKnatKXJ","Como Tú (Magic Music Box)","spotify:artist:4ClsVDy2g7RKSSlvq8cF6d","León Larregui","spotify:album:0UwCZ5d7AFISyHxrpHjbqZ","Solstis - De León Larregui","spotify:artist:4ClsVDy2g7RKSSlvq8cF6d","León Larregui","2012-01-01","https://i.scdn.co/image/ab67616d0000b273f7ab99711c56782832b38504","1","5","193786","","false","61","MXUM72201071","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:3ggtU1ZOKO8ZNiqPNyXGcm","Dinero","spotify:artist:4wP1kxjUsc9IR4Iy2smL7o","Trinidad Cardona","spotify:album:6FfydthOJNOSCM8BeSqKh3","Dinero","spotify:artist:4wP1kxjUsc9IR4Iy2smL7o","Trinidad Cardona","2018-02-02","https://i.scdn.co/image/ab67616d0000b27338c99f64fec0cfebda3bfb6f","1","1","160880","","true","69","USUM71800195","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:6habFhsOp2NvshLv26DqMb","Despacito","spotify:artist:4V8Sr092TqfHkfAA5fXXqG, spotify:artist:4VMYDCV2IEDYJArk749S6m","Luis Fonsi, Daddy Yankee","spotify:album:5C0YLr4OoRGFDaqdMQmkeH","VIDA","spotify:artist:4V8Sr092TqfHkfAA5fXXqG","Luis Fonsi","2019-02-01","https://i.scdn.co/image/ab67616d0000b273ef0d4234e1a645740f77d59c","1","9","229360","","false","84","USUM71607007","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:4WXP5uP1Ugp8aEIVpNRk5g","El Bombón Asesino","spotify:artist:1MI8FuxN4qF0Hr1qmZZLYK","Ninel Conde","spotify:album:2qyTvN94CL82u76kPQxY3l","El Bombon Asesino","spotify:artist:1MI8FuxN4qF0Hr1qmZZLYK","Ninel Conde","2006-01-01","https://i.scdn.co/image/ab67616d0000b273b1a087787d8353dec12058ba","1","3","192546","","false","66","MXF650600018","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:3hcYaOnjlDkDRNPs8HJfGK","I’m Not The Only One (feat. A$AP Rocky)","spotify:artist:2wY79sveU1sp5g7SokKOiI, spotify:artist:13ubrt8QOOCPljQ2FL1Kca","Sam Smith, A$AP Rocky","spotify:album:16HVR99NpuRONFToq3hEET","In The Lonely Hour (10th Anniversary Edition / Deluxe)","spotify:artist:2wY79sveU1sp5g7SokKOiI","Sam Smith","2024-08-30","https://i.scdn.co/image/ab67616d0000b2735e60a64996930d640cf44a42","2","2","223320","","false","37","GBUM71404663","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:1n7omixiROWs5q6xpWiQuL","Satisfaction - Isak Original Extended","spotify:artist:4Ws2otunReOa6BbwxxpCt6, spotify:artist:1jQDgp9Fak4WYVZedWLF4G","Benny Benassi, The Biz","spotify:album:1pjsWAK5eBtJsYGtYDiCER","Hypnotica (Benny Benassi Presents The Biz)","spotify:artist:4Ws2otunReOa6BbwxxpCt6, spotify:artist:1jQDgp9Fak4WYVZedWLF4G","Benny Benassi, The Biz","2003-05-23","https://i.scdn.co/image/ab67616d0000b2731184191625b12259967b7116","1","1","285570","https://p.scdn.co/mp3-preview/ed5cbf923d6dbd63ba159bd2fe9bf58ad6985cc3?cid=9950ac751e34487dbbe027c4fd7f8e99","false","71","IT00D0206401","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:26rdOwwjC2UnweK3xeS58u","GDFR (feat. Sage the Gemini & Lookas)","spotify:artist:0jnsk9HBra6NMjO2oANoPY, spotify:artist:6d47Z08T4snK50HgTEHo5Z, spotify:artist:27fy6rHPC58Eo2VUu0iJSG","Flo Rida, Sage The Gemini, Lookas","spotify:album:5lkNnHVlnCCCV304t89wOH","My House","spotify:artist:0jnsk9HBra6NMjO2oANoPY","Flo Rida","2015-04-07","https://i.scdn.co/image/ab67616d0000b2736ba3d11e51c7df825292307f","1","6","190185","https://p.scdn.co/mp3-preview/6316ccb80845938fad240c7e9d560b997c742544?cid=9950ac751e34487dbbe027c4fd7f8e99","false","75","USAT21404117","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:76hfruVvmfQbw0eYn1nmeC","Cake By The Ocean","spotify:artist:6T5tfhQCknKG4UnH90qGnz","DNCE","spotify:album:3Wv4X8OA65pGpFzBkuUgAh","DNCE","spotify:artist:6T5tfhQCknKG4UnH90qGnz","DNCE","2016-11-18","https://i.scdn.co/image/ab67616d0000b2738d0a75346badc30c8b845be9","1","3","219146","","true","86","USUM71514637","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:0Ext4NdaKAepfsC0G0PxtX","bloodline x pony","spotify:artist:5xhQRvvr6V7zoQn5MPNZfJ, spotify:artist:3A1vU9TZUxn4li5CKliyoq","skyemane, Sapphink","spotify:album:0mXhnLV94yMB7riOjpCujB","bloodline x pony","spotify:artist:5xhQRvvr6V7zoQn5MPNZfJ, spotify:artist:3A1vU9TZUxn4li5CKliyoq","skyemane, Sapphink","2024-01-16","https://i.scdn.co/image/ab67616d0000b273613efc38ad592d823f0049af","1","1","212000","https://p.scdn.co/mp3-preview/b744a608d2d5bd2c43e41d10c4adce465dfa87b0?cid=9950ac751e34487dbbe027c4fd7f8e99","false","39","GX89G2437468","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:6jBoUckd6VEImt6pg8RpDr","Me Mareo","spotify:artist:10VBp06W8NIgMW4JruLCC4, spotify:artist:0FwnPHExlRRxEZPLAi5tmG","Kidd Voodoo, JC Reyes","spotify:album:6DGGDTzn0msZRptzHHcMNE","SATIROLOGÍA (DELUXE EDITION)","spotify:artist:10VBp06W8NIgMW4JruLCC4","Kidd Voodoo","2025-08-07","https://i.scdn.co/image/ab67616d0000b2732389a292d99d5a8dadd09f73","1","7","168209","https://p.scdn.co/mp3-preview/8a4646f2464052d02a24f865a5b4946e1dae14ad?cid=9950ac751e34487dbbe027c4fd7f8e99","true","73","QMDA62579118","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:5aTsxlQlq0vIedDWZoqMWN","Lights - Single Version","spotify:artist:0X2BH1fck6amBIoJhDVmmJ","Ellie Goulding","spotify:album:64Pv36CiG9rBcyvKnud02V","Bright Lights (Lights Re-pack / Bonus Version)","spotify:artist:0X2BH1fck6amBIoJhDVmmJ","Ellie Goulding","2010-01-01","https://i.scdn.co/image/ab67616d0000b273512cd44d21eacbfeda4affe2","1","11","210853","","false","74","GBUM71028043","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:2AW8HXB5U4QA0ZmApbRM0B","Mentirosa","spotify:artist:5oYHL2SijkMY52gKIhYJNb","Elefante","spotify:album:42Fc71rqB9qZAb84q0Hs3U","Elefante","spotify:artist:5oYHL2SijkMY52gKIhYJNb","Elefante","2005","https://i.scdn.co/image/ab67616d0000b273033b8c6b300fb711d4d7b499","1","3","244760","https://p.scdn.co/mp3-preview/8337a7ca5c014716bba4fd492a95066df395df84?cid=9950ac751e34487dbbe027c4fd7f8e99","false","71","MXF140400158","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:2xezpH0r1pT7kcx2TPNsZ0","De la Noche a la Mañana","spotify:artist:5oYHL2SijkMY52gKIhYJNb","Elefante","spotify:album:0fuY5UnmF59L4xKeRSZFbm","El Que Busca Encuentra","spotify:artist:5oYHL2SijkMY52gKIhYJNb","Elefante","2001-10-23","https://i.scdn.co/image/ab67616d0000b273366b39607999ac39405f187e","1","1","260613","https://p.scdn.co/mp3-preview/801bac39a589856c4611950680c6ea437f0756e2?cid=9950ac751e34487dbbe027c4fd7f8e99","false","78","MXF140100129","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T02:40:39Z"
"spotify:track:2bL2gyO6kBdLkNSkxXNh6x","Animals","spotify:artist:04gDigrS5kc9YWfZHwBETP","Maroon 5","spotify:album:2Auw0pTT6EcQdvHNimhLQI","V","spotify:artist:04gDigrS5kc9YWfZHwBETP","Maroon 5","2014-09-02","https://i.scdn.co/image/ab67616d0000b273442b53773d50e1b5369bb16c","1","2","231013","","false","87","USUM71409576","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T16:49:14Z"
"spotify:track:4gbVRS8gloEluzf0GzDOFc","Maps","spotify:artist:04gDigrS5kc9YWfZHwBETP","Maroon 5","spotify:album:2Auw0pTT6EcQdvHNimhLQI","V","spotify:artist:04gDigrS5kc9YWfZHwBETP","Maroon 5","2014-09-02","https://i.scdn.co/image/ab67616d0000b273442b53773d50e1b5369bb16c","1","1","189960","","false","86","USUM71407116","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T16:49:32Z"
"spotify:track:1r299qCKBLgUS9XJ9m1kEx","Moves Like Jagger","spotify:artist:04gDigrS5kc9YWfZHwBETP, spotify:artist:1l7ZsJRRS8wlW3WfJfPfNS","Maroon 5, Christina Aguilera","spotify:album:5NdkVAsSvgUfe3cD8LwSTD","Singles","spotify:artist:04gDigrS5kc9YWfZHwBETP","Maroon 5","2015-09-25","https://i.scdn.co/image/ab67616d0000b273c5e1cecaedcd413599e4e866","1","5","202640","","false","72","USUM71109132","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T16:49:40Z"
"spotify:track:69uxyAqqPIsUyTO8txoP2M","Adventure of a Lifetime","spotify:artist:4gzpq5DPGxSnKTe4SA8HAU","Coldplay","spotify:album:3cfAM8b8KqJRoIzt3zLKqw","A Head Full of Dreams","spotify:artist:4gzpq5DPGxSnKTe4SA8HAU","Coldplay","2015-12-04","https://i.scdn.co/image/ab67616d0000b2738ff7c3580d429c8212b9a3b6","1","5","263786","https://p.scdn.co/mp3-preview/0b666b9a07035a659c7e5b7cb754f1b81bf1535b?cid=9950ac751e34487dbbe027c4fd7f8e99","false","87","GBAYE1500981","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T16:49:56Z"
"spotify:track:1zi7xx7UVEFkmKfv06H8x0","One Dance","spotify:artist:3TVXtAsR1Inumwj472S9r4, spotify:artist:3tVQdUvClmAT7URs9V3rsp, spotify:artist:6TK7fjRPdy2GW2pJzNF23L","Drake, Wizkid, Kyla","spotify:album:40GMAhriYJRO1rsY4YdrZb","Views","spotify:artist:3TVXtAsR1Inumwj472S9r4","Drake","2016-05-06","https://i.scdn.co/image/ab67616d0000b2739416ed64daf84936d89e671c","1","12","173986","","false","92","USCM51600028","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T17:05:37Z"
"spotify:track:7CyPwkp0oE8Ro9Dd5CUDjW","One Of The Girls (with JENNIE, Lily Rose Depp)","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ, spotify:artist:250b0Wlc5Vk0CoUsaCY84M, spotify:artist:1pBLC0qVRTB5zVMuteQ9jJ","The Weeknd, JENNIE, Lily-Rose Depp","spotify:album:7tzVd1fwkxsorytCBjEJkU","The Idol Episode 4 (Music from the HBO Original Series)","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ, spotify:artist:250b0Wlc5Vk0CoUsaCY84M, spotify:artist:1pBLC0qVRTB5zVMuteQ9jJ","The Weeknd, JENNIE, Lily-Rose Depp","2023-06-23","https://i.scdn.co/image/ab67616d0000b273b0dd6a5cd1dec96c4119c262","1","1","244684","","false","93","USUG12303881","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-01T17:06:50Z"
"spotify:track:0O45fw2L5vsWpdsOdXwNAR","SexyBack (feat. Timbaland)","spotify:artist:31TPClRtHm23RisEBtV3X7, spotify:artist:5Y5TRrQiqgUO4S36tzjIRZ","Justin Timberlake, Timbaland","spotify:album:2scB1uhcCI1TSf6b9TCZK3","FutureSex/LoveSounds","spotify:artist:31TPClRtHm23RisEBtV3X7","Justin Timberlake","2006-09-12","https://i.scdn.co/image/ab67616d0000b273c6ba98fd3f3b396a6c6f7091","1","2","242733","https://p.scdn.co/mp3-preview/3093705825f1c799e2de0064a2c775ef5c56d503?cid=9950ac751e34487dbbe027c4fd7f8e99","true","88","USJI10600269","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:07:05Z"
"spotify:track:2r7BPog74oaTG5shNYiUnV","House Of Balloons / Glass Table Girls","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","The Weeknd","spotify:album:7zCODUHkfuRxsUjtuzNqbd","House Of Balloons (Original)","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","The Weeknd","2011-03-21","https://i.scdn.co/image/ab67616d0000b273274b406a7e18acebcf743079","1","3","407315","","true","83","USUM72104130","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:09:21Z"
"spotify:track:7fBv7CLKzipRk6EC6TWHOB","The Hills","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","The Weeknd","spotify:album:0P3oVJBFOv3TDXlYRhGL7s","Beauty Behind The Madness","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","The Weeknd","2015-08-28","https://i.scdn.co/image/ab67616d0000b2737fcead687e99583072cc217b","1","5","242253","","true","89","USUG11500737","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:09:23Z"
"spotify:track:09mEdoA6zrmBPgTEN5qXmN","Call Out My Name","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","The Weeknd","spotify:album:4qZBW3f2Q8y0k1A84d4iAO","My Dear Melancholy,","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","The Weeknd","2018-03-30","https://i.scdn.co/image/ab67616d0000b2731f6a2a40bb692936879db730","1","1","228373","","false","87","USUG11800560","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:09:45Z"
"spotify:track:6ic8OlLUNEATToEFU3xmaH","Gimme More","spotify:artist:26dSoYclwsYLMAKD3tpOr4","Britney Spears","spotify:album:1ePkYcH5ZQCb1b4tQeiEDj","Blackout","spotify:artist:26dSoYclwsYLMAKD3tpOr4","Britney Spears","2007-10-25","https://i.scdn.co/image/ab67616d0000b273d0a8bfe18f25429d76886b1e","1","1","251244","https://p.scdn.co/mp3-preview/c69be559ed82a4259f047ad29f2acdcbec09cde4?cid=9950ac751e34487dbbe027c4fd7f8e99","true","87","USJI10700609","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:09:49Z"
"spotify:track:0SiywuOBRcynK0uKGWdCnn","Bad Romance","spotify:artist:1HY2Jd0NmPuamShAr6KMms","Lady Gaga","spotify:album:6rePArBMb5nLWEaY9aQqL4","The Fame Monster (Deluxe Edition)","spotify:artist:1HY2Jd0NmPuamShAr6KMms","Lady Gaga","2009-11-05","https://i.scdn.co/image/ab67616d0000b2735c9890c0456a3719eeecd8aa","1","1","294573","","true","88","USUM70918596","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:09:55Z"
"spotify:track:6K4t31amVTZDgR3sKmwUJJ","The Less I Know The Better","spotify:artist:5INjqkS1o8h1imAzPqGZBb","Tame Impala","spotify:album:79dL7FLiJFOO0EoehUHQBv","Currents","spotify:artist:5INjqkS1o8h1imAzPqGZBb","Tame Impala","2015-07-17","https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79","1","7","216320","","true","90","AUUM71500303","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:10:04Z"
"spotify:track:3DK6m7It6Pw857FcQftMds","Runaway","spotify:artist:5K4W6rqBFWDnAN6FQUkS6x, spotify:artist:0ONHkAv9pCAFxb0zJwDNTy","Kanye West, Pusha T","spotify:album:20r762YmB5HeofjMCiPMLv","My Beautiful Dark Twisted Fantasy","spotify:artist:5K4W6rqBFWDnAN6FQUkS6x","Kanye West","2010-11-22","https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f","1","9","547733","","true","86","USUM71027402","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:10:27Z"
"spotify:track:58q2HKrzhC3ozto2nDdN4z","I Like It","spotify:artist:4kYSro6naA4h99UJvo89HB, spotify:artist:4q3ewBCX7sLwd24euuV69X, spotify:artist:1vyhD5VmyZ7KMfW5gqLgo5","Cardi B, Bad Bunny, J Balvin","spotify:album:4KdtEKjY3Gi0mKiSdy96ML","Invasion of Privacy","spotify:artist:4kYSro6naA4h99UJvo89HB","Cardi B","2018-04-06","https://i.scdn.co/image/ab67616d0000b273a0caffda54afd0a65995bbab","1","7","253390","https://p.scdn.co/mp3-preview/0fe3542d88da43dd131627df756ac1ce318713fd?cid=9950ac751e34487dbbe027c4fd7f8e99","true","81","USAT21801431","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:10:42Z"
"spotify:track:5AGQSF0ytihJyt96K5vW9d","Heartbeat","spotify:artist:73sIBHcqh3Z3NyqHKZ7FOL","Childish Gambino","spotify:album:01MRGgNbfWrE291tQjw9ta","Camp","spotify:artist:73sIBHcqh3Z3NyqHKZ7FOL","Childish Gambino","2011-11-15","https://i.scdn.co/image/ab67616d0000b2736182cfe2e2a090d125c81dc0","1","6","269840","https://p.scdn.co/mp3-preview/7f326a2dc7b5616df6d193f6995b31f593511a54?cid=9950ac751e34487dbbe027c4fd7f8e99","true","87","USYAH1100351","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:10:48Z"
"spotify:track:7yNf9YjeO5JXUE3JEBgnYc","Babydoll","spotify:artist:6USv9qhCn6zfxlBQIYJ9qs","Dominic Fike","spotify:album:05jbNkYoEQdjVDHEHtg1gY","Don't Forget About Me, Demos","spotify:artist:6USv9qhCn6zfxlBQIYJ9qs","Dominic Fike","2018-10-16","https://i.scdn.co/image/ab67616d0000b2737b1b6f41c1645af9757d5616","1","3","97960","https://p.scdn.co/mp3-preview/bf5ab98492256120bd9c48658e9c899c8692f77f?cid=9950ac751e34487dbbe027c4fd7f8e99","false","95","USQX91802457","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:11:10Z"
"spotify:track:2vXKRlJBXyOcvZYTdNeckS","Lost in the Fire (feat. The Weeknd)","spotify:artist:3hteYQFiMFbJY7wS0xDymP, spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","Gesaffelstein, The Weeknd","spotify:album:0JA38Ekhsv43y2lBj5GQkQ","Hyperion","spotify:artist:3hteYQFiMFbJY7wS0xDymP","Gesaffelstein","2019-03-08","https://i.scdn.co/image/ab67616d0000b2737842fd51802451ff61483dcf","1","3","202093","https://p.scdn.co/mp3-preview/bb6be3c611177685ba91254a63aae326c6143739?cid=9950ac751e34487dbbe027c4fd7f8e99","true","83","USQX91803314","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:11:14Z"
"spotify:track:1AWQoqb9bSvzTjaLralEkT","Rock Your Body","spotify:artist:31TPClRtHm23RisEBtV3X7","Justin Timberlake","spotify:album:6QPkyl04rXwTGlGlcYaRoW","Justified","spotify:artist:31TPClRtHm23RisEBtV3X7","Justin Timberlake","2002-11-04","https://i.scdn.co/image/ab67616d0000b273346a5742374ab4cf9ed32dee","1","6","267266","https://p.scdn.co/mp3-preview/1c8a20b021ebce522a3d01c8e1961d1903b96e01?cid=9950ac751e34487dbbe027c4fd7f8e99","false","85","USJI10200367","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:11:25Z"
"spotify:track:5zUQZjVB6bfewBXWqsP9PY","Here","spotify:artist:2wUjUUtkb5lvLKcGKsKqsR","Alessia Cara","spotify:album:7HnbhIDKXIBhMR4EPGuMgu","Know-It-All","spotify:artist:2wUjUUtkb5lvLKcGKsKqsR","Alessia Cara","2015-11-13","https://i.scdn.co/image/ab67616d0000b273d7ef1ffbd2a5821152f35ce1","1","2","199453","","false","80","USUM71506251","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:11:36Z"
"spotify:track:378iszndTZAR4dH8kwsLC6","Cheap Thrills (feat. Sean Paul)","spotify:artist:5WUlDfRSoLAfcVSX1WnrxN, spotify:artist:3Isy6kedDrgPYoTS1dazA9","Sia, Sean Paul","spotify:album:3Xz1Bcn4YP9bdqlsstMfuJ","This Is Acting","spotify:artist:5WUlDfRSoLAfcVSX1WnrxN","Sia","2016-02-18","https://i.scdn.co/image/ab67616d0000b273fc36b265066a58e205ecbd5c","1","13","224813","https://p.scdn.co/mp3-preview/4dc9b35cf6fdb79ac409ac7c668636cb5b47474c?cid=9950ac751e34487dbbe027c4fd7f8e99","false","84","USRC11600201","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-04T06:11:42Z"
"spotify:track:4L4MttVsY1WaxSDzFiQefU","Ay Mi Dios","spotify:artist:0b2GL7Y02vu50qieoQmw1w, spotify:artist:0TnOYISbd1XYRBk9myaseg, spotify:artist:0eHQ9o50hj6ZDNBt6Ys1sD, spotify:artist:1xFn1xod58AGaSZjrxdiXA","IAmChino, Pitbull, Yandel, El Chacal","spotify:album:1JCOUDiJmrVr6YmzLXMHkO","Ay Mi Dios","spotify:artist:0b2GL7Y02vu50qieoQmw1w, spotify:artist:0TnOYISbd1XYRBk9myaseg","IAmChino, Pitbull","2016-02-22","https://i.scdn.co/image/ab67616d0000b27307e80dd12fc157ce0c9f01a1","1","1","252003","https://p.scdn.co/mp3-preview/466233670a788d8d59bb5ea7585f2a0b023a66d6?cid=9950ac751e34487dbbe027c4fd7f8e99","false","75","USNPW1600229","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-15T05:44:43Z"
"spotify:track:5Ctzx0mMiUPAu9JqbAOY9n","Be Like a Woman","spotify:artist:0CnHF3fzueVi59nz8fdwcl","Chris Rainbow","spotify:album:4ZCCd0IZB5RizC5sz5IguU","White Trails (Expanded)","spotify:artist:0CnHF3fzueVi59nz8fdwcl","Chris Rainbow","1979-01-01","https://i.scdn.co/image/ab67616d0000b273b01318919e207e569f69c1a2","1","4","255946","https://p.scdn.co/mp3-preview/1c1e83f4ec1f5752b0dcb7a1037e9387fc8c2ccd?cid=9950ac751e34487dbbe027c4fd7f8e99","false","85","GBAYE1704802","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-16T06:26:11Z"
"spotify:track:0laYHRpNTS6i8FXdupHkJ4","Love You Like A Love Song","spotify:artist:6dJeKm76NjfXBNTpHmOhfO","Selena Gomez & The Scene","spotify:album:49yHvRh1cOfLcEKukEP7Ox","When The Sun Goes Down","spotify:artist:6dJeKm76NjfXBNTpHmOhfO","Selena Gomez & The Scene","2011-01-01","https://i.scdn.co/image/ab67616d0000b2731c8193de8d62b2ffa49a09db","1","1","188453","","false","86","USHR11132668","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:52:33Z"
"spotify:track:5Fim1gaXBgsiFfsQAfQSDS","Hasta el Amanecer","spotify:artist:1SupJlEpv7RS2tPNRaHViT","Nicky Jam","spotify:album:2dBgWXp41imu2zBNv9oFxZ","Fénix","spotify:artist:1SupJlEpv7RS2tPNRaHViT","Nicky Jam","2017-01-20","https://i.scdn.co/image/ab67616d0000b273b242b4213fb5c21d97dbbf4d","1","22","198706","https://p.scdn.co/mp3-preview/60fad634460152fee67dc89474b4ac2b2a3082a3?cid=9950ac751e34487dbbe027c4fd7f8e99","false","81","USSD11500463","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:52:47Z"
"spotify:track:0QkWikH5Z3U0f79T9iuF6c","Judas","spotify:artist:1HY2Jd0NmPuamShAr6KMms","Lady Gaga","spotify:album:2KkMVsxymoNR7hRmBcMttd","Born This Way","spotify:artist:1HY2Jd0NmPuamShAr6KMms","Lady Gaga","2011-01-01","https://i.scdn.co/image/ab67616d0000b2734ba15b951a5cff36133ca5bd","1","4","249066","","false","78","USUM71104998","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:52:50Z"
"spotify:track:6etwirSInfuJrSOlogS6Sh","American Boy","spotify:artist:5T0MSzX9RC5NA6gAI6irSn, spotify:artist:5K4W6rqBFWDnAN6FQUkS6x","Estelle, Kanye West","spotify:album:1fpyVGMhF1vdl4XTFo1IH0","Shine","spotify:artist:5T0MSzX9RC5NA6gAI6irSn","Estelle","2008-03-28","https://i.scdn.co/image/ab67616d0000b27398dc3e242a818007dd67b7c5","1","3","284733","https://p.scdn.co/mp3-preview/6f51d610e0fcdf1a2452dde184f2c3c1a761885f?cid=9950ac751e34487dbbe027c4fd7f8e99","true","85","USAT20706210","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:53:02Z"
"spotify:track:14OxJlLdcHNpgsm4DRwDOB","Habits (Stay High)","spotify:artist:4NHQUGzhtTLFvgF5SZesLK","Tove Lo","spotify:album:47C7w4o1resDhr7jvYEpxE","Queen Of The Clouds","spotify:artist:4NHQUGzhtTLFvgF5SZesLK","Tove Lo","2014-01-01","https://i.scdn.co/image/ab67616d0000b273edbdf62135e9112a98bffa0c","1","13","209160","","false","82","SE3NM1300101","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:53:08Z"
"spotify:track:3hxIUxnT27p5WcmjGUXNwx","Shut up My Moms Calling","spotify:artist:35WVTyRnKAoaGExqgktVyb","Hotel Ugly","spotify:album:4qVzNqB4cskFInYfrC7P0S","Shut up My Moms Calling","spotify:artist:35WVTyRnKAoaGExqgktVyb","Hotel Ugly","2020-02-10","https://i.scdn.co/image/ab67616d0000b273350ab7a839c04bfd5225a9f5","1","1","164571","https://p.scdn.co/mp3-preview/7642409265c74b714a2f0f0dd8663c031e253485?cid=9950ac751e34487dbbe027c4fd7f8e99","false","89","TCAEQ2083509","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:53:42Z"
"spotify:track:7KA4W4McWYRpgf0fWsJZWB","See You Again (feat. Kali Uchis)","spotify:artist:4V8LLVI7PbaPR0K2TGSxFF, spotify:artist:1U1el3k54VvEUzo3ybLPlM","Tyler\, The Creator, Kali Uchis","spotify:album:2nkto6YNI4rUYTLqEwWJ3o","Flower Boy","spotify:artist:4V8LLVI7PbaPR0K2TGSxFF","Tyler\, The Creator","2017-07-21","https://i.scdn.co/image/ab67616d0000b2738940ac99f49e44f59e6f7fb3","1","4","180386","https://p.scdn.co/mp3-preview/c703198293891e3b276800ea6b187cf7951d3d7d?cid=9950ac751e34487dbbe027c4fd7f8e99","true","91","USQX91701275","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:55:03Z"
"spotify:track:4OwhwvKESFtuu06dTgct7i","Tiroteo - Remix","spotify:artist:5FQ8tBUtIamA2hRtatrYUF, spotify:artist:1mcTU81TzQhprhouKaTkpq, spotify:artist:1aMt4A5jrQHxDYyC7rXgV0","Marc Seguí, Rauw Alejandro, Pol Granch","spotify:album:2Ke07jWpOWaNVYpNMmXt7C","Tiroteo (Remix)","spotify:artist:5FQ8tBUtIamA2hRtatrYUF, spotify:artist:1mcTU81TzQhprhouKaTkpq, spotify:artist:1aMt4A5jrQHxDYyC7rXgV0","Marc Seguí, Rauw Alejandro, Pol Granch","2021-04-01","https://i.scdn.co/image/ab67616d0000b273cf206ae0c2100b85d30ab24c","1","1","321555","https://p.scdn.co/mp3-preview/f4cb7d8ed9e8db194d56e1f7eba3bb4e11e529a4?cid=9950ac751e34487dbbe027c4fd7f8e99","false","87","USWL12100143","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:56:35Z"
"spotify:track:567UAkWoLBqZ709s3Qcbze","Maria Maria (feat. The Product G&B)","spotify:artist:6GI52t8N5F02MxU0g5U69P, spotify:artist:782IpIScTpnDhYb9hyxOu1","Santana, The Product G&B","spotify:album:1n12Kl9IoHSk65OcZDutSH","Supernatural (Legacy Edition)","spotify:artist:6GI52t8N5F02MxU0g5U69P","Santana","1999","https://i.scdn.co/image/ab67616d0000b27305517e4e2defded1e818d3d0","1","7","261973","https://p.scdn.co/mp3-preview/aeca3af8544ab78fef1485a06e5542b65ce00d66?cid=9950ac751e34487dbbe027c4fd7f8e99","false","79","USAR19900035","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:57:24Z"
"spotify:track:6g2BiiVQqY5v1S4HIrM54F","Tuyo (Narcos Theme) [Extended Version] - A Netflix Original Series Soundtrack","spotify:artist:0UOrkpzPED604dKzxgfJqg","Rodrigo Amarante","spotify:album:3NRTc5qEBAqOt3dKPFkmnu","Tuyo (Narcos Theme) [Extended Version] [A Netflix Original Series Soundtrack]","spotify:artist:0UOrkpzPED604dKzxgfJqg","Rodrigo Amarante","2018-11-16","https://i.scdn.co/image/ab67616d0000b27364d924aebcb26f08aac1bf3b","1","1","151565","https://p.scdn.co/mp3-preview/5566b771d2da659f96a8cd8b9412a075678b0361?cid=9950ac751e34487dbbe027c4fd7f8e99","false","71","FR3X61800160","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T03:58:29Z"
"spotify:track:69kOkLUCkxIZYexIgSG8rq","Get Lucky (feat. Pharrell Williams and Nile Rodgers)","spotify:artist:4tZwfgrHOc3mvqYlEYSvVi, spotify:artist:2RdwBSPQiwcmiDo9kixcl8, spotify:artist:3yDIp0kaq9EFKe07X1X2rz","Daft Punk, Pharrell Williams, Nile Rodgers","spotify:album:4m2880jivSbbyEGAKfITCa","Random Access Memories","spotify:artist:4tZwfgrHOc3mvqYlEYSvVi","Daft Punk","2013-05-20","https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937","1","8","369626","https://p.scdn.co/mp3-preview/6de52dda0d37a0646987856c3b9f7da075d965b4?cid=9950ac751e34487dbbe027c4fd7f8e99","false","77","USQX91300108","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:02:25Z"
"spotify:track:4JNdwEfqwFRiAeEISC8RU8","Die For You (with Ariana Grande) - Remix","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ, spotify:artist:66CXWjxzNUsdJxJ2JdwvnR","The Weeknd, Ariana Grande","spotify:album:0YF085Qdh4HgdhZ8zjWkpo","Die For You","spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","The Weeknd","2023-02-27","https://i.scdn.co/image/ab67616d0000b2738b5a9e7c56f01bec356de9d5","1","1","232857","","false","71","USUG12301287","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:03:26Z"
"spotify:track:1n39WXv58zOCFVLnGlVJNg","¿Qué Tiene?","spotify:artist:7plUpXSFcSJUZSiZAoXqr1","Ximena Sariñana","spotify:album:6BvR8xqcnvm7Gpmmnr7JKa","¿Dónde Bailarán Las Niñas?","spotify:artist:7plUpXSFcSJUZSiZAoXqr1","Ximena Sariñana","2019-03-01","https://i.scdn.co/image/ab67616d0000b273a9997a03e23f9ffdd9329688","1","1","177272","https://p.scdn.co/mp3-preview/79e4fe946cea59a67c2d4de4f142932fc8df3ff1?cid=9950ac751e34487dbbe027c4fd7f8e99","true","64","MXF151800238","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:04:00Z"
"spotify:track:4P5KoWXOxwuobLmHXLMobV","Come As You Are","spotify:artist:6olE6TJLqED3rqDCT0FyPh","Nirvana","spotify:album:2guirTSEqLizK7j9i1MTTZ","Nevermind (Remastered)","spotify:artist:6olE6TJLqED3rqDCT0FyPh","Nirvana","1991-09-26","https://i.scdn.co/image/ab67616d0000b273e175a19e530c898d167d39bf","1","3","218920","","false","82","USGF19942503","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:05:38Z"
"spotify:track:7MQ04bZzJGKiBRioclEiIo","Fuera Del Planeta","spotify:artist:7qYeIN2r4H1kBvr0Gm9Iav, spotify:artist:0eet2VBconGGtNYJ0CBgHu","Randy Nota Loca, Eloy","spotify:album:4qJomsv2i158uKDjAsjSuH","Fuera Del Planeta","spotify:artist:7qYeIN2r4H1kBvr0Gm9Iav, spotify:artist:0eet2VBconGGtNYJ0CBgHu","Randy Nota Loca, Eloy","2009-03-19","https://i.scdn.co/image/ab67616d0000b2733eb4ded3a27e5d4f5340a6fc","1","1","222315","https://p.scdn.co/mp3-preview/17777aa66baabd639eed9682b2ea12d3ddc2696c?cid=9950ac751e34487dbbe027c4fd7f8e99","false","8","TCAES2017133","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:17:44Z"
"spotify:track:49G3ExbNrPDgopoEwjhEsQ","Runway Walk (Bonus) (feat. Brevi)","spotify:artist:3hEgzEeaZ0hb3UXx1U1JRR","Demrick","spotify:album:1vT6UQMmFNVVdkwiLHLyiB","#HeadsUP","spotify:artist:3hEgzEeaZ0hb3UXx1U1JRR","Demrick","2014-01-07","https://i.scdn.co/image/ab67616d0000b273d20ff72168c96782a8dabb8b","1","15","190774","https://p.scdn.co/mp3-preview/596f8fa613380b44a5f95d4afae8a47ab9d09a5e?cid=9950ac751e34487dbbe027c4fd7f8e99","true","73","USUYG1038821","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:18:10Z"
"spotify:track:6FRuoVUb0gEvlQwuF7tfTf","Red Crystal Castles - Slowed + Reverb","spotify:artist:0nBm7sxo9DqEk7RLyaxFWO","13Aurora","spotify:album:7EXdjqd7GAl63R7Jcn69Jc","Red Crystal Castles (Slowed + Reverb)","spotify:artist:0nBm7sxo9DqEk7RLyaxFWO","13Aurora","2023-10-02","https://i.scdn.co/image/ab67616d0000b2737175085346dca958882fae99","1","1","215875","https://p.scdn.co/mp3-preview/4de9b4e005e9b8e2910440080b547c0c693e2416?cid=9950ac751e34487dbbe027c4fd7f8e99","false","47","QZNFJ2304949","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:19:06Z"
"spotify:track:5xjTqz4aYQeBnFhwMPmfx9","Kickin’ Back","spotify:artist:6cN9XwPMj9bWzJ32GC6V7v","Mila J","spotify:album:3wlzfD1t9CCQToaqR0rYFG","213","spotify:artist:6cN9XwPMj9bWzJ32GC6V7v","Mila J","2016-06-16","https://i.scdn.co/image/ab67616d0000b273c81c66bf7563402a936eb22c","1","2","202434","","true","67","USUM71604806","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:19:23Z"
"spotify:track:5vTSnZTmS1gMiWuA9kDE19","Futile Devices (Doveman Remix)","spotify:artist:4MXUO7sVCaFgFjoTI5ox5c","Sufjan Stevens","spotify:album:7K0x1O9gqMQlDwbMkyCCIM","Call Me By Your Name (Original Motion Picture Soundtrack)","spotify:artist:0LyfQWJT6nXafLPZqxe9Of","Varios Artistas","2017-11-03","https://i.scdn.co/image/ab67616d0000b2730db3901606954f424070ff01","1","9","135443","https://p.scdn.co/mp3-preview/e35f98f9f7bdec710c493928197ffc0c91b63149?cid=9950ac751e34487dbbe027c4fd7f8e99","false","84","US64G1737301","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:20:24Z"
"spotify:track:7ef4DlsgrMEH11cDZd32M6","One Kiss (with Dua Lipa)","spotify:artist:7CajNmpbOovFoOoasH2HaY, spotify:artist:6M2wZ9GZgrQXHCFfjv46we","Calvin Harris, Dua Lipa","spotify:album:7GEzhoTiqcPYkOprWQu581","One Kiss (with Dua Lipa)","spotify:artist:7CajNmpbOovFoOoasH2HaY, spotify:artist:6M2wZ9GZgrQXHCFfjv46we","Calvin Harris, Dua Lipa","2018-04-06","https://i.scdn.co/image/ab67616d0000b273d09f96d82310d4d77c14c108","1","1","214846","https://p.scdn.co/mp3-preview/0c09da1fe6f1da091c05057835e6be2312e2dc18?cid=9950ac751e34487dbbe027c4fd7f8e99","false","81","GBARL1800368","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:20:42Z"
"spotify:track:6MzofobZt2dm0Kf1hTThFz","Diet Pepsi","spotify:artist:4gvjmrtzydbMpyJaXUtwvP","Addison Rae","spotify:album:0XA403JTounqFh2owquBXu","Diet Pepsi","spotify:artist:4gvjmrtzydbMpyJaXUtwvP","Addison Rae","2024-08-09","https://i.scdn.co/image/ab67616d0000b273316905a371bd81c2eca8a24f","1","1","169697","https://p.scdn.co/mp3-preview/7788840b4aa13fa333340aef34ed81c5f9c6656b?cid=9950ac751e34487dbbe027c4fd7f8e99","false","75","USSM12405456","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:21:14Z"
"spotify:track:6jGAh1bFnXt1Muj9zeHveZ","After Last Night (with Thundercat & Bootsy Collins)","spotify:artist:0du5cEVh5yTK9QJze8zA0C, spotify:artist:3jK9MiCrA42lLAdMGUZpwa, spotify:artist:6PvvGcCY2XtUcSRld1Wilr, spotify:artist:4frXpPxQQZwbCu3eTGnZEw, spotify:artist:5K0rbdBrs2tNXe5LeWMATT","Bruno Mars, Anderson .Paak, Silk Sonic, Thundercat, Bootsy Collins","spotify:album:4VZ7jhV0wHpoNPCB7Vmiml","An Evening With Silk Sonic","spotify:artist:0du5cEVh5yTK9QJze8zA0C, spotify:artist:3jK9MiCrA42lLAdMGUZpwa, spotify:artist:6PvvGcCY2XtUcSRld1Wilr","Bruno Mars, Anderson .Paak, Silk Sonic","2021-11-12","https://i.scdn.co/image/ab67616d0000b2735f19f50677f8ded7021b8229","1","4","249444","https://p.scdn.co/mp3-preview/70b229727335a2e1acae2bbecf7d6448f4c85d80?cid=9950ac751e34487dbbe027c4fd7f8e99","false","66","USAT22103103","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:22:06Z"
"spotify:track:6YAK1Sle1Wl7jOurqwWCfh","MONTAGEM CAMERA LENTA","spotify:artist:76JV5kzmRyAtP4cmMgjMZi, spotify:artist:01XS19DjUcPe5dfYEkXjsg, spotify:artist:3t0ufVf4b2wFeCG1SVNNWY","DJ DUARTE, DJ ORBITAL, Dj Rs","spotify:album:2pdoRydehXDDEYzC6e1uSK","MONTAGEM CAMERA LENTA","spotify:artist:76JV5kzmRyAtP4cmMgjMZi, spotify:artist:01XS19DjUcPe5dfYEkXjsg, spotify:artist:3t0ufVf4b2wFeCG1SVNNWY","DJ DUARTE, DJ ORBITAL, Dj Rs","2025-10-10","https://i.scdn.co/image/ab67616d0000b2734d8151af7b09dfa5d037b489","1","1","169850","https://p.scdn.co/mp3-preview/f2cf5f8f10f1b566e9725762e3230827f98d6eaf?cid=9950ac751e34487dbbe027c4fd7f8e99","true","18","QT5M42580628","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:22:55Z"
"spotify:track:41sGGCCoHI2GLV9qadX80A","Baby Come Back","spotify:artist:0fgtHVpOPfXb07S8Jx443z","Player","spotify:album:1uZ7slfpVTucDk922Btj5B","Player","spotify:artist:0fgtHVpOPfXb07S8Jx443z","Player","1977-09-01","https://i.scdn.co/image/ab67616d0000b27381eae9a98487ae512df29469","1","2","255845","","false","82","NLF057790013","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:24:40Z"
"spotify:track:0FVuyC9RP5MACjp4lgU3qZ","I'm God","spotify:artist:5vSQUyT33qxr1xAX2Tkf3A, spotify:artist:6Xb4ezwoAQC4516kI89nWz","Clams Casino, Imogen Heap","spotify:album:66eXLlqksAwNndmHaHWtCq","Instrumental Relics","spotify:artist:5vSQUyT33qxr1xAX2Tkf3A","Clams Casino","2020-04-24","https://i.scdn.co/image/ab67616d0000b273d57e3b601a8171f7e122b2ea","1","1","277710","https://p.scdn.co/mp3-preview/bf0f24ccdfaf6695769f3f7889a22fae934c2af3?cid=9950ac751e34487dbbe027c4fd7f8e99","false","79","QM24S2003584","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:24:51Z"
"spotify:track:6RtPijgfPKROxEzTHNRiDp","Rude","spotify:artist:0DxeaLnv6SyYk2DOqkLO8c","MAGIC!","spotify:album:0RZ4Ct4vegYBmL9g88TBNi","Don't Kill the Magic","spotify:artist:0DxeaLnv6SyYk2DOqkLO8c","MAGIC!","2014-06-25","https://i.scdn.co/image/ab67616d0000b273b1c2609c8b258ad621d4057b","1","1","224849","https://p.scdn.co/mp3-preview/1b0c13e0cf20a6756a18e779ec0351791800cf9e?cid=9950ac751e34487dbbe027c4fd7f8e99","false","88","CAV161300016","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:26:53Z"
"spotify:track:3Xta6s5k5IwdTfjLwYMa7O","Tout donner","spotify:artist:7xNYY1Zkb1vks5m9ATlJok, spotify:artist:0LKAV3zJ8a8AIGnyc5OvfB","Naza, SDM","spotify:album:2JX4Z6eoaQWk0AizkGIPBC","Tout donner","spotify:artist:7xNYY1Zkb1vks5m9ATlJok, spotify:artist:0LKAV3zJ8a8AIGnyc5OvfB","Naza, SDM","2025-05-30","https://i.scdn.co/image/ab67616d0000b273705b267e531b72b269854707","1","1","145512","https://p.scdn.co/mp3-preview/ee2db1b1f0a4cb321b18466775f984b97bd01947?cid=9950ac751e34487dbbe027c4fd7f8e99","true","66","FRX282553152","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:31:56Z"
"spotify:track:3ng8tfwvzR4BBwa9yaMms6","BADGYAL","spotify:artist:2O8vbr4RYPpk6MRA4fio7u, spotify:artist:0FwnPHExlRRxEZPLAi5tmG, spotify:artist:2YRyPiW98bpkARAS4B3OQP","SAIKO, JC Reyes, Dei V","spotify:album:5z4aZJ5U7LqwRc2tXk98cc","SAKURA","spotify:artist:2O8vbr4RYPpk6MRA4fio7u","SAIKO","2024-04-26","https://i.scdn.co/image/ab67616d0000b273e346fc6f767ca2ac8365fe60","1","13","253962","https://p.scdn.co/mp3-preview/a597d487ae8c66e58661a06e20acc7bb4797cee0?cid=9950ac751e34487dbbe027c4fd7f8e99","true","70","QM4TX2482887","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:32:37Z"
"spotify:track:5jqNQZBwbZWQXPWfo0ygZF","Art Deco","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","spotify:album:2DpEBrjCur1ythIZ10gJWw","Honeymoon","spotify:artist:00FQb4jTyendYWaN8pK0wa","Lana Del Rey","2015-09-18","https://i.scdn.co/image/ab67616d0000b273a3b3f48ca81acacb3ad4ec8a","1","7","295066","","false","82","GBUM71503925","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:33:22Z"
"spotify:track:1otG6j1WHNvl9WgXLWkHTo","After The Storm (feat. Tyler, The Creator & Bootsy Collins)","spotify:artist:1U1el3k54VvEUzo3ybLPlM, spotify:artist:4V8LLVI7PbaPR0K2TGSxFF, spotify:artist:5K0rbdBrs2tNXe5LeWMATT","Kali Uchis, Tyler\, The Creator, Bootsy Collins","spotify:album:4EPQtdq6vvwxuYeQTrwDVY","Isolation","spotify:artist:1U1el3k54VvEUzo3ybLPlM","Kali Uchis","2018-04-06","https://i.scdn.co/image/ab67616d0000b27390b4e1905b1fc48c537ec053","1","13","207454","","false","81","GBUM71706492","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:34:10Z"
"spotify:track:62N2JSA0jHmSH7Va9t7hIf","Habits (Stay High) - Hippie Sabotage Remix","spotify:artist:4NHQUGzhtTLFvgF5SZesLK, spotify:artist:4dM6NDYSfLcspt8GLoT5aE","Tove Lo, Hippie Sabotage","spotify:album:47C7w4o1resDhr7jvYEpxE","Queen Of The Clouds","spotify:artist:4NHQUGzhtTLFvgF5SZesLK","Tove Lo","2014-01-01","https://i.scdn.co/image/ab67616d0000b273edbdf62135e9112a98bffa0c","1","16","258933","","false","69","SEUM71401250","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T04:34:56Z"
"spotify:track:5J4ZkQpzMUFojo1CtAZYpn","Love Me Harder","spotify:artist:66CXWjxzNUsdJxJ2JdwvnR, spotify:artist:1Xyo4u8uXC1ZmMpatF05PJ","Ariana Grande, The Weeknd","spotify:album:6EVYTRG1drKdO8OnIQBeEj","My Everything (Deluxe)","spotify:artist:66CXWjxzNUsdJxJ2JdwvnR","Ariana Grande","2014-08-22","https://i.scdn.co/image/ab67616d0000b273deec12a28d1e336c5052e9aa","1","9","236133","","false","88","USUM71409728","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-18T19:55:05Z"
"spotify:track:1W0OCrMsRP1SLTEdw3JwEz","Sweet Dreams, TN","spotify:artist:2Z7UcsdweVlRbAk5wH5fsf","The Last Shadow Puppets","spotify:album:6q1ZuWCnYTQb7KhXHZo947","Everything You've Come To Expect (Deluxe Edition)","spotify:artist:2Z7UcsdweVlRbAk5wH5fsf","The Last Shadow Puppets","2016-12-02","https://i.scdn.co/image/ab67616d0000b27399845928b10d57ec9f95e953","1","7","236252","https://p.scdn.co/mp3-preview/ec9e1e339ee58f8b79dd1f1dd18a122179d142b2?cid=9950ac751e34487dbbe027c4fd7f8e99","true","66","GBCEL1600011","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-04-25T07:10:14Z"
"spotify:track:4bDPr2VAjcfgUDmN9dGOC3","Why I Love You","spotify:artist:3nFkdlSjzX9mRTtwJOzDYB, spotify:artist:5K4W6rqBFWDnAN6FQUkS6x, spotify:artist:1zV9UjTUevjp5VUddqIUUn","JAŸ-Z, Kanye West, Mr Hudson","spotify:album:0OcMap99vLEeGkBCfCwRwS","Watch The Throne","spotify:artist:3nFkdlSjzX9mRTtwJOzDYB, spotify:artist:5K4W6rqBFWDnAN6FQUkS6x","JAŸ-Z, Kanye West","2011-08-08","https://i.scdn.co/image/ab67616d0000b27352e61456aa4995ba48d94e30","1","12","201453","","true","70","USUM71111678","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-05-14T23:25:18Z"
"spotify:track:0eAuGrXyGFYwur9ARUe7LJ","Earrings","spotify:artist:7eKkW1zo5uzW8kUntiiBvz","Malcolm Todd","spotify:album:2jX6yKrWw9bY7JAYHhhtqZ","Sweet Boy","spotify:artist:7eKkW1zo5uzW8kUntiiBvz","Malcolm Todd","2024-04-05","https://i.scdn.co/image/ab67616d0000b2732c1f34ecc1929fb59908aad1","1","1","151500","https://p.scdn.co/mp3-preview/20a1469df9f65a51878811bbe49979c418abc1b7?cid=9950ac751e34487dbbe027c4fd7f8e99","false","97","USSM12402225","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-05-15T05:04:21Z"
"spotify:track:7r6PigmGzlB3YPB7wvBBbi","No Church In The Wild","spotify:artist:3nFkdlSjzX9mRTtwJOzDYB, spotify:artist:5K4W6rqBFWDnAN6FQUkS6x, spotify:artist:2h93pZq0e7k5yf4dywlkpM, spotify:artist:1W3FSF1BLpY3hlVIgvenLz","JAŸ-Z, Kanye West, Frank Ocean, THE-DREAM","spotify:album:0OcMap99vLEeGkBCfCwRwS","Watch The Throne","spotify:artist:3nFkdlSjzX9mRTtwJOzDYB, spotify:artist:5K4W6rqBFWDnAN6FQUkS6x","JAŸ-Z, Kanye West","2011-08-08","https://i.scdn.co/image/ab67616d0000b27352e61456aa4995ba48d94e30","1","1","272506","","true","83","USUM71111617","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-05-15T19:16:51Z"
"spotify:track:1cmQe4EYZI3J0dygdL701Q","Rock That Body","spotify:artist:1yxSLGMDHlW21z4YXirZDS","Black Eyed Peas","spotify:album:0pQiRIPFblFwEummRX28Qa","THE E.N.D. (THE ENERGY NEVER DIES) [International Version]","spotify:artist:1yxSLGMDHlW21z4YXirZDS","Black Eyed Peas","2009-01-01","https://i.scdn.co/image/ab67616d0000b2735eb4fdcdce583bf9b92334ce","1","2","268840","","false","62","USUM70967623","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-05-22T04:30:53Z"
"spotify:track:49ou9vBZLTCi4TYoYzR3F9","Calabria 2007 - Radio Edit","spotify:artist:1BQaZSq1KsLOZGzjG5QxRC, spotify:artist:73O5T44Ui5WqxtW6S5JENA","Enur, Natasja","spotify:album:6MEU7vnEiJ0qzsJkZSqPed","Calabria 2007","spotify:artist:1BQaZSq1KsLOZGzjG5QxRC, spotify:artist:73O5T44Ui5WqxtW6S5JENA","Enur, Natasja","2007","https://i.scdn.co/image/ab67616d0000b273c9ee2d29e5034875b9548a77","1","1","233480","https://p.scdn.co/mp3-preview/62b17ae2f23ec524205e1a4238664a926405abe6?cid=9950ac751e34487dbbe027c4fd7f8e99","false","79","DKEW50600106","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-05-22T04:31:47Z"
"spotify:track:4tu0JnWbFaaTHJ7QDimWRz","Ronroneame","spotify:artist:2k0GqjU0ypOK1ishkR8Ppx, spotify:artist:4GK4U1lkvejUHBFsqyv23D, spotify:artist:05LiGpQaK746ULVzjzLgZ3","Dj Drewther, Ruzzo Doblezz, LA FAMA","spotify:album:3rwYTbvRaDOelYtYHG2142","Ronroneame","spotify:artist:05LiGpQaK746ULVzjzLgZ3, spotify:artist:2k0GqjU0ypOK1ishkR8Ppx, spotify:artist:4GK4U1lkvejUHBFsqyv23D","LA FAMA, Dj Drewther, Ruzzo Doblezz","2026-07-31","https://i.scdn.co/image/ab67616d0000b273861a20edcbfa1ca309caa823","1","1","125568","","true","74","QT8BW2648005","spotify:user:317x3cliiy4z47ame4dq5bnrc4pa","2026-09-05T20:21:15Z"
````

## File: fix_slash.js
````javascript
// mexlify://C:/ --> mexlify:///C:/
````

## File: renderer.js
````javascript
// Función para log debug
function logDebug(...args)
⋮----
// Reproducir canción (stream o local) y actualizar UI
async function playSong(song, localPath = null)
⋮----
// Detener audio anterior
⋮----
// Buscar canciones
⋮----
// Descargar
⋮----
// Reproducir streaming
⋮----
// Cargar canciones descargadas
async function loadDownloadedSongs()
⋮----
const downloadsDir = await window.electronAPI.getAppPath(); // <-- AQUI
⋮----
async function deleteDownload(filename)
// Inicializar
````

## File: .github/workflows/node.js.yml
````yaml
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs
name: Node.js CI
on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
jobs:
  build:
    runs-on: windows-latest
    strategy:
      matrix:
        node-version: [22.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test --if-present
````

## File: assets/js/messages.js
````javascript
// messages.js
// Manager para la bandeja del sistema (inbox de notificaciones)
⋮----
class SystemTrayManager
⋮----
this.activeTab = "general"; // default active tab: general
⋮----
init()
⋮----
// Close button
⋮----
// Overlay click
⋮----
// Clear button
⋮----
// Bind sidebar button
⋮----
// Tab buttons
⋮----
// Add initial welcome message (silent = false so it starts in General tab!)
⋮----
// Re-render
⋮----
addMessage(title, text, type = "info", silent = true)
⋮----
// type: 'info' | 'success' | 'warning' | 'error' | 'music'
⋮----
// Keep max 50 messages
⋮----
// Only update badge count if the drawer is not open
⋮----
clearAll()
⋮----
updateBadge()
⋮----
isOpen()
⋮----
open()
⋮----
// Reset/hide badge on open
⋮----
// Close other drawers (like queue) if they are open
⋮----
close()
⋮----
toggle()
⋮----
render()
⋮----
// Export global instance
````

## File: assets/js/topSongs.js
````javascript
// topSongs.js
// Función para obtener y reproducir la canción más popular de un país
async function playCountry(countryCode = "mexico", type = "month")
⋮----
// Llama a tu API, por ejemplo: /top?country=mx&type=month
⋮----
// Crea/actualiza el contenedor para la lista
⋮----
// Crear el botón "Reproducir todo" si no existe
⋮----
// Listado de tracks
⋮----
// Agrega evento para reproducir al hacer clic en el nombre de la canción
⋮----
// Actualiza el título del enlace solo del que esta reproduciendo para indicarlo, resetea los demas
⋮----
// añade tambien color al autor
⋮----
// Asignar onclick garantiza un único handler activo (reemplaza cualquier asignación previa)
document.getElementById("playAllbtn").onclick = () =>
⋮----
// Función para reproducir la siguiente canción en la cola
⋮----
// Espera a que termine la canción actual
````

## File: .gitignore
````
build
"build/*"
dist
"dist/*"
node_modules
".vscode/*"
.env
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
cookies.txt
````

## File: script copy.js
````javascript
function debugLog(...args)
⋮----
let currentIndex = -1; // Ninguna al inicio
function cleanSongTitle(title)
⋮----
async function handleExpiredStream(currentSong)
⋮----
// Opcional: pasar a la siguiente canción
⋮----
// Función unificada para reproducir cualquier canción
async function playSong(song, isDownloaded = false)
⋮----
// Extraer "nombre base" quitando Jr/Sr/feat
⋮----
// Regex global e insensible a mayúsculas/minúsculas
⋮----
// Reemplazar todas las coincidencias del nombre base
⋮----
// Limpiar dobles espacios, guiones y paréntesis vacíos
⋮----
.replace(/\s{2,}/g, " ") // dobles espacios
.replace(/\s*[-–—]\s*/g, " ") // guiones sobrantes
.replace(/(^|\s),\s*/g, "$1") // elimina comas al inicio o después de espacios
.replace(/\(\s*\)/g, "") // paréntesis vacíos
⋮----
// Enviar a Discord
⋮----
// 👉 Actualizar índice si la canción estaba en la cola
⋮----
// Si no estaba en cola, reiniciamos con esta canción
⋮----
function renderQueue()
⋮----
// Contenido con imagen, botón de play y título
⋮----
// Resaltar la canción que se está reproduciendo
⋮----
// Cargar canciones descargadas
async function loadDownloaded()
⋮----
// Si no hay thumbnail, usamos un placeholder
⋮----
// Duración en formato minutos:segundos
⋮----
// Reproducir canción
⋮----
// Agregar a la cola
⋮----
// Función de búsqueda y reproducción directa
function cleanQuery(query, maxChars = 40)
⋮----
// Quitar paréntesis y corchetes con su contenido
⋮----
// Quitar "feat." y variaciones
//  cleaned = cleaned.replace(/feat\.?[^,]*,/gi, "");
⋮----
// Quitar "Remix", "Mixed", "Edit", etc.
⋮----
// Quitar caracteres extra y espacios dobles
⋮----
// Limitar a los primeros N caracteres SIN contar espacios
⋮----
async function searchSongDirectPlay(query = "")
⋮----
const genreEl = document.getElementById("songGenre"); // Añade este elemento en tu HTML si quieres mostrar el género
⋮----
// PLAY DIRECTO DEL PRIMER RESULTADO
⋮----
// Mostrar género del primer resultado
⋮----
// Renderiza los resultados igual que searchSongs
⋮----
// Función unificada para buscar canciones
async function searchSongs()
⋮----
// Nuevo tab para la cola
⋮----
searchContainer.style.display = "block"; // o "flex" según tu diseño
⋮----
// Reproducir directo
⋮----
// Descargar canción desde la búsqueda
⋮----
// ✅ Actualizar la lista de descargas
⋮----
// Agregar a la cola
⋮----
function addToQueue(song, isDownloaded = false)
⋮----
// Si no hay nada sonando, reproducimos directamente
⋮----
}, 4000); // pequeño retraso para asegurar que el DOM está listo
// Actualizar la vista de la cola
⋮----
function playNextInQueue()
⋮----
// Evento para botón
//searchButton.addEventListener("click", searchSongs);
⋮----
// Evento para Enter en input
⋮----
// Búsqueda automática tras 2 segundos de inactividad
⋮----
clearTimeout(searchTimeout); // resetea si el usuario sigue escribiendo
⋮----
}, 2000); // 2000ms = 2 segundos
⋮----
// Debug de eventos de audio
⋮----
case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED: // code === 4
⋮----
// 👉 Aquí podrías saltar a la siguiente canción de la cola si quieres
⋮----
// Inicializar
⋮----
progressBar.disabled = true; // Deshabilitado hasta que se cargue una canción
⋮----
// Inicializar volumen
⋮----
// ⏯ Play/Pause
⋮----
// 🔁 Repetir
⋮----
// 🔊 Mute/Unmute
⋮----
// 🎚 Control volumen
⋮----
// ⏱ Actualizar barra de progreso y tiempos
⋮----
// Función mejorada para obtener una canción aleatoria de un artista en iTunes
async function getRandomSongByArtist(artistName, excludeTrackName = null)
⋮----
// Filtrar canciones que contengan todas las partes del nombre del artista (no solo una)
// Normaliza: quita espacios y puntuación, pasa a minúsculas
function normalize(str)
⋮----
// Divide por comas y espacios, y filtra partes vacías
⋮----
// Filtra las canciones donde al menos la mitad de los "parts" estén presentes
⋮----
// Excluir la canción actual si es necesario
⋮----
// Devuelve más datos, incluyendo el género
⋮----
// Ejemplo de uso integrado:
async function playRandomSongByArtistDirect()
⋮----
// Ahora puedes pasar el género si tu función lo soporta
⋮----
// Si searchSongDirectPlay solo espera el query, puedes modificarla para aceptar también el género
// Ejemplo: await searchSongDirectPlay(songToPlay, song.genre);
⋮----
// Ejemplo de uso:
⋮----
// ⏱ Mostrar duración total
⋮----
// 🎵 Buscar en la barra
⋮----
renderQueue(); // actualizar resaltado en la cola
⋮----
// Listener para actualizaciones de yt-dlp
⋮----
// Usamos la función showModal que ya existe en tu proyecto
// para notificar al usuario de una forma más elegante que un alert.
⋮----
// No mostramos nada si ya está actualizado para no molestar.
⋮----
// 🕒 Formato mm:ss
function formatTime(seconds)
⋮----
// Nuevo tab para la cola
const queueTabButton = document.getElementById("queueTabButton"); // tu botón del tab
⋮----
// Tabs existentes
⋮----
searchContainer.style.display = "block"; // o "flex" según tu diseño
⋮----
function measureFPS()
⋮----
// cada 1 segundo
⋮----
//measureFPS();
⋮----
// Aplicar fondo guardado al cargar
⋮----
// Para el overlay negro con linear-gradient:
⋮----
// Guardar y aplicar nueva URL
⋮----
// Si ya hay un bg guardado, borrarlo
⋮----
// Guardar URL en localStorage
⋮----
// Aplicar inmediatamente al background
````

## File: assets/js/equalizer.js
````javascript
// ======= 6. CONFIGURACIÓN SEPARADA =======
⋮----
rampTime: 0.05, // Tiempo de rampa suave (~0.05s) para evitar clicks
⋮----
// Ajustes de presets con coeficientes de ganancia para cada banda
⋮----
// ======= 2. CONTROL DE LOGS EN PRODUCCIÓN =======
⋮----
/**
   * Imprime mensajes de depuración en consola si DEBUG está activo.
   * @param {...any} args - Argumentos a imprimir.
   */
function log(...args)
⋮----
// Obtener elementos de la interfaz
⋮----
// Validaciones iniciales del DOM
⋮----
// ======= 4. ARQUITECTURA: CLASE EQUALIZER =======
/**
   * Clase que gestiona el ecualizador de audio utilizando la Web Audio API.
   */
class Equalizer
⋮----
/**
     * Inicializa el contexto de audio y los nodos de filtrado.
     * El contexto solo se creará si el navegador lo soporta.
     * @param {HTMLAudioElement} audioEl - Elemento de audio HTML5.
     * @returns {boolean} True si la inicialización fue exitosa, false en caso contrario.
     */
init(audioEl)
⋮----
// ======= 7. DETECCIÓN DE SOPORTE =======
⋮----
// ======= 3. MANEJO DE ERRORES EN AUDIO CONTEXT =======
⋮----
// Crear filtros de frecuencia
⋮----
// Crear nodos de ganancia para cada banda
⋮----
// Conectar la cadena de audio: source -> filtros -> ganancias -> salida
⋮----
// Guardar las referencias de los nodos
⋮----
// Si había un preset pendiente seleccionado antes de dar play, aplicarlo
⋮----
/**
     * Reanuda de forma segura el contexto de audio si está suspendido.
     * @returns {Promise<void>}
     */
async resume()
⋮----
/**
     * Aplica de forma suave los cambios de ganancia de un preset determinado.
     * @param {string} name - Nombre del preset de EQ.
     */
applyPreset(name)
⋮----
// Validar si el preset existe, si no, aplicar fallback "flat"
⋮----
// ======= 8. FLUJO CORRECTO: Si no está inicializado, guardar como pendiente =======
⋮----
// ======= 5. TRANSICIONES SUAVES (linearRampToValueAtTime) =======
⋮----
// Anclar el valor inicial de la ganancia al valor actual para evitar chasquidos
⋮----
// Rampa lineal hacia el valor objetivo en rampTime segundos
⋮----
// Instanciar el gestor del ecualizador
⋮----
// ======= 3. MANEJO DE ERRORES EN LOCAL STORAGE & FALLBACK =======
⋮----
// Sincronizar el select de la interfaz
⋮----
// Guardar el preset inicial en el ecualizador (se aplicará al iniciar el reproductor)
⋮----
// ======= 8. FLUJO DE INICIALIZACIÓN POR EVENTO PLAY =======
⋮----
// ======= 1. BUG: UN SOLO EVENT LISTENER PARA EL SELECT =======
⋮----
// Guardar en localStorage de forma segura
⋮----
// Aplicar al ecualizador
````

## File: assets/js/style.js
````javascript
// ======= Fondo dinámico central =======
⋮----
input.value = savedUrl; // Muestra la URL en el input
⋮----
// ======= Imagen de fondo del reproductor =======
⋮----
const playerStyle = document.getElementById("playerCard"); // Elemento que tendrá el background
const inputStyle = document.getElementById("imgInput"); // Input para la URL
const btnStyle = document.getElementById("setImgBtn"); // Botón para asignar
⋮----
// Al iniciar la app, revisa si existe playerImg en localStorage
⋮----
inputStyle.value = savedImg; // Muestra la URL en el input
⋮----
document.getElementById("cover").style.opacity = "50%"; // baja opacidad de la carátula
}, 500); // espera medio segundo para asegurar que la imagen se haya cargado
⋮----
// Al hacer click en el botón, guarda la URL si es diferente
⋮----
if (!url) return; // No hacer nada si está vacío
if (url === localStorage.getItem("playerImg")) return; // No hacer nada si es igual
⋮----
document.getElementById("cover").style.opacity = "100%"; // restaura opacidad de la carátula
⋮----
// Función para actualizar el color de fondo basado en la imagen del reproductor siempre y cuando no haya una imagen personalizada
⋮----
function updatePlayerBgColor()
⋮----
// Asegúrate de que la imagen esté completamente cargada y tenga dimensiones válidas antes de procesarla
⋮----
// Extrae una paleta de colores de la imagen (toma 10 colores)
⋮----
// Calcula el promedio de los colores extraídos
⋮----
// Aplica el color promedio como fondo
⋮----
// Si la imagen no está cargada, vuelve a intentarlo
⋮----
// ======= Fin fondo dinámico =======
⋮----
//load custom gradient from localStorage
⋮----
gradientController.logCurrentGradient(true); // true para resetear a valores por defecto
⋮----
// Obtiene el background actual (linear-gradient)
getCurrentGradient()
⋮----
// Convierte color RGB a HEX
rgbToHex(r, g, b)
⋮----
// Convierte HEX a RGB
hexToRgb(hex)
⋮----
// Convierte string "rgb(8,0,20)" a HEX "#080014"
rgbStringToHex(rgbStr)
⋮----
// Establece el degradado con colores (admite HEX o RGB string)
setGradient(color1, color2)
⋮----
// Si no se pasan valores, toma los del input
⋮----
// Permite valores en formato rgb(r,g,b)
⋮----
// Muestra el degradado actual en la consola
logCurrentGradient(resetColors = false)
⋮----
// Si no se quiere mantener los colores actuales, resetea
⋮----
// JavaScript funcional de tabs
⋮----
openTab(tabId, element)
⋮----
// Oculta todos los tabs con clase is-hidden
⋮----
// Muestra el tab seleccionado
⋮----
// Resalta el botón seleccionado
⋮----
// Opcional: autoabrir el tab por defecto al cargar
⋮----
}, 400); // Duración del fade-out (debe coincidir con la transición del CSS)
}, 1000); // El spinner permanece visible 2 segundos
⋮----
// declarar variable para saber si activar la voz - variable global por defecto false
⋮----
// función para activar o desactivar la voz
⋮----
function toggleVoice()
function say(text)
⋮----
/* use google tts for voice personalized https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=Se%20esta%20reproduciendo%20so%20far%20so%20fake&tl=es-MX */
⋮----
function saySong(message)
⋮----
audio.preload = "auto"; // 👈 asegura que se descargue antes de reproducir
⋮----
// botón para probar la voz
````

## File: services/ytdlpResolver.js
````javascript
class ProcessQueue
⋮----
add(job, options =
⋮----
next()
⋮----
stats()
⋮----
function readJson(filePath)
⋮----
function writeJsonAtomic(filePath, data)
⋮----
function normalizeQuery(query)
⋮----
function extractVideoId(sourceUrl)
⋮----
function makeTrackKey(track)
⋮----
function toPublicTrack(entry)
⋮----
function isUsableStream(entry, now = Date.now())
⋮----
function isYouTubeRateLimitError(error)
⋮----
function classifyYtdlpError(error)
⋮----
function createYtdlpResolver(options)
⋮----
function persist()
⋮----
// Evict expired stream entries (tracks whose streamUrl has expired)
⋮----
// Evict expired search cache entries
⋮----
function rememberTrack(track, extra =
⋮----
function rememberSearchResults(query, results)
⋮----
function getCachedSearchResults(query)
⋮----
function getCachedStream(track)
⋮----
function runYtdlpGetUrl(sourceUrl)
⋮----
async function resolveTrack(track, options =
⋮----
function prewarmTracks(tracks, limit = 1)
⋮----
function getVersion()
⋮----
stats: () => (
````

## File: package.json
````json
{
  "name": "mexlify",
  "version": "1.0.0-alpha",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "dist": "electron-builder"
  },
  "description": "Mexlify - Alpha",
  "author": "vC3sar",
  "license": "ISC",
  "devDependencies": {
    "electron": "^38.0.0",
    "electron-builder": "^26.0.12"
  },
  "dependencies": {
    "@distube/ytdl-core": "^4.16.12",
    "@phosphor-icons/web": "^2.1.2",
    "adm-zip": "^0.5.18",
    "colorthief": "^3.5.0",
    "discord-rpc": "^4.0.1",
    "express": "^5.1.0",
    "ffmpeg-static": "^5.2.0",
    "googleapis": "^164.1.0",
    "jquery": "^4.0.0",
    "mysql2": "^3.15.3",
    "path": "^0.12.7",
    "play-dl": "^1.9.7",
    "simple-notify": "^1.0.6",
    "sqlite3": "^6.0.1",
    "sweetalert2": "^11.26.25",
    "tough-cookie": "^5.1.2",
    "youtube-sr": "^4.3.12",
    "yt-dlp-exec": "^1.0.2"
  },
  "build": {
    "appId": "com.mexlify.electron",
    "productName": "Mexlify Alpha",
    "icon": "build/icon.ico",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!**/*.map"
    ],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": [
            "x64",
            "ia32"
          ]
        }
      ]
    }
  }
}
````

## File: readme.md
````markdown
# 🎵 Mexlify Música [![Node.js CI](https://github.com/vC3sar/Mexlify_Musica/actions/workflows/node.js.yml/badge.svg)](https://github.com/vC3sar/Mexlify_Musica/actions/workflows/node.js.yml)

**Mexlify Música** es una aplicación de escritorio para Windows desarrollada con **Electron** que permite **escuchar música sin anuncios**, **buscar canciones** en YouTube, **descargar audio en MP3** y **mostrar tu actividad en Discord** mediante **Rich Presence**.  
Todo esto sin recopilar datos personales ni incluir publicidad.

---

## 🚀 Características Principales

- 🎧 **Escucha música sin anuncios**
- 🔎 **Búsqueda inteligente** con corrección automática de nombres (API de iTunes + Redis)
- 💾 **Descarga canciones** en formato `.mp3`
- 🖼️ **Portadas automáticas** y metadatos integrados
- 💬 **Integración con Discord RPC** (Rich Presence)
- 🧠 **Caché inteligente** local y remoto (Redis)
- 🧩 **Interfaz limpia** y sin distracciones
- ⚙️ **Compatible con Windows 10/11**

---

## 🧱 Tecnologías Utilizadas

- Electron — Motor principal de la aplicación
- yt-dlp — Extracción de metadatos y descarga de audio
- ffmpeg-static — Conversión a formato MP3
- Discord RPC — Presencia en Discord
- Node.js — Backend de ejecución
- API personalizada de Redis/iTunes — Corrección de títulos y metadatos de canciones

---

## 🖥️ Instalación

### 🔧 Requisitos previos

- Node.js v22 o superior  
- npm o yarn  
- Windows 10/11 no trabaja con linux debido al PATH de ffmpeg personalizado con .exe

### 📦 Instalación y ejecución

```
# Clonar el repositorio
git clone https://github.com/vaensystems/mexlify-music.git
cd mexlify-music

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Compilar versión final
npm run build
```

La aplicación generará un archivo ejecutable `.exe` dentro de `/dist`.

---

## 🕹️ Integración con Discord

Mexlify Música muestra en tu perfil de Discord lo que estás escuchando.  
Para habilitarlo:

1. Crea una aplicación en el Portal de Desarrolladores de Discord.
2. Copia el Client ID
3. Reemplázalo en el código:
   ```js
   const CLIENT_ID = "TU_CLIENT_ID_AQUI";
   ```
4. Inicia la app y verás algo como:  
   > 🎶 “Escuchando: Canción actual — Mexlify Music”

---

## 📁 Estructura del Proyecto

```
Mexlify/
├── main.js
├── preload.js
├── index.html
├── logo.png
├── package.json
└── /node_modules
```

---

## 🧩 API y Funcionalidades Internas

- Búsqueda de canciones con Redis + iTunes
- Descarga de audio en MP3
- Streaming directo sin descarga
- Caché local y remoto para resultados más rápidos

---

## 🔒 Términos y Condiciones de Uso

### 1. Uso de la Aplicación
Mexlify Música es una aplicación de escritorio gratuita para escuchar música sin anuncios.  
Está destinada únicamente a uso personal.  
No está permitido modificar, redistribuir o vender la aplicación sin autorización.

### 2. Propiedad Intelectual
Mexlify es un proyecto de código abierto, pero la marca, logo e interfaz están protegidos por derechos de autor.  
El contenido musical pertenece a sus respectivos autores.

### 3. Privacidad
Mexlify no recopila información personal.  
Puedes unirte a la comunidad en Discord para soporte técnico o sugerencias.

### 4. Limitación de Responsabilidad
La aplicación se ofrece “tal cual”, sin garantía de ningún tipo.  
Los desarrolladores no se hacen responsables de daños directos o indirectos derivados del uso del software.

### 5. Modificaciones
Los términos pueden cambiar sin previo aviso. Las actualizaciones se publicarán en Mexlify.top.

### 6. Contacto
📬 info@Mexlify.top

---

## 🧾 Licencia

Este proyecto se distribuye bajo una licencia de código abierto modificada, permitiendo su uso personal y educativo.  
Queda prohibida su redistribución con fines comerciales sin consentimiento del autor.

© 2025 VAEN Systems  
Mexlify.top

---

## 🌐 Aviso Legal

Mexlify actúa únicamente como intermediario técnico para acceder a contenido público de YouTube.  
No aloja, modifica ni distribuye dicho contenido.  
El uso de Mexlify implica la aceptación de los Términos de Servicio de YouTube.

---

## 💬 Comunidad

Únete a la comunidad de Mexlify en Discord:  
👉 [https://discord.gg/JRTtZWhDF8](https://discord.gg/JRTtZWhDF8)

---

Versión: 1.0.0 Alpha
Última actualización: 03 de Octubre de 2025  
Desarrollado por: VAEN Systems
````

## File: preload.js
````javascript
// Buscar canciones en YouTube
searchSong: async (query) =>
⋮----
// Descargar canción a carpeta local
downloadSong: async (song) =>
⋮----
// Obtener lista de canciones descargadas
getDownloaded: async () =>
⋮----
// Reproducir canción (si ya está descargada, usa local; si no, stream)
streamSong: async (song) =>
⋮----
// Precalienta canciones en segundo plano sin bloquear la UI.
prewarmSongs: async (songs, limit = 3) =>
⋮----
getYtdlpDiagnostics: async () =>
⋮----
updateYtdlpNightly: async () =>
⋮----
// Activar/desactivar modo debug
setDebug: async (value) =>
⋮----
// Enviar mensajes de debug al main
log: async (msg) =>
⋮----
// Obtener ruta de la app (útil para reproducir archivos locales)
getAppPath: async () =>
⋮----
// DISCORD STATUS
setDiscordActivity: async (details, state, image, resetTime) =>
⋮----
deleteDownload: async (filename) =>
⋮----
exportDownloadsToZip: async (selectedFilenames) =>
⋮----
openExternal: async (url) =>
⋮----
// SQLite Database API
incrementPlayCount: async (song) =>
⋮----
getMostPlayedSongs: async () =>
⋮----
// Recibir mensajes de actualización de yt-dlp
onYtdlpUpdate: (callback) =>
⋮----
// Eventos de progreso de exportación
onExportProgress: (callback) =>
removeExportProgressListener: () =>
⋮----
// Gestión de archivos .mexref
saveMexrefFile: async (payload) =>
readMexrefFiles: async () =>
⋮----
// Sistema de letras LRCLIB con sincronización y caché SQLite
getLyrics: async (songParams) =>
````

## File: assets/css/style.css
````css
:root {
⋮----
/* Reset y tipografía */
* {
⋮----
body {
⋮----
/* Para navbar fija */
⋮----
/* Espacio para el footer-compact-player fijo */
⋮----
/* Layout principal */
.main-layout {
⋮----
/* sidebar - contenido - sidebar derecho */
⋮----
/* Tablet: ajustar tamaño de columnas */
⋮----
/* reducir ancho de sidebars */
⋮----
#playerCard {
⋮----
#cover {
⋮----
.playback-controls {
⋮----
.playback-controls button {
⋮----
.volume-controls-row button {
⋮----
/* Pantallas pequeñas: solo sidebar izquierdo y contenido */
⋮----
/* todo en una columna */
⋮----
.player-area {
⋮----
/* Móviles muy pequeños: reducir padding */
⋮----
.main-container {
⋮----
/* Sidebar */
.sidebar {
⋮----
.sidebar h3 {
⋮----
/* Sidebar Toggle */
.sidebar-toggle-row {
⋮----
.sidebar-toggle-row h3 {
⋮----
.sidebar-toggle-btn {
⋮----
.sidebar-toggle-btn:hover {
⋮----
/* Estilos para el estado Colapsado (Solo Desktop) */
⋮----
.sidebar.collapsed {
⋮----
.sidebar.collapsed .sidebar-toggle-row {
⋮----
.sidebar.collapsed h3,
⋮----
.sidebar.collapsed ul li {
⋮----
.sidebar.collapsed ul li .menu-link-left {
⋮----
.sidebar.collapsed ul li .menu-link-left span {
⋮----
/* Lista dentro de la sidebar */
.sidebar ul {
⋮----
/* Items de la lista */
.sidebar ul li, .menu-link-glass {
⋮----
.sidebar ul li:hover, .menu-link-glass:hover {
⋮----
.menu-link-left {
⋮----
.menu-link-left i {
⋮----
.sidebar ul li:hover .menu-link-left i,
⋮----
.sidebar ul li a {
⋮----
/* Elementos no disponibles aún */
.menu-link-soon {
⋮----
.menu-link-soon:hover {
⋮----
/* Badge de Próximamente */
.badge-soon {
⋮----
.sidebar hr {
⋮----
/* Responsivo para pantallas pequeñas */
⋮----
.sidebar ul li {
⋮----
/* Responsivo para móviles muy pequeños */
⋮----
/* Contenido principal */
.content {
⋮----
/* Navbar glassy */
.navbar.glassy {
⋮----
.nav-left {
⋮----
.nav-logo {
⋮----
.company-name {
⋮----
.nav-title {
⋮----
.nav-right {
⋮----
.nav-right a {
⋮----
.nav-right a:hover {
⋮----
.nav-right a.is-active {
⋮----
/* Títulos */
h1 {
⋮----
/* Buscador */
#searchContainer {
⋮----
.searchIcon {
⋮----
/* Resultados y descargas */
#resultsList,
⋮----
/* Custom scrollbars for lists */
#resultsList::-webkit-scrollbar,
⋮----
#resultsList::-webkit-scrollbar-track,
⋮----
#resultsList::-webkit-scrollbar-thumb,
⋮----
#resultsList::-webkit-scrollbar-thumb:hover,
⋮----
/* Song list card items */
#resultsList li,
⋮----
#resultsList li:hover,
⋮----
#resultsList li img,
⋮----
.song-info {
⋮----
.song-info br {
⋮----
.song-info b {
⋮----
/* Action button group */
.song-actions {
⋮----
.song-actions button:not(#playlistSongsList li .song-actions button) {
⋮----
/* Icon-only button override */
.song-actions button:has(i):not(.play) {
⋮----
.song-actions button i {
⋮----
/* Play button theme */
.song-actions .play,
⋮----
.song-actions .play:hover,
⋮----
.song-actions .play i {
⋮----
/* Queue button theme */
.song-actions .queue:hover {
⋮----
/* Download button theme */
.song-actions .download:hover,
⋮----
/* Delete button theme */
.song-actions .deleteThis:hover {
⋮----
/* Reproductor fijo a la derecha */
#playerContainer {
⋮----
/* ---- Rediseño Premium de la Tarjeta del Reproductor Lateral (#playerCard) ---- */
⋮----
#playerCard:hover {
⋮----
/* Contenedor portada con relieve y sombra ambiental */
.player-cover-wrapper {
⋮----
.player-cover-wrapper:hover {
⋮----
#songInfo {
⋮----
#songTitle {
⋮----
#songTitle:hover {
⋮----
#songArtist {
⋮----
/* Audio player agrupado */
.progress-bar-wrapper {
⋮----
#progressBar {
⋮----
#progressBar:hover {
⋮----
#progressBar::-webkit-slider-runnable-track {
⋮----
#progressBar::-webkit-slider-thumb {
⋮----
#progressBar::-webkit-slider-thumb:hover {
⋮----
/* Controles de volumen */
.volume-controls {
⋮----
/* Slider estilo Liquid Glass */
#volumeSlider {
⋮----
#volumeSlider:hover {
⋮----
#volumeSlider::-webkit-slider-runnable-track {
⋮----
#volumeSlider::-webkit-slider-thumb {
⋮----
#volumeSlider::-webkit-slider-thumb:hover {
⋮----
#muteBtn {
⋮----
#muteBtn:hover {
⋮----
/* Barra de Progreso y Cronómetros simétricos */
.progress-container {
⋮----
#progressBar:hover::-webkit-slider-thumb {
⋮----
#time-info {
⋮----
#currentTime {
⋮----
#totalTime {
⋮----
.controls {
⋮----
.controls button {
⋮----
/* espacio fijo para que no salte */
⋮----
.play-icon {
⋮----
.pause-icon {
⋮----
button.playing .play-icon {
⋮----
button.playing .pause-icon {
⋮----
.controls button:hover {
⋮----
.playbtn {
⋮----
/* Resultados */
.resultsContainer p {
⋮----
/* Tabs */
.tabs {
⋮----
.tabs button {
⋮----
.tabs button.active {
⋮----
.active {
⋮----
/* List Header */
.ListHeader {
⋮----
.ListHeader h2 {
⋮----
.ListHeader h2:hover {
⋮----
/* Resultados lista */
#resultsList {
⋮----
#resultsList li {
⋮----
/* scrollbar estilo Liquid Glass */
/* Estilo general del scrollbar */
::-webkit-scrollbar {
⋮----
/* ancho de la barra vertical */
⋮----
/* alto de la barra horizontal (si hay) */
⋮----
/* Fondo del track (la parte por donde se mueve la barra) */
::-webkit-scrollbar-track {
⋮----
/* translúcido */
⋮----
/* Thumb (la parte que se mueve) */
::-webkit-scrollbar-thumb {
⋮----
/* borde sutil tipo glass */
⋮----
/* Hover del thumb */
::-webkit-scrollbar-thumb:hover {
⋮----
/* Footer estilo glass */
.glass-footer {
⋮----
/* Fondo tipo liquid glass */
⋮----
/* Sombra suave */
⋮----
/* --- Home View Redesign --- */
.home-welcome-header {
⋮----
.home-welcome-header h1 {
⋮----
.home-welcome-header p {
⋮----
/* Container */
.vaen-cards-container {
⋮----
/* Cards */
.vaen-card {
⋮----
.vaen-card:hover {
⋮----
/* Spotify Cover Layouts */
.spotify-card-cover {
⋮----
.spotify-cover-single {
⋮----
.spotify-cover-collage {
⋮----
.spotify-cover-collage img {
⋮----
/* Card content */
.vaen-card-info {
⋮----
.vaen-card-tag {
⋮----
.vaen-card-title {
⋮----
.vaen-card-desc {
⋮----
/* Play button */
.vaen-card-play-btn {
⋮----
.vaen-card-play-btn i {
⋮----
margin-left: 2px; /* Center alignment adjustment for play icon */
⋮----
.vaen-card:hover .vaen-card-play-btn {
⋮----
.vaen-card-play-btn:hover {
⋮----
.vaen-card-play-btn:active {
⋮----
/* Animaciones de entrada */
⋮----
/* Responsive */
⋮----
.vaen-play-btn {
⋮----
.vaen-play-btn::before {
⋮----
.vaen-play-btn::after {
⋮----
.vaen-play-btn:hover {
⋮----
.vaen-play-btn:active {
⋮----
.vaen-queue-container {
⋮----
.vaen-queue-container:hover {
⋮----
.vaen-queue-container h3 {
⋮----
.vaen-queue-container ul {
⋮----
/* scroll si hay muchas */
⋮----
.vaen-queue-container li {
⋮----
.vaen-queue-container li:hover {
⋮----
.vaen-queue-container li.playing {
⋮----
.vaen-queue-container li span {
⋮----
.queue-button-container {
⋮----
.queue-button {
⋮----
.queue-button:hover {
⋮----
.glass-box {
⋮----
/* Capa con degradado + efecto glass */
.glass-box::before {
⋮----
/* Contenido encima */
.glass-box>* {
⋮----
/* Input */
.bgInput {
⋮----
/* efecto glass suave */
⋮----
.bgInput::placeholder {
⋮----
.bgInput:focus {
⋮----
#country-top-container {
⋮----
/* Opcional: para que se vea encima en fondos oscuros */
⋮----
#country-top-container li:active {
⋮----
#country-top-container li:hover {
⋮----
#country-top-container h3 {
⋮----
#country-top-container a {
⋮----
#country-top-container a:hover {
⋮----
#country-top-container ol {
⋮----
.backtop {
⋮----
.backtop:hover {
⋮----
.backtop:active {
⋮----
/* Botón */
.changeBg {
⋮----
.changeBg:hover {
⋮----
.changeBg:active {
⋮----
hr {
⋮----
#artistRecommends li:active {
⋮----
#artistRecommends li:hover {
⋮----
#artistRecommends h3 {
⋮----
#artistRecommends a {
⋮----
#artistRecommends a:hover {
⋮----
#artistRecommends ol {
⋮----
#artistRecommends ul {
⋮----
/* Reproducción automática */
/* Contenedor con efecto glass */
.glass-control-ra {
⋮----
/* Label principal */
.glass-label-ra {
⋮----
/* Textos pequeños */
.small-ra {
⋮----
.small-info {
⋮----
/* ✨ Estilo glass sin fondo */
⋮----
/* Switch estilo checkbox */
.switch-ra {
⋮----
/* Oculta el checkbox real */
.switch-ra input {
⋮----
/* Fondo del switch */
.slider-ra {
⋮----
/* Botón redondo */
.slider-ra:before {
⋮----
/* Activo */
.switch-ra input:checked+.slider-ra {
⋮----
.switch-ra input:checked+.slider-ra:before {
⋮----
/* Ajustes */
#settings {
⋮----
.menu-link-glass {
⋮----
.menu-link-glass:hover {
⋮----
.menu-link-glass a {
⋮----
/* Fondo sutil */
⋮----
.ph {
⋮----
.theme {
⋮----
.controls-theme {
⋮----
.controls-theme label {
⋮----
.controls-theme input[type="color"] {
⋮----
.controls-theme input[type="color"]:hover,
⋮----
.color-inputs {
⋮----
.controls-theme button {
⋮----
.controls-theme,
⋮----
.tabsSettings {
⋮----
.tablinkSettings {
⋮----
.tablinkSettings:hover,
⋮----
.tablinkSettings.active,
⋮----
#spinner-overlay {
⋮----
.app-logo {
⋮----
/* Animación de entrada para el logo */
⋮----
.spinner {
⋮----
/* Para fade out */
#spinner-overlay.hide {
⋮----
.glass-audio-quality {
⋮----
.footer-compact-player {
⋮----
.fcp-left,
⋮----
.fcp-left {
⋮----
.fcp-cover {
⋮----
.fcp-cover:hover {
⋮----
.fcp-song-info {
⋮----
.fcp-title {
⋮----
.fcp-artist {
⋮----
.fcp-center {
⋮----
.fcp-controls-row {
⋮----
.fcp-btn {
⋮----
.fcp-btn:hover {
⋮----
.fcp-btn:active {
⋮----
/* Play/Pause Main compact button */
#fcp-playPauseBtn {
⋮----
#fcp-playPauseBtn:hover {
⋮----
#fcp-playPauseBtn:active {
⋮----
.fcp-progress {
⋮----
.fcp-progressbar {
⋮----
.fcp-progressbar:hover {
⋮----
.fcp-progressbar::-webkit-slider-thumb {
⋮----
.fcp-progressbar:hover::-webkit-slider-thumb {
⋮----
.fcp-progressbar:focus {
⋮----
.fcp-time {
⋮----
.fcp-right {
⋮----
.fcp-volume {
⋮----
.fcp-volume:hover {
⋮----
.fcp-volume::-webkit-slider-thumb {
⋮----
#fcp-queueBtn:hover {
⋮----
.disabled {
⋮----
.label-info-gray {
⋮----
/* No permitir selección */
⋮----
.span-muted {
⋮----
.span-template {
⋮----
/* Estilo para las opciones dentro de los menús desplegables */
.glass-select option {
⋮----
background: #1c1c1c !important; /* Un fondo oscuro para mejor compatibilidad */
color: #ffffff !important; /* Color de texto blanco */
padding: 8px; /* Añade algo de espacio interno si el navegador lo permite */
⋮----
/* ============================================================
   SISTEMA DE ESTADO CENTRALIZADO — Mexlify Nav Refactor
   ============================================================ */
⋮----
/* Clase de ocultación centralizada (reemplaza style="display:none") */
.is-hidden {
⋮----
/* Animación de entrada para secciones de vista */
.view-section {
⋮----
/* Cuando está oculta, sin animación */
.view-section.is-hidden {
⋮----
/* ---- Nav activo ---- */
⋮----
/* ---- Botón en estado de carga/bloqueado ---- */
.btn--loading {
⋮----
/* ---- Badges "Próximamente" ---- */
⋮----
/* ---- Queue Drawer ---- */
/* Sobreescribe los estilos anteriores de #queuetab */
#queuetab {
⋮----
/* Anula mix-blend-mode del estilo anterior que causaba problemas */
⋮----
/* Estado abierto del drawer */
#queuetab.is-open {
⋮----
/* Hover del drawer — anula el transform del estilo anterior */
#queuetab:hover {
⋮----
/* Header del drawer */
.queue-drawer-header {
⋮----
.queue-drawer-header h3 {
⋮----
/* Botón de cierre del drawer */
.queue-close-btn {
⋮----
.queue-close-btn:hover {
⋮----
/* Lista del drawer */
#queuetab #queueList {
⋮----
/* Queue item cards (Ultra-compact & high-density layout) */
.queue-item {
⋮----
.queue-item:hover {
⋮----
.queue-item.playing {
⋮----
.queue-thumb {
⋮----
/* Header de cola con acciones */
.queue-header-left {
⋮----
.queue-count-badge {
⋮----
.queue-header-actions {
⋮----
.queue-action-btn {
⋮----
.queue-action-btn:hover {
⋮----
.queue-action-btn.is-active {
⋮----
/* Queue item estructurado */
⋮----
/* Asas de arrastre: fit mínimo absoluto para la cola */
.queue-drag-handle {
⋮----
.queue-drag-handle:hover {
⋮----
.queue-drag-handle:active {
⋮----
.queue-drag-handle i {
⋮----
.song-drag-handle {
⋮----
.song-drag-handle:hover {
⋮----
.queue-item-info {
⋮----
.queue-item-title {
⋮----
.queue-item:hover .queue-item-title {
⋮----
.queue-item-artist {
⋮----
.queue-item-remove-btn {
⋮----
.queue-item-remove-btn:hover {
⋮----
/* Drag & Drop Feedback Visual */
.is-dragging {
⋮----
.drag-over-top {
⋮----
.drag-over-bottom {
⋮----
/* Playlist header actions */
.playlist-title-row {
⋮----
.playlist-meta-action-btn {
⋮----
.playlist-meta-action-btn:hover {
⋮----
.playlist-meta-action-btn.btn-danger:hover {
⋮----
/* Botón activo de repeat y shuffle en el reproductor */
#repeatBtn.is-repeat-one {
#repeatBtn.is-repeat-all {
#shuffleBtn.is-active,
⋮----
/* Overlay semitransparente detrás del drawer */
#queueOverlay {
⋮----
#queueOverlay.is-open {
⋮----
/* ---- Home view wrapper ---- */
#homeView {
⋮----
/* ---- Settings tab activo ---- */
.tablinkSettings.is-active {
⋮----
/* ---- fcp-time-total (alias legible) ---- */
.fcp-time-total {
⋮----
/* ---- Messages Drawer ---- */
#messagestab {
⋮----
#messagestab.is-open {
⋮----
#messagestab:hover {
⋮----
.messages-drawer-header {
⋮----
.messages-drawer-header h3 {
⋮----
.messages-action-btn {
⋮----
.messages-action-btn:hover {
⋮----
#clearMessagesBtn:hover {
⋮----
#closeMessagesBtn:hover {
⋮----
/* Drawer subheader tabs row */
.messages-drawer-tabs {
⋮----
.msg-tab-btn {
⋮----
.msg-tab-btn:hover {
⋮----
.msg-tab-btn.is-active {
⋮----
.messages-drawer-list {
⋮----
/* Items en la bandeja de sistema */
.message-item {
⋮----
.message-item:hover {
⋮----
.message-icon-wrapper {
⋮----
/* Colores de tipo de mensaje */
.message-info .message-icon-wrapper {
⋮----
.message-success .message-icon-wrapper {
⋮----
.message-warning .message-icon-wrapper {
⋮----
.message-error .message-icon-wrapper {
⋮----
.message-music .message-icon-wrapper {
⋮----
.message-content {
⋮----
.message-header {
⋮----
.message-title {
⋮----
.message-time {
⋮----
.message-text {
⋮----
/* Empty state */
.messages-empty-state {
⋮----
.messages-empty-state i {
⋮----
.messages-empty-state p {
⋮----
/* Overlay */
#messagesOverlay {
⋮----
#messagesOverlay.is-open {
⋮----
/* Badge de la sidebar */
.sidebar-badge {
⋮----
/* ---- Search input discrete tip (definido en bloque de búsqueda principal) ---- */
⋮----
/* ---- Playlists Management ---- */
.playlist-create-row {
⋮----
.playlist-create-row input {
⋮----
.playlist-create-row input:focus {
⋮----
.playlists-grid {
⋮----
.playlist-card {
⋮----
.playlist-card:hover {
⋮----
.playlist-card-icon {
⋮----
.playlist-card:hover .playlist-card-icon {
⋮----
.playlist-card-name {
⋮----
.playlist-card-count {
⋮----
.playlist-card-delete-btn {
⋮----
.playlist-card:hover .playlist-card-delete-btn {
⋮----
.playlist-card-delete-btn:hover {
⋮----
.playlist-detail-header {
⋮----
.playlist-detail-header h3 {
⋮----
/* Playlist Selection Modal */
.playlist-modal-overlay {
⋮----
.playlist-modal-content {
⋮----
.playlist-modal-header {
⋮----
.playlist-modal-header h3 {
⋮----
.playlist-modal-body {
⋮----
.modal-song-title {
⋮----
.playlist-modal-list {
⋮----
.playlist-modal-item {
⋮----
.playlist-modal-item:hover {
⋮----
.playlist-modal-create {
⋮----
.playlist-modal-create input {
⋮----
.playlist-modal-create input:focus {
⋮----
/* Add to playlist button hover */
.song-actions .add-to-playlist:hover {
⋮----
/* ============================================================
   Playlist Songs List — full redesign
   ============================================================ */
⋮----
#playlistSongsList {
⋮----
/* Scrollbar inteligente personalizado para la lista de reproducción */
#playlistSongsList::-webkit-scrollbar {
⋮----
#playlistSongsList::-webkit-scrollbar-track {
⋮----
#playlistSongsList::-webkit-scrollbar-thumb {
⋮----
#playlistSongsList::-webkit-scrollbar-thumb:hover {
⋮----
#playlistSongsList::-webkit-scrollbar-thumb:active {
⋮----
#playlistSongsList li {
⋮----
#playlistSongsList li:hover {
⋮----
/* Row number badge */
#playlistSongsList li::before {
⋮----
#playlistSongsList li:hover::before {
⋮----
/* Thumbnail */
#playlistSongsList li img.play {
⋮----
#playlistSongsList li:hover img.play {
⋮----
/* Song info */
#playlistSongsList li .song-info {
⋮----
#playlistSongsList li .song-info br {
⋮----
#playlistSongsList li .song-info b {
⋮----
#playlistSongsList li .song-info span,
⋮----
/* Actions */
#playlistSongsList li .song-actions {
⋮----
#playlistSongsList li:hover .song-actions {
⋮----
/* Action buttons shared */
#playlistSongsList li .song-actions button {
⋮----
#playlistSongsList li .playbtn {
⋮----
font-size: 0 !important;         /* hide the "Reproducir" text */
⋮----
/* Re-show the icon at normal size */
#playlistSongsList li .playbtn i {
⋮----
#playlistSongsList li .playbtn:hover {
⋮----
/* Queue button */
#playlistSongsList li .queue:hover {
⋮----
/* Re-link button */
#playlistSongsList li .relink-pl:hover {
⋮----
/* Download button */
#playlistSongsList li .download-pl:hover {
⋮----
/* Remove button */
#playlistSongsList li .remove-from-pl:hover {
⋮----
/* Offline badge */
#playlistSongsList li .song-actions span[title="Disponible offline"] {
⋮----
/* Controles responsivos del player de escritorio */
.controls-container {
⋮----
/* Controles de reproducción con simetría y jerarquía premium */
⋮----
/* Botón Central Héroe Play/Pause */
.control-btn-play {
⋮----
.control-btn-play:hover {
⋮----
.control-btn-play:active {
⋮----
/* Botones de salto Anterior/Siguiente */
.control-btn-skip {
⋮----
.control-btn-skip:hover {
⋮----
/* Botones auxiliares Shuffle / Repeat */
.control-btn-secondary {
⋮----
.control-btn-secondary:hover {
⋮----
.control-btn-secondary.is-active {
⋮----
/* Píldora de volumen integrada */
.volume-controls-row {
⋮----
.volume-controls-row:hover {
⋮----
.volume-controls-row button:hover {
⋮----
.volume-controls-row input[type="range"] {
⋮----
.volume-controls-row input[type="range"]::-webkit-slider-thumb {
⋮----
.volume-controls-row input[type="range"]:hover::-webkit-slider-thumb {
⋮----
/* Grupo de botones de acciones inferiores (Letras + Cola) */
.queue-button-container.player-actions-group {
⋮----
.queue-button.active {
⋮----
/* ==========================================================================
   REDiseño PREMIUM UI/UX MEXLIFY (Panel Central)
   ========================================================================== */
⋮----
/* Animación de entrada suave para las pestañas activas */
⋮----
.view-section:not(.is-hidden) {
⋮----
/* Bloque de Búsqueda Principal */
.search-hero-card,
⋮----
.search-title-row {
⋮----
.glow-pink {
⋮----
/* Barra de Búsqueda */
.premium-search-bar {
⋮----
.premium-search-bar:hover {
⋮----
.premium-search-bar:focus-within {
⋮----
.premium-search-bar .searchIcon {
⋮----
.premium-search-bar:focus-within .searchIcon {
⋮----
.premium-search-bar input {
⋮----
.premium-search-bar input::placeholder {
⋮----
/* Ocultar botón nativo de cancelar para usar nuestro control estilizado */
.premium-search-bar input::-webkit-search-cancel-button,
⋮----
/* Botón limpiar texto */
.search-clear-btn {
⋮----
.search-clear-btn:hover {
⋮----
.search-clear-btn.is-hidden {
⋮----
/* Botón ejecutar búsqueda integrado en el campo */
.search-action-btn {
⋮----
.search-action-btn:hover:not(:disabled) {
⋮----
.search-action-btn:active:not(:disabled) {
⋮----
.search-action-btn:disabled {
⋮----
.search-action-btn.is-loading i {
⋮----
/* Microcopy discreto debajo del buscador */
.search-tip-label {
⋮----
/* Compatibilidad con tema claro */
[data-theme="light"] .search-hero-card,
⋮----
[data-theme="light"] .search-title-row,
⋮----
[data-theme="light"] .premium-search-bar,
⋮----
[data-theme="light"] .premium-search-bar:hover,
⋮----
[data-theme="light"] .premium-search-bar:focus-within,
⋮----
[data-theme="light"] .premium-search-bar .searchIcon,
⋮----
[data-theme="light"] .premium-search-bar:focus-within .searchIcon,
⋮----
[data-theme="light"] .premium-search-bar input,
⋮----
[data-theme="light"] .premium-search-bar input::placeholder,
⋮----
[data-theme="light"] .search-clear-btn,
⋮----
[data-theme="light"] .search-clear-btn:hover,
⋮----
[data-theme="light"] .search-action-btn,
⋮----
[data-theme="light"] .search-action-btn:hover:not(:disabled),
⋮----
[data-theme="light"] .search-tip-label,
⋮----
/* Sugerencias de Búsqueda */
.search-suggestions-container {
⋮----
.suggestions-label {
⋮----
.search-suggestions-scroll {
⋮----
.suggestion-pill {
⋮----
.suggestion-pill:hover {
⋮----
/* Badges e información estadística */
.stat-badge {
⋮----
.header-title-group {
⋮----
/* Filtro local */
.local-filter-bar {
⋮----
.local-filter-bar i {
⋮----
.local-filter-bar input {
⋮----
.local-filter-bar input:focus {
⋮----
/* Playlists Premium Card & Grid */
.premium-create-card {
⋮----
.create-card-left {
⋮----
.create-card-left input {
⋮----
.create-card-left input:focus {
⋮----
/* Cuadrícula de Playlists */
⋮----
.playlist-card::before {
⋮----
.playlist-card:hover::before {
⋮----
/* Portada Dinámica / Collage en Tarjeta */
.playlist-card-cover {
⋮----
.playlist-card:hover .playlist-card-cover {
⋮----
.playlist-card-cover .spotify-cover-collage {
⋮----
.playlist-card-cover .spotify-cover-collage img {
⋮----
.playlist-card-cover .single-cover-img {
⋮----
/* Dropzone animada para arrastrar archivos .csv */
.playlist-drop-zone {
⋮----
.playlist-drop-zone.dragover {
⋮----
/* Botón eliminar playlist en tarjeta */
⋮----
/* Detalle de Playlist Premium Hero — Rediseño High-End Spotify/Apple Music */
.playlist-detail-header-premium {
⋮----
/* Barra superior: Volver a playlists + Acciones de gestión */
.playlist-detail-topbar {
⋮----
.backtop-premium {
⋮----
.backtop-premium:hover {
⋮----
.playlist-quick-actions {
⋮----
.playlist-header-icon-btn {
⋮----
.playlist-header-icon-btn:hover {
⋮----
.playlist-header-icon-btn.btn-danger:hover {
⋮----
/* Fila Hero: Carátula amplia (130px) + Metadatos de la playlist */
.playlist-header-hero {
⋮----
.playlist-hero-cover {
⋮----
.playlist-hero-cover:hover {
⋮----
.playlist-hero-cover .playlist-card-cover {
⋮----
.playlist-hero-cover .spotify-cover-collage {
⋮----
.playlist-hero-cover .spotify-cover-collage img {
⋮----
.playlist-hero-cover .single-cover-img {
⋮----
.playlist-hero-cover .playlist-card-icon {
⋮----
.playlist-detail-meta {
⋮----
.playlist-meta-type {
⋮----
.playlist-hero-title {
⋮----
.playlist-meta-chips {
⋮----
.playlist-chip {
⋮----
.playlist-chip i {
⋮----
.playlist-chip-dot {
⋮----
/* Fila de Acciones: Botón principal de Reproducir + Acciones secundarias */
.playlist-hero-actions {
⋮----
/* Botón Primario: Reproducir */
.playlist-action-primary {
⋮----
.playlist-action-primary:hover {
⋮----
.playlist-action-primary i {
⋮----
/* Botones Secundarios Glassmorphic */
.playlist-action-secondary {
⋮----
.playlist-action-secondary:hover {
⋮----
.playlist-action-secondary i {
⋮----
.btn-label-desktop {
⋮----
/* Indicador de canción en reproducción activa (Ecualizador) */
.active-playing-indicator {
⋮----
.active-playing-indicator .bar {
⋮----
.active-playing-indicator .bar1 { animation-delay: 0.15s; }
.active-playing-indicator .bar2 { animation-delay: 0.4s; animation-duration: 0.6s; }
.active-playing-indicator .bar3 { animation-delay: 0.02s; animation-duration: 0.9s; }
.active-playing-indicator .bar4 { animation-delay: 0.55s; animation-duration: 0.72s; }
⋮----
/* Efecto visual de canción activa en la lista */
li.is-playing {
⋮----
li.is-playing .song-info b {
⋮----
/* Rediseño de la sección de Ajustes */
⋮----
.tablinkSettings:hover:not(.active):not(.is-active) {
⋮----
/* Contenedores de grupos de configuración */
.settings-group-container {
⋮----
.settings-card {
⋮----
.settings-card-header {
⋮----
.settings-card-header i {
⋮----
.settings-card-header h3 {
⋮----
.settings-row {
⋮----
.settings-row:last-of-type {
⋮----
.settings-info {
⋮----
.settings-label {
⋮----
.settings-desc {
⋮----
.settings-control {
⋮----
/* Selectores premium */
.glass-select-premium {
⋮----
.glass-select-premium:focus {
⋮----
.glass-select-premium option {
⋮----
/* Nota pequeña */
.note-row {
⋮----
.settings-note {
⋮----
/* Botón narrador de voz */
.small-info-new {
⋮----
.btn-group-vertical {
⋮----
.test-voice-btn {
⋮----
.buttons-row {
⋮----
/* Campos de entrada en personalización */
.vertical-layout {
⋮----
.bgInput-new {
⋮----
.bgInput-new:focus {
⋮----
.settings-input-group {
⋮----
.action-buttons-row {
⋮----
.action-btn-new {
⋮----
.action-buttons-row button.delete-style {
⋮----
.action-buttons-row button.delete-style:hover {
⋮----
/* Color Pickers en Ajustes de Degradado */
.color-picker-grid {
⋮----
.color-picker-col {
⋮----
.color-label {
⋮----
.color-input-wrapper {
⋮----
.color-input-wrapper input[type="color"] {
⋮----
.color-input-wrapper input[type="color"]::-webkit-color-swatch-wrapper {
⋮----
.color-input-wrapper input[type="color"]::-webkit-color-swatch {
⋮----
/* Sliders de rango en Ajustes (Accesibilidad) */
.settings-range-wrapper {
⋮----
.settings-range-slider {
⋮----
.settings-range-slider::-webkit-slider-thumb {
⋮----
.settings-range-slider::-webkit-slider-thumb:hover {
⋮----
.settings-range-value {
⋮----
.color-hex-preview {
⋮----
.theme-controls {
⋮----
/* Reproduciendo Text Animation */
.reproduciendo-text-container {
⋮----
.reproduciendo-text-container.active {
⋮----
.reproduciendo-text {
⋮----
/* Efecto de iluminacion */
⋮----
/* Sombra opcional sutil en vez de glow nativo para que funcione bien con text-fill-color */
⋮----
/* ========================================================
   MODAL DE EXPORTACIÓN A ZIP / MP3 DUMP
   ======================================================== */
.export-modal-content {
⋮----
.export-header-title {
⋮----
.export-header-title i {
⋮----
.export-header-title h3 {
⋮----
.export-subtitle {
⋮----
.export-modal-body {
⋮----
.export-stats-bar {
⋮----
.export-stat-pill {
⋮----
.export-stat-pill.pill-new {
⋮----
.export-stat-pill.pill-exported {
⋮----
.export-stat-pill.pill-selected {
⋮----
.export-quick-actions {
⋮----
.export-chip-btn {
⋮----
.export-chip-btn:hover {
⋮----
.export-chip-btn.active {
⋮----
.export-chip-btn.chip-danger:hover {
⋮----
.export-search-box {
⋮----
.export-search-box i {
⋮----
.export-search-box input {
⋮----
.export-search-box input:focus {
⋮----
.export-songs-list {
⋮----
.export-song-row {
⋮----
.export-song-row:hover {
⋮----
.export-song-row.is-selected {
⋮----
.export-song-checkbox {
⋮----
.export-song-thumb {
⋮----
.export-song-meta {
⋮----
.export-song-title {
⋮----
.export-song-artist {
⋮----
.export-song-tag {
⋮----
.export-song-tag.tag-new {
⋮----
.export-song-tag.tag-old {
⋮----
.export-modal-footer {
⋮----
.export-btn-secondary {
⋮----
.export-btn-secondary:hover {
⋮----
.export-btn-primary {
⋮----
.export-btn-primary:disabled {
⋮----
/* ========================================================
   SECCIÓN: EXCLUIR CANCIONES (.MEXREF)
   ======================================================== */
.mexref-section-container {
⋮----
.mexref-section-container:hover {
⋮----
.mexref-header-row {
⋮----
.mexref-title-group {
⋮----
.mexref-section-title {
⋮----
.mexref-section-title i {
⋮----
.mexref-count-badge {
⋮----
.mexref-import-btn {
⋮----
.mexref-import-btn:hover {
⋮----
.mexref-files-chips-container {
⋮----
.mexref-file-chip {
⋮----
.mexref-chip-name {
⋮----
.mexref-chip-badge {
⋮----
.mexref-chip-remove-btn {
⋮----
.mexref-chip-remove-btn:hover {
⋮----
.mexref-summary-box {
⋮----
.mexref-summary-item {
⋮----
.mexref-summary-item strong {
⋮----
.mexref-summary-item.text-excluded {
⋮----
.mexref-summary-item.text-excluded strong {
⋮----
.mexref-summary-item.text-remaining {
⋮----
.mexref-summary-item.text-remaining strong {
⋮----
.export-song-tag.tag-mexref-excluded {
⋮----
.export-song-row.is-mexref-excluded {
⋮----
.export-song-row.is-mexref-excluded:hover {
⋮----
/* ========================================================
   MODAL DE PROGRESO DE EXPORTACIÓN (UI / UX EXCELENTE)
   ======================================================== */
.export-progress-modal-content {
⋮----
.export-progress-header {
⋮----
.export-progress-icon-wrap {
⋮----
.export-progress-header-text h3 {
⋮----
.export-progress-header-text p {
⋮----
.export-progress-body {
⋮----
.export-progress-song-card {
⋮----
.export-progress-song-details {
⋮----
.export-progress-song-name {
⋮----
.export-progress-song-step {
⋮----
.export-progress-bar-container {
⋮----
.export-progress-bar-track {
⋮----
.export-progress-bar-fill {
⋮----
.export-progress-bar-meta {
⋮----
.export-progress-bar-meta span:last-child {
⋮----
.export-progress-status-footer {
⋮----
/* ==========================================================================
   MEXLIFY MUSIC - APPLE MUSIC INSPIRED SYNCHRONIZED LYRICS PANEL
   ========================================================================== */
⋮----
.player-actions-group {
⋮----
.player-actions-group .queue-button {
⋮----
.lyrics-view-overlay {
⋮----
.lyrics-view-overlay.is-hidden {
⋮----
.lyrics-view-panel {
⋮----
.lyrics-view-panel.is-hidden {
⋮----
/* Fondo dinámico difuminado estilo Apple Music */
.lyrics-bg-mesh {
⋮----
.lyrics-bg-mesh img {
⋮----
.lyrics-backdrop-scrim {
⋮----
/* Barra superior */
.lyrics-header {
⋮----
.lyrics-header-left {
⋮----
.lyrics-app-badge {
⋮----
.lyrics-mode-badge {
⋮----
.lyrics-mode-badge.is-synced {
⋮----
.lyrics-mode-badge.is-plain {
⋮----
.lyrics-header-right {
⋮----
.lyrics-header-action-btn,
⋮----
.lyrics-header-action-btn:hover,
⋮----
/* Layout de 2 columnas */
.lyrics-content-layout {
⋮----
/* Columna izquierda: Carátula e información */
.lyrics-album-column {
⋮----
.lyrics-artwork-card {
⋮----
.lyrics-artwork-card:hover {
⋮----
.lyrics-artwork-card img {
⋮----
.lyrics-song-meta {
⋮----
.lyrics-song-title {
⋮----
.lyrics-song-artist {
⋮----
.lyrics-song-album {
⋮----
/* Columna derecha: Flujo de letras */
.lyrics-stream-column {
⋮----
/* Máscara de desvanecimiento superior e inferior tipo Apple Music */
.lyrics-scroll-viewport {
⋮----
/* Scrollbar sutil y translúcida */
.lyrics-scroll-viewport::-webkit-scrollbar {
.lyrics-scroll-viewport::-webkit-scrollbar-track {
.lyrics-scroll-viewport::-webkit-scrollbar-thumb {
.lyrics-scroll-viewport::-webkit-scrollbar-thumb:hover {
⋮----
.lyrics-lines-container {
⋮----
/* Líneas de letra individuales */
.lyrics-line {
⋮----
.lyrics-line:hover {
⋮----
/* Línea activa (reproduciéndose actualmente) */
.lyrics-line.active {
⋮----
/* Líneas pasadas */
.lyrics-line.passed {
⋮----
/* Letras sin sincronizar (formato lectura limpio) */
.lyrics-plain-container {
⋮----
.lyrics-plain-paragraph {
⋮----
/* Botón flotante de sincronización (Apple Music "Sincronizar") */
.lyrics-sync-pill {
⋮----
.lyrics-sync-pill:hover {
⋮----
.lyrics-sync-pill.is-hidden {
⋮----
/* Estados de carga y vacío */
.lyrics-empty-state,
⋮----
.lyrics-empty-state i,
⋮----
.lyrics-empty-state h3 {
⋮----
.lyrics-empty-state p {
⋮----
.lyrics-retry-btn {
⋮----
.lyrics-retry-btn:hover {
⋮----
.lyrics-pulse-dot {
⋮----
/* Botón de alternancia activo en UI */
.lyrics-toggle-btn.is-active,
⋮----
/* Responsividad para pantallas medianas y móviles */
````

## File: assets/js/script.js
````javascript
// ======= Constantes de DOM =======
⋮----
// Referencias nuevas — navegación centralizada y queue drawer
⋮----
// Playlists DOM
⋮----
// Modal Selección Playlist DOM
⋮----
// ======= Variables globales =======
⋮----
let repeatMode = "off"; // "off" | "all" | "one"
⋮----
function isSameSong(s1, s2)
⋮----
// ======= Utilidades =======
function debugLog(...args)
⋮----
function showPlayerStatus(message)
⋮----
// Log strictly to our system messages tray to keep the screen clean and avoid toast spam
⋮----
function cleanSongTitle(title)
⋮----
function formatTime(seconds)
⋮----
function normalize(str)
⋮----
// ======= Limpieza de Query =======
function cleanQuery(query)
⋮----
// Limitar a los primeros N caracteres SIN contar espacios
⋮----
// ======= Reproducción y manejo de audio =======
async function handleExpiredStream(currentSong)
async function playSong(song, isDownloaded = false, forceIndex = -1)
⋮----
// Solo bloquear si se hace clic repetido en la MISMA canción que ya está cargando
⋮----
// Si es una canción distinta, la nueva sesión toma el control inmediatamente
⋮----
// Limpiar controlador dinámico de topSongs
⋮----
// Limpiar cola automática de top country si se reproduce una canción directamente
⋮----
// Normalizar y guardar en historial de reproducción reciente
⋮----
// Incrementar contador de reproducciones en base de datos SQLite
⋮----
// Actualizar la portada de la playlist en tiempo real
⋮----
// Portada
⋮----
// Título y artista
⋮----
// Discord Rich Presence
⋮----
// Pausar canción anterior
⋮----
// [Fase 4: Opción A - Lazy Resolution inmediata]
⋮----
// Auto-recuperación (Auto-heal): Si el video vinculado fue borrado o bloqueado en YouTube,
// invalidamos el enlace viejo y buscamos una versión alternativa funcional automáticamente.
⋮----
// Manejo de cola
⋮----
// Insertar después de la canción actual sin destruir la cola existente
⋮----
// MediaSession API
⋮----
// ======= Cola de reproducción y Persistencia =======
function saveQueueToStorage()
⋮----
function loadQueueFromStorage()
⋮----
function removeFromQueue(index)
⋮----
function clearQueue()
⋮----
function toggleShuffleMode()
⋮----
function updateShuffleUI()
⋮----
function cycleRepeatMode()
⋮----
// off -> all -> one -> off
⋮----
function updateRepeatUI()
⋮----
function renderQueue()
⋮----
const playThis = () =>
⋮----
// Drag & Drop reordering in Queue
⋮----
// placed on lower half
⋮----
// Adjust currentIndex if necessary
⋮----
function addToQueue(song, isDownloaded = false)
⋮----
function playNext()
⋮----
// Hemos llegado al final de la cola
⋮----
function playPrev()
⋮----
// Si lleva más de 3 segundos reproduciéndose, reiniciar
⋮----
// Reiniciar primera canción
⋮----
function playNextInQueue()
⋮----
// ======= Descargas =======
async function loadDownloaded()
⋮----
// si ya está bloqueado -> no ejecutar
⋮----
return; // ⬅️ aquí se detiene
⋮----
// bloquear
⋮----
//btn.disabled = true;
⋮----
// desbloquear a los 5s
⋮----
// ======= Búsqueda =======
async function searchSongDirectPlay(query = "")
⋮----
// Filtrar canciones que NO incluyan "remix" o "remixes" en el título
⋮----
(song) => !/remix(es)?|choreography|#\w+|@\w+/i.test(song.title) // filtra palabras remix, remixes, choreography, hashtags y arrobas
⋮----
async function searchSongs()
⋮----
// tu listener con bloqueo
⋮----
// si ya está bloqueado -> no ejecutar
⋮----
return; // ⬅️ aquí se detiene
⋮----
// bloquear
⋮----
//btn.disabled = true;
⋮----
await playSong(song); // solo se ejecuta si NO estaba bloqueado
⋮----
// desbloquear a los 5s
⋮----
// ======= iTunes API =======
class ITunesSearch
⋮----
async searchTracks(query, limit = 15)
⋮----
async searchArtistName(artistName)
⋮----
return data.results; // array de artistas encontrados
⋮----
// Crear instancia
⋮----
// Función principal
async function showArtistRecommendations(artistName)
⋮----
// ===== 1. Buscar nombre correcto del artista =====
⋮----
// ===== 2. Buscar canciones del artista correcto =====
⋮----
// ===== 3. Mostrar tracks =====
⋮----
// ======= iTunes y funciones aleatorias =======
async function getRandomSongByArtist(artistName, excludeTrackName = null)
⋮----
// Búsqueda en iTunes
⋮----
async function playRandomSongByArtistDirect()
⋮----
// Si no encuentra por artista, intenta buscar por partes del título
⋮----
// ======= Eventos =======
⋮----
// Reproducir siguiente en cola o repetir según repeatMode
⋮----
// Recomendaciones con Spotify
⋮----
// Solo actualiza si el segundo entero ha cambiado
⋮----
// ---- Eventos del Buscador de canciones ----
⋮----
// ======= Ajustes de Sensibilidad de Volumen (Touchpad y Ratón) =======
⋮----
function initAccessibilitySettings()
⋮----
// Escuchar wheel en sliders y en el contenedor del volumen para facilitar el gesto en touchpad
⋮----
// Soportar tanto scroll vertical como horizontal del touchpad
⋮----
// Sensibilidad calibrada para touchpad y rueda de ratón (ajustable en Ajustes > Accesibilidad):
// deltaMode 0: píxeles (touchpad o ratones de alta resolución)
// deltaMode 1: líneas (ratón convencional)
// deltaMode 2: páginas
⋮----
// Modo píxeles (típico de touchpads)
⋮----
// Limitar el paso máximo por evento según la sensibilidad configurada
⋮----
// Redondear a 4 decimales para mantener fluidez y evitar imprecisión flotante
⋮----
function handleVolumeChange(e)
⋮----
// Cambia ambos sliders y ambos players
⋮----
// Guardar volumen antes de mutear
⋮----
// Guardar en localStorage
⋮----
// Determinar el ícono del botón mute según el volumen
⋮----
let volume = Math.max(0, Math.min(value, 1)); // Asegura que 0 <= volume <= 1
⋮----
// Muteado
⋮----
// Volumen bajo
⋮----
// Volumen alto
⋮----
// Fallback
⋮----
// Solo actualiza el HTML si cambió
⋮----
// ======= Navegación centralizada =======
// Todas las vistas de contenido central que navigateTo controla
⋮----
// Todos los nav-links del navbar superior y sidebar
⋮----
/**
 * navigateTo — fuente única de verdad para mostrar/ocultar vistas.
 * @param {string} view - "home" | "search" | "downloads" | "settings" | "countryTop" | "recents" | "playlists"
 */
function navigateTo(view)
⋮----
// 1. Ocultar TODAS las vistas de contenido
⋮----
// 2. Quitar activo de todos los nav-links
⋮----
// 3. Mostrar/ocultar el homeView (las cards de inicio + bienvenida)
⋮----
// 4. Activar la vista correcta
⋮----
// Activar tab General por defecto si ninguna está activa
⋮----
// Hide detail view by default and show playlists grid
⋮----
// ======= Listeners de navegación (navbar y sidebar) =======
⋮----
// ======= Renderizador de Recientes =======
function renderRecents()
⋮----
// ======= Queue Drawer =======
function openQueueDrawer()
⋮----
renderQueue(); // refrescar la lista al abrir
⋮----
function closeQueueDrawer()
⋮----
function toggleQueueDrawer()
⋮----
// Botón "Lista de reproducción" en el player aside
⋮----
// Botón queue en el footer compact player
⋮----
// Botones de acciones en cabecera de la cola
⋮----
// Botón X para cerrar el drawer
⋮----
// Clic en el overlay cierra el drawer
⋮----
// ======= renderCountryTop =======
function renderCountryTop()
⋮----
// Listener para actualizaciones de yt-dlp
function showUpdateStatus(message, sub_message)
⋮----
// Usamos la función showModal que ya existe en tu proyecto
// para notificar al usuario de una forma más elegante que un alert.
⋮----
// No mostramos nada si ya está actualizado para no molestar.
⋮----
// guardar estado en localStorage
⋮----
// ======= Inicializar =======
⋮----
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
⋮----
audio.preload = "auto"; // carga inmediata
audio.autoplay = true; // sin clic
audio.crossOrigin = "anonymous"; // evita bloqueos
⋮----
// ============================================================
//  PLAYLISTS ENGINE
// ============================================================
⋮----
// ---- Persistence ----
function loadPlaylistsFromStorage()
⋮----
function savePlaylistsToStorage()
⋮----
// ---- Exportify CSV Parser (Fase 1 - Ultra Robusto) ----
function detectCsvDelimiter(text)
⋮----
function parseCSV(text)
⋮----
// Eliminar BOM de UTF-8 si existe
⋮----
i++; // escapar comilla doble ""
⋮----
function cleanHeaderStr(str)
⋮----
function parseExportifyCsv(csvText)
⋮----
// Fallbacks de seguridad si el CSV no tiene cabeceras legibles o fue alterado
⋮----
// ---- Cover & Duration Helpers (Fase 3) ----
function getPlaylistCoverHTML(pl)
⋮----
function getPlaylistTotalDuration(pl)
⋮----
// ---- CRUD helpers ----
function createPlaylist(name)
⋮----
function deletePlaylist(id)
⋮----
function addSongToPlaylist(playlistId, song)
⋮----
// ---- Acciones de Playlist seguras con SweetAlert2 ----
async function handleRenamePlaylist(playlistId)
⋮----
inputValidator: (val) =>
⋮----
async function handleDeletePlaylist(playlistId)
⋮----
async function openMoveSongModal(song, songIndex, sourcePl)
⋮----
// ---- Grid renderer ----
function renderPlaylists()
⋮----
// Variable para la playlist actualmente visualizada
⋮----
// ---- Detail view ----
function openPlaylistDetail(playlistId)
⋮----
// Switch visibility
⋮----
// Store current playlist id on the play button
⋮----
// Asegurar siempre posición inicial al tope sin saltos a la segunda canción
⋮----
function playPlaylistSong(playlist, clickedIndex)
⋮----
// Configurar la cola con todas las canciones de la playlist
⋮----
function renderPlaylistSongs(pl, filterQuery = "")
⋮----
// Buscar índice real en la playlist original
⋮----
// Drag & Drop reorder within Playlist
⋮----
// dropped on bottom half
⋮----
// Si no tiene url, resolver bajo demanda
⋮----
// ---- Play entire playlist ----
function playPlaylist(playlistId)
⋮----
// Reproducir la primera canción de la cola
⋮----
// ---- Ranking Inteligente de Candidatos de YouTube ----
function pickBestCandidate(candidates, song)
⋮----
// 1. Duración exacta de la canción (Coincidencia con Spotify/Metadata)
⋮----
if (diff <= 3) score += 65; // Coincidencia milimétrica
⋮----
else if (diff > 35) score -= 55; // Desviación grande: videoclip con intro hablada o versión extendida
⋮----
// 2. Canales oficiales "Topic" (YouTube Music / Pistas de estudio)
⋮----
// 3. Audio oficial o Lyrics
⋮----
// 4. Exclusión estricta de remixes, directos, covers no solicitados
⋮----
// 5. Videoclip oficial con duración que no cuadra (típica intro o escena hablada al inicio)
⋮----
// ---- Resolutor Robusto de Audio Online para Canciones ----
async function resolveSongOnlineUrl(song, force = false)
⋮----
// Intento 1: Buscar directamente título + artista
⋮----
// Intento 2: Probar con palabra clave "audio" para forzar pista de estudio
⋮----
// Intento 3: Si tiene comas (múltiples artistas), probar con el artista principal
⋮----
// Intento 4: Buscar solo por el título de la canción
⋮----
// ---- Sincronizador de canciones resueltas en playlists (Opción A) ----
function syncResolvedSongToPlaylists(resolvedSong)
⋮----
// ---- Reproducción Aleatoria / Shuffle (Fase 5) ----
function shufflePlaylist(playlistId)
⋮----
// Clona y baraja con Fisher-Yates
⋮----
// ---- Descarga completa de Playlist Fuera de Línea (Fase 5) ----
⋮----
async function downloadAllPlaylist(playlistId)
⋮----
// ---- Sincronizador en Segundo Plano con YouTube (Opción B) ----
⋮----
async function syncPlaylistWithYouTube(playlistId)
⋮----
// Si fue resuelta mientras tanto por reproducción on-demand
⋮----
// Pausa prudente entre consultas a YouTube para evitar límites y redirecciones
⋮----
// ---- Modal Selección de Playlist para Agregar Canción ----
function openPlaylistModal(song)
⋮----
function closePlaylistModal()
⋮----
function renderPlaylistModalList()
⋮----
async function readFileTextWithEncoding(file)
⋮----
// Si tiene caracteres corruptos de decodificación, probar windows-1252
⋮----
// ---- Procesador e importador de archivos CSV (Fase 1 y 2) ----
async function handleCsvFile(file)
⋮----
// Nombre sugerido a partir del nombre del archivo sin .csv
⋮----
// Previsualización de portadas (primeras 4 carátulas de Spotify)
⋮----
preConfirm: () =>
⋮----
// ---- Wire up all playlist & queue event listeners ----
⋮----
// Botón e input para importar CSV
⋮----
// Drag and drop para archivos .csv sobre la vista de Playlists
⋮----
// Filtro buscador dentro de la playlist activa
⋮----
// Create playlist from main view
⋮----
// Back button in detail view
⋮----
// Rename playlist button
⋮----
// Delete playlist from detail view button
⋮----
// Queue all playlist button
⋮----
// Play entire playlist button
⋮----
// Shuffle playlist button
⋮----
// Download all playlist button
⋮----
// Background sync button
⋮----
// Local filter input for playlist songs
⋮----
// Close modal button
⋮----
// Close modal on overlay click
⋮----
// Create playlist directly from the modal
⋮----
// ======= Sidebar Collapsible Logic =======
⋮----
const updateSidebarState = (shouldCollapse) =>
⋮----
const handleResize = () =>
⋮----
handleResize(); // Ejecutar al inicio para ajustar al tamaño actual
⋮----
// ======= Cargar Volumen Guardado =======
function initVolume()
⋮----
let volume = 0.5; // fallback predeterminado
⋮----
// ======= Cargar Última Canción Reproducida =======
function initLastSong()
⋮----
// Actualizar UI
⋮----
// Habilitar barra de progreso
⋮----
// ======= Exportar música a ZIP & Sistema de Referencias .mexref =======
⋮----
// Elementos de la sección .mexref
⋮----
// Elementos del modal de progreso UI/UX
⋮----
// Mapa de archivos .mexref cargados: fileName -> { fileName, filePath, data }
⋮----
// ---- Historial LocalStorage ----
function getExportedSongsHistory()
⋮----
function saveExportedSongsHistory(filenames)
⋮----
// ---- Helpers de normalización y extracción de IDs ----
function normalizeMexrefTitle(str)
⋮----
function cleanArtist(str)
⋮----
function extractYouTubeId(url)
⋮----
// ---- Validación y Parseo de .mexref ----
function validateMexrefContent(parsed, filename = "archivo.mexref")
⋮----
// Sanitizar cada pista sin ejecutar nada como código
⋮----
// Combinar referencias de múltiples archivos .mexref sin duplicados
function mergeMexrefTracks(filesMap)
⋮----
// Comparación precisa de canciones con referencias .mexref
function matchSongWithMexref(song, mexrefTracks)
⋮----
// 1. Priorizar identificadores estables de plataforma (Spotify / YouTube)
⋮----
// Coincidencia por Spotify ID
⋮----
// Coincidencia por YouTube Video ID
⋮----
// 2. Estrategia secundaria: Título y Artista normalizados (ambos deben coincidir)
⋮----
// Si no hay artista explícito pero el nombre tiene ' - ', extraer ambas partes
⋮----
// Evitar falsos positivos: si no hay artista o es desconocido, no excluir a ciegas solo por título
⋮----
// Verificar si los títulos coinciden de manera segura
⋮----
// Generador oficial del documento .mexref
function generateMexrefDocument(
⋮----
// ---- Actualización de la sección .mexref y resumen de exclusión ----
function updateMexrefExclusions()
⋮----
// 1. Actualizar badge de total de referencias
⋮----
// 2. Renderizar lista de chips de archivos importados
⋮----
// 3. Evaluar coincidencias sobre exportCurrentSongs
⋮----
// Deseleccionar automáticamente para evitar duplicar en el iPod / MP3
⋮----
// 4. Actualizar resumen de exclusión
⋮----
// 5. Refrescar la lista de canciones en pantalla y contadores
⋮----
// Procesar texto de archivo .mexref importado
function handleLoadedMexrefFile(fileName, content, filePath = "")
⋮----
// Botón para importar archivos .mexref
⋮----
// Fallback a input file estándar si fuera necesario
⋮----
// Input file fallback para .mexref
⋮----
// ---- Actualizar Contadores de la Ventana ----
function updateExportCounters()
⋮----
// ---- Renderizado de la Lista de Canciones ----
function renderExportSongsList(filterText = "")
⋮----
const toggleSelection = (checked) =>
⋮----
function closeExportModal()
⋮----
// Confirmar exportación con barra de progreso moderna UI/UX y creación de .mexref
⋮----
// Mostrar modal moderno de progreso de exportación
⋮----
// Configurar listener para actualizar la barra en tiempo real
⋮----
// Guardar las canciones exportadas en el historial para evitar duplicados en el siguiente dump
⋮----
// Preguntar al usuario si desea guardar el archivo .mexref de referencias
⋮----
// No mostrar error si el usuario simplemente canceló el diálogo de guardado
⋮----
// Abrir modal de exportación al pulsar #exportZipBtn
⋮----
// Por defecto: pre-seleccionar solo las canciones NUEVAS (no exportadas antes)
⋮----
// Si todas ya fueron exportadas previamente, marcarlas todas por defecto para que no salga en 0
⋮----
// Aplicar exclusiones si ya había archivos .mexref cargados
⋮----
// Inicializar configuraciones guardadas
⋮----
// ======= PLAYLIST: MIS MÁS ESCUCHADAS (SQLite) =======
async function showMostPlayedList()
⋮----
// 1. Navegar a la vista de countryTop que es la que se usa para listas detalladas
⋮----
// 2. Obtener canciones de SQLite
⋮----
// Crear el botón "Reproducir todo"
⋮----
// Listado de tracks
⋮----
// Click events
⋮----
// Cargar playlist completa en cola de reproducción
⋮----
// Highlight active playing
⋮----
// Play all button handler
btnPlayAll.onclick = () =>
⋮----
async function playMostPlayedList(autoPlay = true)
⋮----
showMostPlayedList(); // Show empty state
⋮----
// Renders the list
⋮----
// If autoPlay requested, start playing first track immediately
⋮----
// Export functions to global scope
⋮----
async function renderMostPlayedCardCover()
⋮----
// ======= Funciones de Rediseño Premium (Mexlify UI/UX) =======
⋮----
/**
 * highlightPlayingSong - Busca en todas las listas la canción actualmente reproducida y le añade clases/visualizador.
 * @param {boolean} autoScroll - Si es true, hace scroll hacia la canción activa (solo en reproducción explícita)
 */
function highlightPlayingSong(autoScroll = false)
⋮----
// Solo hacer scroll automático si se especificó explícitamente durante la reproducción activa
⋮----
// Inicialización de escuchadores interactivos al cargar el DOM
⋮----
// 2. Filtro local para descargas
⋮----
// 3. Botón para limpiar historial de recents
⋮----
// 4. Color pickers sincronizados con etiquetas hex
⋮----
// Comprobar estado de red
````

## File: index.html
````html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mexlify</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="icon" type="image/png" href="logo.png">
    <link rel="stylesheet" type="text/css"
        href="node_modules/@phosphor-icons/web/src/regular/style.css" />
    <link rel="stylesheet" type="text/css"
        href="node_modules/@phosphor-icons/web/src/fill/style.css" />
    <script src="node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>
    <script src="node_modules/jquery/dist/jquery.min.js"></script>
    <!-- CSS -->
    <link rel="stylesheet" href="node_modules/simple-notify/dist/simple-notify.css" />
    <!-- JS -->
    <script src="node_modules/simple-notify/dist/simple-notify.min.js"></script>
</head>
<body>
    <!-- Spinner Overlay -->
    <div id="spinner-overlay">
        <img src="logo.png" alt="Logo de mi app" class="app-logo">
        <div class="spinner"></div>
    </div>
    <!-- Navbar Liquid Glass -->
    <nav class="navbar glassy">
        <div class="nav-left">
            <span class="nav-title company-name">MEXLIFY</span>
        </div>
        <div class="nav-right">
            <a id="homeTab" href="#home" data-view="homeView">Inicio</a>
            <a id="searchTab" href="#search" data-view="searchContainer">Buscar</a>
            <a id="downloadsTab" href="#downloads" data-view="downloadsContainer">Fuera de línea</a>
            <a id="settingsTab" href="#settings" data-view="settings">Ajustes</a>
        </div>
    </nav>
    <!-- Queue Drawer (nivel body, siempre en DOM) -->
    <div id="queueOverlay"></div>
    <div id="queuetab" class="vaen-queue-container">
        <div class="queue-drawer-header">
            <div class="queue-header-left">
                <h3><i class="ph ph-queue"></i> Cola de reproducción</h3>
                <span id="queueCountBadge" class="queue-count-badge">0 canciones</span>
            </div>
            <div class="queue-header-actions">
                <button id="queueShuffleBtn" class="queue-action-btn" title="Mezclar cola aleatoriamente"><i class="ph ph-shuffle"></i></button>
                <button id="clearQueueBtn" class="queue-action-btn" title="Vaciar cola de reproducción"><i class="ph ph-trash"></i></button>
                <button id="closeQueueBtn" class="queue-close-btn" title="Cerrar cola"><i class="ph ph-x"></i></button>
            </div>
        </div>
        <ul id="queueList"></ul>
    </div>
    <!-- Messages Drawer (nivel body, siempre en DOM) -->
    <div id="messagesOverlay"></div>
    <div id="messagestab" class="vaen-messages-container">
        <div class="messages-drawer-header">
            <h3><i class="ph ph-bell"></i> Bandeja del Sistema</h3>
            <div style="display: flex; gap: 8px;">
                <button id="clearMessagesBtn" class="messages-action-btn" title="Limpiar bandeja"><i
                        class="ph ph-trash"></i></button>
                <button id="closeMessagesBtn" class="messages-action-btn" title="Cerrar"><i
                        class="ph ph-x"></i></button>
            </div>
        </div>
        <div class="messages-drawer-tabs">
            <button id="msgTabGeneral" class="msg-tab-btn is-active">General</button>
            <button id="msgTabSistem" class="msg-tab-btn">Sistem</button>
        </div>
        <ul id="messagesList" class="messages-drawer-list"></ul>
    </div>
    <!-- Lyrics View Panel (Inspirado en Apple Music) -->
    <div id="lyricsViewOverlay" class="lyrics-view-overlay is-hidden"></div>
    <div id="lyricsViewPanel" class="lyrics-view-panel is-hidden" aria-hidden="true">
        <!-- Fondo ambiental dinámico con carátula difuminada -->
        <div class="lyrics-bg-mesh">
            <img id="lyricsBgArtwork" src="resources/player.gif" alt="" />
        </div>
        <div class="lyrics-backdrop-scrim"></div>
        <!-- Barra superior del panel de letras -->
        <div class="lyrics-header">
            <div class="lyrics-header-left">
                <span class="lyrics-app-badge"><i class="ph ph-quotes"></i> Letras</span>
                <span id="lyricsModeBadge" class="lyrics-mode-badge is-hidden">Sincronizada</span>
            </div>
            <div class="lyrics-header-right">
                <button id="lyricsRetrySearchBtn" class="lyrics-header-action-btn" title="Buscar de nuevo"><i class="ph ph-arrow-clockwise"></i></button>
                <button id="closeLyricsBtn" class="lyrics-header-close-btn" title="Cerrar letras (Esc)"><i class="ph ph-x"></i></button>
            </div>
        </div>
        <!-- Contenido principal: Columna de carátula/meta + Flujo de letras -->
        <div class="lyrics-content-layout">
            <!-- Columna izquierda: Información y carátula -->
            <div class="lyrics-album-column">
                <div class="lyrics-artwork-card">
                    <img id="lyricsCoverImg" src="resources/player.gif" alt="Carátula" />
                    <div class="lyrics-cover-glow"></div>
                </div>
                <div class="lyrics-song-meta">
                    <h2 id="lyricsTrackTitle" class="lyrics-song-title">Nombre de la canción</h2>
                    <h3 id="lyricsArtistName" class="lyrics-song-artist">Artista</h3>
                    <p id="lyricsAlbumName" class="lyrics-song-album"></p>
                </div>
            </div>
            <!-- Columna derecha: Flujo vertical de líneas de letra -->
            <div class="lyrics-stream-column">
                <div class="lyrics-scroll-viewport" id="lyricsScrollViewport">
                    <div id="lyricsLinesContainer" class="lyrics-lines-container">
                        <!-- Líneas sincronizadas, texto sin sincronizar o estado no disponible -->
                    </div>
                </div>
                <!-- Botón flotante para resincronizar si el usuario hace scroll manual -->
                <button id="lyricsSyncPillBtn" class="lyrics-sync-pill is-hidden" title="Volver a la línea actual">
                    <i class="ph ph-arrow-down-left"></i> Sincronizar
                </button>
            </div>
        </div>
    </div>
    <div id="app">
        <!-- Home View: greeting header & compact quick-access cards -->
        <div id="homeView" class="view-section">
            <div class="home-welcome-header">
            </div>
            <div class="vaen-cards-container">
                <div class="vaen-card" onclick="document.getElementById('btnCountryMixB').click()">
                    <div class="spotify-card-cover">
                        <img src="assets/top_mexico.jpg" class="spotify-cover-single">
                    </div>
                    <div class="vaen-card-info">
                        <span class="vaen-card-tag">Top Nacional</span>
                        <h2 class="vaen-card-title">Más escuchadas de México</h2>
                        <p class="vaen-card-desc">El Top 50 del país</p>
                    </div>
                    <button id="btnCountryMixB" class="vaen-card-play-btn"
                        onclick="event.stopPropagation(); playCountry('mexico', 'month')">
                        <i class="ph-fill ph-play"></i>
                    </button>
                </div>
                <div class="vaen-card" onclick="document.getElementById('btnCountryMixA').click()">
                    <div class="spotify-card-cover">
                        <img src="assets/top_global.jpg" class="spotify-cover-single">
                    </div>
                    <div class="vaen-card-info">
                        <span class="vaen-card-tag">Mix Global</span>
                        <h2 class="vaen-card-title">Playlist del Día</h2>
                        <p class="vaen-card-desc">Tendencias del momento</p>
                    </div>
                    <button id="btnCountryMixA" class="vaen-card-play-btn"
                        onclick="event.stopPropagation(); playCountry('global', 'day')">
                        <i class="ph-fill ph-play"></i>
                    </button>
                </div>
                <div class="vaen-card" onclick="showMostPlayedList()">
                    <div class="spotify-card-cover" id="myMostPlayedCover">
                        <img src="resources/player.gif" class="spotify-cover-single">
                    </div>
                    <div class="vaen-card-info">
                        <span class="vaen-card-tag">Mi Playlist</span>
                        <h2 class="vaen-card-title">Mis Más Escuchadas</h2>
                        <p class="vaen-card-desc">Lo que más reproduces</p>
                    </div>
                    <button id="btnMyMostPlayed" class="vaen-card-play-btn"
                        onclick="event.stopPropagation(); playMostPlayedList(true)">
                        <i class="ph-fill ph-play"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="main-layout">
            <aside class="sidebar collapsed">
                <div class="sidebar-toggle-row">
                    <h3>Menú</h3>
                    <button id="sidebarToggleBtn" class="sidebar-toggle-btn" title="Expandir menú">
                        <i class="ph ph-caret-double-right" id="sidebarToggleIcon"></i>
                    </button>
                </div>
                <ul>
                    <li id="recentsTab" class="menu-link-glass">
                        <div class="menu-link-left">
                            <i class="ph ph-clock-counter-clockwise"></i>
                            <span>Recientes</span>
                        </div>
                    </li>
                    <li id="playlistsTab" class="menu-link-glass">
                        <div class="menu-link-left">
                            <i class="ph ph-playlist"></i>
                            <span>Playlists</span>
                        </div>
                    </li>
                    <li class="menu-link-glass"
                        onclick="window.electronAPI.openExternal('https://discord.com/invite/hpRMKdqWRy')">
                        <div class="menu-link-left">
                            <i class="ph ph-discord-logo"></i>
                            <span>Soporte</span>
                        </div>
                    </li>
                </ul>
                <hr>
                <ul>
                    <li id="messagesBtn" class="menu-link-glass">
                        <div class="menu-link-left">
                            <i class="ph ph-bell"></i>
                            <span>Mensajes</span>
                        </div>
                        <span id="messagesBadge" class="sidebar-badge" style="display: none;">0</span>
                    </li>
                </ul>
                <button id="backtop" class="backtop is-hidden">VOLVER AL TOP</button>
            </aside>
            <!-- Columna central: buscador + resultados -->
            <section class="content glass-box">
                <!-- Resultados y vistas de contenido -->
                <div class="tab-content">
                    <!-- Pestaña Buscar -->
                    <div id="searchContainer" class="view-section">
                        <!-- Buscador -->
                        <div class="search-hero-card">
                            <div class="search-title-row">
                                <span>Buscar canciones</span>
                            </div>
                            <div id="searchBar" class="premium-search-bar">
                                <span class="searchIcon" aria-hidden="true"><i class="ph ph-magnifying-glass"></i></span>
                                <input
                                    id="searchInput"
                                    type="search"
                                    placeholder="Título de la canción o artista..."
                                    aria-label="Buscar canciones por título o artista"
                                    autocomplete="off"
                                    autocorrect="off"
                                    spellcheck="false"
                                >
                                <button id="searchClearBtn" class="search-clear-btn is-hidden" type="button" title="Borrar texto" aria-label="Borrar texto de búsqueda">
                                    <i class="ph ph-x"></i>
                                </button>
                                <button id="searchButton" class="search-action-btn" type="button" title="Buscar canciones" aria-label="Buscar canciones">
                                    <i class="ph ph-magnifying-glass"></i>
                                </button>
                            </div>
                            <span class="search-tip-label">Combina título y artista para resultados más precisos.</span>
                        </div>
                        <div class="ListHeader" id="searchResultsHeader" style="display: none;">
                            <h2>Resultados</h2>
                        </div>
                        <ul id="resultsList">
                            <!-- Aquí se cargarán los resultados -->
                        </ul>
                    </div>
                    <!-- Pestaña Descargas -->
                    <div id="downloadsContainer" class="view-section is-hidden">
                        <div class="ListHeader">
                            <div class="header-title-group">
                                <h2>Fuera de línea</h2>
                                <span class="stat-badge" id="offlineCountBadge">0 guardadas</span>
                            </div>
                            <button id="exportZipBtn" class="changeBg" style="margin: 0; padding: 8px 16px;">
                                <i class="ph ph-file-zip"></i> Exportar a ZIP
                            </button>
                        </div>
                        <!-- Filtro local interactivo para descargas -->
                        <div class="local-filter-bar">
                            <i class="ph ph-funnel"></i>
                            <input id="offlineFilterInput" placeholder="Filtrar por título o artista en tus descargas...">
                        </div>
                        <ul id="downloadsList">
                            <!-- Aquí se cargarán las descargas -->
                        </ul>
                    </div>
                    <!-- Pestaña Recientes -->
                    <div id="recentsContainer" class="view-section is-hidden">
                        <div class="ListHeader">
                            <div class="header-title-group">
                                <h2>Recientes (Sesión actual)</h2>
                                <span class="stat-badge" id="recentsCountBadge">0 reproducidas</span>
                            </div>
                            <button id="clearRecentsBtn" class="changeBg" style="margin: 0; padding: 8px 16px;">
                                <i class="ph ph-trash"></i> Limpiar Historial
                            </button>
                        </div>
                        <ul id="recentsList">
                            <!-- Aquí se cargarán las canciones reproducidas recientemente -->
                        </ul>
                    </div>
                    <!-- Pestaña Playlists -->
                    <div id="playlistsContainer" class="view-section is-hidden">
                        <div class="ListHeader">
                            <div class="header-title-group">
                                <h2>Mis Playlists</h2>
                                <span class="stat-badge" id="playlistsCountBadge">0 creadas</span>
                            </div>
                            <div class="header-actions-group" style="display: flex; gap: 10px;">
                                <input type="file" id="importCsvFileInput" accept=".csv" style="display: none;">
                                <button id="importCsvBtn" class="changeBg" style="margin: 0; padding: 8px 16px;">
                                    <i class="ph ph-file-arrow-up"></i> Importar Exportify (.csv)
                                </button>
                            </div>
                        </div>
                        <!-- Panel de creación rediseñado -->
                        <div class="playlist-create-row premium-create-card glass-box-premium">
                            <div class="create-card-left">
                                <i class="ph ph-playlist glow-pink" style="font-size: 1.3rem;"></i>
                                <input id="playlistNameInput" placeholder="Nombre de la nueva playlist">
                            </div>
                            <button id="createPlaylistBtn" class="changeBg"><i class="ph ph-plus"></i> Crear</button>
                        </div>
                        <!-- Dropzone animada para arrastrar archivos .csv -->
                        <div id="playlistDropZone" class="playlist-drop-zone is-hidden">
                            <i class="ph ph-file-csv" style="font-size: 2.8rem; color: #ff0090;"></i>
                            <p style="margin: 8px 0 0 0; font-weight: 600;">Suelta tu archivo .csv aquí</p>
                            <span style="font-size: 0.85rem; color: rgba(255,255,255,0.6);">Importación automática con carátulas de Spotify</span>
                        </div>
                        <div class="playlists-grid" id="playlistsGrid">
                            <!-- Aquí se cargarán las tarjetas de las playlists creadas -->
                        </div>
                        <div id="playlistDetailView" class="playlist-detail-view is-hidden">
                            <div class="playlist-detail-header-premium">
                                <!-- Barra superior de navegación y gestión de la playlist -->
                                <div class="playlist-detail-topbar">
                                    <button id="backToPlaylistsBtn" class="backtop-premium" title="Volver al catálogo de playlists">
                                        <i class="ph ph-arrow-left"></i>
                                        <span>Volver a playlists</span>
                                    </button>
                                    <div class="playlist-quick-actions">
                                        <button id="renamePlaylistBtn" class="playlist-header-icon-btn" title="Renombrar playlist">
                                            <i class="ph ph-pencil-simple"></i>
                                            <span class="btn-label-desktop">Renombrar</span>
                                        </button>
                                        <button id="deletePlaylistFromDetailBtn" class="playlist-header-icon-btn btn-danger" title="Eliminar playlist permanentemente">
                                            <i class="ph ph-trash"></i>
                                            <span class="btn-label-desktop">Eliminar</span>
                                        </button>
                                    </div>
                                </div>
                                <!-- Contenido Hero Principal: Carátula e información -->
                                <div class="playlist-header-hero">
                                    <div class="playlist-hero-cover" id="playlistHeroCover">
                                        <!-- Carátula o collage dinámico inyectado por getPlaylistCoverHTML -->
                                    </div>
                                    <div class="playlist-detail-meta">
                                        <span class="playlist-meta-type"><i class="ph ph-playlist"></i> LISTA DE REPRODUCCIÓN</span>
                                        <h2 id="currentPlaylistTitle" class="playlist-hero-title">Nombre de la Playlist</h2>
                                        <div class="playlist-meta-chips">
                                            <span class="playlist-chip">
                                                <i class="ph ph-music-notes"></i>
                                                <span id="playlistMetaCount">0 canciones</span>
                                            </span>
                                            <span class="playlist-chip-dot">•</span>
                                            <span class="playlist-chip">
                                                <i class="ph ph-clock"></i>
                                                <span id="playlistMetaDuration">0 min</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <!-- Barra de acciones de reproducción y biblioteca -->
                                <div class="playlist-hero-actions">
                                    <button id="playPlaylistBtn" class="playlist-action-primary" title="Reproducir playlist desde el inicio">
                                        <i class="ph-fill ph-play"></i>
                                        <span>Reproducir</span>
                                    </button>
                                    <button id="shufflePlaylistBtn" class="playlist-action-secondary" title="Reproducción Aleatoria (Shuffle)">
                                        <i class="ph ph-shuffle"></i>
                                        <span>Aleatorio</span>
                                    </button>
                                    <button id="queueAllPlaylistBtn" class="playlist-action-secondary" title="Añadir toda la playlist a la cola de reproducción">
                                        <i class="ph ph-list-plus"></i>
                                        <span>Añadir a cola</span>
                                    </button>
                                    <button id="downloadAllPlaylistBtn" class="playlist-action-secondary" title="Descargar todas las canciones fuera de línea">
                                        <i class="ph ph-download-simple"></i>
                                        <span>Descargar Todo</span>
                                    </button>
                                    <button id="syncPlaylistBtn" class="playlist-action-secondary" title="Vincular canciones con YouTube">
                                        <i class="ph ph-arrows-clockwise"></i>
                                        <span>Vincular</span>
                                    </button>
                                </div>
                            </div>
                            <!-- Filtro buscador local de playlist -->
                            <div class="local-filter-bar" style="margin: 15px 0;">
                                <i class="ph ph-magnifying-glass"></i>
                                <input id="playlistFilterInput" placeholder="Filtrar canciones en esta playlist...">
                            </div>
                            <ul id="playlistSongsList" class="song-list">
                                <!-- Canciones de la playlist actual -->
                            </ul>
                        </div>
                    </div>
                    <!-- Ajustes -->
                    <div id="settings" class="view-section is-hidden">
                        <div class="ListHeader">
                            <h2>Ajustes</h2>
                        </div>
                        <!-- Sub-tabs de Ajustes estilo Pill -->
                        <div class="tabsSettings">
                            <button class="tablinkSettings active is-active" onclick="settings.openTab('tabGeneral', this)" id="defaultTab">
                                <i class="ph ph-sliders"></i> General
                            </button>
                            <button class="tablinkSettings" onclick="settings.openTab('tabTheme', this)">
                                <i class="ph ph-paint-brush"></i> Personalización
                            </button>
                            <button class="tablinkSettings" onclick="settings.openTab('tabAccessibility', this)">
                                <i class="ph ph-hand-tap"></i> Accesibilidad
                            </button>
                        </div>
                        <!-- Tab General -->
                        <div id="tabGeneral" class="settings-group-container">
                            <div class="settings-card glass-box-premium">
                                <div class="settings-card-header">
                                    <i class="ph ph-gear"></i>
                                    <h3>Reproducción y Sistema</h3>
                                </div>
                                <div id="autoPlayRandom" class="settings-row">
                                    <div class="settings-info">
                                        <span class="settings-label">Reproducción automática</span>
                                        <small class="settings-desc">Al terminar una canción se reproducirá automáticamente otra aleatoria.</small>
                                    </div>
                                    <div class="settings-control">
                                        <label class="switch-ra">
                                            <input class="checkbox-ra" type="checkbox" id="autoplay" name="autoplay" checked>
                                            <span class="slider-ra"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="settings-row">
                                    <div class="settings-info">
                                        <span class="settings-label">Calidad de audio</span>
                                        <small class="settings-desc">Selecciona la calidad de audio predeterminada para la reproducción.</small>
                                    </div>
                                    <div class="settings-control">
                                        <select id="audioQuality" name="audioQuality" class="glass-select-premium">
                                            <option value="low" disabled>Baja (64 kbps)</option>
                                            <option value="medium" disabled>Media (128 kbps)</option>
                                            <option value="high" selected>Alta (256 kbps)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="settings-row note-row">
                                    <small class="settings-note"><i class="ph ph-info"></i> Nota: La reproducción se reproducirá en la mejor calidad disponible. Por el momento, solo se admite la calidad alta.</small>
                                </div>
                            </div>
                            <div class="settings-card glass-box-premium">
                                <div class="settings-card-header">
                                    <i class="ph ph-sliders-horizontal"></i>
                                    <h3>Ecualizador (BETA)</h3>
                                </div>
                                <div class="settings-row">
                                    <div class="settings-info">
                                        <span class="settings-label">EQ Presets</span>
                                        <small class="settings-desc">Selecciona un preset de ecualización. Se aplicará al audio en tiempo real.</small>
                                    </div>
                                    <div class="settings-control">
                                        <select id="presets" class="glass-select-premium">
                                            <option value="flat">Plano</option>
                                            <option value="bassBoost">Refuerzo de Bajos</option>
                                            <option value="trebleBoost">Refuerzo de Agudos</option>
                                            <option value="vocal">Vocal Suave</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="settings-row note-row">
                                    <small class="settings-note"><i class="ph ph-info"></i> Puedes personalizar el ecualizador en la sección de ecualizador avanzado. (Próximamente)</small>
                                </div>
                            </div>
                            <div class="settings-card glass-box-premium">
                                <div class="settings-card-header">
                                    <i class="ph ph-microphone"></i>
                                    <h3>Asistente de Voz (BETA)</h3>
                                </div>
                                <div class="settings-row">
                                    <div class="settings-info">
                                        <span class="settings-label">Estado de la voz</span>
                                        <small class="settings-desc">Activa el anuncio de canciones mediante voz sintética.</small>
                                    </div>
                                    <div class="settings-control btn-group-vertical">
                                        <button id="toggleVoiceBtn" class="changeBg">Activar</button>
                                        <small class="small-info-new" id="voiceLabel">Voz desactivada</small>
                                    </div>
                                </div>
                                <div class="settings-row">
                                    <div class="settings-info">
                                        <span class="settings-label">Idioma / Voz</span>
                                        <small class="settings-desc">Elige el idioma del narrador.</small>
                                    </div>
                                    <div class="settings-control">
                                        <select id="appVoiceSelect" name="appVoiceSelect" class="glass-select-premium">
                                            <option value="spanish" selected>Español (México)</option>
                                            <option value="english" disabled>Inglés (US) (Próximamente)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="settings-row buttons-row">
                                    <button id="testVoiceBtn" class="changeBg"><i class="ph ph-play-circle"></i> Probar Voz</button>
                                </div>
                            </div>
                        </div>
                        <!-- Tab Personalización -->
                        <div id="tabTheme" class="settings-group-container is-hidden">
                            <div class="settings-card glass-box-premium">
                                <div class="settings-card-header">
                                    <i class="ph ph-image"></i>
                                    <h3>Fondo en Tarjeta de Reproducción</h3>
                                </div>
                                <div class="settings-row vertical-layout">
                                    <div class="settings-info">
                                        <small class="settings-desc">Si está desactivado, el fondo de la tarjeta de reproducción será un color sólido (dinámico de la portada).</small>
                                    </div>
                                    <div class="settings-input-group">
                                        <input id="imgInput" class="bgInput-new" placeholder="Pega la URL de la imagen aquí">
                                        <div class="action-buttons-row">
                                            <button id="setImgBtn" class="changeBg">Cambiar Fondo</button>
                                            <button id="removeImgBtn" class="changeBg">Eliminar Fondo</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="settings-card glass-box-premium">
                                <div class="settings-card-header">
                                    <i class="ph ph-layout"></i>
                                    <h3>Fondo de Panel Central</h3>
                                </div>
                                <div class="settings-row vertical-layout">
                                    <div class="settings-info">
                                        <small class="settings-desc">Pega una URL de imagen para establecer el fondo del panel principal. Deja vacío para usar el tema base.</small>
                                    </div>
                                    <div class="settings-input-group">
                                        <input id="bgInput" class="bgInput-new" placeholder="Pega la URL de la imagen aquí">
                                        <div class="action-buttons-row">
                                            <button id="changeBg" class="changeBg">Cambiar Fondo</button>
                                            <button id="removeBg" class="changeBg">Eliminar Fondo</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="settings-card glass-box-premium">
                                <div class="settings-card-header">
                                    <i class="ph ph-palette"></i>
                                    <h3>Tema de la Aplicación (Degradado)</h3>
                                </div>
                                <div class="settings-row vertical-layout">
                                    <div class="color-picker-grid">
                                        <div class="color-picker-col">
                                            <label class="color-label">Color Principal</label>
                                            <div class="color-input-wrapper">
                                                <input type="color" id="color1" value="#080014">
                                                <span class="color-hex-preview" id="color1Hex">#080014</span>
                                            </div>
                                        </div>
                                        <div class="color-picker-col">
                                            <label class="color-label">Color Secundario</label>
                                            <div class="color-input-wrapper">
                                                <input type="color" id="color2" value="#080014">
                                                <span class="color-hex-preview" id="color2Hex">#080014</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="action-buttons-row theme-controls">
                                        <button class="changeBg" onclick="gradientController.setGradient()"><i class="ph ph-check"></i> Actualizar</button>
                                        <button class="changeBg" id="getCurrentGradientBtn" onclick="gradientController.logCurrentGradient(false)"><i class="ph ph-info"></i> Obtener Actual</button>
                                        <button class="changeBg" id="resetGradientBtn" onclick="gradientController.logCurrentGradient(true)"><i class="ph ph-arrows-counter-clockwise"></i> Restablecer</button>
                                    </div>
                                    <div class="settings-row note-row">
                                        <small class="settings-note"><i class="ph ph-info"></i> Recomendamos colores oscuros para un mejor contraste y visualización del texto.</small>
                                    </div>
                                </div>
                            </div>
                            <div id="sidebarElements" class="settings-option">
                                <!-- Opciones de elementos para la barra lateral del reproductor -->
                            </div>
                        </div>
                        <!-- Tab Accesibilidad -->
                        <div id="tabAccessibility" class="settings-group-container is-hidden">
                            <div class="settings-card glass-box-premium">
                                <div class="settings-card-header">
                                    <i class="ph ph-sliders"></i>
                                    <h3>Sensibilidad de Volumen (Touchpad y Ratón)</h3>
                                </div>
                                <div class="settings-row">
                                    <div class="settings-info">
                                        <span class="settings-label">Sensibilidad de gestos (Touchpad)</span>
                                        <small class="settings-desc">Ajusta la velocidad con la que cambia el volumen al deslizar con dos dedos sobre el control de volumen.</small>
                                    </div>
                                    <div class="settings-control">
                                        <div class="settings-range-wrapper">
                                            <input type="range" id="touchpadSensitivity" class="settings-range-slider" min="0.01" max="0.10" step="0.005" value="0.035">
                                            <span id="touchpadSensitivityValue" class="settings-range-value">3.5</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="settings-row">
                                    <div class="settings-info">
                                        <span class="settings-label">Sensibilidad de rueda (Ratón)</span>
                                        <small class="settings-desc">Ajusta el paso de volumen al girar la rueda tradicional del ratón.</small>
                                    </div>
                                    <div class="settings-control">
                                        <div class="settings-range-wrapper">
                                            <input type="range" id="mouseWheelSensitivity" class="settings-range-slider" min="0.01" max="0.12" step="0.005" value="0.04">
                                            <span id="mouseWheelSensitivityValue" class="settings-range-value">4.0</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="settings-row buttons-row">
                                    <button id="resetSensitivityBtn" class="changeBg" type="button">
                                        <i class="ph ph-arrows-counter-clockwise"></i> Restablecer Valores
                                    </button>
                                </div>
                                <div class="settings-row note-row">
                                    <small class="settings-note"><i class="ph ph-info"></i> Puedes probar el volumen inmediatamente deslizando sobre el control de volumen de la derecha o inferior.</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Country top container -->
                    <div id="country-top-container" class="view-section is-hidden"></div>
                </div>
                <div id="artistRecommends"></div>
            </section>
            <!-- Columna derecha: Player (siempre visible en desktop) -->
            <aside class="player-area">
                <div id="playerContainer">
                    <div id="playerCard">
                        <!-- Portada con marco y resplandor ambiental -->
                        <div class="player-cover-wrapper">
                            <img id="cover" src="resources/player.gif" alt="Carátula" onerror="this.onerror=null; this.src='resources/player.gif';" />
                        </div>
                        <!-- Información de la canción -->
                        <div id="songInfo">
                            <span id="songTitle" title="Nombre de la canción">Nombre de la canción</span>
                            <span id="songArtist" title="Artista">Artista</span>
                            <div id="songGenre" class="is-hidden"></div>
                        </div>
                        <!-- Audio invisible técnico -->
                        <div class="player" style="visibility: hidden; position: absolute; pointer-events: none;">
                            <audio id="player" style="visibility: hidden;"></audio>
                        </div>
                        <!-- Barra de progreso e información temporal armónica -->
                        <div class="progress-container">
                            <div id="time-info">
                                <span id="currentTime">0:00</span> / <span id="totalTime">0:00</span>
                            </div>
                            <div class="progress-bar-wrapper">
                                <input type="range" id="progressBar" min="0" max="100" value="0" step="0.001" disabled>
                            </div>
                            <div class="reproduciendo-text-container">
                                <span id="reproduciendoText" class="reproduciendo-text">REPRODUCIENDO</span>
                            </div>
                        </div>
                        <!-- Controles de reproducción simétricos de alta fidelidad -->
                        <div class="controls-container">
                            <div class="playback-controls">
                                <button id="shuffleBtn" class="control-btn-secondary" title="Aleatorio (Shuffle)"><i class="ph ph-shuffle"></i></button>
                                <button id="prevBtn" class="control-btn-skip" title="Anterior"><i class="ph-fill ph-skip-back"></i></button>
                                <button id="playPauseBtn" class="control-btn-play" title="Reproducir / Pausar"><i class="ph-fill ph-play"></i></button>
                                <button id="nextBtn" class="control-btn-skip" title="Siguiente"><i class="ph-fill ph-skip-forward"></i></button>
                                <button id="repeatBtn" class="control-btn-secondary" title="Repetir"><i class="ph ph-repeat"></i></button>
                            </div>
                            <!-- Control de volumen compacto en píldora -->
                            <div class="volume-controls-row">
                                <button id="muteBtn" title="Silenciar / Activar sonido"><i class="ph ph-speaker-high"></i></button>
                                <input type="range" id="volumeSlider" min="0" max="0.95" step="0.0001" value="0.5">
                            </div>
                        </div>
                        <!-- Barra de utilidades dual: Letras y Cola de reproducción -->
                        <div class="queue-button-container player-actions-group">
                            <button id="lyricsTabButton" class="queue-button lyrics-toggle-btn" title="Ver letras sincronizadas">
                                <i class="ph ph-quotes"></i> Letras
                            </button>
                            <button id="queueTabButton" class="queue-button" title="Ver cola de reproducción">
                                <i class="ph ph-queue"></i> Cola
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
    <!-- Footer compact player (fuente de verdad en mobile / siempre visible) -->
    <footer class="footer-compact-player">
        <div class="fcp-left">
            <img src="resources/player.gif" alt="Carátula" class="fcp-cover" id="fcp-cover" />
            <div class="fcp-song-info">
                <span class="fcp-title" id="fcp-title">Nombre de la canción</span>
                <span class="fcp-artist" id="fcp-artist">Artista</span>
            </div>
        </div>
        <div class="fcp-center">
            <div class="fcp-controls-row">
                <button class="fcp-btn" id="fcp-prevBtn"><i class="ph ph-skip-back"></i></button>
                <button class="fcp-btn" id="fcp-playPauseBtn"><i class="ph ph-play"></i></button>
                <button class="fcp-btn" id="fcp-nextBtn"><i class="ph ph-skip-forward"></i></button>
            </div>
            <div class="fcp-progress">
                <span class="fcp-time" id="fcp-time">0:00</span>
                <input type="range" id="fcp-progressbar" class="fcp-progressbar" min="0" max="100" value="0" step="0.01"
                    disabled>
                <span class="fcp-time-total" id="fcp-time-total">0:00</span>
            </div>
        </div>
        <div class="fcp-right">
            <button class="fcp-btn" id="fcp_shuffleBtn" title="Aleatorio (Shuffle)"><i style="font-size: larger;"
                    class="ph ph-shuffle"></i></button>
            <button class="fcp-btn" id="fcp_repeatBtn" title="Repetir"><i style="font-size: larger;"
                    class="ph ph-repeat"></i></button>
            <button class="fcp-btn" id="fcp_muteBtn"><i style="font-size: larger;"
                    class="ph ph-speaker-high"></i></button>
            <input id="fcp-volumeSlider" type="range" class="fcp-volume" min="0" max="0.95" step="0.0001" value="0.5">
            <button class="fcp-btn" id="fcp-lyricsBtn" title="Letras">
                <i style="font-size: larger;" class="ph ph-quotes"></i>
            </button>
            <button class="fcp-btn" id="fcp-queueBtn" title="Lista de reproducción">
                <i style="font-size: larger;" class="ph ph-queue"></i>
            </button>
        </div>
    </footer>
    <!-- Playlist Selection Modal -->
    <div id="playlistModalOverlay" class="playlist-modal-overlay is-hidden">
        <div class="playlist-modal-content glass-box">
            <div class="playlist-modal-header">
                <h3>Añadir a Playlist</h3>
                <button id="closePlaylistModalBtn" class="messages-action-btn" title="Cerrar"><i
                        class="ph ph-x"></i></button>
            </div>
            <div class="playlist-modal-body">
                <p class="modal-song-title" id="playlistModalSongTitle">Canción seleccionada</p>
                <div class="playlist-modal-list" id="playlistModalList">
                    <!-- List of playlists to choose from -->
                </div>
                <div class="playlist-modal-create">
                    <input id="playlistModalNameInput" placeholder="Nueva playlist...">
                    <button id="playlistModalCreateBtn" class="changeBg"><i class="ph ph-plus"></i></button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal para seleccionar canciones y exportar a ZIP (iPod, MP3, USB) -->
    <div id="exportZipModalOverlay" class="playlist-modal-overlay is-hidden">
        <div class="playlist-modal-content export-modal-content glass-box">
            <div class="playlist-modal-header">
                <div class="export-header-title">
                    <i class="ph ph-file-zip"></i>
                    <div>
                        <h3>Exportar música fuera de línea</h3>
                        <p class="export-subtitle">Selecciona canciones para tu dump (iPod, MP3, USB)</p>
                    </div>
                </div>
                <button id="closeExportZipModalBtn" class="messages-action-btn" title="Cerrar"><i class="ph ph-x"></i></button>
            </div>
            <div class="playlist-modal-body export-modal-body">
                <!-- Estadísticas y contadores -->
                <div class="export-stats-bar">
                    <span class="export-stat-pill pill-total">Total: <b id="exportStatTotal">0</b></span>
                    <span class="export-stat-pill pill-new">✨ Nuevas: <b id="exportStatNew">0</b></span>
                    <span class="export-stat-pill pill-exported">💾 Ya exportadas: <b id="exportStatOld">0</b></span>
                    <span class="export-stat-pill pill-selected">Seleccionadas: <b id="exportStatSelected">0</b></span>
                </div>
                <!-- Botones de selección rápida -->
                <div class="export-quick-actions">
                    <button id="exportSelectOnlyNewBtn" class="export-chip-btn active" title="Marcar solo las canciones que no se han exportado antes">
                        <i class="ph ph-sparkle"></i> Solo nuevas
                    </button>
                    <button id="exportSelectAllBtn" class="export-chip-btn" title="Marcar todas las canciones">
                        <i class="ph ph-check-square"></i> Todas
                    </button>
                    <button id="exportDeselectAllBtn" class="export-chip-btn" title="Desmarcar todas las canciones">
                        <i class="ph ph-square"></i> Ninguna
                    </button>
                    <button id="exportResetHistoryBtn" class="export-chip-btn chip-danger" title="Reiniciar historial para que todas cuenten como nuevas">
                        <i class="ph ph-arrow-counter-clockwise"></i> Reiniciar historial
                    </button>
                </div>
                <!-- Sección: Excluir canciones ya exportadas (.mexref) -->
                <div class="mexref-section-container">
                    <div class="mexref-header-row">
                        <div class="mexref-title-group">
                            <span class="mexref-section-title"><i class="ph ph-file-code"></i> Excluir canciones ya exportadas</span>
                            <span class="mexref-count-badge" id="mexrefTotalLoadedBadge">0 referencias cargadas</span>
                        </div>
                        <button id="importMexrefBtn" class="export-chip-btn mexref-import-btn" title="Cargar uno o más archivos .mexref para excluir canciones">
                            <i class="ph ph-file-arrow-up"></i> Importar archivos .mexref
                        </button>
                    </div>
                    <!-- Input file invisible como fallback -->
                    <input type="file" id="mexrefFileInput" accept=".mexref" multiple style="display: none;">
                    <!-- Lista de archivos .mexref importados (chips interactivos con botón para retirar) -->
                    <div id="mexrefFilesList" class="mexref-files-chips-container is-hidden">
                        <!-- Chips inyectados dinámicamente -->
                    </div>
                    <!-- Resumen / Indicador de exclusión -->
                    <div id="mexrefExclusionSummary" class="mexref-summary-box is-hidden">
                        <div class="mexref-summary-item">
                            <span class="mexref-summary-label">Canciones originales:</span>
                            <strong id="mexrefOrigCount">0</strong>
                        </div>
                        <div class="mexref-summary-item text-excluded">
                            <span class="mexref-summary-label"><i class="ph ph-prohibit"></i> Se excluirán:</span>
                            <strong id="mexrefExcludedCount">0</strong>
                        </div>
                        <div class="mexref-summary-item text-remaining">
                            <span class="mexref-summary-label"><i class="ph ph-check-circle"></i> Restantes a exportar:</span>
                            <strong id="mexrefRemainingCount">0</strong>
                        </div>
                    </div>
                </div>
                <!-- Buscador de canciones -->
                <div class="export-search-box">
                    <i class="ph ph-magnifying-glass"></i>
                    <input id="exportModalSearchInput" type="text" placeholder="Filtrar canciones por título o artista...">
                </div>
                <!-- Lista scrolleable con canciones y checkboxes -->
                <div class="export-songs-list" id="exportSongsList">
                    <!-- Se inyecta dinámicamente -->
                </div>
                <!-- Footer con botones -->
                <div class="export-modal-footer">
                    <button id="exportCancelBtn" class="export-btn-secondary">Cancelar</button>
                    <button id="exportConfirmBtn" class="export-btn-primary changeBg">
                        <i class="ph ph-download-simple"></i> Exportar seleccionadas (.zip)
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal UI/UX de Progreso de Exportación -->
    <div id="exportProgressModalOverlay" class="playlist-modal-overlay is-hidden">
        <div class="playlist-modal-content export-progress-modal-content glass-box">
            <div class="export-progress-header">
                <div class="export-progress-icon-wrap">
                    <i class="ph ph-file-zip"></i>
                </div>
                <div class="export-progress-header-text">
                    <h3 id="exportProgressTitle">Exportando tu música...</h3>
                    <p id="exportProgressSubtitle">Incrustando carátulas HD y etiquetas ID3v2</p>
                </div>
            </div>
            <div class="export-progress-body">
                <!-- Tarjeta con la canción que se está procesando actualmente -->
                <div class="export-progress-song-card" id="exportProgressCurrentSongCard">
                    <div class="export-progress-song-details">
                        <span id="exportProgressSongTitle" class="export-progress-song-name">Iniciando proceso...</span>
                        <span id="exportProgressSongStep" class="export-progress-song-step">Preparando archivos</span>
                    </div>
                </div>
                <!-- Barra de progreso con gradiente y animación -->
                <div class="export-progress-bar-container">
                    <div class="export-progress-bar-track">
                        <div id="exportProgressBarFill" class="export-progress-bar-fill" style="width: 0%;"></div>
                    </div>
                    <div class="export-progress-bar-meta">
                        <span id="exportProgressCounterText">0 / 0 canciones</span>
                        <span id="exportProgressPercentText">0%</span>
                    </div>
                </div>
                <div class="export-progress-status-footer" id="exportProgressStatusText">
                    <i class="ph ph-hourglass-high"></i> Por favor espera, no cierres la aplicación...
                </div>
            </div>
        </div>
    </div>
    <script src="assets/js/script.js" defer></script>
    <script src="assets/js/topSongs.js" defer></script>
    <script src="assets/js/messages.js" defer></script>
    <script src="node_modules/colorthief/dist/color-thief.umd.js"></script>
    <script src="assets/js/style.js" defer></script>
    <script src="assets/js/modal.js" defer></script>
    <script src="assets/js/equalizer.js"></script>
    <script src="assets/js/lyrics.js" defer></script>
</body>
</html>
````

## File: main.js
````javascript
// node fetch con required
⋮----
// Solo estos cambios mínimos para mejorar sin romper nada
const isDev = !app.isPackaged; // ✅ Auto-detecta entorno (en lugar de hardcodear)
let debug = isDev; // ✅ Mantener como variable para poder cambiar
⋮----
function logDebug(...args)
⋮----
/////////////////////
// DISCORD PRESENCE
/////////////////////
⋮----
const CLIENT_ID = "1417279389858529392"; // ← Cambiar por tu Discord Application ID
⋮----
// ================ FUNCIONES ESENCIALES ================
async function initDiscord()
⋮----
let rpcStartTimestamp = null; // timestamp global de inicio
⋮----
async function updateActivity(details, state, image, resetTime = false)
⋮----
console.log("Imagen recibida:", image); // <-- Nuevo log
⋮----
console.log("Usando imagen:", imgurl); // <-- Nuevo log
⋮----
rpcStartTimestamp = Math.floor(Date.now() / 1000); // inicializamos
⋮----
// agregar presencia con denotacion en debug
⋮----
startTimestamp: rpcStartTimestamp, // usamos la misma referencia
⋮----
type: 2, // <--- "Listening to"
⋮----
// ================ IPC HANDLERS ================
⋮----
// ------------------- Paths de binarios (TU CÓDIGO ORIGINAL) -------------------
function getYtdlpPath()
⋮----
function getFfmpegPath()
⋮----
function checkYtdlpUpdate(win)
⋮----
// ------------------- Crear ventana (TU CÓDIGO ORIGINAL) -------------------
function createWindow()
⋮----
icon: path.join(__dirname, "logo.png"), // aquí sí acepta PNG en Windows
⋮----
// ================ INICIALIZACIÓN ================
⋮----
// ⚠️ DEBE ir antes de app.whenReady()
// Registra mexlify:// como protocolo seguro para cargar archivos locales de AppData
⋮----
// ==================== SQLite DATABASE SYSTEM ====================
⋮----
function initDatabase()
⋮----
// Crear tabla de reproducciones
⋮----
// Inicializar tabla de caché de letras
⋮----
// Handlers de base de datos
⋮----
// Copiar cookies.txt a la carpeta userData para el proceso secundario de yt-dlp
⋮----
// Interceptar cabeceras salientes a googlevideo.com para evitar el error 403 Forbidden
⋮----
// Registrar protocolo mexlify:// para servir imágenes locales sin bloqueo CSP
⋮----
// Fix Chromium converting C:/ into host c/ (e.g. mexlify://c/Users/...)
⋮----
// ------------------- Cache -------------------
⋮----
// ------------------- Utilidades (TU CÃ"DIGO ORIGINAL EXACTO) -------------------
function normalize(query)
⋮----
// ------------------- FunciÃ³n helper para ejecutar yt-dlp (TU CÃ"DIGO ORIGINAL) -------------------
function execYtdlp(args = [])
⋮----
function execYtdlpDownload(args = [])
⋮----
// Éxito, simplemente resolvemos sin JSON
⋮----
// Si falla por el formato volver a intentarlo de otra manera
⋮----
async function validateURL(url)
⋮----
async function getCorrectSongName(query)
⋮----
// Consultar iTunes API para obtener resultados
⋮----
// Realizamos la búsqueda en iTunes
⋮----
// Si la respuesta no es correcta, devolvemos la consulta original
⋮----
// Parseamos la respuesta de la API
⋮----
// Mapeamos los resultados para obtener el nombre corregido, portada y género
⋮----
cover: track.artworkUrl100?.replace("100x100bb.jpg", "500x500bb.jpg"), // Usamos una imagen más grande
⋮----
// Retornamos los resultados procesados
⋮----
// Si no encontramos resultados, devolvemos la consulta original
⋮----
// Manejo de errores
⋮----
// Si ocurre algún error en la consulta, devolvemos la consulta original
⋮----
// NEW CODEEEEEEEEEEEEEEEEEEEEE
⋮----
// ------------------- IPC Handlers (TU CÓDIGO ORIGINAL EXACTO) -------------------
// ✨ BÚSQUEDA ULTRA-OPTIMIZADA CON YOUTUBE-SR
⋮----
// 1️⃣ Obtener metadatos de iTunes (para cover y género de alta calidad)
⋮----
// Llamar a la función correctamente
const result = corrected; //await getCorrectSongName(normalizedQuery);
⋮----
// Verificar si hay resultados válidos
⋮----
// Si result es un objeto simple
⋮----
// 2️⃣ Búsqueda con youtube-sr (ULTRA RÁPIDO - reemplaza yt-dlp)
⋮----
// 3️⃣ Mapear resultados directamente (sin requests adicionales)
⋮----
// Priorizar cover de iTunes, luego thumbnail de YouTube en máxima calidad
⋮----
duration: Math.floor(video.duration / 1000), // Convertir ms a segundos
⋮----
// 4️⃣ Filtrar canciones muy cortas (menos de 50 segundos)
⋮----
// ------------------- Descargas (TU CÓDIGO ORIGINAL EXACTO) -------------------
// Carpeta de descargas "segura" fuera de ASAR
⋮----
// Asegurarse de que exista la carpeta y el archivo de metadata
⋮----
// Carpeta para metadata independiente
⋮----
function safeParseDate(value)
⋮----
function parseMetadataFile(content)
⋮----
function resolveDownloadTimestamp(metadata, metadataPath, filePath)
⋮----
function embedCoverAndMetadata(mp3Path, coverPath, metadataObj =
⋮----
// Validar datos
⋮----
// Nombre seguro del archivo
⋮----
// Si ya existe, retornar
⋮----
// Validar URL
⋮----
// Ejecutar yt-dlp para descargar audio
⋮----
// Verificar descarga
⋮----
// Guardar metadata de manera segura
⋮----
// Descargar miniatura para disponibilidad offline
⋮----
// Usar protocolo mexlify:// en lugar de file:// para evitar bloqueo CSP
⋮----
// Incrustar la carátula y metadatos ID3v2 directamente dentro del archivo MP3
⋮----
// Eliminar archivos
⋮----
// También incluir cualquier mp3 en downloads que no tenga archivo .txt
⋮----
return path.join(downloadsDir, filename); // C:\...\downloads\song.mp3
⋮----
return downloadsDir; // solo la carpeta
⋮----
// Filtrar solo las canciones seleccionadas por el usuario si se proporcionan
⋮----
// Si no hay archivo txt, deducir Artista y Título del nombre si contiene ' - '
⋮----
// Si existe carátula en metadata/, usarla; si no, usar logo.png como fallback elegante
⋮----
// Si el archivo local no estaba ocupado, actualizarlo para que ya tenga carátula incrustada
⋮----
// Fallback si no hay carátula o si falló el empaquetado
⋮----
// Extraer identificador de la fuente (Spotify, YouTube, local)
⋮----
// Escribir archivo ZIP
⋮----
// Limpiar archivos temporales generados
⋮----
// Guardar archivo .mexref (Mexlify References)
⋮----
// Leer archivos .mexref para importación y exclusión
⋮----
// ==================== LYRICS SYSTEM (LRCLIB + SQLite Cache) ====================
````
