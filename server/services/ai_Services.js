import axios from "axios";

// API keys for all of the services
const API_KEYS = {
  OPENAI: process.env.OPENAI_API_KEY,
  GEMINI: process.env.GEMINI_API_KEY,
  PERPLEXITY: process.env.PERPLEXITY_API_KEY,
  DEEPSEEK: process.env.DEEPSEEK_API_KEY,
  BOLT: process.env.BOLT_API_KEY,
  CLAUDE: process.env.CLAUDE_API_KEY,
  GROK: process.env.GROK_API_KEY,
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
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${API_KEYS.GEMINI}`,
      { prompt: { text: prompt } }
    );
    return response.data.candidates?.[0]?.output || null;
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return null;
  }
};

// Query Perplexity
export const queryPerplexity = async (prompt) => {
  try {
    const response = await axios.post(
      "http://api.perplexity.ai/v1/answer",
      { query: prompt },
      { headers: { Authorization: `Bearer ${API_KEYS.PERPLEXITY}` } }
    );
    return response.data.answer || null;
  } catch (error) {
    console.error("Perplexity Error:", error.message);
    return null;
  }
};

// Query Deepseek
export const queryDeepseek = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/generate",
      { query: prompt },
      { headers: { Authorization: `Bearer ${API_KEYS.DEEPSEEK}` } }
    );
    return response.data.result || null;
  } catch (error) {
    console.error("Deepseek Error:", error.message);
    return null;
  }
};

// Query Bolt.new
export const queryBolt = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.bolt.new/v1/query",
      { prompt },
      { headers: { Authorization: `Bearer ${API_KEYS.BOLT}` } }
    );
    return response.data.output || null;
  } catch (error) {
    console.error("Bolt.new Error :", error.message);
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

// Query Grok
export const queryGrok = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.grok.x.com/v1/query",
      { prompt },
      { headers: { Authorization: `Bearer ${API_KEYS.GROK}` } }
    );
    return response.data.response || null;
  } catch (error) {
    console.error("Grok Error:", error.message);
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
  const validResponses = response.filter((res) => res !== null);
  if (validResponses.length === 0) return "All AI services failed.";
  return validResponses.join(" | ");
};
