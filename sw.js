const staticCacheName = "s-app-v118";
const dynamicCacheName = "d-app-v118";

const assetUrls = ["index.html", "script.js", "database.js", "style.css"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(assetUrls);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (name) => name !== staticCacheName && name !== dynamicCacheName
          )
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("chrome-extension")) {
    return;
  }
  const { request } = event;

  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    let responseToCache;
    if (navigator.onLine) {
      event.waitUntil(
        fetch(request)
          .then((response) => {
            if (url.pathname.includes("/endpoint/")) {
              return response.text().then((data) => {
                if (data) {
                  return caches.open(dynamicCacheName).then((cache) => {
                    cache.put(request, new Response(data));
                    responseToCache = new Response(data);
                    return response;
                  });
                }
              });
            } else {
              responseToCache = response.clone();
              return response;
            }
          })
      );
    } else if (url.pathname.includes("/endpoint/")) {
      console.log("no internet");
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          responseToCache = cachedResponse;
          return cachedResponse;
        })
      );
    }
  }
});


async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? (await fetch(request));
}
