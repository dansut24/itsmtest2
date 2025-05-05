// src/utils/openai.js

export async function askOpenAI(prompt) {
  try {
    const response = await fetch("/api/ask-openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.content || "No response from AI.";
  } catch (error) {
    console.error("Error talking to AI:", error);
    return "Sorry, something went wrong while contacting the AI.";
  }
}
