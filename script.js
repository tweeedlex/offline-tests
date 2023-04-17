import database from "./database.js";

const saveTests = async () => {
  try {
    const tests = await database.test.get();
    if (tests) {
      localStorage.setItem("tests", JSON.stringify(tests));
    } else {
      console.log("Offline");
    }
  } catch (e) {
    console.log("Error, offline");
    console.log(e)
  }
}

await saveTests();

console.log(localStorage.getItem("tests"));