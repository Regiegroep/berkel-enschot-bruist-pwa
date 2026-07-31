const appState = {
  currentScreen: "home",
  selectedProgramId: null,
  selectedFestivalInfoId: null,
  searchQuery: "",
  savedProgramIds: loadSavedProgramIds(),
  selectedPlattegrondLocationId: null,
  selectedProgramFromMapId: null,
  mapReturnScreen: null,

  filters: {
    day: "",
    category: "",
    part: "",
    location: "",
    tag: ""
  }
};

function loadSavedProgramIds() {
  try {
    const saved = localStorage.getItem("beb-mijn-bruist");

    if (!saved) {
      return [];
    }

    const ids = JSON.parse(saved);

    return Array.isArray(ids) ? ids.map(String) : [];
  } catch (error) {
    console.warn("Mijn Bruist kon niet worden geladen.", error);
    return [];
  }
}

function saveProgramIds() {
  localStorage.setItem(
    "beb-mijn-bruist",
    JSON.stringify(appState.savedProgramIds)
  );
}

function isProgramSaved(programId) {
  return appState.savedProgramIds.includes(String(programId));
}

function addProgramSaved(programId) {
  const id = String(programId);

  if (!isProgramSaved(id)) {
    appState.savedProgramIds = [
      ...appState.savedProgramIds,
      id
    ];

    saveProgramIds();
  }

  renderProgramResultsOnly();
}

function removeProgramSaved(programId) {
  const id = String(programId);

  appState.savedProgramIds = appState.savedProgramIds.filter(
    (savedId) => savedId !== id
  );

  saveProgramIds();

  if (appState.currentScreen === "mijn") {
    renderScreen("mijn");
    renderInlineIcons();
  } else {
    renderProgramResultsOnly();
  }
}

async function initializeApp() {
  setupNavigation();
  renderInlineIcons();

  setStore({ loading: true, error: null });
  navigateTo("home");

  try {
    const data = await loadAllGoogleSheetsData();
    setStore({ ...data, loading: false, error: null });
    buildRelationIndexes();
    enrichProgramma();
  } catch (error) {
    console.error(error);
    setStore({
      loading: false,
      error: error.message || "De programmagegevens konden niet worden geladen."
    });
  }

  if (appState.currentScreen === "programma") {
    navigateTo("programma");
  }
}

function navigateTo(screenName, options = {}) {
  const preserveMapSelection = Boolean(
    options.preserveMapSelection
  );

  if (
    screenName === "kaart" &&
    !preserveMapSelection
  ) {
    appState.selectedPlattegrondLocationId = null;
    appState.selectedProgramFromMapId = null;
    appState.mapReturnScreen = null;
  }

  appState.currentScreen = screenName;

  if (screenName === "festivalinfo") {
    showFestivalInfo();
    return;
  }

  if (screenName !== "detail") {
    appState.selectedProgramId = null;
  }

  renderScreen(screenName);
  updateNavigation(screenName);
  renderInlineIcons();
  setupCurrentScreenInteractions();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showProgramDetail(programId) {
  appState.selectedProgramId = programId;
  appState.currentScreen = "detail";
  renderScreen("detail");
  updateNavigation("programma");
  renderInlineIcons();
  setupCurrentScreenInteractions();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateNavigation(screenName) {
  const activeScreen = screenName === "detail" ? "programma" : screenName;

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === activeScreen);
  });
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.screen));
  });
}

function setupCurrentScreenInteractions() {
  if (appState.currentScreen === "programma") {
    setupProgramInteractions();
  }
}

