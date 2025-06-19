const CACHE_NAME = 'order-app-cache-v1';
const OFFLINE_URL = 'offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/script.js',
  '/style.css',
  '/manifest.json',
  '/offline.html',
  '/privacy-policy.html',
  '/cookie-policy.html',
  // Add placeholder icon paths if they were actual files, e.g.:
  // '/icons/icon-192x192.png',
  // '/icons/icon-512x512.png',
  'https://via.placeholder.com/300x200?text=Glass+Mug',
  'https://via.placeholder.com/300x200?text=Lamp',
  'https://via.placeholder.com/300x200?text=Mouse+Pad',
  'https://via.placeholder.com/300x200?text=LED+Strip'
];

// Install event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching core assets');
        // Add offline.html to cache during install
        const offlineRequest = new Request(OFFLINE_URL, { cache: 'reload' });
        cache.add(offlineRequest);
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache core assets during install:', error);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Ensure clients are controlled on activation
      return self.clients.claim();
    })
  );
});

// Fetch event: serve from cache, fallback to network, then offline page
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If network fails for navigation, try to serve offline.html from cache
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Cache hit - return response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(() => {
          // Network fetch failed (e.g., offline) for non-navigation requests
          // For images, we might want to return a placeholder image from cache if available
          if (event.request.destination === 'image') {
            // Optionally, return a placeholder image from cache
            // return caches.match('/placeholder-image.png');
          }
          // For other types of requests, no specific fallback here, will just fail.
          // Navigation requests are handled above to show offline.html
          return new Response("Network error", { status: 408, headers: { 'Content-Type': 'text/plain' }});
        })
    })
  );
});
