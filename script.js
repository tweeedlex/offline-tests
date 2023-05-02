import database from "./database.js";

const mainContainer = document.querySelector(".main__container");
const logo = document.querySelector(".logo");
const startPage = mainContainer.innerHTML;

const createElem = (tag, className, innerHTML = "") => {
  const elem = document.createElement(tag);
  elem.classList.add(className);
  elem.innerHTML = innerHTML;
  return elem;
};

const createAnswerElem = (answer) => {
  const answerContainer = createElem("div", "answer");
  const answerId = `answer-${Math.floor(Math.random() * 1000000)}`; // generate unique id
  const answerCheckbox = createElem("input", "answer__checkbox");
  answerCheckbox.setAttribute("type", "checkbox");
  answerCheckbox.setAttribute("id", answerId);
  const answerText = createElem("label", "answer__text");
  answerText.setAttribute("for", answerId);
  answerText.innerText = answer.text;
  answerContainer.append(answerCheckbox, answerText);
  return answerContainer;
};

const createQuestionElem = (question) => {
  const questionContainer = createElem("div", "question");
  const questionText = createElem("p", "question__text", question.text);
  const questionImg = createElem("img", "question__img");
  questionImg.setAttribute("src", question.img);
  const questionAnswers = createElem("div", "question__answers");
  question.answers.forEach((answer) => {
    questionAnswers.appendChild(createAnswerElem(answer));
  });
  questionContainer.append(questionImg, questionText, questionAnswers);
  return questionContainer;
};

const generateTestPage = (test) => {
  const testContainer = createElem("div", "test");
  const testHeader = createElem("h1", "test__header", test.topic);
  const testQuestions = createElem("div", "test__questions");
  const finishButton = createElem("button", "button", "Finish test");
  finishButton.classList.add("finish-button")

  test.questions.forEach((question) => {
    console.log(question)
    testQuestions.appendChild(createQuestionElem(question));
  });

  finishButton.addEventListener("click", finishTest);

  testContainer.append(testHeader, testQuestions, finishButton);
  return testContainer;
};

const clearPage = () => {
  mainContainer.innerHTML = "";
};

window.addEventListener("hashchange", async () => {
  console.log(location.hash, location.hash.includes("#test"));
  if (location.hash === "#start") {
    mainContainer.innerHTML = startPage;
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", startTest);
  }
  if (location.hash.includes("#test")) {
    const testId = location.hash.split("#test")[1];
    const test = JSON.parse(await database.testController.get(testId))[0];
    const testContainer = generateTestPage(test);
    clearPage();
    mainContainer.appendChild(testContainer);
  }
});

const startTest = async () => {
  const codeInput = document.getElementById("code");
  const code = codeInput.value;
  location.hash = `#test${code}`;
};

const finishTest = () => {
  location.hash = "#start";
};

logo.addEventListener("click", () => (location.hash = "#start"));
const startButton = document.getElementById("start");
startButton.addEventListener("click", startTest);
