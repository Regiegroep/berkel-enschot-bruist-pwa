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
        <img src="images/logo.png" alt="Logo Berkel-Enschot Bruist" class="logo-main">
        <p class="intro-text">
          Berkel-Enschot heeft een eigen festival.<br>
          Een feest voor en door het dorp.
        </p>
      </div>

      <div class="home-content">
        <figure class="hero-image">
          <img src="images/hero-home.jpg" alt="Sfeerbeeld van Berkel-Enschot Bruist bij Koningsoord">
        </figure>

        <div class="home-menu">
          ${homeMenuItem("Programma", "Alle activiteiten.", "programma", "accent-blue")}
          ${homeMenuItem("Ontdek", "Zoek op dag, categorie of locatie.", "ontdek", "accent-purple")}
          ${homeMenuItem("Mijn Bruist", "Jouw festivalprogramma.", "mijn", "accent-magenta")}
          ${homeMenuItem("Plattegrond", "Festivalkaart en locaties.", "kaart", "accent-orange")}
        </div>

        <button type="button" class="festival-info-button" onclick="showFestivalInfo()">
          <span class="festival-info-icon" data-icon="info"></span>
          <span>Festivalinfo</span>
        </button>
      </div>
    </section>
  `;
}

function renderProgramma() {
  if (store.loading) {
    return `
      <section class="screen">
        ${screenHeader("Programma", "Het actuele programma uit Google Sheets.")}
        ${renderLoadingState()}
      </section>
    `;
  }

  if (store.error) {
    return `
      <section class="screen">
        ${screenHeader("Programma", "Het actuele programma uit Google Sheets.")}
        ${renderErrorState(store.error)}
      </section>
    `;
  }

  const filtered = getFilteredProgramma();

  return `
    <section class="screen">
      ${screenHeader("Programma", "Zoek en filter in het actuele programma.")}

      <div class="search-block">
        <label for="search-program">Zoeken</label>
        <input
          id="search-program"
          type="search"
          placeholder="Titel, omschrijving, locatie of categorie"
          value="${escapeAttribute(appState.searchQuery)}"
        >
      </div>

      ${renderProgramFilters()}

      <div class="program-results-header">
        <strong id="program-result-count">${resultCountText(filtered.length, store.programma.length)}</strong>
        <button
          type="button"
          class="reset-filters-button"
          id="reset-filters"
          ${hasActiveProgramFilters() ? "" : "hidden"}
        >
          Wis filters
        </button>
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

function renderProgramCards(items) {
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

  return `<div class="program-list">${items.map(programCard).join("")}</div>`;
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
  const part = programPart(item);
  const organization = programOrganization(item);
  const address = item.location?.address || "";
  const time = formatProgramTime(item);
  const description = item.description || item.shortDescription || "Meer informatie volgt.";
  const colorClass = categoryColorClassFromItem(item);
  const websiteUrl = safeExternalUrl(item.websiteUrl);
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

          ${
            address
              ? `<div class="detail-fact">
                   <span class="detail-fact-icon" data-icon="pin"></span>
                   <span>${escapeHtml(address)}</span>
                 </div>`
              : ""
          }

          ${
            part
              ? `<div class="detail-fact">
                   <span class="detail-fact-icon" data-icon="compass"></span>
                   <span>Onderdeel van ${escapeHtml(part)}</span>
                 </div>`
              : ""
          }

          ${
            tags.length
              ? `<div class="detail-fact">
                  <span class="detail-fact-icon" data-icon="tag"></span>
                  <span>${tags.map((tag) => escapeHtml(tag)).join(" • ")}</span>
                </div>`
              : ""
          }

          ${
            organization
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
          ${
            websiteUrl
              ? `<a class="primary-button" href="${escapeAttribute(websiteUrl)}" target="_blank" rel="noopener">
                   Meer informatie op website
                 </a>`
              : ""
          }

          <button type="button" class="secondary-button" disabled>
            Toevoegen aan Mijn Bruist — volgt later
          </button>

          <button type="button" class="secondary-button" disabled>
            Toon op kaart — volgt later
          </button>
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

function renderMijnBruist() {
  return `
    <section class="screen">
      ${screenHeader("Mijn Bruist", "Hier komt straks je persoonlijke festivalagenda.")}
      <div class="empty-state">
        <h3>Nog geen activiteiten gekozen</h3>
        <p>Favorieten worden in een volgende release toegevoegd.</p>
      </div>
    </section>
  `;
}

function renderPlattegrond() {
  return `
    <section class="screen">
      ${screenHeader("Plattegrond", "Kies straks welke kaart je wilt bekijken.")}
      <div class="map-options">
        <article class="map-card">
          <span class="badge accent-purple">Festivalgebied</span>
          <h3>Festivalkaart</h3>
          <p>Overzicht van alle hoofdlocaties in het festivalgebied.</p>
        </article>

        <article class="map-card">
          <span class="badge accent-blue">Binnenlocaties</span>
          <h3>Ons Koningsoord-kaart</h3>
          <p>Detailkaart voor locaties binnen Ons Koningsoord.</p>
        </article>
      </div>
    </section>
  `;
}

function showFestivalInfo() {
  document.getElementById("app").innerHTML = `
    <section class="screen">
      ${screenHeader("Festivalinfo", "Praktische informatie over Berkel-Enschot Bruist.")}
      <div class="card-grid">
        ${discoverCard("pin", "Bereikbaarheid", "Hoe kom je bij het festival?")}
        ${discoverCard("pin", "Fiets parkeren", "Informatie over fietsenstallingen.")}
        ${discoverCard("pin", "Auto parkeren", "Parkeren in en rond het centrum.")}
        ${discoverCard("info", "Toiletten", "Vind sanitaire voorzieningen.")}
        ${discoverCard("info", "EHBO", "Waar kun je terecht bij hulp?")}
        ${discoverCard("info", "Toegankelijkheid", "Informatie voor bezoekers met een beperking.")}
      </div>
    </section>
  `;

  updateNavigation("");
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

function programCard(item) {
  const category = programCategory(item);
  const location = programLocation(item);
  const time = formatProgramTime(item);
  const description = item.shortDescription || item.description || "Meer informatie volgt.";
  const colorClass = categoryColorClassFromItem(item);

  return `
    <button type="button" class="program-card program-card-button ${colorClass}" onclick="showProgramDetail('${escapeJsString(item.id)}')">
      <span class="badge ${colorClass}">${escapeHtml(category)}</span>
      <h3>${escapeHtml(item.title)}</h3>

      <div class="program-meta">
        <span class="mini-icon" data-icon="clock"></span>
        <span>${escapeHtml(time)}</span>
        <span class="mini-icon" data-icon="pin"></span>
        <span>${escapeHtml(location)}</span>
      </div>

      <p>${escapeHtml(description)}</p>
      <span class="card-link">Bekijk details</span>
    </button>
  `;
}

function formatProgramTime(item) {
  const datePart = [item.day, item.date].filter(Boolean).join(" ");
  const timePart = item.endTime ? `${item.startTime} – ${item.endTime}` : item.startTime;
  return [datePart, timePart].filter(Boolean).join(" · ") || "Tijd volgt";
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
