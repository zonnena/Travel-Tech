const CACHE_VERSION = 'geolayers-v9';
const APP_SHELL = [
  '.',
  'index.html',
  'css/style.css',
  'js/config.js',
  'js/app.js',
  'js/ai.js',
  'js/social.js',
  'js/ar.js',
  'js/tour.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Install — cache app shell and immediately take over
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate — purge ALL old caches and claim clients immediately
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network-first for EVERYTHING, cache is only an offline fallback
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Update cache with fresh response
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
