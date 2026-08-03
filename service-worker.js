/* Berkel-Enschot Bruist PWA — T-007b */
const CACHE_NAME = "bruist-shell-v1-0-network-first";
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

  const pathname = url.pathname.toLowerCase();
  const isImage =
    request.destination === "image" ||
    /\.(png|jpe?g|webp|gif|svg|ico)$/i.test(pathname);

  const isAppCode =
    request.mode === "navigate" ||
    request.destination === "script" ||
    request.destination === "style" ||
    /\.(html?|js|css|json)$/i.test(pathname);

  // HTML, JavaScript, CSS en manifest: online altijd eerst de nieuwste versie.
  if (isAppCode) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }

          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);

          if (cached) {
            return cached;
          }

          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }

          throw new Error("Geen netwerk en geen cache beschikbaar.");
        })
    );

    return;
  }

  // Afbeeldingen: snel uit cache, op de achtergrond verversen.
  if (isImage) {
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

    return;
  }

  // Overige lokale GET-bestanden: network-first met cache-fallback.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }

        return response;
      })
      .catch(() => caches.match(request))
  );
});
