import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { redisClient } from "../config/redis.js";
import { refreshToken } from "firebase-admin/app";

const prisma = new PrismaClient();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS))
  });
}

export const googleAuthController = async (req, res) => {
  try {
    const { token } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

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

    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).json({ token: jwtToken, user });

    await autoLoginAI(user.id, token);
  } catch (error) {
    res.status(500).json({ Oauth_error: error.message });
  }
};

export const autoLoginAIController = async (req, res) => {
  try {
    const { userId, googleToken } = req.body;

    const updatedTokens = await autoLoginAI(userId, googleToken);
    res
      .status(200)
      .json({ success: true, message: "Auto-login successful", updatedTokens });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const autoLoginAI = async (userId, googleToken) => {
  const services = await prisma.aIService.findMany();
  let updatedTokens = {};

  for (const service of services) {
    try {
      if (service.oauthType === "google") {
        const response = await axios.post(`${service.apiUrl}/auth/google`, {
          token: googleToken,
        });

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
      }
    } catch (error) {
      console.error(`Failed to auto-login to ${service.name}`, error.message);
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { authTokens: updatedTokens },
  });

  return updatedTokens;
};

export const refreshTokensController = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    for (const user of users) {
      if (user.authTokens) {
        for (const [service, tokens] of Object.entries(user.authTokens)) {
          if (tokens.refreshToken) {
            try {
              const response = await axios.post(
                `${service.apiUrl}/auth/refresh`,
                {
                  refreshToken: tokens.refreshToken,
                }
              );

              user.authTokens[service] = {
                accessToken: response.data.newToken,
                refreshToken: tokens.refreshToken,
              };

              await prisma.user.update({
                where: { id: user.id },
                data: { authTokens: user.authTokens },
              });

              await redisClient.set(
                `authToken:${user.id}:${service}`,
                response.data.newToken,
                "EX",
                3600
              );
            } catch (error) {
              console.error(`Failed to refresh ${service}:`, error.message);
            }
          }
        }
      }
    }

    res
      .status(203)
      .json({ success: true, message: "Tokens refreshed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
