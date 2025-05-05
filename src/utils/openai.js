// src/utils/openai.js

export async function askOpenAI(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error:", error);
      throw new Error("OpenAI request failed");
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error("AI fetch error:", err);
    return "Sorry, something went wrong while contacting the AI.";
  }
}
