import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";

import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import assistRoutes from "./routes/assistRoutes.js"

import { redisClient } from "./config/redis.js";
import passport from "passport";

// env variables config
dotenv.config();
const server = express();

// Middleware setup
server.use(cors());
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(helmet({ crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" } }));

// session handling
server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

server.use(passport.initialize());
server.use(passport.session());

// Redis connection
const connectRedis = async () => {
  if (redisClient.isOpen) {
    console.log("Redis already connected.");
    return;
  }
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis");
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
  }
};

connectRedis();

// Route handlers
server.get("/", (req, res) => res.send("Server running"));
server.use("/auth", authRoutes);
server.use("/chat", chatRoutes);
server.use("/ai", aiRoutes);
server.use("/assist", assistRoutes);

// Server vroom vroom 💨
server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
