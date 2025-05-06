import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// API keys
const API_KEYS = {
  DEEPSEEK: process.env.DEEPSEEK_V3_0324,
  GEMINI: process.env.GEMINI_API_KEY,
  QWEN: process.env.QWEN_QWQ_32B,
  MISTRAL: process.env.MISTRAL_S_31_24B,
  META: process.env.META_LLAMA_31_8B,
  NVIDIA: process.env.NVIDIA,
};

// Query Deepseek V3-0324
export const queryDeepseek = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEYS.DEEPSEEK}`,
          "Content-Type": "application/json",
          "X-Title": "CoAI Chat",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "DeepSeek V3 Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return "Sorry, I couldn't generate a response at the moment. Please try again later.";
  }
};

// Query Google Gemini
const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI);

export const queryGemini = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text || null;
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return null;
  }
};

//  Query Qwen QWB
export const queryQwen = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwq-32b:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEYS.QWEN}`,
          "Content-Type": "application/json",
          "X-Title": "CoAI Chat",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Qwen QWQ 32B Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return "Sorry, I couldn't generate a response at the moment. Please try again later.";
  }
};


// Query Mistral
export const queryMistral = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-small-3.1-24b-instruct:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEYS.MISTRAL}`,
          "Content-Type": "application/json",
          "X-Title": "CoAI Chat",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Mistral 3.1 24B Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return "Sorry, Mistral couldn't respond at the moment. Please try again later.";
  }
};


// Query Meta
export const queryMeta = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEYS.META}`,
          "Content-Type": "application/json",
          "X-Title": "CoAI Chat",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Meta Llama 3.1 8B Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return "Sorry, Meta Llama couldn't respond at the moment. Please try again later.";
  }
};

// Query Nvidia
export const queryNvidia = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
        messages: [{ role: "user", content: `Please respond concisely. ${prompt}` }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEYS.NVIDIA}`,
          "Content-Type": "application/json",
          "X-Title": "CoAI Chat",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Nvidia Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return "Sorry, Nvidia couldn't respond at the moment. Please try again later.";
  }
};

export const mergeResponses = (response) => {
  const validResponses = response
    .filter(res => res.status === "fulfilled" && res.value)
    .map((res, idx) => `AI ${idx + 1}: ${res.value.trim()}`);

  if (validResponses.length === 0) return null;
  return validResponses.join("\n\n---\n\n");
};
