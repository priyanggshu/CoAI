import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { redisClient } from "../config/redis.js";

const prisma = new PrismaClient();

// Initialize Firebase only once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS))
    });
    console.log("Firebase Admin Initialized");    
  } catch (error) {
    console.error("Firebase Initialization failed:", error.message);
  }
}

export const googleAuthController = async (req, res) => {
  try {
    const { token } = req.body;

    // Firebase token verification
    const decodedToken = await admin.auth().verifyIdToken(token);
    if(!decodedToken) throw new Error("Invalid Google token");

    const { uid, email, name, picture } = decodedToken;

    if(!email) {
      return res.status(400).json({ error: "Email is required for authentication"});
    }

    // !user exists ? then create the new user
    let user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uid,
          email,
          name,
          picture,
          apiKeys: {},
          authTokens: {},
          preferences: {},
        },
      });
    }

    // JWT token generation
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Auto-login to AI services
    const updatedTokens = await autoLoginAI(user.id, token);

    res.status(201).json({ token: jwtToken, user, updatedTokens });
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(500).json({ Oauth_error: error.message });
  }
};

export const getUserProfileController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID missing" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, picture: true },
    });

    if(!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Fetch user profile error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

// Auto-login AI Services
export const autoLoginAIController = async (req, res) => {
  try {
    const { userId, googleToken } = req.body;

    if(!userId || !googleToken) {
      return res.status(400).json({ error: "User ID and Google Token are required" });
    }

    const updatedTokens = await autoLoginAI(userId, googleToken);
    res.status(200).json({ success: true, updatedTokens });
  } catch (error) {
    console.error("Auto-login AI Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Auto-login AI function
const autoLoginAI = async (userId, googleToken) => {
  const services = await prisma.aIService.findMany();
  let updatedTokens = {};

  for (const service of services) {
    try {
      if (service.oauthType !== "google") continue; // Skip if OAuth type ain't Google
        
        const response = await axios.post(`${service.apiUrl}/auth/google`, {
          token: googleToken,
        });

        if(!response.data.accessToken) {
          throw new Error(`No access token returned from ${service.name}`);
        }

        updatedTokens[service.name] = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken || null,
        };

        await redisClient.set(
          `authToken:${userId}:${service.name}`,
          response.data.accessToken,
          "EX",
          3600
        );
      } catch (error) {
        console.error(`Auto-login failed for ${service.name}`, error.message);
      }
    }

  // Update user tokens in DB
  await prisma.user.update({
    where: { id: userId },
    data: { authTokens: updatedTokens },
  });

  return updatedTokens;
};

// Refresh Tokens Controller
export const refreshTokensController = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    for (const user of users) {
      if (!user.authTokens) continue; 

      for(const [serviceName, tokens] of Object.entries(user.authTokens)) {
        if (!tokens.refreshToken) continue;

        try {
          const serviceObj = await prisma.aIService.findUnique({
            where: { name: serviceName },
          });
          if(!serviceObj) continue;

          const response = await axios.post(`${serviceObj.apiUrl}/auth/refresh`, {
            refreshToken: tokens.refreshToken,
          });

          if(!response.data.newToken) {
            throw new Error(`No new token received from ${serviceName}`);
          }

          user.authTokens[serviceName] = {
            accessToken: response.data.newToken,
            refreshToken: tokens.refreshToken,
          };

          await prisma.user.update({
            where: { id: user.id },
            data: { authTokens: user.authTokens },
          });

          await redisClient.set(
            `authToken:${user.id}:${serviceName}`,
            response.data.newToken,
            "EX",
            3600
          );
        } catch (error) {
          console.error(`Failed to refresh ${serviceName}:`, error.message);
        }
      }
    }

    res.status(203).json({ success: true, message: "Tokens refreshed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};