import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // required when used client-side
});

export async function askOpenAI(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI error:", error);
    return "No response from AI.";
  }
}
