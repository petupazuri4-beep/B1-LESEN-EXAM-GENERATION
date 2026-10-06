// B1 Lesen Exam Studio - Offline Service Worker
const CACHE_NAME = 'b1-lesen-exam-studio-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/seeds/exam_01.json',
  '/seeds/exam_02.json',
  '/seeds/exam_03.json',
  '/seeds/exam_04.json',
  '/seeds/exam_05.json',
  '/seeds/exam_06.json',
  '/seeds/exam_07.json',
  '/seeds/exam_08.json',
  '/seeds/exam_09.json',
  '/seeds/exam_10.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Service worker precache partial fail:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Network-first for dynamic API routes, Cache-first / Stale-while-revalidate for static assets
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || new Response(JSON.stringify({ offline: true, error: 'Offline mode active' }), {
            headers: { 'Content-Type': 'application/json' },
          });
        });
      })
    );
    return;
  }

  // App shell and static resources
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached and update in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
