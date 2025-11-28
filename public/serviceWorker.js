const CACHE_NAME = "coffee_order_v2";
const STATIC_ASSETS = ["/", "/index.html", "/logo.png"];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first with dynamic caching
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const isSupabaseAPI = requestUrl.origin.includes("supabase.co");

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") return response;

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            if (isSupabaseAPI || requestUrl.origin === location.origin) {
              cache.put(event.request, responseClone);
            }
          });
          return response;
        })
        .catch(() => {
          // **Important**: return index.html for SPA navigations
          if (event.request.mode === "navigate") return caches.match("/index.html");
          if (isSupabaseAPI) return caches.match(event.request);
        })
    })
  );
});

