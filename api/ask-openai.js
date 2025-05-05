// /api/ask-openai.js

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    const reply = chatResponse.choices[0]?.message?.content?.trim();

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ error: "Failed to contact OpenAI" });
  }
}
