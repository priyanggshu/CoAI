import { redisClient } from "../config/redis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkLimitsController = async (req, res) => {
    try {
        const services = await prisma.aIService.findMany();
        let alert = [];

        for(const service of services) {
            const usageCount = await redisClient.get(`usage:${service.name}`) || 0;
            const limit = service.freeTierLimit || 1000; // Default limit if not set

            if(usageCount >= limit) {
                alert.push({
                    service: service.name,
                    message: `Free limit reached! Try ${getAlternativeService(service.name)}`
                });
            }
        }

        if(alert.length === 0) {
            return res.json({ message: "All services are within free limits." });
        }
        res.json({ alert });
    } catch (error) {
        res.status(500).json({ error: "Error checking service limits" });
    }
};

const getAlternativeService = (serviceName) => {
    const alternatives = {
        "chatGPT": "Try Google Gemini or Claude",
        "Google Gemini": "Use Perplexity AI",
        "Claude": "Try Bolt.new or Hugging Face",
        "Perplexity AI": "Use ChatGPT free-tier",
    };

    return alternatives[serviceName] || "Explore other AI models";
};