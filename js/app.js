const appState = {
  currentScreen: "home",
  selectedProgramId: null,
  searchQuery: "",
  savedProgramIds: loadSavedProgramIds(),

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

function navigateTo(screenName) {
  appState.currentScreen = screenName;

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
