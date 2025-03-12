import { Prisma, PrismaClient } from "@prisma/client";
import { redisClient } from "../config/redis.js";
import axios from "axios";

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

    const apiKeys = user.apiKeys || {};
    const aiServices = await prisma.aIService.findMany({
      where: { status: "active" },
    });

    if (!aiServices.length)
      return res.status(500).json({ error: "No AI services available" });
    let selectedAI =
      aiServices.find((service) => service.name === aiServicePreference) ||
      aiServices[0];
    let response;

    try {
      response = await axios.post(
        selectedAI.apiUrl,
        { prompt: message },
        {
          headers: { Authorization: `Bearer ${apiKeys[selectedAI.name]}` },
        }
      );
    } catch (error) {
      console.error(`Error with ${selectedAI.name}:`, error.message);

      for (let fallbackAI of aiServices) {
        if (fallbackAI.id !== selectedAI.id) {
          try {
            response = await axios.post(
              fallbackAI.apiUrl,
              { prompt: message },
              {
                headers: {
                  Authorization: `Bearer ${apiKeys[fallbackAI.name]}`,
                },
              }
            );
            selectedAI = fallbackAI;
            break;
          } catch (err) {
            console.error(
              `Error with fallback ${fallbackAI.name}:`,
              err.message
            );
          }
        }
      }
    }

    if (!response)
      return res.status(500).json({ error: "All AI services failed" });
    await prisma.conversation.create({
      data: {
        userId,
        aiService: selectedAI.name,
        messages: { request: message, response: response.data },
      },
    });

    res.json({ response: response.data });
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
