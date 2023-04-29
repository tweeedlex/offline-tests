import database from "./database.js";

const codeInput = document.getElementById("code");
const startButton = document.getElementById("start");

const mainContainer = document.querySelector(".main__container");
const startPage = mainContainer.innerHTML;

const createElem = (tag, className, innerHTML = "") => {
  const elem = document.createElement(tag);
  elem.classList.add(className);
  elem.innerHTML = innerHTML;
  return elem;
};

const createAnswerElem = (answer) => {
  const answerContainer = createElem("div", "answer");
  const answerText = createElem("p", "answer__text", answer.text);
  const answerCheckbox = createElem("input", "answer__checkbox");
  answerCheckbox.setAttribute("type", "checkbox");
  answerContainer.append(answerText, answerCheckbox);
  return answerContainer;
};

const createQuestionElem = (question) => {
  const questionContainer = createElem("div", "question");
  const questionText = createElem("p", "question__text", question.text);
  const questionAnswers = createElem("div", "question__answers");
  question.answers.forEach((answer) => {
    questionAnswers.appendChild(createAnswerElem(answer));
  });
  questionContainer.append(questionText, questionAnswers);
  return questionContainer;
};

const generateTestPage = (test) => {
  const testContainer = createElem("div", "test");
  const testHeader = createElem("h1", "test__header", test.topic);
  const testQuestions = createElem("div", "test__questions");

  test.questions.forEach((question) => {
    testQuestions.appendChild(createQuestionElem(question));
  });

  testContainer.append(testHeader, testQuestions);
  mainContainer.appendChild(testContainer);
};

const clearPage = () => {
  mainContainer.innerHTML = "";
};

const startTest = async () => {
  const code = codeInput.value;
  const test = JSON.parse(await database.testController.get(code))[0];
  console.log(test);
  clearPage();
  generateTestPage(test);
};

startButton.addEventListener("click", startTest);
