const staticCacheName = "s-app-v17";
const dynamicCacheName = "d-app-v17";

const assetUrls = ["index.html", "script.js", "database.js", "style.css"];

self.addEventListener("install", async (event) => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
});

self.addEventListener("activate", async (event) => {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter((name) => name !== staticCacheName)
      .filter((name) => name !== dynamicCacheName)
      .map((name) => caches.delete(name))
  );
});

self.addEventListener("fetch", async (event) => {
  if (event.request.url.includes("chrome-extension")) {
    return;
  }
  const { request } = event;

  const url = new URL(request.url);
  if (url.origin === location.origin) {
    return event.respondWith(cacheFirst(request));
  } else {
    let responseToCache;
    try {
      const response = await fetch(request);

      if (url.pathname.includes("/endpoint/")) {
        const data = await response.text();
        if (data) {
          console.log("data");
          const cache = await caches.open(dynamicCacheName);
          await cache.put(request, new Response(data));
          responseToCache = new Response(data);
        }
      } else {
        responseToCache = response.clone();
      }
    } catch (e) {
      if (url.pathname.includes("/endpoint/")) {
        console.log("no internet");
        responseToCache = await caches.match(request);
      }
    }
    if (!navigator.onLine) {
      responseToCache = new Response("OFFLINE");
      console.log("sw offline");
    }
    event.respondWith(responseToCache);
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}
