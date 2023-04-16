const APP_ID = "offline-tests-iiwtm";
const ATLAS_SERVICE = "mongodb-atlas";
const app = new Realm.App({ id: APP_ID });

const loginIntoApp = async () => {
  const credentials = Realm.Credentials.apiKey(
    "WiwuvA0z3s0dwXGicdpldfi5PHEziaoWnDR5bWd6GxCqp8LUcj4uZjWH7mdVx4WO"
  );
  try {
    const user = await app.logIn(credentials);
  } catch (err) {
    console.error("Failed to log in", err);
  }
};

let mongodb;

window.onload = async () => {
  await loginIntoApp();
  mongodb = app.currentUser.mongoClient(ATLAS_SERVICE);
  await getFunctionsTest();
};


const testController = {
  insertOne: async (topic, questions) => {
    const data = {
      topic,
      questions,
    };
    const response = await mongodb
      .db("offline-tests")
      .collection("tests")
      .insertOne(data);
    return response;
  },
  get: async (userId) => {
    let result;
    if (userId) {
      result = await mongodb
        .db("offline-tests")
        .collection("tests")
        .find({ userId })
    } else {
      result = await mongodb
        .db("offline-tests")
        .collection("tests")
        .find({})
    }
    return result;
  },
};

const userController = {
  insertOne: async (name, password, group) => {
    const data = {
      name,
      password,
      group,
    };

    const response = await mongodb
      .db("offline-tests")
      .collection("users")
      .insertOne(data);
    return response;
  },
  get: async (userId) => {
    let result;

    if (userId) {
      result = await mongodb
        .db("offline-tests")
        .collection("users")
        .findOne({ id: userId });
    } else {
      result = await mongodb
        .db("offline-tests")
        .collection("users")
        .find({})
    }

    return result;
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

    const response = await mongodb
      .db("offline-tests")
      .collection("results")
      .insertOne(data);
    return response;
  },
  get: async (userId, testId) => {
    let result;
    if (userId && !testId) {
      result = await mongodb
        .db("offline-tests")
        .collection("results")
        .findAll({ userId });
    }
    if (!userId && testId) {
      result = await mongodb
        .db("offline-tests")
        .collection("results")
        .findAll({ testId });
    }
    if (userId && testId) {
      result = await mongodb
        .db("offline-tests")
        .collection("results")
        .findAll({ userId, testId });
    }
    if (!userId && !testId) {
      result = await mongodb
        .db("offline-tests")
        .collection("results")
        .find({})
    }
    return result;
  },
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