function setupProgramInteractions() {
  const searchInput = document.getElementById("search-program");
  const filterForm = document.getElementById("program-filters");
  const filterToggle = document.getElementById("toggle-program-filters");
  const filterPanel = document.getElementById("program-filter-panel");
  const resetButton = document.getElementById("reset-filters");

  if (searchInput) {
    searchInput.value = appState.searchQuery;

    searchInput.addEventListener("input", (event) => {
      appState.searchQuery = event.target.value;
      renderProgramResultsOnly();
      updateProgramFilterControls();
    });
  }

  if (filterToggle && filterPanel) {
    filterToggle.addEventListener("click", () => {
      const willOpen = filterPanel.hidden;

      filterPanel.hidden = !willOpen;
      filterToggle.setAttribute("aria-expanded", String(willOpen));
    });
  }

  if (filterForm) {
    filterForm.addEventListener("change", (event) => {
      const target = event.target;

      if (target.matches("[data-filter]")) {
        appState.filters[target.dataset.filter] = target.value;
        renderProgramResultsOnly();
        updateProgramFilterControls();
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      appState.searchQuery = "";
      appState.filters = {
        day: "",
        category: "",
        part: "",
        location: "",
        tag: ""
      };

      navigateTo("programma");
    });
  }
}

function updateProgramFilterControls() {
  const filterToggle = document.getElementById("toggle-program-filters");
  const resetButton = document.getElementById("reset-filters");
  const activeFilterCount = activeProgramFilterCount();

  if (filterToggle) {
    filterToggle.textContent =
      `Filters${activeFilterCount ? ` (${activeFilterCount})` : ""}`;
  }

  if (resetButton) {
    resetButton.hidden = !hasActiveProgramFilters();
  }
}

function renderProgramResultsOnly() {
  const resultsContainer = document.getElementById("program-results");
  const resultCount = document.getElementById("program-result-count");
  const resetButton = document.getElementById("reset-filters");

  if (!resultsContainer) {
    return;
  }

  const filtered = getFilteredProgramma();
  resultsContainer.innerHTML = renderProgramCards(filtered);

  if (resultCount) {
    resultCount.textContent = resultCountText(filtered.length, store.programma.length);
  }

  if (resetButton) {
    resetButton.hidden = !hasActiveProgramFilters();
  }

  renderInlineIcons();
}

document.addEventListener("DOMContentLoaded", initializeApp);

let activePlattegrondMap = "buiten";

function normalizePlattegrondMap(value) {
  const map = String(value || "")
    .trim()
    .toLowerCase();

  if (
    map === "beganegrond" ||
    map === "begane-grond" ||
    map === "binnen-begane" ||
    map === "binnen-beganegrond" ||
    map === "binnen-begane-grond"
  ) {
    return "beganegrond";
  }

  if (
    map === "souterrain" ||
    map === "souterain" ||
    map === "binnen-souterrain" ||
    map === "binnen-souterain"
  ) {
    return "souterrain";
  }

  return "buiten";
}

function setPlattegrondMap(mapType) {
  activePlattegrondMap = normalizePlattegrondMap(mapType);
  navigateTo("kaart");
}

function selectPlattegrondLocation(locationId) {
  const id = String(locationId || "");

  appState.selectedProgramFromMapId = null;
  appState.mapReturnScreen = null;

  appState.selectedPlattegrondLocationId =
    appState.selectedPlattegrondLocationId === id
      ? null
      : id;

  navigateTo("kaart", { preserveMapSelection: true });
}

function showLocationOnMap(locationValue, programId = "") {
  const requestedLocation = String(locationValue || "")
    .trim()
    .toLowerCase();

  const location = Array.isArray(store.locaties)
    ? store.locaties.find((item) => {
        const id = String(
          item.id ??
          item.locatie_id ??
          ""
        )
          .trim()
          .toLowerCase();

        const name = String(
          item.name ??
          item.naam ??
          item.locatie ??
          item.id ??
          ""
        )
          .trim()
          .toLowerCase();

        return (
          id === requestedLocation ||
          name === requestedLocation
        );
      })
    : null;

  if (!location) {
    navigateTo("kaart");
    return;
  }

  const selectedId = String(
    location.id ??
    location.locatie_id ??
    location.name ??
    location.naam ??
    location.locatie ??
    ""
  ).trim();

  const mapValue =
    location.map ??
    location.kaart ??
    "";

  const sourceScreen =
    appState.currentScreen === "mijn"
      ? "mijn"
      : "programma";

  appState.selectedPlattegrondLocationId = selectedId;
  appState.selectedProgramFromMapId = String(programId || "").trim() || null;
  appState.mapReturnScreen =
    appState.selectedProgramFromMapId
      ? sourceScreen
      : null;

  activePlattegrondMap =
    normalizePlattegrondMap(mapValue);

  navigateTo("kaart", { preserveMapSelection: true });

  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

function showProgramCardFromMap(programId) {
  const id = String(programId || "").trim();
  const returnScreen =
    appState.mapReturnScreen === "mijn"
      ? "mijn"
      : "programma";

  appState.selectedProgramFromMapId = null;
  appState.mapReturnScreen = null;

  if (returnScreen === "programma") {
    appState.searchQuery = "";
    appState.filters = {
      day: "",
      category: "",
      part: "",
      location: "",
      tag: ""
    };
  }

  navigateTo(returnScreen);

  window.setTimeout(() => {
    const card = Array.from(
      document.querySelectorAll("[data-program-id]")
    ).find(
      (element) => String(element.dataset.programId || "") === id
    );

    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, 150);
}

function returnFromMapToPreviousScreen() {
  const programId =
    String(appState.selectedProgramFromMapId || "").trim();

  if (programId) {
    showProgramCardFromMap(programId);
    return;
  }

  navigateTo(
    appState.mapReturnScreen === "mijn"
      ? "mijn"
      : "programma"
  );
}

function showProgramAtLocation(locationName) {
  appState.searchQuery = "";

  appState.filters = {
    day: "",
    category: "",
    part: "",
    location: String(locationName || ""),
    tag: ""
  };

  navigateTo("programma");
}

window.selectPlattegrondLocation = selectPlattegrondLocation;
window.showLocationOnMap = showLocationOnMap;
window.showProgramAtLocation = showProgramAtLocation;
window.showProgramCardFromMap = showProgramCardFromMap;
window.returnFromMapToPreviousScreen = returnFromMapToPreviousScreen;
