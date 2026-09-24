const CACHE_NAME = "syntra-static-v2";
const STATIC_ASSETS = ["/manifest.json", "/icon-192x192.png", "/icon-512x512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
  );
  self.clients.claim();
});

// Only serve precached static assets from cache. Pages, auth and API always hit the network.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || !STATIC_ASSETS.includes(url.pathname)) return;
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});
