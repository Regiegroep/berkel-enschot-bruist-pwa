function renderScreen(screenName) {
  const app = document.getElementById("app");

  const screens = {
    home: renderHome,
    programma: renderProgramma,
    detail: renderProgramDetail,
    ontdek: renderOntdek,
    mijn: renderMijnBruist,
    kaart: renderPlattegrond
  };

  app.innerHTML = (screens[screenName] || renderHome)();
}

function renderHome() {
  return `
    <section class="screen">
      <div class="home-hero">
        <img
          src="images/logo.png"
          alt="Logo Berkel-Enschot Bruist"
          class="logo-main"
        >

      </div>

      <div class="home-content">
        <figure class="hero-image">
          <img
            src="images/hero-home.jpg"
            alt="Sfeerbeeld van Berkel-Enschot Bruist bij Koningsoord"
          >
        </figure>

        <aside
          class="pwa-install-card"
          id="pwa-install-card"
          hidden
          aria-labelledby="pwa-install-title"
        >
          <button
            type="button"
            class="pwa-install-close"
            id="pwa-install-close"
            aria-label="Verberg installatie-informatie"
          >
            ×
          </button>

          <div class="pwa-install-copy">
            <strong id="pwa-install-title">Installeer de Bruist-app</strong>
            <span id="pwa-install-text">Sneller openen, altijd je programma bij de hand.</span>
          </div>

          <button
            type="button"
            class="pwa-install-button"
            id="pwa-install-button"
          >
            Installeer
          </button>
        </aside>

        <div class="home-menu">
          ${homeMenuItem(
    "Programma",
    "Bekijk alle activiteiten.",
    "programma",
    "accent-blue"
  )}

          ${homeMenuItem(
    "Mijn Bruist",
    "Jouw persoonlijke festivalprogramma.",
    "mijn",
    "accent-magenta"
  )}

          ${homeMenuItem(
    "Festivalinfo",
    "Praktische informatie voor je bezoek.",
    "festivalinfo",
    "accent-purple"
  )}

          ${homeMenuItem(
    "Plattegrond",
    "Vind locaties en voorzieningen.",
    "kaart",
    "accent-orange"
  )}
        </div>
      </div>
    </section>
  `;
}

function activeProgramFilterCount() {
  return [
    appState.filters.day,
    appState.filters.category,
    appState.filters.part,
    appState.filters.location,
    appState.filters.tag
  ].filter(Boolean).length;
}

function renderProgramma() {
  if (store.loading) {
    return `
      <section class="screen">
        ${screenHeader(
      "Programma",
      "Het actuele programma uit Google Sheets."
    )}
        ${renderLoadingState()}
      </section>
    `;
  }

  if (store.error) {
    return `
      <section class="screen">
        ${screenHeader(
      "Programma",
      "Het actuele programma uit Google Sheets."
    )}
        ${renderErrorState(store.error)}
      </section>
    `;
  }

  const filtered = getFilteredProgramma();
  const activeFilterCount = activeProgramFilterCount();

  const resultText =
    filtered.length === store.programma.length
      ? `${store.programma.length} activiteiten`
      : `${filtered.length} van ${store.programma.length} activiteiten`;

  return `
    <section class="screen program-screen">
      ${screenHeader(
    "Programma",
    `Zoek en filter in het actuele programma.<br>
   <span id="program-result-count" class="program-header-count">
     ${escapeHtml(resultText)}
   </span>`
  )}

      <div class="program-toolbar">
        <div class="program-toolbar-row">
          <button
            type="button"
            class="filter-toggle-button"
            id="toggle-program-filters"
            aria-expanded="false"
            aria-controls="program-filter-panel"
          >
            Filters${activeFilterCount ? ` · ${activeFilterCount}` : ""}
          </button>

          <div class="program-search">
            <label
              class="visually-hidden"
              for="search-program"
            >
              Zoeken
            </label>

            <input
              id="search-program"
              type="search"
              placeholder="Zoek in programma"
              value="${escapeAttribute(appState.searchQuery)}"
            >
          </div>
        </div>

        <div
          class="program-filter-panel"
          id="program-filter-panel"
          hidden
        >
          ${renderProgramFilters()}

          <button
            type="button"
            class="reset-filters-button program-reset-button"
            id="reset-filters"
            ${hasActiveProgramFilters() ? "" : "hidden"}
          >
            Wis alle filters
          </button>
        </div>
      </div>

      <div id="program-results">
        ${renderProgramCards(filtered)}
      </div>
    </section>
  `;
}

function renderProgramFilters() {
  const options = getProgramFilterOptions();

  return `
    <form class="program-filters" id="program-filters">
      ${filterSelect("day", "Dag", options.days, appState.filters.day)}
      ${filterSelect("category", "Categorie", options.categories, appState.filters.category)}
      ${filterSelect("part", "Festivalonderdeel", options.parts, appState.filters.part)}
      ${filterSelect("location", "Locatie", options.locations, appState.filters.location)}
      ${filterSelect("tag", "Tag", options.tags, appState.filters.tag)}
    </form>
  `;
}

function filterSelect(filterName, label, options, selectedValue) {
  return `
    <label class="filter-field">
      <span>${label}</span>
      <select data-filter="${filterName}">
        <option value="">Alle</option>
        ${options
      .map(
        (option) => `
              <option value="${escapeAttribute(option)}" ${option === selectedValue ? "selected" : ""}>
                ${escapeHtml(option)}
              </option>
            `
      )
      .join("")}
      </select>
    </label>
  `;
}

