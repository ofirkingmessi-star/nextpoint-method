// Next Point: שומר את האפליקציה בטלפון כדי שתיפתח גם בלי אינטרנט.
// כשמעלים גרסה חדשה: משנים את המספר כאן, והטלפון יוריד אותה.
const CACHE = "np-method-v5";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // רק קבצי האפליקציה. בקשות ל-GitHub (הסנכרון) לא נשמרות בטלפון
  if (new URL(e.request.url).origin !== self.location.origin) return;
  // קודם רשת (כדי לקבל עדכונים), ואם אין אינטרנט: מהשמור
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && (r.type === "basic" || r.type === "cors")) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request).then(m => m || caches.match("./index.html"))));
});
