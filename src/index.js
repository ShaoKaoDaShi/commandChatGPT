import { ChatGPTAPI } from "chatgpt";
import inquirer from "inquirer";
import chalk from "chalk";

let api;

init();

async function init() {
  await setChatKeyFromUser();
  api = getChatApi();
  await chatWithGPT();
}

async function setChatKeyFromUser() {
  const userInput = await getUserInput("chatKey", "Enter your chat key:");
  process.env.OPENAI_API_KEY = userInput.chatKey;
}

function getChatApi() {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    debug: false,
  });
  return api;
}

async function getUserInput(name = "question", message = "Q:") {
  var userInput = await inquirer.prompt([
    {
      type: "input",
      name,
      message,
    },
  ]);
  return userInput;
}

async function getAnswerFromChatGPT(message, lastRes) {
  const res = await api.sendMessage(message, {
    conversationId: lastRes?.conversationId,
    parentMessageId: lastRes?.id,
    // onProgress: (partialResponse) => console.log(partialResponse.text)
    timeoutMs: 2 * 60 * 1000,
  });

  return res;
}

async function chatWithGPT() {
  let lastRes;
  while (true) {
    var userInput = await getUserInput();
    var question = userInput.question;
    console.log("🚀 ~ file: index.js:55 ~ chatWithGPT ~ question  ", question)
    if (question === "exit()") return;

    const answer = await getAnswerFromChatGPT(question, lastRes);
    lastRes = answer;
    console.log(chalk.green(`A: ` + answer.text));
  }
}