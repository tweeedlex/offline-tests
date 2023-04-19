const staticCacheName = "s-app-v15";
const dynamicCacheName = "d-app-v15";

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
  if (
    event.request.url.includes("chrome-extension") ||
    event.request.method !== "GET"
  ) {
    return;
  }
  const { request } = event;

  const url = new URL(request.url);
  if (url.origin === location.origin) {
    return event.respondWith(cacheFirst(request));
  } else {
    console.log(request);
    try {
      const response = await fetch(request);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
  if (!navigator.onLine) {
    event.respondWith(new Response("OFFLINE"));
    console.log("sw offline");
    return;
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}
