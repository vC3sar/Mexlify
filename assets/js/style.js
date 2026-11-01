document.addEventListener("DOMContentLoaded", () => {
  const sanitizeImageUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== "string") return "";
    return rawUrl.trim().replace(/^["']+|["']+$/g, "");
  };

  // ======= Fondo dinámico central (Fondo de Panel Central) =======
  const box =
    document.querySelector("section.content.glass-box") ||
    document.querySelector(".content") ||
    document.querySelector(".glass-box");
  const input = document.getElementById("bgInput");
  const btnChangeBG = document.getElementById("changeBg");
  const btnRemoveBG = document.getElementById("removeBg");

  const applyCentralPanelBg = (url) => {
    if (!box) return;
    const cleanUrl = sanitizeImageUrl(url);
    if (!cleanUrl) {
      box.style.backgroundImage = "";
      box.style.backgroundPosition = "";
      box.style.backgroundSize = "";
      box.style.backgroundRepeat = "";
      box.style.backgroundBlendMode = "";
      return;
    }
    const escapedUrl = cleanUrl.replace(/"/g, '\\"');
    box.style.backgroundImage = `linear-gradient(rgba(8, 4, 18, 0.52), rgba(8, 4, 18, 0.65)), url("${escapedUrl}")`;
    box.style.backgroundPosition = "center top";
    box.style.backgroundSize = "cover";
    box.style.backgroundRepeat = "no-repeat";
    box.style.backgroundBlendMode = "normal";
  };

  const resetCentralPanelBg = () => {
    localStorage.removeItem("bgUrl");
    applyCentralPanelBg("");
    if (input) input.value = "";
    console.log("bg removed");
  };

  const savedUrl = sanitizeImageUrl(localStorage.getItem("bgUrl"));
  if (savedUrl) {
    if (input) input.value = savedUrl;
    applyCentralPanelBg(savedUrl);
  }

  if (btnChangeBG) {
    btnChangeBG.addEventListener("click", () => {
      const url = input ? sanitizeImageUrl(input.value) : "";
      if (!url) {
        // "Deja vacío para usar el tema base"
        resetCentralPanelBg();
        return;
      }
      localStorage.setItem("bgUrl", url);
      applyCentralPanelBg(url);
      console.log("bg setted");
    });
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && btnChangeBG) {
        e.preventDefault();
        btnChangeBG.click();
      }
    });
  }

  if (btnRemoveBG) {
    btnRemoveBG.addEventListener("click", () => {
      resetCentralPanelBg();
    });
  }

  // ======= Imagen de fondo del reproductor (Fondo en Tarjeta de Reproducción) =======
  const playerStyle = document.getElementById("playerCard");
  const inputStyle = document.getElementById("imgInput");
  const btnStyle = document.getElementById("setImgBtn");
  const btnRemStyle = document.getElementById("removeImgBtn");
  const coverImg = document.getElementById("cover");
  const audioPlayer = document.getElementById("player");
  const songTitleEl = document.getElementById("songTitle");

  // Calcula luminancia perceptual (0 = negro absoluto, 1 = blanco absoluto)
  const getPerceivedLuminance = (r, g, b) => {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  };

  // Aplica automáticamente la clase de contraste (is-light-bg o is-dark-bg) a #playerCard
  const setPlayerContrastMode = (isLight) => {
    if (!playerStyle) return;
    playerStyle.classList.toggle("is-light-bg", !!isLight);
    playerStyle.classList.toggle("is-dark-bg", !isLight);
  };

  const extractRichPaletteInfo = (palette) => {
    if (!palette || !palette.length) return null;
    let r = 0,
      g = 0,
      b = 0;

    let bestVibrant = palette[0];
    let bestVibrantScore = -1;

    palette.forEach((color) => {
      r += color[0];
      g += color[1];
      b += color[2];

      const maxC = Math.max(color[0], color[1], color[2]);
      const minC = Math.min(color[0], color[1], color[2]);
      const chroma = maxC - minC;
      const lum = getPerceivedLuminance(color[0], color[1], color[2]);
      // Preferir tonos con buena saturación que no sean ni casi negros ni casi blancos
      const lumPenalty = 1 - Math.abs(lum - 0.5) * 1.35;
      const score = chroma * Math.max(0.2, lumPenalty);
      if (score > bestVibrantScore) {
        bestVibrantScore = score;
        bestVibrant = color;
      }
    });

    const avg = [
      Math.floor(r / palette.length),
      Math.floor(g / palette.length),
      Math.floor(b / palette.length),
    ];

    // Buscar un segundo tono distinto para aportar riqueza cromática lateral
    let secondary = palette[1] || avg;
    let maxDist = -1;
    palette.forEach((color) => {
      const dist =
        Math.abs(color[0] - bestVibrant[0]) +
        Math.abs(color[1] - bestVibrant[1]) +
        Math.abs(color[2] - bestVibrant[2]);
      if (dist > maxDist) {
        maxDist = dist;
        secondary = color;
      }
    });

    return {
      avg,
      vibrant: bestVibrant,
      secondary,
    };
  };

  const sampleImagePalette = (urlOrImg, onPaletteReady) => {
    if (typeof ColorThief === "undefined") {
      onPaletteReady(null);
      return;
    }

    const extract = (imgEl) => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(imgEl, 10);
      return extractRichPaletteInfo(palette);
    };

    if (typeof urlOrImg !== "string" && urlOrImg) {
      if (urlOrImg.complete && urlOrImg.naturalWidth > 0 && urlOrImg.naturalHeight > 0) {
        try {
          const info = extract(urlOrImg);
          if (info) {
            onPaletteReady(info);
            return;
          }
        } catch (err) {
          // Fallback CORS abajo
        }
      }
      const src = urlOrImg.currentSrc || urlOrImg.src || "";
      if (!src) {
        onPaletteReady(null);
        return;
      }
      urlOrImg = src;
    }

    if (typeof urlOrImg === "string" && urlOrImg) {
      const probeImg = new Image();
      if (/^https?:\/\//i.test(urlOrImg)) {
        probeImg.crossOrigin = "Anonymous";
      }
      probeImg.onload = () => {
        try {
          onPaletteReady(extract(probeImg));
        } catch (err) {
          onPaletteReady(null);
        }
      };
      probeImg.onerror = () => onPaletteReady(null);
      probeImg.src = urlOrImg;
    } else {
      onPaletteReady(null);
    }
  };

  const applyPlayerCardCustomBg = (url) => {
    if (!playerStyle) return;
    const cleanUrl = sanitizeImageUrl(url);
    if (!cleanUrl) return;
    const escapedUrl = cleanUrl.replace(/"/g, '\\"');

    // Activar modo de fondo personalizado: hace #cover transparente vía CSS (#playerCard.has-custom-bg #cover)
    playerStyle.classList.add("has-custom-bg");
    playerStyle.style.backgroundColor = "transparent";
    playerStyle.style.backgroundImage = `linear-gradient(180deg, rgba(10, 6, 20, 0.20) 0%, rgba(10, 6, 20, 0.45) 55%, rgba(8, 4, 16, 0.72) 100%), url("${escapedUrl}")`;
    playerStyle.style.backgroundPosition = "center";
    playerStyle.style.backgroundSize = "cover";
    playerStyle.style.backgroundRepeat = "no-repeat";

    if (coverImg) {
      coverImg.style.opacity = "";
      coverImg.style.backgroundColor = "";
    }
    if (songTitleEl) {
      songTitleEl.style.backgroundColor = "";
      songTitleEl.style.padding = "";
    }

    // Analizar luminancia y paleta de la imagen de fondo para adaptar el contraste y el halo automáticamente
    sampleImagePalette(cleanUrl, (paletteInfo) => {
      if (sanitizeImageUrl(localStorage.getItem("playerImg")) !== cleanUrl) return;
      if (paletteInfo) {
        const { avg, vibrant } = paletteInfo;
        playerStyle.style.setProperty(
          "--cover-ambient-glow",
          `rgba(${vibrant[0]}, ${vibrant[1]}, ${vibrant[2]}, 0.38)`
        );
        const lum = getPerceivedLuminance(avg[0], avg[1], avg[2]);
        if (lum > 0.68) {
          playerStyle.style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(245, 242, 255, 0.48) 100%), url("${escapedUrl}")`;
          setPlayerContrastMode(true);
        } else {
          playerStyle.style.backgroundImage = `linear-gradient(180deg, rgba(10, 6, 20, 0.18) 0%, rgba(10, 6, 20, 0.44) 55%, rgba(8, 4, 16, 0.72) 100%), url("${escapedUrl}")`;
          setPlayerContrastMode(false);
        }
      } else {
        setPlayerContrastMode(false);
      }
    });
  };

  function updatePlayerBgColor() {
    // Si el usuario tiene una imagen personalizada activa, respetarla siempre
    if (sanitizeImageUrl(localStorage.getItem("playerImg"))) return;
    if (!coverImg || !playerStyle) return;

    playerStyle.classList.remove("has-custom-bg");

    sampleImagePalette(coverImg, (paletteInfo) => {
      if (sanitizeImageUrl(localStorage.getItem("playerImg"))) return;
      if (!paletteInfo) return;

      const { avg, vibrant, secondary } = paletteInfo;
      const [r, g, b] = avg;
      const [vR, vG, vB] = vibrant;
      const [sR, sG, sB] = secondary;

      const lum = getPerceivedLuminance(r, g, b);
      const isLightCover = lum > 0.58;
      setPlayerContrastMode(isLightCover);

      // Resplandor ambiental de la carátula sincronizado con el color vibrante de la portada
      playerStyle.style.setProperty(
        "--cover-ambient-glow",
        `rgba(${vR}, ${vG}, ${vB}, ${isLightCover ? 0.34 : 0.46})`
      );

      // Construir atmósfera multicapa con profundidad cromática (luz superior desde la carátula + caída tonal hacia los controles)
      const topR = Math.min(255, Math.round(r * 0.65 + vR * 0.35));
      const topG = Math.min(255, Math.round(g * 0.65 + vG * 0.35));
      const topB = Math.min(255, Math.round(b * 0.65 + vB * 0.35));

      const midR = Math.round(r * (isLightCover ? 0.88 : 0.68));
      const midG = Math.round(g * (isLightCover ? 0.88 : 0.68));
      const midB = Math.round(b * (isLightCover ? 0.88 : 0.68));

      const botR = Math.round(r * (isLightCover ? 0.74 : 0.32) + (isLightCover ? 18 : 8));
      const botG = Math.round(g * (isLightCover ? 0.74 : 0.32) + (isLightCover ? 14 : 4));
      const botB = Math.round(b * (isLightCover ? 0.74 : 0.32) + (isLightCover ? 26 : 16));

      playerStyle.style.backgroundColor = `rgb(${botR}, ${botG}, ${botB})`;
      playerStyle.style.backgroundImage = [
        `radial-gradient(115% 58% at 50% 15%, rgba(${vR}, ${vG}, ${vB}, 0.62) 0%, rgba(${topR}, ${topG}, ${topB}, 0.22) 58%, transparent 100%)`,
        `radial-gradient(90% 48% at 88% 6%, rgba(${sR}, ${sG}, ${sB}, 0.34) 0%, transparent 72%)`,
        `linear-gradient(180deg, rgba(${topR}, ${topG}, ${topB}, 0.86) 0%, rgba(${midR}, ${midG}, ${midB}, 0.91) 52%, rgba(${botR}, ${botG}, ${botB}, 0.97) 100%)`,
      ].join(", ");
    });
  }

  const resetPlayerCardCustomBg = () => {
    localStorage.removeItem("playerImg");
    if (inputStyle) inputStyle.value = "";
    if (playerStyle) {
      playerStyle.classList.remove("has-custom-bg");
      playerStyle.style.backgroundImage = "";
      playerStyle.style.backgroundColor = "";
      playerStyle.style.removeProperty("--cover-ambient-glow");
    }
    if (coverImg) {
      coverImg.style.opacity = "";
      coverImg.style.backgroundColor = "";
    }
    if (songTitleEl) {
      songTitleEl.style.backgroundColor = "";
      songTitleEl.style.padding = "";
    }
    setPlayerContrastMode(false);
    // Al desactivar el fondo personalizado, aplicar el diseño atmosférico dinámico de la portada actual
    updatePlayerBgColor();
  };

  // Al iniciar la app, revisa si existe playerImg en localStorage
  const initialPlayerImg = sanitizeImageUrl(localStorage.getItem("playerImg"));
  if (initialPlayerImg) {
    if (inputStyle) inputStyle.value = initialPlayerImg;
    applyPlayerCardCustomBg(initialPlayerImg);
  } else {
    updatePlayerBgColor();
  }

  if (btnStyle) {
    btnStyle.addEventListener("click", () => {
      const url = inputStyle ? sanitizeImageUrl(inputStyle.value) : "";
      if (!url) {
        resetPlayerCardCustomBg();
        return;
      }
      localStorage.setItem("playerImg", url);
      applyPlayerCardCustomBg(url);
    });
  }

  if (inputStyle) {
    inputStyle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && btnStyle) {
        e.preventDefault();
        btnStyle.click();
      }
    });
  }

  if (btnRemStyle) {
    btnRemStyle.addEventListener("click", () => {
      resetPlayerCardCustomBg();
    });
  }

  // Actualizar color sólido dinámico cuando cambie la carátula o inicie reproducción (si no hay fondo personalizado)
  if (coverImg) {
    coverImg.addEventListener("load", () => {
      if (!sanitizeImageUrl(localStorage.getItem("playerImg"))) {
        updatePlayerBgColor();
      }
    });
  }

  if (audioPlayer) {
    audioPlayer.addEventListener("play", () => {
      if (!sanitizeImageUrl(localStorage.getItem("playerImg"))) {
        updatePlayerBgColor();
      }
    });
  }

  // ======= Fin fondo dinámico =======
});

//load custom gradient from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const savedColor1 = localStorage.getItem("gradientColor1");
  const savedColor2 = localStorage.getItem("gradientColor2");
  if (savedColor1 && savedColor2) {
    document.getElementById("color1").value = savedColor1;
    document.getElementById("color2").value = savedColor2;
    gradientController.setGradient(savedColor1, savedColor2);
  } else {
    gradientController.logCurrentGradient(true); // true para resetear a valores por defecto
  }
});
const gradientController = {
  // Obtiene el background actual (linear-gradient)
  getCurrentGradient() {
    return getComputedStyle(document.body).backgroundImage;
  },

  // Convierte color RGB a HEX
  rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = Number(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  },

  // Convierte HEX a RGB
  hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((x) => x + x)
        .join("");
    }
    const num = parseInt(hex, 16);
    return [num >> 16, (num >> 8) & 255, num & 255];
  },

  // Convierte string "rgb(8,0,20)" a HEX "#080014"
  rgbStringToHex(rgbStr) {
    const nums = rgbStr.match(/\d+/g);
    if (!nums) return rgbStr;
    return this.rgbToHex(nums[0], nums[1], nums[2]);
  },

  // Establece el degradado con colores (admite HEX o RGB string)
  setGradient(color1, color2) {
    // Si no se pasan valores, toma los del input
    if (!color1 || !color2) {
      color1 = document.getElementById("color1").value;
      color2 = document.getElementById("color2").value;
    }
    // Permite valores en formato rgb(r,g,b)
    if (/rgb\(/i.test(color1)) {
      color1 = this.rgbStringToHex(color1);
    }
    if (/rgb\(/i.test(color2)) {
      color2 = this.rgbStringToHex(color2);
    }
    document.body.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
    localStorage.setItem("gradientColor1", color1);
    localStorage.setItem("gradientColor2", color2);
    console.log("Gradient set to:", this.getCurrentGradient());
  },

  // Muestra el degradado actual en la consola
  logCurrentGradient(resetColors = false) {
    // Si no se quiere mantener los colores actuales, resetea
    if (resetColors) {
      console.log("Resetting colors to default");
      const color1 = document.getElementById("color1");
      const color2 = document.getElementById("color2");
      color1.value = "#080014";
      color2.value = "#080014";
      localStorage.removeItem("gradientColor1");
      localStorage.removeItem("gradientColor2");
      return this.setGradient(color1.value, color2.value);
    }
    console.log(this.getCurrentGradient());
    color1.value = this.rgbStringToHex(
      getComputedStyle(document.body).backgroundImage.match(
        /rgb\(\d+,\s*\d+,\s*\d+\)/g
      )[0]
    );
    color2.value = this.rgbStringToHex(
      getComputedStyle(document.body).backgroundImage.match(
        /rgb\(\d+,\s*\d+,\s*\d+\)/g
      )[1]
    );
  },
};

// JavaScript funcional de tabs
const settings = {
  openTab(tabId, element) {
    // Oculta todos los tabs con clase is-hidden
    const tabs = document.querySelectorAll("#tabGeneral, #tabTheme, #tabAccessibility");
    tabs.forEach((tab) => {
      tab.classList.add("is-hidden");
    });
    // Muestra el tab seleccionado
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.remove("is-hidden");
    // Resalta el botón seleccionado
    const buttons = document.querySelectorAll(".tablinkSettings");
    buttons.forEach((btn) => {
      btn.classList.remove("active");
      btn.classList.remove("is-active");
    });
    element.classList.add("active");
    element.classList.add("is-active");
  },
};


// Opcional: autoabrir el tab por defecto al cargar
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("defaultTab").click();
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("spinner-overlay").classList.add("hide");
    setTimeout(() => {
      document.getElementById("spinner-overlay").style.display = "none";
    }, 400); // Duración del fade-out (debe coincidir con la transición del CSS)
  }, 1000); // El spinner permanece visible 2 segundos
});

// declarar variable para saber si activar la voz - variable global por defecto false
let voiceEnabled = false;

// función para activar o desactivar la voz
document
  .getElementById("toggleVoiceBtn")
  .addEventListener("click", toggleVoice);
function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  const status = voiceEnabled ? "activada" : "desactivada";
  localStorage.setItem("voiceEnabled", status);
  console.log(`Voz ${status}`);
  const voiceStatus = document.getElementById("toggleVoiceBtn");
  voiceStatus.textContent = voiceEnabled ? "Desactivar voz" : "Activar voz";
  const voiceLabel = document.getElementById("voiceLabel");
  voiceLabel.textContent = `Voz ${status}`;
}
function say(text) {
  /* use google tts for voice personalized https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=Se%20esta%20reproduciendo%20so%20far%20so%20fake&tl=es-MX */
  const audio = new Audio(
    `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(
      text
    )}&tl=es-MX`
  );
  audio.play({
    speed: 1.1,
  });
}

function saySong(message) {
  if (message === "test") {
    say("Hola, soy Mexlify, tu reproductor de música.");
    console.log("Test de voz ejecutado");
    return;
  }
  if (!voiceEnabled) return;
  const audio = new Audio(
    "resources/ahoraseestareproduciendunanuevacancion.mp3"
  );
  audio.preload = "auto"; // 👈 asegura que se descargue antes de reproducir

  audio.addEventListener("canplaythrough", () => {
    audio.play().then(() => {
      audio.addEventListener("ended", () => {
        say(message);
      });
    });
  });
}
let testVoiceRunning = false;
// botón para probar la voz
document.getElementById("testVoiceBtn").addEventListener("click", () => {
  if (testVoiceRunning) return;
  saySong("test");
  testVoiceRunning = true;
  const testStatus = document.getElementById("testVoiceBtn");
  testStatus.textContent = "Test de voz en curso...";
  setTimeout(() => {
    testStatus.textContent = "Probar voz";
    testVoiceRunning = false;
  }, 4700);
});

