// topSongs.js
// Redirección moderna y compatibilidad hacia atrás para listas de recomendaciones
async function playCountry(countryCode = "mexico", type = "month") {
  if (typeof playTopChart === "function") {
    return playTopChart(countryCode, true);
  }
}

async function renderCountryTop(countryCode = "mexico") {
  if (typeof showTopChartList === "function") {
    return showTopChartList(countryCode);
  }
}

window.playCountry = playCountry;
window.renderCountryTop = renderCountryTop;
