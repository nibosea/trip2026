/*
 * Service Worker for 2026 USA & Canada Trip guide
 * - Precaches shell HTML on install
 * - Stale-while-revalidate for all same-origin GET requests (images, HTML)
 * - Offline fallback from cache
 *
 * Bump CACHE_NAME to invalidate on each deploy.
 */

const CACHE_NAME = 'trip2026-v1-20260422';
const PRECACHE_URLS = [
  './',
  'index.html',
  'travel-site.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => { /* ignore individual failures */ })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only handle same-origin
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === 'basic') {
            const cloned = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, cloned));
          }
          return res;
        })
        .catch(() => cached); // offline fallback
      return cached || networkFetch;
    })
  );
});
