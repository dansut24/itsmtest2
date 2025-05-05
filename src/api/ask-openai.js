// api/ask-openai.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful IT support assistant." },
        { role: "user", content: prompt }
      ]
    });

    const aiMessage = completion.choices[0].message.content.trim();
    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
