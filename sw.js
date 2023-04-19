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
    event.request.url.includes("chrome-extension")
  ) {
    return;
  }
  const { request } = event;

  const url = new URL(request.url);
  if (url.origin === location.origin) {
    return event.respondWith(cacheFirst(request));
  } else {
    try {
      const response = await fetch(request);

      // check if url ends with call that means its a database controller function
      if (url.pathname.endsWith("call")) {
        console.log(request)
        const data = await response.text();
        const cache = await caches.open(dynamicCacheName);
        await cache.put(request, new Response(data));
        return event.respondWith(new Response(data));
      } else {
        return event.respondWith(response);
      }
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
