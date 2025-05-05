// src/utils/openaiClient.js

export const sendMessageToOpenAI = async (messages) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.text,
      })),
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "No response from AI.";
};
