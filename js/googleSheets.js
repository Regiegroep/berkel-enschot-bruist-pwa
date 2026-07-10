async function loadConfig() {
  const response = await fetch("data/config.json", { cache: "no-store" });
  if (!response.ok) throw new Error(`Configuratie kon niet worden geladen (${response.status}).`);
  return response.json();
}

function buildSheetCsvUrl(spreadsheetId, sheetName) {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

async function fetchSheetRows(spreadsheetId, sheetName) {
  const response = await fetch(buildSheetCsvUrl(spreadsheetId, sheetName), { cache: "no-store" });
  if (!response.ok) throw new Error(`Tabblad "${sheetName}" kon niet worden opgehaald (${response.status}).`);
  const csv = await response.text();
  return csv.trim() ? csvToObjects(csv) : [];
}

function csvToObjects(csv) {
  const rows = parseCsv(csv);
  if (rows.length < 2) return [];
  const headers = rows[0].map(normalizeHeader);

  return rows.slice(1)
    .filter((row) => row.some((value) => String(value).trim() !== ""))
    .map((row) => {
      const object = {};
      headers.forEach((header, index) => {
        if (header) object[header] = String(row[index] ?? "").trim();
      });
      return object;
    });
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const nextCharacter = csv[index + 1];

    if (character === '"') {
      if (insideQuotes && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (character === "," && !insideQuotes) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !insideQuotes) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function normalizeHeader(header) {
  return String(header).trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function firstValue(row, aliases) {
  for (const alias of aliases) {
    const key = normalizeHeader(alias);
    if (row[key] !== undefined && row[key] !== "") return row[key];
  }
  return "";
}

function mapProgramRow(row, index) {
  return {
    id: firstValue(row, ["programma_id", "id"]) || `programma-${index + 1}`,
    title: firstValue(row, ["titel", "naam"]),
    day: firstValue(row, ["dag"]),
    date: firstValue(row, ["datum"]),
    startTime: firstValue(row, ["starttijd", "start_tijd"]),
    endTime: firstValue(row, ["eindtijd", "eind_tijd"]),
    note: firstValue(row, ["toelichting"]),
    description: firstValue(row, ["omschrijving", "beschrijving"]),
    partId: firstValue(row, ["onderdeel_id", "festivalonderdeel_id", "onderdeel"]),
    categoryId: firstValue(row, ["categorie_id", "categorie"]),
    tags: firstValue(row, ["tags"]),
    organizationId: firstValue(row, ["organisatie_id", "organisatie"]),
    locationId: firstValue(row, ["locatie_id", "locatie"]),
    audience: firstValue(row, ["doelgroep"]),
    websiteUrl: firstValue(row, ["link_meer_info", "url", "website"]),
    imageUrl: firstValue(row, ["afbeelding_url", "afbeelding"]),
    status: firstValue(row, ["status"]),
    raw: row
  };
}

function mapCategoryRow(row) {
  return {
    id: firstValue(row, ["categorie_id", "id"]),
    name: firstValue(row, ["categorie", "naam"]),
    mainCategory: firstValue(row, ["hoofdcategorie"]),
    color: firstValue(row, ["kleur"]),
    icon: firstValue(row, ["icoon"])
  };
}

function mapFestivalPartRow(row) {
  return {
    id: firstValue(row, ["onderdeel_id", "festivalonderdeel_id", "id"]),
    name: firstValue(row, ["onderdeel", "festivalonderdeel", "naam"])
  };
}

function mapLocationRow(row) {
  return {
    id: firstValue(row, ["locatie_id", "id"]),
    name: firstValue(row, ["locatie", "naam"]),
    address: firstValue(row, ["adres"]),
    mapX: firstValue(row, ["kaart_x", "x"]),
    mapY: firstValue(row, ["kaart_y", "y"])
  };
}

function mapOrganizationRow(row) {
  return {
    id: firstValue(row, ["organisatie_id", "id"]),
    name: firstValue(row, ["organisatie", "naam"]),
    websiteUrl: firstValue(row, ["url", "website"])
  };
}

async function loadAllGoogleSheetsData() {
  const config = await loadConfig();
  const id = config.spreadsheetId;
  const s = config.sheets;

  const [programmaRows, categorieRows, onderdeelRows, locatieRows, organisatieRows] =
    await Promise.all([
      fetchSheetRows(id, s.programma),
      fetchSheetRows(id, s.categorieen),
      fetchSheetRows(id, s.festivalonderdelen),
      fetchSheetRows(id, s.locaties),
      fetchSheetRows(id, s.organisaties)
    ]);

  return {
    config,
    programma: programmaRows
      .map(mapProgramRow)
      .filter((item) => item.title && item.status.trim().toLowerCase() === "definitief"),
    categorieen: categorieRows.map(mapCategoryRow).filter((item) => item.id),
    festivalonderdelen: onderdeelRows.map(mapFestivalPartRow).filter((item) => item.id),
    locaties: locatieRows.map(mapLocationRow).filter((item) => item.id),
    organisaties: organisatieRows.map(mapOrganizationRow).filter((item) => item.id)
  };
}
