import { exec } from "child_process";
import fs from "fs";
import axios from "axios";

import { redisClient } from "../config/redis.js";
import { PrismaClient } from "@prisma/client";

// Voice Controllers (TTS && STT )
export const transcribeAudio = async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const selectedAIService = req.body.selectedAIService;
    const userId = req.user?.id;

    if(!selectedAIService) {
        return res.status(400).json({ error: "AI service not selected" });
    }

    const uploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      buffer,
      {
        headers: {
          Authorization: process.env.ASSEMBLYAI_API_KEY,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    const uploadUrl = uploadResponse.data.upload_url;

    const transcriptResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: uploadUrl },
      {
        headers: {
          Authorization: process.env.ASSEMBLYAI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const transcriptId = transcriptResponse.data.id;

    let transcription = "";
    let completed = false;
    while (!completed) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pollingRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            Authorization: process.env.ASSEMBLYAI_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      if (pollingRes.data.status === "completed") {
        transcription = pollingRes.data.text;
        completed = true;
      } else if (pollingRes.data.status === "error") {
        throw new Error("AssemblyAI transcription failed");
      }
    }

    const aiResponseRes = await axios.post(
        `${process.env.BACKEND_URL}/ai/query`,
        {
            message: transcription,
            aiServicePreference: selectedAIService,
        },
        {
            headers: {
                Authorization: req.headers.authorization,
            },
        }
    );

    const aiText = aiResponseRes.data.response;

    const safeText = aiText.replace(/[^a-zA-Z0-9 .,!?]/g, "");
    const outputFilePath = `output-${Date.now()}.wav`;

    exec(`espeak-ng -w ${outputFilePath} "${safeText}"`, (error) => {
        if(error) {
            return res.status(500).json({ error: "Text-to-speech conversion failed" });
        }
    });

    res.json({ transcription, aiResponse: aiText, audioFile: outputFilePath });
  } catch (error) {
    console.error("STT Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const synthesizeSpeech = async (req, res) => {
  try {
    const { text } = req.body;
    const outputFilePath = `output-${Date.now()}.wav`;

    const safeText = text.replace(/[^a-zA-Z0-9 .,!?]/g, "");
    exec(`espeak-ng -w ${outputFilePath} "${safeText}"`, (error) => {
      if (error) {
        return res.status(500).json({ error: "Text-to-speech conversion failed" });
      }

      res.download(outputFilePath, () => {
        fs.unlinkSync(outputFilePath); // delete temp file after sending
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
