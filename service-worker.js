/* Berkel-Enschot Bruist PWA — T-007b */
const CACHE_NAME = "bruist-shell-t007b-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/variables.css",
  "./css/style.css",
  "./js/icons.js",
  "./js/store.js",
  "./js/googleSheets.js",
  "./js/screens.js",
  "./js/app.js",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./images/apple-touch-icon.png",
  "./images/logo.png",
  "./images/hero-home.jpg",
  "./images/kaart_buiten.jpg",
  "./images/kaart_beganegrond.jpg",
  "./images/kaart_souterrain.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Externe gegevens, zoals Google Sheets, blijven altijd netwerkgestuurd.
  if (url.origin !== self.location.origin) return;

  // Voor pagina-navigatie eerst online proberen, daarna offline terugvallen.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Lokale bestanden: snel uit cache, terwijl op de achtergrond wordt ververst.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
