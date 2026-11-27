const CACHE = 'chess-academy-v4';
const assets = ['./','./index.html','./app.js?v=4','./study.js?v=4','./manifest.json','./icon-192.png','./icon-512.png','https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(assets)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('chess-academy-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    if (request.mode === 'navigate' && new URL(request.url).origin === self.location.origin) {
      try { return await fetch(request); }
      catch { return await cache.match('./index.html') || Response.error(); }
    }
    return await cache.match(request) || fetch(request);
  }));
});
