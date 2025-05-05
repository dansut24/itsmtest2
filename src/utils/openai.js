// src/utils/openai.js

export const askOpenAI = async (prompt) => {
  try {
    const response = await fetch("/api/ask-openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error("API call failed");
    }

    const data = await response.json();
    return data.reply || "No response from AI.";
  } catch (error) {
    console.error("OpenAI request error:", error);
    return "Sorry, something went wrong while contacting the AI.";
  }
};
