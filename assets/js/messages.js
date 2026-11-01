// messages.js
// Manager para la bandeja del sistema (inbox de notificaciones)

class SystemTrayManager {
  constructor() {
    this.messages = [];
    this.activeTab = "general"; // default active tab: general
    this.listElement = null;
    this.overlayElement = null;
    this.drawerElement = null;
    this.btnBadge = null;
    this.activeDownloadTask = null;
  }

  init() {
    this.listElement = document.getElementById("messagesList");
    this.overlayElement = document.getElementById("messagesOverlay");
    this.drawerElement = document.getElementById("messagestab");
    this.btnBadge = document.getElementById("messagesBadge");

    // Close button
    const closeBtn = document.getElementById("closeMessagesBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    // Overlay click
    if (this.overlayElement) {
      this.overlayElement.addEventListener("click", () => this.close());
    }

    // Clear button
    const clearBtn = document.getElementById("clearMessagesBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearAll());
    }

    // Bind sidebar button
    const sidebarMsgBtn = document.getElementById("messagesBtn");
    if (sidebarMsgBtn) {
      sidebarMsgBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    // Tab buttons
    const tabGeneral = document.getElementById("msgTabGeneral");
    const tabSistem = document.getElementById("msgTabSistem");

    if (tabGeneral) {
      tabGeneral.addEventListener("click", () => {
        this.activeTab = "general";
        tabGeneral.classList.add("is-active");
        if (tabSistem) tabSistem.classList.remove("is-active");
        this.render();
      });
    }

    if (tabSistem) {
      tabSistem.addEventListener("click", () => {
        this.activeTab = "system";
        tabSistem.classList.add("is-active");
        if (tabGeneral) tabGeneral.classList.remove("is-active");
        this.render();
      });
    }

    // Add initial welcome message (silent = false so it starts in General tab!)
    this.addMessage("Sistema", "Mexlify se ha iniciado correctamente.", "info", false);

    // Re-render
    this.render();
  }

  addMessage(title, text, type = "info", silent = true) {
    // type: 'info' | 'success' | 'warning' | 'error' | 'music'
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const message = {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      title,
      text,
      type,
      time: timeStr,
      silent
    };

    this.messages.unshift(message);

    // Keep max 50 messages
    if (this.messages.length > 50) {
      this.messages.pop();
    }

    this.render();
    
    // Only update badge count if the drawer is not open
    if (!this.isOpen()) {
      this.updateBadge();
    }
  }

  clearAll() {
    if (this.activeTab === "general") {
      this.messages = this.messages.filter(m => m.silent);
    } else {
      this.messages = this.messages.filter(m => !m.silent);
    }
    this.render();
    this.updateBadge();
  }

  updateDownloadTask(taskData) {
    if (!taskData) {
      this.activeDownloadTask = null;
    } else {
      this.activeDownloadTask = {
        ...(this.activeDownloadTask || {}),
        ...taskData,
        updatedAt: new Date()
      };
    }
    this.render();
    this.updateBadge();
  }

  clearDownloadTask() {
    this.activeDownloadTask = null;
    this.render();
    this.updateBadge();
  }

  updateBadge() {
    if (!this.btnBadge) return;
    if (this.activeDownloadTask && !this.activeDownloadTask.isFinished) {
      const { processedCount = 0, totalCount = 0 } = this.activeDownloadTask;
      this.btnBadge.textContent = totalCount > 0 ? `${processedCount}/${totalCount}` : "↓";
      this.btnBadge.style.display = "inline-flex";
      return;
    }
    if (this.isOpen()) {
      this.btnBadge.style.display = "none";
      return;
    }
    const nonSilentCount = this.messages.filter(m => !m.silent).length;
    if (nonSilentCount > 0) {
      this.btnBadge.textContent = nonSilentCount;
      this.btnBadge.style.display = "inline-flex";
    } else {
      this.btnBadge.style.display = "none";
    }
  }

  isOpen() {
    return this.drawerElement && this.drawerElement.classList.contains("is-open");
  }

  open() {
    if (this.drawerElement) this.drawerElement.classList.add("is-open");
    if (this.overlayElement) this.overlayElement.classList.add("is-open");
    
    // Reset/hide badge on open unless a live download is showing progress
    this.updateBadge();
    
    // Close other drawers (like queue) if they are open
    if (window.closeQueueDrawer) {
      window.closeQueueDrawer();
    }
  }

  close() {
    if (this.drawerElement) this.drawerElement.classList.remove("is-open");
    if (this.overlayElement) this.overlayElement.classList.remove("is-open");
    this.updateBadge();
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  createDownloadTaskElement(task) {
    const {
      playlistName = "Playlist",
      processedCount = 0,
      totalCount = 1,
      downloadedCount = 0,
      cachedCount = 0,
      failedCount = 0,
      currentSongTitle = "",
      status = "downloading",
      statusText = "Descargando...",
      isPaused = false,
      isFinished = false
    } = task;

    const percent = totalCount > 0 ? Math.min(100, Math.round((processedCount / totalCount) * 100)) : 0;

    let badgeClass = "status-active";
    let statusIcon = "ph-spinner ph-spin";
    if (status === "cooldown" || status === "playback-yield") {
      badgeClass = "status-cooldown";
      statusIcon = status === "playback-yield" ? "ph-Headphones" : "ph-shield-check";
      if (status === "playback-yield") statusIcon = "ph-headphones";
    } else if (isPaused || status === "paused") {
      badgeClass = "status-paused";
      statusIcon = "ph-pause-circle";
    } else if (status === "completed") {
      badgeClass = "status-completed";
      statusIcon = "ph-check-circle";
    } else if (status === "cancelled") {
      badgeClass = "status-cancelled";
      statusIcon = "ph-x-circle";
    }

    const li = document.createElement("li");
    li.className = `message-item tray-download-card ${badgeClass}`;
    li.innerHTML = `
      <div class="tray-dl-header">
        <div class="tray-dl-title-wrap">
          <i class="ph ${statusIcon} tray-dl-icon"></i>
          <div>
            <span class="tray-dl-title">Descarga: ${playlistName}</span>
            <span class="tray-dl-status-badge">${statusText}</span>
          </div>
        </div>
        <span class="tray-dl-percent">${percent}%</span>
      </div>

      <div class="tray-dl-progress-track">
        <div class="tray-dl-progress-fill" style="width: ${percent}%;"></div>
      </div>

      <div class="tray-dl-meta-row">
        <span><b>${processedCount}</b> / ${totalCount} procesadas</span>
        <span>Nuevas: <b>${downloadedCount}</b></span>
        ${cachedCount > 0 ? `<span>En caché: <b>${cachedCount}</b></span>` : ""}
        ${failedCount > 0 ? `<span class="tray-dl-failed">Fallos: <b>${failedCount}</b></span>` : ""}
      </div>

      ${
        currentSongTitle && !isFinished
          ? `<div class="tray-dl-current-song" title="${currentSongTitle.replace(/"/g, "&quot;")}">
               <i class="ph ph-music-note"></i>
               <span>${currentSongTitle}</span>
             </div>`
          : ""
      }

      <div class="tray-dl-actions">
        ${
          !isFinished
            ? `
              <button type="button" class="tray-dl-btn tray-dl-btn-pause" data-dl-action="toggle-pause">
                <i class="ph ${isPaused ? "ph-play" : "ph-pause"}"></i>
                ${isPaused ? "Reanudar" : "Pausar"}
              </button>
              <button type="button" class="tray-dl-btn tray-dl-btn-cancel" data-dl-action="cancel">
                <i class="ph ph-stop"></i> Cancelar
              </button>
            `
            : `
              <button type="button" class="tray-dl-btn tray-dl-btn-dismiss" data-dl-action="dismiss">
                <i class="ph ph-check"></i> Entendido
              </button>
            `
        }
      </div>
    `;

    const pauseBtn = li.querySelector('[data-dl-action="toggle-pause"]');
    if (pauseBtn) {
      pauseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.playlistDownloadController && typeof window.playlistDownloadController.togglePause === "function") {
          window.playlistDownloadController.togglePause();
        }
      });
    }

    const cancelBtn = li.querySelector('[data-dl-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (window.playlistDownloadController && typeof window.playlistDownloadController.cancel === "function") {
          window.playlistDownloadController.cancel();
        }
      });
    }

    const dismissBtn = li.querySelector('[data-dl-action="dismiss"]');
    if (dismissBtn) {
      dismissBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.clearDownloadTask();
      });
    }

    return li;
  }

  render() {
    if (!this.listElement) return;
    this.listElement.innerHTML = "";

    if (this.activeDownloadTask) {
      this.listElement.appendChild(this.createDownloadTaskElement(this.activeDownloadTask));
    }

    const filtered = this.messages.filter(msg => {
      if (this.activeTab === "general") {
        return !msg.silent;
      } else {
        return msg.silent;
      }
    });

    if (filtered.length === 0 && !this.activeDownloadTask) {
      this.listElement.innerHTML = `
        <div class="messages-empty-state">
          <i class="ph ph-bell-slash"></i>
          <p>La bandeja está vacía</p>
        </div>
      `;
      return;
    }

    filtered.forEach(msg => {
      let iconClass = "ph-info";
      if (msg.type === "success") iconClass = "ph-check-circle";
      if (msg.type === "warning") iconClass = "ph-warning";
      if (msg.type === "error") iconClass = "ph-x-circle";
      if (msg.type === "music") iconClass = "ph-music-notes";

      const li = document.createElement("li");
      li.className = `message-item message-${msg.type}`;
      li.innerHTML = `
        <div class="message-icon-wrapper">
          <i class="ph ${iconClass}"></i>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-title">${msg.title}</span>
            <span class="message-time">${msg.time}</span>
          </div>
          <p class="message-text">${msg.text}</p>
        </div>
      `;
      this.listElement.appendChild(li);
    });
  }
}

// Export global instance
window.systemTray = new SystemTrayManager();
document.addEventListener("DOMContentLoaded", () => {
  window.systemTray.init();
});
