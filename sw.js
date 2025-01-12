const CACHE_NAME = 'itonuta-cache-v2'; // Updated cache version
const urlsToCache = [
    '/', // Root
    '/index.html', // Main HTML file
    '/manifest.json', // Manifest file
    '/css/styles.css', // Stylesheet
    '/css/chubbo.css', // Font CSS
    '/icons/icon-192.png', // Icon for PWA
    '/icons/icon-512.png' // Icon for PWA
];

// Install event: cache all necessary resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event: clear old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName); // Remove outdated cache
                    }
                })
            );
        })
    );
});

// Fetch event: serve cached resources or fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
