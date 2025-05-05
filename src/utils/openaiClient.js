// src/utils/openaiClient.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const sendMessageToOpenAI = async (messages) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages.map(m => ({ role: m.role, content: m.text })),
  });

  const reply = response.data.choices[0].message.content.trim();
  return reply;
};
