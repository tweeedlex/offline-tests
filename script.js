import database from "./database.js";

await database.result.get()
await database.test.get()
await database.user.get()

window.addEventListener("fetch", (event) => {
  console.log(event.request);
})