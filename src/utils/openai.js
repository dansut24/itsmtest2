const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askOpenAI(prompt) {
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

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't get that.";
  } catch (error) {
    console.error("OpenAI request failed:", error);
    return "Something went wrong talking to the AI.";
  }
}
