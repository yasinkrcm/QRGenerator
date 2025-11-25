const CACHE_NAME = 'qr-generator-v2';
const urlsToCache = [
  '/',
  '/favicon.svg',
  '/og-image.png',
  '/_next/static/css/app.css',
];

// Install event - daha agresif caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch((err) => {
          console.log('Cache addAll error:', err);
        });
      })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Cache first for app shell, network first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first strategy for app shell (HTML, CSS, JS, images)
  if (
    request.destination === 'document' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          // Cache'de var, arka planda güncelle
          fetch(request).then((freshResponse) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, freshResponse);
            });
          }).catch(() => {});
          return response;
        }
        
        // Cache'de yok, network'ten al ve cache'le
        return fetch(request).then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        }).catch(() => {
          // Offline fallback
          if (request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
    );
  } else {
    // Network-first for everything else
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});
