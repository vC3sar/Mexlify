/**
 * Mexlify Android Player - Synchronized Lyrics Engine
 * Parsea y sincroniza letras offline en formato .lrc con desplazamiento automático y resalte activo,
 * además de soporte para letras en texto plano (plainLyrics).
 */

export class LyricsEngine {
  constructor() {
    this.lines = [];
    this.plainLines = [];
    this.activeIndex = -1;
    this.container = null;
    this.onSeekCallback = null;
    this.isUserInteracting = false;
    this.scrollTimeout = null;
  }

  /**
   * Parsea un texto .lrc con marcas [mm:ss.xx] o [mm:ss]
   */
  parseLRC(lrcText) {
    this.lines = [];
    this.plainLines = [];
    this.activeIndex = -1;

    if (!lrcText || typeof lrcText !== "string") {
      return this.lines;
    }

    const rawLines = lrcText.split(/\r?\n/);
    const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

    for (const rawLine of rawLines) {
      const trimmed = rawLine.trim();
      if (!trimmed) continue;

      let match;
      const timestamps = [];
      while ((match = timeRegex.exec(trimmed)) !== null) {
        const min = parseInt(match[1], 10);
        const sec = parseInt(match[2], 10);
        const msStr = (match[3] || "0").padEnd(3, "0").slice(0, 3);
        const ms = parseInt(msStr, 10);
        const totalSeconds = min * 60 + sec + ms / 1000;
        timestamps.push(totalSeconds);
      }

      const text = trimmed.replace(timeRegex, "").trim();

      if (timestamps.length > 0) {
        for (const t of timestamps) {
          this.lines.push({ time: t, text: text });
        }
      } else if (!/^\[(ar|ti|al|by|offset|length):/i.test(trimmed)) {
        this.plainLines.push(trimmed);
      }
    }

    // Ordenar cronológicamente
    this.lines.sort((a, b) => a.time - b.time);
    return this.lines;
  }

  /**
   * Sincroniza con el tiempo actual del reproductor
   */
  syncTime(currentTime) {
    if (!this.lines || this.lines.length === 0) return -1;

    let targetIdx = -1;
    for (let i = 0; i < this.lines.length; i++) {
      if (currentTime >= this.lines[i].time) {
        targetIdx = i;
      } else {
        break;
      }
    }

    if (targetIdx !== this.activeIndex) {
      this.activeIndex = targetIdx;
      this.updateVisualClasses();
      if (!this.isUserInteracting) {
        this.scrollToActive();
      }
    }

    return this.activeIndex;
  }

  /**
   * Devuelve el texto de la línea activa actual
   */
  getActiveLineText() {
    if (this.activeIndex >= 0 && this.activeIndex < this.lines.length) {
      return this.lines[this.activeIndex].text || "♪";
    }
    if (this.lines.length > 0) {
      return "♪ Letras sincronizadas listas";
    }
    if (this.plainLines.length > 0) {
      return this.plainLines[0];
    }
    return null;
  }

  /**
   * Renderiza el DOM de las letras dentro de un contenedor
   */
  render(containerElement, onSeek) {
    this.container = containerElement;
    this.onSeekCallback = onSeek;
    this.container.innerHTML = "";

    if ((!this.lines || this.lines.length === 0) && (!this.plainLines || this.plainLines.length === 0)) {
      this.container.innerHTML = `
        <div class="lyrics-empty">
          <i class="ph ph-music-notes"></i>
          <p>No hay letra sincronizada disponible para este tema</p>
        </div>
      `;
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "lyrics-stream";

    if (this.lines.length > 0) {
      this.lines.forEach((line, index) => {
        const lineEl = document.createElement("div");
        lineEl.className = "lyrics-line";
        lineEl.dataset.index = index;
        lineEl.textContent = line.text || "♪";

        lineEl.addEventListener("click", () => {
          if (typeof this.onSeekCallback === "function") {
            this.onSeekCallback(line.time);
          }
        });

        wrapper.appendChild(lineEl);
      });
    } else {
      this.plainLines.forEach((text) => {
        const lineEl = document.createElement("div");
        lineEl.className = "lyrics-line passed";
        lineEl.style.cursor = "default";
        lineEl.textContent = text;
        wrapper.appendChild(lineEl);
      });
    }

    this.container.appendChild(wrapper);

    // Detección de scroll táctil del usuario
    this.container.addEventListener("touchstart", () => {
      this.isUserInteracting = true;
      clearTimeout(this.scrollTimeout);
    }, { passive: true });

    this.container.addEventListener("touchend", () => {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.isUserInteracting = false;
        this.scrollToActive();
      }, 3000);
    }, { passive: true });
  }

  updateVisualClasses() {
    if (!this.container) return;
    const elements = this.container.querySelectorAll(".lyrics-line");

    elements.forEach((el, idx) => {
      if (idx === this.activeIndex) {
        el.classList.add("active");
        el.classList.remove("passed");
      } else if (idx < this.activeIndex) {
        el.classList.add("passed");
        el.classList.remove("active");
      } else {
        el.classList.remove("active", "passed");
      }
    });
  }

  scrollToActive() {
    if (!this.container || this.activeIndex < 0) return;
    const activeEl = this.container.querySelector(`.lyrics-line[data-index="${this.activeIndex}"]`);
    if (!activeEl) return;

    activeEl.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}
