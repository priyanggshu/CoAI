import { PrismaClient } from "@prisma/client";
import { redisClient } from "../config/redis.js";
import axios from "axios";
import {
  queryOpenAI,
  queryGemini,
  queryPerplexity,
  queryBolt,
  queryDeepseek,
  queryClaude,
  queryGrok,
  queryHuggingFace,
} from "../services/ai_Services.js";

const prisma = new PrismaClient();

export const AIResponseController = async (req, res) => {
  const { userId, message, aiServicePreference } = req.body;

  try {
    const cacheKey = `ai:${userId}:${message}`;
    const cacheResponse = await redisClient.get(cacheKey);

    if (cacheResponse) {
      return res.json({ fromCache: true, response: JSON.parse(cacheResponse) });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    let responses = await Promise.all([
      aiServicePreference === "OpenAI" || !aiServicePreference ? queryOpenAI(message) : null,
      aiServicePreference === "Gemini" || !aiServicePreference ? queryGemini(message) : null,
      aiServicePreference === "Perplexity" || !aiServicePreference ? queryPerplexity(message) : null,
      aiServicePreference === "Deepseek" || !aiServicePreference ? queryDeepseek(message) : null,
      aiServicePreference === "Bolt" || !aiServicePreference ? queryBolt(message) : null,
      aiServicePreference === "Claude" || !aiServicePreference ? queryClaude(message) : null,
      aiServicePreference === "Grok" || !aiServicePreference ? queryGrok(message) : null,
      aiServicePreference === "HuggingFace" || !aiServicePreference ? queryHuggingFace(message) : null,
    ]);

    const mergedResponse = mergeResponses(responses);
    if (!mergedResponse) {
      return res.status(500).json({ error: "All AI services failed." });
    }

    await redisClient.set(cacheKey, JSON.stringify(mergedResponse), "EX", 600);

    await prisma.conversation.create({
      data: {
        userId,
        aiService: aiServicePreference || "Multiple",
        messages: { request: message, response: mergeResponses },
      },
    });

    res.json({ response: mergedResponse });
  } catch (error) {
    console.error("Query AI error:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const getAvailableAIController = async (req, res) => {
  try {
    const aiServices = await prisma.aIService.findMany({
      where: { status: "active" },
    });
    if (!aiServices) {
      return;
    } else {
      res.status(203).json({ services: aiServices });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};
