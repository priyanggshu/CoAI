import { PrismaClient } from "@prisma/client";
import { redisClient } from "../config/redis.js";
import {
  queryDeepseek,
  queryGemini,
  queryQwen,
  queryMistral,
  queryMeta,
  queryNvidia,
  mergeResponses,
} from "../services/ai_Services.js";

const prisma = new PrismaClient();

export const AIResponseController = async (req, res) => {
  const { message, aiServicePreference } = req.body;
  const userId = req.user?.id;
  const cacheKey = `chat:${aiServicePreference}:${message}`;
  console.log("Request received at /ai/query");
  console.log("aiServicePreference:", aiServicePreference);
  console.log("message:", message);
  
  if (!userId || !message || !aiServicePreference) {
    console.error("❌ Error: Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  try {
    const aiService = await prisma.aIService.findUnique({
      where: { name: aiServicePreference },
    });

    console.log(`Ai service found from supabase table: ${aiServicePreference}`)
    if (!aiService) {
      console.error(`AI Service not found in database`);
      return res.status(404).json({ error: "AI Service not found in database" });
    }

    const cacheResponse = await redisClient.get(cacheKey);
    if (cacheResponse) {
      console.log("Cache HIT - Raw:", cacheResponse);
      console.log("Cache HIT - Parsed:", JSON.parse(cacheResponse));
      return res.json({ fromCache: true, response: JSON.parse(cacheResponse) });
    }

    let aiResponse;
    
    switch (aiServicePreference) {
      case "Deepseek":
        aiResponse = await queryDeepseek(message);
        break;
      case "Gemini":
        aiResponse = await queryGemini(message);
        break;
      case "Qwen":
        aiResponse = await queryQwen(message);
        break;
      case "Mistral":
        aiResponse = await queryMistral(message);
        break;
      case "Meta":
        aiResponse = await queryMeta(message);
        break;
      case "Nvidia":
        aiResponse = await queryNvidia(message);
        break;
      case "All in one Fusion":
        const aiResults = await Promise.allSettled([
          queryNvidia(message),
          queryDeepseek(message),
          queryGemini(message),
          queryMistral(message),
          queryQwen(message),
          queryMeta(message),
        ]);
        aiResponse = mergeResponses(aiResults);
        if (!aiResponse) {
          return res
            .status(500)
            .json({ error: "No valid AI responses received." });
        }
        break;
      default:
        return res.status(400).json({ error: "Invalid AI service preference" });
    }

    if (!aiResponse) {
      return res.status(500).json({ error: "AI response was null or invalid" });
    }

    await redisClient.set(cacheKey, JSON.stringify(aiResponse), { EX: 3600 });
    console.log("Caching aiResponse:", aiResponse); // 1

    await prisma.conversation.create({
      data: {
        userId,
        aiServiceId: aiService.id,
        messages: [
          {
            sender: "user",
            content: message,
            timestamp: new Date().toISOString(),
          },
          {
            sender: "AI",
            content: aiResponse,
            timestamp: new Date().toISOString(),
          },
        ],
      },
    });

    res.json({ response: aiResponse, fromCache: false });
  } catch (error) {
    console.error("AI Query error:", error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export const getAvailableAIController = async (req, res) => {
  try {
    const aiServices = await prisma.aIService.findMany({
      where: { status: "active" },
    });
    if (aiServices.length === 0) {
      return res.status(404).json({ error: "No AI services found" });
    } else {
      res.status(200).json({ services: aiServices });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server error" });
  }
};
