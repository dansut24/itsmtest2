// src/utils/openaiclient.js

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    console.error("Missing OpenAI API key.");
    return "OpenAI API key is not set.";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return "There was an error from the AI service.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "AI did not return a response.";
  } catch (error) {
    console.error("Failed to connect to OpenAI:", error);
    return "Failed to reach OpenAI.";
  }
}
