// Celoris Unified PWA Service Worker
// Lightweight network-first worker: ensures instant updates and never caches stale auth or API data.

const CACHE_NAME = 'celoris-pwa-v1';
const STATIC_ASSETS = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Never intercept non-GET requests, API calls, or Next.js internal data/auth endpoints
  if (
    request.method !== 'GET' ||
    request.url.includes('/api/') ||
    request.url.includes('/auth/') ||
    request.url.includes('/_next/')
  ) {
    return;
  }

  // For cached static icons, serve cache-first with network fallback
  const url = new URL(request.url);
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // Default: pure network pass-through so content and sessions are always fresh
});
