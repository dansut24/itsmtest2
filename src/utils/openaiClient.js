export const sendMessageToOpenAI = async (messages) => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages.map((m) => ({
          role: m.role,
          content: m.text,
        })),
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    }

    if (data.error) {
      return `Error: ${data.error.message}`;
    }

    return "No response from AI.";
  } catch (error) {
    console.error("OpenAI error:", error);
    return "Error communicating with AI.";
  }
};
