import axios from "axios";

// API keys for all of the services
const API_KEYS = {
  OPENAI: process.env.OPENAI_API_KEY,
  GEMINI: process.env.GEMINI_API_KEY,
  CLAUDE: process.env.CLAUDE_API_KEY,
  HUGGINGFACE: process.env.HUGGINGFACE_API_KEY,
};

// Query OpenAI GPT-4
export const queryOpenAI = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      { model: "gpt-4", messages: [{ role: "user", content: prompt }] },
      { headers: { Authorization: `Bearer ${API_KEYS.OPENAI}` } }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    return null;
  }
};

// Query Google Gemini
export const queryGemini = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEYS.GEMINI}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
            role: "user",
          },
        ],
      }
    );
    return response.data.candidates?.[0]?.output || null;
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return null;
  }
};

// Query Claude AI
export const queryClaude = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/complete",
      {
        model: "claude-2",
        prompt: `Human: ${prompt}\nAssistant:`,
        max_tokens: 512,
      },
      {
        headers: {
          "x-api-key": API_KEYS.CLAUDE,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
      }
    );
    return response.data.completion || null;
  } catch (error) {
    console.error("Claude AI Error:", error.message);
    return null;
  }
};

// Query Hugging Face Inference API
export const queryHuggingFace = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-3B",
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${API_KEYS.HUGGINGFACE}` } }
    );
    return response.data.generated_text || null;
  } catch (error) {
    console.error("Hugging Face Error:", error.message);
    return null;
  }
};

export const mergeResponses = (response) => {
  const validResponses = response
    .filter(res => res.status === "fulfilled" && res.value)
    .map(res => res.value);

  if (validResponses.length === 0) return null;
  return validResponses.join(" | ");
};
