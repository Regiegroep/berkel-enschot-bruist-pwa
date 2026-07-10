const appState = {
  currentScreen: "home",
  selectedProgramId: null,
  searchQuery: "",
  filters: {
    day: "",
    category: "",
    part: "",
    location: "",
    tag: ""
  }
};

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
  const resetButton = document.getElementById("reset-filters");

  if (searchInput) {
    searchInput.value = appState.searchQuery;

    searchInput.addEventListener("input", (event) => {
      appState.searchQuery = event.target.value;
      renderProgramResultsOnly();
    });
  }

  if (filterForm) {
    filterForm.addEventListener("change", (event) => {
      const target = event.target;

      if (target.matches("[data-filter]")) {
        appState.filters[target.dataset.filter] = target.value;
        renderProgramResultsOnly();
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
        location: ""
      };

      navigateTo("programma");
    });
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
