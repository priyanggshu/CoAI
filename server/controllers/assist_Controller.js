import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import { exec } from "child_process";
import { redisClient } from "../config/redis.js";
import { PrismaClient } from "@prisma/client";

// Voice Controller (TTS )
export const synthesizeSpeech = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });
    
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    dotenv.config();

    const response = await axios.post("https://api-inference.huggingface.co/models/espnet/fastspeech2_en_ljspeech",
      { inputs: text },
      { headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`},
        responseType: "blob",
      }
    );

    if(!response.data) {
      return res.status(500).json({ error: "TTS conversion failed" });
    }

    const outputFilePath = `uploads/output-${Date.now()}.wav`;
    fs.writeFileSync(outputFilePath, Buffer.from(response.data));

    res.json({
      audioUrl: `${process.env.BACKEND_URL}/${outputFilePath}`,
    });
  } catch (error) {
    console.error("TTS Error:", error.message);
    res.status(500).json({ error: "Text-to-speech failed" });
  }
};

// Tracks and ensures alerting when service-limit exceeds
const prisma = new PrismaClient();

export const checkLimitsController = async (req, res) => {
  try {
    const services = await prisma.aIService.findMany();
    let alert = [];

    for (const service of services) {
      const usageCount = (await redisClient.get(`usage:${service.name}`)) || 0;
      const limit = service.freeTierLimit || 1000; // Default limit if not set

      if (usageCount >= limit) {
        alert.push({
          service: service.name,
          message: `Free limit reached! Try ${getAlternativeService(
            service.name
          )}`,
        });
      }
    }

    if (alert.length === 0) {
      return res.json({ message: "All services are within free limits." });
    }
    res.json({ alert });
  } catch (error) {
    res.status(500).json({ error: "Error checking service limits" });
  }
};

const getAlternativeService = (serviceName) => {
  const alternatives = {
    chatGPT: "Try Google Gemini or Claude",
    "Google Gemini": "Use Perplexity AI",
    Claude: "Try Bolt.new or Hugging Face",
    "Perplexity AI": "Use ChatGPT free-tier",
  };

  return alternatives[serviceName] || "Explore other AI models";
};

// AI based smart recommendation
export const saveUserQueryController = async (req, res) => {
  // function to save user queries
  const { userId, query } = req.body;

  if (!userId || !query) {
    return res.status(400).json({ error: "Missing user ID or query " });
  }

  try {
    await redisClient.lPush(`user:${userId}:queries`, query);
    await redisClient.lTrim(`user:${userId}:queries`, 0, 9); // keep last 10 queries

    res.status(201).json({ message: "Query saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving query" });
  }
};

export const getRecommendationsController = async (req, res) => {
  // Function to generate recommendations
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing user ID" });
  }

  try {
    const recentQueries = await redisClient.lRange(
      `user:${userId}:queries`,
      0,
      -1
    );
    if (recentQueries.length === 0) {
      return res.json({
        recommendations: [
          "Try asking about AI models!",
          "Explore trending AI topics!",
        ],
      });
    }

    const recommendations = generateTopicSuggestions(recentQueries);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: "Error fetching recommendations" });
  }
};

const generateTopicSuggestions = (queries) => {
  // generates topic suggestions based on queries
  let suggestions = [];
  if (queries.some((q) => q.toLowerCase().includes("code"))) {
    suggestions.push("Try 'AI code generation'", "Ask about debugging with AI");
  }
  if (queries.some((q) => q.toLowerCase().includes("health"))) {
    suggestions.push(
      "Explore AI in healthcare",
      "Check AI-powered medical diagnosis tools"
    );
  }
  if (suggestions.length === 0) {
    suggestions = ["Discover latest AI trends"];
  }
  return suggestions;
};

//Multiple AI responses aggregator
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

const queryOpenAI = async (promp) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    return "Error fetching from OpenAI";
  }
};

const queryGemini = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
      { prompt: { text: prompt } }
    );
    return response.data.candidates[0]?.output || "Error fetching from Gemini";
  } catch (error) {
    return "Error fetching from Gemini";
  }
};

const queryPerplexity = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.perplexity.ai/v1/answer",
      { query: prompt },
      { headers: { Authorization: `Bearer ${PERPLEXITY_API_KEY}` } }
    );
    return response.data.answer || "Error fetching from Perplexity";
  } catch (error) {
    return "Error fetching from Perplexity";
  }
};

const mergeResponses = (responses) => {
  const filteredResponses = responses.filter((res) => !res.includes("Error"));
  if (filteredResponses.length === 0) return "All AI services failed.";
  return filteredResponses.join("  |  ");
};

export const fetchAndMergeResponses = async (req, res) => {
  const { prompt } = req.body;

  const responses = await Promise.all([
    queryOpenAI(prompt),
    queryGemini(prompt),
    queryPerplexity(prompt),
  ]);

  const mergedResponse = mergeResponses(responses);

  return res.json({ mergedResponse, individualResponses: responses });
};
