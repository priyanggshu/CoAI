import { redisClient } from "../config/redis";

// function to save user queries
export const saveUserQueryController = async (req, res) => {
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

// Function to generate recommendations
export const getRecommendationsController = async (req, res) => {
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

// Function to generate topic suggestions based on queries
const generateTopicSuggestions = (queries) => {
  let suggestions = [];
  if (queries.some((q) => q.toLowerCase().includes("code"))) {
    suggestions.push("Try 'AI code generation'", "Ask about debugging with AI");
  }
  if (queries.some((q) => q.toLowerCase().includes("health"))) {
    suggestions.push("Explore AI in healthcare", "Check AI-powered medical diagnosis tools");
  }
  if (suggestions.length === 0) {
    suggestions = ["Discover latest AI trends"];
  }
  return suggestions;
};
