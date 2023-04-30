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
  const questionAnswers = createElem("div", "question__answers");
  question.answers.forEach((answer) => {
    questionAnswers.appendChild(createAnswerElem(answer));
  });
  questionContainer.append(questionText, questionAnswers);
  return questionContainer;
};

const finishTest = () => {
  clearPage();
  mainContainer.innerHTML = startPage;
};

const generateTestPage = (test) => {
  const testContainer = createElem("div", "test");
  const testHeader = createElem("h1", "test__header", test.topic);
  const testQuestions = createElem("div", "test__questions");
  const finishButton = createElem("button", "button", "Finish test");

  test.questions.forEach((question) => {
    testQuestions.appendChild(createQuestionElem(question));
  });

  finishButton.addEventListener("click", finishTest);

  testContainer.append(testHeader, testQuestions, finishButton);
  mainContainer.appendChild(testContainer);
};

const clearPage = () => {
  mainContainer.innerHTML = "";
};

const startTest = async () => {
  const code = codeInput.value;
  const test = JSON.parse(await database.testController.get(code))[0];
  clearPage();
  generateTestPage(test);
};

startButton.addEventListener("click", startTest);
