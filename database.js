const enableOfflineMode = () => {
  const offlineLabel = document.getElementById("offline");
  offlineLabel.innerHTML = "Offline mode. Couldn't connect to db";
};

const APP_ID = "offline-tests-iiwtm";
const ATLAS_SERVICE = "mongodb-atlas";
let app;
try {
  app = new Realm.App({ id: APP_ID });
} catch (e) {
  enableOfflineMode();
}

const loginIntoApp = async () => {
  const credentials = Realm.Credentials.apiKey(
    "WiwuvA0z3s0dwXGicdpldfi5PHEziaoWnDR5bWd6GxCqp8LUcj4uZjWH7mdVx4WO"
  );
  try {
    const user = await app.logIn(credentials);
  } catch (err) {
    console.log("Failed to log in", err);
  }
};

let mongodb;
await loginIntoApp();
mongodb = app.currentUser.mongoClient(ATLAS_SERVICE);

const testController = {
  insertOne: async (topic, questions) => {
    const code = Math.random().toString(36).substr(2, 5);
    const data = {
      topic,
      code,
      questions,
    };
    try {
      const response = await mongodb
        .db("offline-tests")
        .collection("tests")
        .insertOne(data);
      return response;
    } catch (e) {
      console.log(e);
    }
  },
  get: async (code, userId) => {
    try {
      const response = await fetch(
        `https://eu-central-1.aws.data.mongodb-api.com/app/offline-tests-iiwtm/endpoint/test${
          userId ? `?userId=${userId}` : ""
        }${code ? `?code=${code}` : ""}`
      );
      const result = await response.text();
      return result;
    } catch (e) {
      console.log(e);
    }
  },
};

const userController = {
  insertOne: async (name, password, group) => {
    const data = {
      name,
      password,
      group,
    };
    try {
      const response = await mongodb
        .db("offline-tests")
        .collection("users")
        .insertOne(data);
      return response;
    } catch (e) {
      console.log(e);
    }
  },
  get: async (userId) => {
    try {
      const response = await fetch(
        `https://eu-central-1.aws.data.mongodb-api.com/app/offline-tests-iiwtm/endpoint/user${
          userId ? `?userId=${userId}` : ""
        }`
      );
      const result = await response.text();
      return result;
    } catch (e) {
      console.log(e);
    }
  },
};

const resultController = {
  insertOne: async (userId, testId, mark, time) => {
    const data = {
      userId,
      testId,
      mark,
      time,
    };
    try {
      const response = await mongodb
        .db("offline-tests")
        .collection("results")
        .insertOne(data);
      return response;
    } catch (e) {
      console.log(e);
    }
  },
  get: async (userId, testId) => {
    try {
      const response = await fetch(
        `https://eu-central-1.aws.data.mongodb-api.com/app/offline-tests-iiwtm/endpoint/result${
          (userId ? `?userId=${userId}` : "", testId ? `?testId=${testId}` : "")
        }`
      );
      const result = await response.text();
      return result;
    } catch (e) {
      console.log(e);
    }
  },
};

export default {
  testController,
  userController,
  resultController,
};

const insertFunctionsTest = async () => {
  const testResponse = await testController.insertOne("Great Britain", [
    {
      question: "What is the capital of Great Britain?",
      answers: [
        { value: "London", isRight: true, image: "" },
        { value: "Berlin", isRight: false, image: "" },
        { value: "Kyiv", isRight: false, image: "" },
      ],
    },
  ]);
  const userResponse = await userController.insertOne(
    "Volodymyr Antoniuk",
    "125923",
    "10-A"
  );
  const resultResponse = await resultController.insertOne(
    userResponse.insertedId,
    testResponse.insertedId,
    11,
    120
  );
  console.log("Test results: ", testResponse, userResponse, resultResponse);
};

const getFunctionsTest = async () => {
  const tests = await testController.get();
  const users = await userController.get();
  const results = await resultController.get();
  console.log("Get results: ", tests, users, results);
};