function renderProgramCards(items, context = "programma") {
  if (store.programma.length === 0) {
    return renderEmptyProgramState();
  }

  if (items.length === 0) {
    return `
      <div class="empty-state">
        <h3>Geen onderdelen gevonden</h3>
        <p>Pas je zoekopdracht of filters aan.</p>
      </div>
    `;
  }

  return `
    <div class="program-list">
      ${items.map((item) => programCard(item, context)).join("")}
    </div>
  `;
}

function getFilteredProgramma() {
  const query = normalizeSearchValue(appState.searchQuery);

  return store.programma
    .filter((item) => {
      const day = programDay(item);
      const category = programCategory(item);
      const part = programPart(item);
      const location = programLocation(item);

      const matchesQuery =
        !query ||
        [
          item.title,
          item.shortDescription,
          item.description,
          category,
          part,
          location,
          day,
          item.date,
          item.tags
        ].some((value) => normalizeSearchValue(value).includes(query));

      const matchesDay = !appState.filters.day || day === appState.filters.day;
      const matchesCategory =
        !appState.filters.category || category === appState.filters.category;
      const matchesPart =
        !appState.filters.part || part === appState.filters.part;
      const matchesLocation =
        !appState.filters.location || location === appState.filters.location;
      const itemTags = String(item.tags || "")
        .split(",")
        .map((tag) => tag.trim());

      const matchesTag =
        !appState.filters.tag || itemTags.includes(appState.filters.tag);

      return (
        matchesQuery &&
        matchesDay &&
        matchesCategory &&
        matchesPart &&
        matchesLocation &&
        matchesTag
      );
    })
    .sort(compareProgramItems);
}

function compareProgramItems(a, b) {
  const dateA = parseProgramDate(a.day || a.date);
  const dateB = parseProgramDate(b.day || b.date);
  const dateComparison = dateA - dateB;

  if (dateComparison !== 0) {
    return dateComparison;
  }

  const timeComparison =
    parseProgramTime(a.startTime) - parseProgramTime(b.startTime);

  if (timeComparison !== 0) {
    return timeComparison;
  }

  return String(a.title || "").localeCompare(
    String(b.title || ""),
    "nl",
    { sensitivity: "base" }
  );
}

function programsOverlap(itemA, itemB) {
  const dayA = normalizeSearchValue(programDay(itemA));
  const dayB = normalizeSearchValue(programDay(itemB));

  if (!dayA || dayA !== dayB) {
    return false;
  }

  const startA = parseProgramTime(itemA.startTime);
  const endA = parseProgramTime(itemA.endTime);
  const startB = parseProgramTime(itemB.startTime);
  const endB = parseProgramTime(itemB.endTime);

  const hasValidTimes =
    startA !== Number.MAX_SAFE_INTEGER &&
    endA !== Number.MAX_SAFE_INTEGER &&
    startB !== Number.MAX_SAFE_INTEGER &&
    endB !== Number.MAX_SAFE_INTEGER;

  if (!hasValidTimes) {
    return false;
  }

  return startA < endB && startB < endA;
}

function hasSavedProgramConflict(item) {
  const savedItems = store.programma.filter((programItem) =>
    isProgramSaved(programItem.id)
  );

  return savedItems.some(
    (otherItem) =>
      String(otherItem.id) !== String(item.id) &&
      programsOverlap(item, otherItem)
  );
}

function parseProgramDate(value) {
  const text = String(value || "").trim();

  if (!text) {
    return Number.MAX_SAFE_INTEGER;
  }

  const dutchDate = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);

  if (dutchDate) {
    const [, day, month, year] = dutchDate;
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
  }

  const parsed = Date.parse(text);

  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function parseProgramTime(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{1,2}):(\d{2})/);

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function getProgramFilterOptions() {
  const tags = store.programma.flatMap((item) =>
    String(item.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
  );

  return {
    days: uniqueSorted(store.programma.map(programDay)),
    categories: uniqueSorted(store.programma.map(programCategory)),
    parts: uniqueSorted(store.programma.map(programPart)),
    locations: uniqueSorted(store.programma.map(programLocation)),
    tags: uniqueSorted(tags)
  };
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "nl", { sensitivity: "base" })
  );
}

