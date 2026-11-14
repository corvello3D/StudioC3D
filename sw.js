// Corvello 3D — funciona sem internet depois da primeira visita
const CACHE = "studioc3d-v25";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request; if (req.method !== "GET") return;
  // página: rede primeiro (pega atualização), cache se estiver sem internet
  if (req.mode === "navigate") { e.respondWith(fetch(req, { cache: "no-store" }).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req.url.split("#")[0].split("?")[0], cp)); return r; }).catch(() => caches.match(req.url.split("#")[0].split("?")[0]).then((hit) => hit || caches.match("./index.html")))); return; }
  // resto (ícones, fontes): cache primeiro
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok || r.type === "opaque") { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return r; })));
});
