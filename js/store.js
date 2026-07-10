const store = {
  config: null,
  programma: [],
  categorieen: [],
  festivalonderdelen: [],
  locaties: [],
  organisaties: [],
  indexes: {},
  loading: false,
  error: null
};

function setStore(patch) {
  Object.assign(store, patch);
}

function createIndex(items, keyName) {
  return new Map(
    items
      .filter((item) => item[keyName])
      .map((item) => [String(item[keyName]).trim(), item])
  );
}

function buildRelationIndexes() {
  store.indexes = {
    categorieen: createIndex(store.categorieen, "id"),
    festivalonderdelen: createIndex(store.festivalonderdelen, "id"),
    locaties: createIndex(store.locaties, "id"),
    organisaties: createIndex(store.organisaties, "id")
  };
}

function enrichProgramma() {
  store.programma = store.programma.map((item) => ({
    ...item,
    category: store.indexes.categorieen.get(String(item.categoryId || "").trim()) || null,
    part: store.indexes.festivalonderdelen.get(String(item.partId || "").trim()) || null,
    location: store.indexes.locaties.get(String(item.locationId || "").trim()) || null,
    organization: store.indexes.organisaties.get(String(item.organizationId || "").trim()) || null
  }));
}