function normalizeSearchValue(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasActiveProgramFilters() {
  return Boolean(
    appState.searchQuery ||
    appState.filters.day ||
    appState.filters.category ||
    appState.filters.part ||
    appState.filters.location ||
    appState.filters.tag
  );
}

function resultCountText(filteredCount, totalCount) {
  if (filteredCount === totalCount) {
    return `${totalCount} ${totalCount === 1 ? "onderdeel" : "onderdelen"}`;
  }

  return `${filteredCount} van ${totalCount} onderdelen`;
}

function programDay(item) {
  return item.day || item.date || "";
}

function programCategory(item) {
  return item.category?.name || item.categoryId || "Programma";
}

function programPart(item) {
  return item.part?.name || item.partId || "";
}

function programLocation(item) {
  return item.location?.name || item.locationId || "Locatie volgt";
}

function programOrganization(item) {
  return item.organization?.name || item.organizationId || "";
}

function colorNameToClass(colorName) {
  const value = String(colorName || "").trim().toLowerCase();
  const map = {
    blauw: "accent-blue",
    paars: "accent-purple",
    magenta: "accent-magenta",
    roze: "accent-magenta",
    oranje: "accent-orange",
    geel: "accent-yellow",
    grijs: "accent-grey"
  };
  return map[value] || "";
}

function categoryColorClassFromItem(item) {
  return colorNameToClass(item.category?.color) || categoryColorClass(programCategory(item));
}

function renderProgramDetail() {
  const item = store.programma.find(
    (programItem) => String(programItem.id) === String(appState.selectedProgramId)
  );

  if (!item) {
    return `
      <section class="screen">
        ${screenHeader("Programma", "Dit programmaonderdeel kon niet worden gevonden.")}
        <div class="empty-state">
          <h3>Onderdeel niet gevonden</h3>
          <p>Ga terug naar het programma en kies opnieuw.</p>
          <button type="button" class="secondary-button" onclick="navigateTo('programma')">
            Terug naar programma
          </button>
        </div>
      </section>
    `;
  }

  const category = programCategory(item);
  const location = programLocation(item);
  const mapLocation = String(
    item.location?.name ||
    item.locationId ||
    ""
  ).trim();
  const part = programPart(item);
  const organization = programOrganization(item);
  const address = item.location?.address || "";
  const time = formatProgramTime(item);
  const description = item.description || item.shortDescription || "Meer informatie volgt.";
  const colorClass = categoryColorClassFromItem(item);
  const websiteUrl = safeExternalUrl(item.websiteUrl);
  const actionUrl = safeExternalUrl(item.actionUrl);
  const actionText = String(item.actionText || "Aanmelden").trim() || "Aanmelden";
  const tags = String(item.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return `
    <section class="screen">
      <button type="button" class="back-button" onclick="navigateTo('programma')">
        <span aria-hidden="true">←</span>
        <span>Terug naar programma</span>
      </button>

      <article class="detail-card ${colorClass}">
        <span class="badge ${colorClass}">${escapeHtml(category)}</span>
        <h1 class="detail-title">${escapeHtml(item.title)}</h1>

        <div class="detail-facts">
          <div class="detail-fact">
            <span class="detail-fact-icon" data-icon="clock"></span>
            <span>${escapeHtml(time)}</span>
          </div>

          <div class="detail-fact">
            <span class="detail-fact-icon" data-icon="pin"></span>
            <span>${escapeHtml(location)}</span>
          </div>

          ${address
      ? `<div class="detail-fact">
                   <span class="detail-fact-icon" data-icon="pin"></span>
                   <span>${escapeHtml(address)}</span>
                 </div>`
      : ""
    }

          ${part
      ? `<div class="detail-fact">
                   <span class="detail-fact-icon" data-icon="compass"></span>
                   <span>Onderdeel van ${escapeHtml(part)}</span>
                 </div>`
      : ""
    }

          ${tags.length
      ? `<div class="detail-fact">
                  <span class="detail-fact-icon" data-icon="tag"></span>
                  <span>${tags.map((tag) => escapeHtml(tag)).join(" • ")}</span>
                </div>`
      : ""
    }

          ${organization
      ? `<div class="detail-fact">
                   <span class="detail-fact-icon" data-icon="info"></span>
                   <span>Georganiseerd door ${escapeHtml(organization)}</span>
                 </div>`
      : ""
    }
        </div>

        <div class="detail-section">
          <h2>Over dit onderdeel</h2>
          <div class="detail-description">${formatDescription(description)}</div>
        </div>

        <div class="detail-actions">
          ${websiteUrl
      ? `<a class="primary-button" href="${escapeAttribute(websiteUrl)}" target="_blank" rel="noopener">
                   Meer informatie op website
                 </a>`
      : ""
    }

          ${actionUrl
      ? `<a
           class="primary-button program-action-cta"
           href="${escapeAttribute(actionUrl)}"
           target="_blank"
           rel="noopener"
         >
           ${escapeHtml(actionText)}
         </a>`
      : ""
    }

          <button
            type="button"
            class="secondary-button"
            onclick="addProgramSaved('${escapeJsString(item.id)}')"
            ${isProgramSaved(item.id) ? "disabled" : ""}
          >
            ${isProgramSaved(item.id)
      ? "Toegevoegd aan Mijn Bruist"
      : "Toevoegen aan Mijn Bruist"
    }
          </button>

          ${mapLocation
      ? `
            <button
              type="button"
              class="secondary-button"
              onclick="showLocationOnMap('${escapeJsString(mapLocation)}', '${escapeJsString(item.id)}')"
            >
              Toon op kaart
            </button>
          `
      : ""
    }
        </div>
      </article>
    </section>
  `;
}

function renderLoadingState() {
  return `
    <div class="empty-state">
      <img src="images/app-icon.jpg" alt="" class="loading-symbol">
      <h3>Programma laden</h3>
      <p>De actuele gegevens worden uit Google Sheets opgehaald.</p>
    </div>
  `;
}

function renderErrorState(message) {
  return `
    <div class="empty-state error-state">
      <h3>Programma kon niet worden geladen</h3>
      <p>${escapeHtml(message)}</p>
      <p>Controleer of de Google Sheet gedeeld is voor iedereen met de link.</p>
    </div>
  `;
}

function renderEmptyProgramState() {
  return `
    <div class="empty-state">
      <h3>Nog geen programma gevonden</h3>
      <p>Controleer het tabblad Programma en de kolomtitels in Google Sheets.</p>
    </div>
  `;
}

function renderOntdek() {
  return `
    <section class="screen">
      ${screenHeader("Ontdek", "Kies hoe je het festival wilt verkennen.")}
      <div class="card-grid">
        ${discoverCard("calendar", "Per dag", "Vrijdag, zaterdag of zondag.")}
        ${discoverCard("compass", "Festivalonderdelen", "Bekijk activiteiten per onderdeel.")}
        ${discoverCard("tag", "Categorieën", "Muziek, kunst, film, food en meer.")}
        ${discoverCard("star", "Tags", "Bijvoorbeeld binnen, doorlopend of actief meedoen.")}
        ${discoverCard("pin", "Locaties", "Vind wat er per locatie gebeurt.")}
      </div>
    </section>
  `;
}

function formatMyBruistDayLabel(value) {
  const text = String(value || "").trim();

  const match = text.match(
    /^(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\s+(\d{1,2})\s+([a-zA-Zé]+)(?:\s+\d{4})?/i
  );

  if (!match) {
    return capitalizeFirst(text);
  }

  const dayNames = {
    maandag: "MA",
    dinsdag: "DI",
    woensdag: "WO",
    donderdag: "DO",
    vrijdag: "VR",
    zaterdag: "ZA",
    zondag: "ZO"
  };

  const day = dayNames[match[1].toLowerCase()] || match[1];
  const date = match[2];
  const month = match[3].toLocaleUpperCase("nl-NL");

  return `${day} ${date} ${month}`;
}

function renderMijnBruist() {
  const savedItems = store.programma
    .filter((item) => isProgramSaved(item.id))
    .sort(compareProgramItems);

  if (savedItems.length === 0) {
    return `
      <section class="screen my-bruist-screen">
        ${screenHeader(
      "Mijn Bruist",
      "Nog geen keuzes in jouw festivalprogramma."
    )}

        <div class="empty-state">
          <h3>Nog geen onderdelen gekozen</h3>

          <p>
            Voeg programmaonderdelen toe en stel zo je eigen festivalprogramma samen.
          </p>

          <button
            type="button"
            class="primary-button"
            onclick="navigateTo('programma')"
          >
            Bekijk het programma
          </button>
        </div>
      </section>
    `;
  }

  const subtitle =
    savedItems.length === 1
      ? "1 keuze in jouw festivalprogramma."
      : `${savedItems.length} keuzes in jouw festivalprogramma.`;

  return `
    <section class="screen my-bruist-screen">
      ${screenHeader("Mijn Bruist", subtitle)}

      <div class="my-bruist-list">
        ${savedItems
      .map((item) => myBruistCard(item))
      .join("")}
      </div>
    </section>
  `;
}

function renderPlattegrond() {
  const maps = {
    buiten: {
      label: "Buiten",
      title: "Festivalgebied buiten",
      image: "./images/kaart_buiten.jpg",
      alt: "Plattegrond van het festivalgebied buiten"
    },

    beganegrond: {
      label: "Begane grond",
      title: "Ons Koningsoord – begane grond",
      image: "./images/kaart_beganegrond.jpg",
      alt: "Plattegrond van de begane grond van Ons Koningsoord"
    },

    souterrain: {
      label: "Souterrain",
      title: "Ons Koningsoord – souterrain",
      image: "./images/kaart_souterrain.jpg",
      alt: "Plattegrond van het souterrain van Ons Koningsoord"
    }
  };

  const safeText = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  activePlattegrondMap =
    normalizePlattegrondMap(activePlattegrondMap);

  const currentMap =
    maps[activePlattegrondMap] || maps.buiten;

  const sourceLocations =
    typeof store !== "undefined" &&
      Array.isArray(store.locaties)
      ? store.locaties
      : [];

  const sourceProgramma =
    typeof store !== "undefined" &&
      Array.isArray(store.programma)
      ? store.programma
      : [];

  const normalizedLocations = sourceLocations
    .map((location) => {
      const mapValue =
        location.map ??
        location.kaart ??
        "";

      const xValue =
        location.mapX ??
        location.kaartX ??
        location.kaart_x ??
        location.x ??
        "";

      const yValue =
        location.mapY ??
        location.kaartY ??
        location.kaart_y ??
        location.y ??
        "";

      const x = Number(
        String(xValue)
          .trim()
          .replace(",", ".")
      );

      const y = Number(
        String(yValue)
          .trim()
          .replace(",", ".")
      );

      return {
        id: String(
          location.id ??
          location.locatie_id ??
          ""
        ),

        name:
          location.name ??
          location.naam ??
          location.locatie ??
          location.id ??
          "Locatie",

        map: normalizePlattegrondMap(mapValue),

        x,
        y,

        icon:
          location.icon ??
          location.icoon ??
          ""
      };
    })
    .filter((location) => {
      return (
        location.id &&
        location.map === activePlattegrondMap &&
        Number.isFinite(location.x) &&
        Number.isFinite(location.y) &&
        location.x >= 0 &&
        location.x <= 100 &&
        location.y >= 0 &&
        location.y <= 100
      );
    });

  const selectedLocation =
    normalizedLocations.find(
      (location) =>
        location.id ===
        String(appState.selectedPlattegrondLocationId || "")
    ) || null;

  function getProgramLocationId(item) {
    return String(
      item.locationId ??
      item.locatieId ??
      item.locatie_id ??
      item.location?.id ??
      ""
    );
  }

  const selectedLocationProgramma =
    selectedLocation
      ? sourceProgramma.filter(
        (item) =>
          getProgramLocationId(item).trim().toLowerCase() ===
          String(selectedLocation.name || "").trim().toLowerCase()
      )
      : [];

  const selectedProgramFromMap =
    selectedLocation && appState.selectedProgramFromMapId
      ? selectedLocationProgramma.find(
        (item) =>
          String(item.id) ===
          String(appState.selectedProgramFromMapId)
      ) || null
      : null;

  const isFocusedProgramMap = Boolean(selectedProgramFromMap);
  const mapReturnLabel =
    appState.mapReturnScreen === "mijn"
      ? "Terug naar Mijn Bruist"
      : "Terug naar programma";

  const buttonsHtml = Object.entries(maps)
    .map(([mapId, map]) => {
      const active =
        mapId === activePlattegrondMap;

      return `
        <button
          type="button"
          class="festival-map-switch ${active ? "is-active" : ""
        }"
          onclick="setPlattegrondMap('${mapId}')"
          aria-pressed="${active}"
        >
          ${safeText(map.label)}
        </button>
      `;
    })
    .join("");

  const markersHtml = normalizedLocations
    .map((location, index) => {
      const isSelected =
        location.id ===
        String(
          appState.selectedPlattegrondLocationId || ""
        );

      const markerIcon =
        String(location.icon || "").trim() || "●";

      const isDisabled =
        isFocusedProgramMap && !isSelected;

      return `
      <button
        type="button"
        class="festival-map-marker"
        ${isDisabled ? "disabled" : ""}
        onclick="selectPlattegrondLocation(
          '${safeText(location.id)}'
        )"
        title="${safeText(location.name)}"
        aria-label="Bekijk ${safeText(location.name)}"
        style="
          position: absolute;
          left: ${location.x}%;
          top: ${location.y}%;
          z-index: ${isSelected ? 500 : 100 + index};
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? 31 : 20}px;
          height: ${isSelected ? 31 : 20}px;
          padding: 0;
          border: ${isSelected ? "4px" : "2px"} solid #ffffff;
          border-radius: 50%;
          background: ${isSelected ? "#173b69" : "#d93636"};
          color: #ffffff;
          opacity: ${selectedLocation && !isSelected ? 0.42 : 1};
          box-shadow: ${isSelected
          ? "0 0 0 4px rgba(23, 59, 105, 0.28), 0 4px 12px rgba(0, 0, 0, 0.42)"
          : "0 2px 6px rgba(0, 0, 0, 0.32)"};
          transform: translate(-50%, -50%);
          font-size: ${isSelected ? 16 : 10}px;
          line-height: 1;
          cursor: ${isDisabled ? "default" : "pointer"};
          pointer-events: ${isDisabled ? "none" : "auto"};
          transition: opacity 160ms ease, transform 160ms ease, box-shadow 160ms ease;
        "
      >
        ${icon(markerIcon)}
      </button>
    `;
    })
    .join("");

  const programmaHtml =
    selectedProgramFromMap
      ? (() => {
        const timeParts = [
          selectedProgramFromMap.day,
          selectedProgramFromMap.startTime
        ].filter(Boolean);

        return `
          <button
            type="button"
            onclick="showProgramCardFromMap(
              '${escapeJsString(selectedProgramFromMap.id)}'
            )"
            aria-label="Ga terug naar ${safeText(selectedProgramFromMap.title)}"
            style="
              display: block;
              width: 100%;
              margin-top: 14px;
              padding: 12px 14px;
              border: 0;
              border-radius: 12px;
              background: #f5f3ed;
              color: #17212b;
              text-align: left;
              font: inherit;
              cursor: pointer;
            "
          >
            <strong
              style="
                display: block;
                color: #17212b;
                font-size: 16px;
              "
            >
              ${safeText(selectedProgramFromMap.title)}
            </strong>

            ${timeParts.length
            ? `
                  <span
                    style="
                      display: block;
                      margin-top: 4px;
                      color: #65605a;
                      font-size: 13px;
                    "
                  >
                    ${safeText(timeParts.join(" · "))}
                  </span>
                `
            : ""
          }
          </button>
        `;
      })()
      : selectedLocationProgramma.length > 0
        ? `
          <div
            style="
              display: grid;
              gap: 8px;
              max-height: 320px;
              margin-top: 14px;
              padding-right: 4px;
              overflow-y: auto;
              overscroll-behavior: contain;
            "
          >
            ${selectedLocationProgramma
          .sort(compareProgramItems)
          .map((item) => {
            const timeParts = [
              item.day,
              item.startTime
            ].filter(Boolean);

            return `
                  <button
                    type="button"
                    onclick="showProgramCardFromMap(
                      '${escapeJsString(item.id)}'
                    )"
                    aria-label="Bekijk ${safeText(item.title)} in het programma"
                    style="
                      display: block;
                      width: 100%;
                      padding: 10px 12px;
                      border: 0;
                      border-radius: 10px;
                      background: #f5f3ed;
                      color: #17212b;
                      text-align: left;
                      font: inherit;
                      cursor: pointer;
                    "
                  >
                    <strong
                      style="
                        display: block;
                        color: #17212b;
                      "
                    >
                      ${safeText(item.title)}
                    </strong>

                    ${timeParts.length
                ? `
                          <span
                            style="
                              display: block;
                              margin-top: 3px;
                              color: #65605a;
                              font-size: 13px;
                            "
                          >
                            ${safeText(timeParts.join(" · "))}
                          </span>
                        `
                : ""
              }
                  </button>
                `;
          })
          .join("")}
          </div>
        `
        : `
          <p
            style="
              margin: 10px 0 0;
              color: #65605a;
            "
          >
            Voor deze locatie zijn nog geen programmaonderdelen
            gevonden.
          </p>
        `;

  const selectedLocationHtml =
    selectedLocation
      ? `
        <section
          id="selected-map-location"
          style="
            margin-top: 18px;
            padding: 18px;
            border-radius: 18px;
            background: #ffffff;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
          "
        >
          <div
            style="
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 12px;
            "
          >
            <div>
              <p
                style="
                  margin: 0 0 3px;
                  color: #8b6500;
                  font-size: 12px;
                  font-weight: 800;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                "
              >
                Geselecteerde locatie
              </p>

              <h3
                style="
                  margin: 0;
                  color: #17212b;
                  font-size: 21px;
                "
              >
                ${safeText(selectedLocation.name)}
              </h3>
            </div>

            <button
              type="button"
              onclick="selectPlattegrondLocation(
                '${safeText(selectedLocation.id)}'
              )"
              aria-label="Sluit locatie-informatie"
              style="
                width: 34px;
                height: 34px;
                padding: 0;
                border: 0;
                border-radius: 50%;
                background: #f2f0e9;
                color: #17212b;
                font-size: 22px;
                cursor: pointer;
              "
            >
              ×
            </button>
          </div>

          ${programmaHtml}

          ${selectedLocationProgramma.length > 0
        ? `
                <button
                  type="button"
                  onclick="showProgramAtLocation(
                    '${safeText(selectedLocation.name)}'
                  )"
                  style="
                    width: 100%;
                    margin-top: 14px;
                    padding: 12px 16px;
                    border: 1px solid rgba(23, 33, 43, 0.18);
                    border-radius: 12px;
                    background: #ffffff;
                    color: #17212b;
                    font: inherit;
                    font-weight: 650;
                    cursor: pointer;
                  "
                >
                  Bekijk alle activiteiten op deze locatie
                </button>
              `
        : ""
      }
        </section>
      `
      : "";

  return `
    <section class="screen">
      ${screenHeader(
    "Plattegrond",
    "Bekijk waar de verschillende festivalactiviteiten plaatsvinden."
  )}

      <div
        class="festival-map-switcher"
        role="group"
        aria-label="Kies een plattegrond"
      >
        ${isFocusedProgramMap
          ? `
              <button
                type="button"
                class="festival-map-back"
                onclick="returnFromMapToPreviousScreen()"
                aria-label="${safeText(mapReturnLabel)}"
              >
                <span aria-hidden="true" class="festival-map-back-icon">◀</span>
                <span>Terug</span>
              </button>
            `
          : ""
        }

        ${buttonsHtml}
      </div>

      <div class="festival-map-heading">
        <h2>${safeText(currentMap.title)}</h2>

        <span class="festival-map-count">
          ${normalizedLocations.length}
          ${normalizedLocations.length === 1
      ? "locatie"
      : "locaties"
    }
        </span>
      </div>

      <div style="overflow-x: auto;">
        <div
          style="
            position: relative;
            width: 100%;
            min-width: 300px;
          "
        >
          <img
            src="${safeText(currentMap.image)}"
            alt="${safeText(currentMap.alt)}"
            class="festival-map-image"
            style="
              display: block;
              width: 100%;
              height: auto;
            "
          >

          <div
            aria-label="Locaties op de plattegrond"
            style="
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
            "
          >
            ${markersHtml}
          </div>
        </div>
      </div>

      ${selectedLocationHtml}
    </section>
  `;
}

function showFestivalInfo() {
  const items = store.festivalinfo || [];
  const heroImageUrl = safeExternalUrl(items[0]?.imageUrl);

  document.getElementById("app").innerHTML = `
    <section class="screen festival-info-screen">
      ${screenHeader(
    "Festivalinfo",
    "Praktische informatie over Berkel-Enschot Bruist."
  )}

      ${heroImageUrl
      ? `
            <div class="festival-info-hero">
              <img
                src="${escapeAttribute(heroImageUrl)}"
                alt=""
                loading="eager"
              >
            </div>
          `
      : ""
    }

      ${items.length > 0
      ? `
            <div class="festival-info-list">
              ${items
        .map((item) => festivalInfoCard(item))
        .join("")}
            </div>
          `
      : `
            <div class="empty-state">
              <h3>Festivalinformatie volgt</h3>
              <p>
                De praktische informatie wordt binnenkort aangevuld.
              </p>
            </div>
          `
    }
    </section>
  `;

  updateNavigation("festivalinfo");
  renderInlineIcons();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showFestivalInfoDetail(infoId) {
  appState.selectedFestivalInfoId = String(infoId);

  const item = store.festivalinfo.find(
    (infoItem) =>
      String(infoItem.id) === appState.selectedFestivalInfoId
  );

  if (!item) {
    return;
  }

  const imageUrl = safeExternalUrl(item.imageUrl);

  document.getElementById("app").innerHTML = `
    <section class="screen festival-info-detail-screen">
      <button
        type="button"
        class="back-button"
        onclick="showFestivalInfo()"
      >
        ← Festivalinfo
      </button>

      ${imageUrl
      ? `
            <figure class="festival-info-detail-hero">
              <img
                src="${escapeAttribute(imageUrl)}"
                alt=""
              >
            </figure>
          `
      : ""
    }

      <div class="festival-info-detail-heading">
        <h1>${escapeHtml(item.title)}</h1>
      </div>

      <div class="festival-info-detail-text">
        ${formatDescription(item.text)}
      </div>
    </section>
  `;

  updateNavigation("festivalinfo");
  renderInlineIcons();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function screenHeader(title, subtitle) {
  return `
    <header class="app-header">
      <img src="images/app-icon.jpg" alt="" class="app-symbol">
      <div>
        <h1 class="screen-title">${title}</h1>
        <p class="screen-subtitle">${subtitle}</p>
      </div>
    </header>
  `;
}

function homeMenuItem(title, subtitle, screenName, colorClass) {
  return `
    <button type="button" class="home-menu-item ${colorClass}" onclick="navigateTo('${screenName}')">
      <span class="menu-accent"></span>
      <span>
        <span class="menu-title">${title}</span>
        <span class="menu-subtitle">${subtitle}</span>
      </span>
    </button>
  `;
}

function discoverCard(iconName, title, text) {
  return `
    <article class="info-card discover-card">
      <span class="discover-icon" data-icon="${iconName}"></span>
      <span>
        <h3>${title}</h3>
        <p>${text}</p>
      </span>
    </article>
  `;
}

function festivalInfoCard(item) {
  return `
    <button
      type="button"
      class="festival-info-card"
      onclick="showFestivalInfoDetail('${escapeJsString(item.id)}')"
      aria-label="Bekijk informatie over ${escapeAttribute(item.title)}"
    >
      <span
        class="festival-info-icon"
        data-icon="${escapeAttribute(item.icon || "info")}"
        aria-hidden="true"
      ></span>

      <span class="festival-info-content">
        <span class="festival-info-title">
          ${escapeHtml(item.title)}
        </span>

        <span class="festival-info-text">
          ${escapeHtml(item.shortText || item.text)}
        </span>
      </span>

      <span class="festival-info-arrow" aria-hidden="true">
        ›
      </span>
    </button>
  `;
}

function programCard(item, context = "programma") {
  const category = programCategory(item);
  const location = programLocation(item);
  const mapLocation = String(
    item.location?.name ||
    item.locationId ||
    ""
  ).trim();
  const part = programPart(item);

  const description =
    item.shortDescription ||
    item.description ||
    "Meer informatie volgt.";

  const colorClass = categoryColorClassFromItem(item);
  const moment = formatProgramTime(item);
  const imageUrl = safeExternalUrl(item.imageUrl);
  const websiteUrl = safeExternalUrl(item.websiteUrl);
  const actionUrl = safeExternalUrl(item.actionUrl);
  const actionText = String(item.actionText || "Aanmelden").trim() || "Aanmelden";
  const isSaved = isProgramSaved(item.id);

  const tags = String(item.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 3);

  return `
    <article
      class="program-card ${colorClass}"
      data-program-id="${escapeAttribute(item.id)}"
    >
      <span
        class="program-card-accent"
        aria-hidden="true"
      ></span>

      <div class="program-card-content">
        <div class="program-card-top ${imageUrl ? "has-image" : ""}">
          <div class="program-card-heading">
            <h3 class="program-card-title">
              ${escapeHtml(item.title)}
            </h3>
          </div>

          ${imageUrl
      ? `
                <span class="program-card-image">
                  <img
                    src="${escapeAttribute(imageUrl)}"
                    alt=""
                    loading="lazy"
                  >
                </span>
              `
      : ""
    }
        </div>

        <div class="program-card-labels">
          <span class="badge ${colorClass}">
            ${escapeHtml(category)}
          </span>

          ${tags
      .map(
        (tag) => `
                <span class="program-tag">
                  ${escapeHtml(tag)}
                </span>
              `
      )
      .join("")}
        </div>

        <p class="program-card-description">
          ${escapeHtml(description)}
        </p>

        <div class="program-card-facts">
          <div class="program-card-fact program-card-fact-time">
            <span
              class="mini-icon"
              data-icon="clock"
              aria-hidden="true"
            ></span>

            <span class="program-card-fact-text">
              ${escapeHtml(moment)}
            </span>
          </div>

          ${part
      ? `
                <div class="program-card-fact program-card-fact-part">
                  <span
                    class="mini-icon"
                    data-icon="compass"
                    aria-hidden="true"
                  ></span>

                  <span class="program-card-fact-text">
                    ${escapeHtml(part)}
                  </span>
                </div>
              `
      : ""
    }

          <div class="program-card-fact program-card-fact-location">
            <span
              class="mini-icon"
              data-icon="pin"
              aria-hidden="true"
            ></span>

            <span class="program-card-fact-text">
              ${escapeHtml(location)}
            </span>
          </div>
        </div>

        <div class="program-card-actions">
          ${context === "mijn"
      ? `
                <button
                  type="button"
                  class="program-card-action program-card-remove"
                  onclick="removeProgramSaved('${escapeJsString(item.id)}')"
                  aria-label="Verwijder ${escapeAttribute(item.title)} uit Mijn Bruist"
                >
                  <span
                    class="program-action-icon"
                    data-icon="star"
                    aria-hidden="true"
                  ></span>

                  <span>Verwijder</span>
                </button>
              `
      : isSaved
        ? `
                  <button
                    type="button"
                    class="program-card-action"
                    disabled
                  >
                    <span
                      class="program-action-icon"
                      data-icon="star"
                      aria-hidden="true"
                    ></span>

                    <span>In Mijn Bruist</span>
                  </button>
                `
        : `
                  <button
                    type="button"
                    class="program-card-action program-card-add"
                    onclick="addProgramSaved('${escapeJsString(item.id)}')"
                    aria-label="Voeg ${escapeAttribute(item.title)} toe aan Mijn Bruist"
                  >
                    <span
                      class="program-action-icon"
                      data-icon="star"
                      aria-hidden="true"
                    ></span>

                    <span>Mijn Bruist</span>
                  </button>
                `
    }

          ${websiteUrl
      ? `
                <a
                  class="program-card-action program-card-more"
                  href="${escapeAttribute(websiteUrl)}"
                  target="_blank"
                  rel="noopener"
                  aria-label="Meer informatie over ${escapeAttribute(item.title)}"
                >
                  <span
                    class="program-action-icon"
                    data-icon="info"
                    aria-hidden="true"
                  ></span>

                  <span>Meer info</span>
                </a>
              `
      : ""
    }

          ${actionUrl
      ? `
                <a
                  class="program-card-action program-card-cta"
                  href="${escapeAttribute(actionUrl)}"
                  target="_blank"
                  rel="noopener"
                  aria-label="${escapeAttribute(actionText)} voor ${escapeAttribute(item.title)}"
                >
                  <span
                    class="program-action-icon"
                    data-icon="calendar"
                    aria-hidden="true"
                  ></span>

                  <span>${escapeHtml(actionText)}</span>
                </a>
              `
      : ""
    }

          ${mapLocation
      ? `
                <button
                  type="button"
                  class="program-card-action program-card-map"
                  onclick="showLocationOnMap('${escapeJsString(mapLocation)}', '${escapeJsString(item.id)}')"
                  aria-label="Toon ${escapeAttribute(mapLocation)} op de plattegrond"
                >
                  <span
                    class="program-action-icon"
                    data-icon="map"
                    aria-hidden="true"
                  ></span>

                  <span>Toon op kaart</span>
                </button>
              `
      : ""
    }
        </div>
      </div>
    </article>
  `;
}

function myBruistCard(item) {
  const location = programLocation(item);
  const mapLocation = String(
    item.location?.name ||
    item.locationId ||
    ""
  ).trim();
  const colorClass = categoryColorClassFromItem(item);
  const moment = formatProgramTime(item);
  const imageUrl = safeExternalUrl(item.imageUrl);
  const hasConflict = hasSavedProgramConflict(item);

  return `
    <article
      class="my-bruist-card ${colorClass}"
      data-program-id="${escapeAttribute(item.id)}"
    >
      <span
        class="my-bruist-card-accent"
        aria-hidden="true"
      ></span>

      <div class="my-bruist-card-content">
        <div class="my-bruist-card-top ${imageUrl ? "has-image" : ""}">
          <h3 class="my-bruist-card-title">
            ${escapeHtml(item.title)}
          </h3>

          ${imageUrl
      ? `
                <span class="my-bruist-card-image">
                  <img
                    src="${escapeAttribute(imageUrl)}"
                    alt=""
                    loading="lazy"
                  >
                </span>
              `
      : ""
    }
        </div>

        <div class="my-bruist-card-facts">
          <div class="my-bruist-card-fact">
            <span
              class="mini-icon"
              data-icon="clock"
              aria-hidden="true"
            ></span>

            <span>${escapeHtml(moment)}</span>
          </div>

          <div class="my-bruist-card-fact">
            <span
              class="mini-icon"
              data-icon="pin"
              aria-hidden="true"
            ></span>

            <span>${escapeHtml(location)}</span>
          </div>
        </div>

        ${hasConflict
      ? `
              <div class="program-conflict">
                Let op: dit onderdeel overlapt met een andere keuze.
              </div>
            `
      : ""
    }

        <div class="my-bruist-card-actions">
          <button
            type="button"
            class="program-card-action program-card-remove"
            onclick="removeProgramSaved('${escapeJsString(item.id)}')"
            aria-label="Verwijder ${escapeAttribute(item.title)} uit Mijn Bruist"
          >
            <span
              class="program-action-icon"
              data-icon="star"
              aria-hidden="true"
            ></span>

            <span>Verwijder</span>
          </button>

          ${mapLocation
      ? `
                <button
                  type="button"
                  class="program-card-action program-card-map"
                  onclick="showLocationOnMap('${escapeJsString(mapLocation)}', '${escapeJsString(item.id)}')"
                  aria-label="Toon ${escapeAttribute(mapLocation)} op de plattegrond"
                >
                  <span
                    class="program-action-icon"
                    data-icon="map"
                    aria-hidden="true"
                  ></span>

                  <span>Toon op kaart</span>
                </button>
              `
      : ""
    }
        </div>
      </div>
    </article>
  `;
}

function formatProgramTime(item) {
  const day = capitalizeFirst(item.day);
  const date = String(item.date || "").trim();

  let datePart = day;

  if (date) {
    const normalizedDay = normalizeSearchValue(day);
    const normalizedDate = normalizeSearchValue(date);

    if (!normalizedDay.includes(normalizedDate)) {
      datePart = [day, date].filter(Boolean).join(" ");
    }
  }

  const startTime = formatClockTime(item.startTime);
  const endTime = formatClockTime(item.endTime);

  const timePart = endTime
    ? `${startTime} – ${endTime}`
    : startTime;

  return [datePart, timePart]
    .filter(Boolean)
    .join(" · ") || "Tijd volgt";
}

function capitalizeFirst(value) {
  const text = String(value || "").trim();

  return text
    ? text.charAt(0).toLocaleUpperCase("nl-NL") + text.slice(1)
    : "";
}

function formatClockTime(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{1,2}):(\d{2})/);

  if (!match) {
    return text;
  }

  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function categoryColorClass(category) {
  const value = String(category).toLowerCase();

  if (value.includes("kunst") || value.includes("klassiek")) return "accent-purple";
  if (value.includes("film") || value.includes("muziek")) return "accent-blue";
  if (value.includes("food") || value.includes("cabaret")) return "accent-orange";
  return "accent-magenta";
}

function safeExternalUrl(value) {
  if (!value) return "";

  try {
    const url = new URL(value, window.location.href);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch (error) {
    console.warn("Ongeldige URL in Google Sheets:", value);
  }

  return "";
}

function formatDescription(value) {
  return escapeHtml(value)
    .split(/\r?\n/)
    .filter((paragraph) => paragraph.trim() !== "")
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function escapeJsString(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'");
}
