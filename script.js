import database from "./database.js";

await database.result.get();
await database.test.get();
await database.user.get();

const button = document.querySelector("button");

button.addEventListener("click", async () => {
  const res = await database.user.get();
  console.log(res);
});

const insertButton = document.querySelector("#insert");

insertButton.addEventListener("click", async () => {
  const res = await database.user.insertOne(`${Math.random() * 1000}`, "test", "test");
  console.log(res)
});
