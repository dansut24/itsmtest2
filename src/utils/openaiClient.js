import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const askOpenAI = async (message) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI error:", error?.response?.data || error.message);
    return "Sorry, something went wrong with AI.";
  }
};
