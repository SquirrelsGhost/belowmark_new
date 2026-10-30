// BELOWMARK Cleanup Service Worker
// Automatically replaces and unregisters any legacy service workers (e.g. on localhost:3000)
// that intercept fetch() and fail with "TypeError: Failed to convert value to 'Response'".
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister()),
  );
});
