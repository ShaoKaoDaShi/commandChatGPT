import { ChatGPTAPI } from "chatgpt";
import inquirer from "inquirer";
import chalk from "chalk";
import dotenv from 'dotenv'
import { remark } from 'remark'
import stripMarkdown from 'strip-markdown'
const env = dotenv.config();

// let api;

// init();

export  function init() {
  // await setChatKeyFromUser();
  return getChatApi();
  // await chatWithGPT();
}

// async function setChatKeyFromUser() {
//   const userInput = await getUserInput("chatKey", "Enter your chat key:");
//   process.env.OPENAI_API_KEY = userInput.chatKey;
// }

function getChatApi() {
  const api = new ChatGPTAPI({
    apiKey: env.parsed.OPENAI_API_KEY,
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

async function getAnswerFromChatGPT(message, lastRes, api) {
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
    if (question === "exit()") return;

    const answer = await getAnswerFromChatGPT(question, lastRes);
    lastRes = answer;
    console.log(chalk.green(`A: ` + answer.text));
  }
}
function markdownToText(markdown) {
  return remark()
    .use(stripMarkdown)
    .processSync(markdown ?? '')
    .toString()
}
export function initReply(api) {
  let lastRes;
  return async function(question){
    const answer = await getAnswerFromChatGPT(question, lastRes, api);
    lastRes = answer;
    console.log(chalk.blue(`bot: ` + answer.text));

    return markdownToText(answer.text)
  }

}