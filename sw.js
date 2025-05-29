// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';
const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json'
];

// Install event - add initial recipe URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(RECIPE_URLS);
    })
  );
});

// Activate event - allow immediate control of clients
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Fetch event - serve from cache if available, otherwise fetch and cache
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (cachedResponse) {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then(function (networkResponse) {
          // Only cache valid same-origin GET requests
          if (
            event.request.method === 'GET' &&
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(function () {
          // Optional: fallback response if fetch fails (e.g. offline)
          return new Response('Network error occurred and no cache available.', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      });
    })
  );
});
