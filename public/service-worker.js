// Minimal service worker to avoid 404s. Intentionally lightweight.
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  clients.claim();
});
self.addEventListener('fetch', (event) => {
  // No special caching; passthrough
});
