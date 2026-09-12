const CACHE_NAME = 'focus-sprint-v2';

self.addEventListener('install', (event) => {
    // Force new service worker to activate immediately without waiting
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Delete any old caches from previous builds
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Network-first strategy: always fetch the latest version from Vercel/network,
// and gracefully fall back to cache when offline
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    // Ignore non-http(s) requests like chrome-extension://
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Offline fallback
                return caches.match(event.request);
            })
    );
});
