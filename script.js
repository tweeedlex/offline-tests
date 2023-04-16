const jokeList = document.getElementById("jokeList");
const refreshButton = document.getElementById("refreshButton");

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").then(
      (registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      },
      (err) => {
        console.log("Service Worker registration failed:", err);
      }
    );
  });
}

// Service Worker message event listener
navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data.command === "updateJokes") {
    jokeList.innerHTML = "";
    event.data.jokes.forEach((joke) => {
      jokeList.innerHTML += "<li>" + joke + "</li>";
    });
  }
});

// Fetch random jokes and cache them for offline use
if ("caches" in window) {
  caches.open("jokes-v1").then((cache) => {
    cache.match("jokes").then((response) => {
      if (response) {
        // Cached jokes found - update UI
        response.json().then((data) => {
          jokeList.innerHTML = "";
          data.forEach((joke) => {
            jokeList.innerHTML += "<li>" + joke + "</li>";
          });
        });
      } else {
        // No cached jokes found - fetch new jokes and cache them
        const jokes = [];
        for (let i = 0; i < 10; i++) {
          fetch("https://api.chucknorris.io/jokes/random")
            .then((response) => response.json())
            .then((data) => {
              jokes.push(data.value);
              if (jokes.length === 10) {
                cache.put("jokes", new Response(JSON.stringify(jokes)));
                console.log("Jokes cached!");
              }
            })
            .catch((err) => console.log("Error caching joke:", err));
        }
      }
    });
  });
}
