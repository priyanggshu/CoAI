import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";
import compression from "compression";


import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import assistRoutes from "./routes/assistRoutes.js"

import { redisClient } from "./config/redis.js";
import passport from "passport";

// env variables config
dotenv.config();
const server = express();

const redisStore = new RedisStore({ client: redisClient });

// Middleware setup
server.use(cors());
server.use(compression());
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(helmet());


// session handling
server.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: 'lax' 
    }
  })
);

server.use(passport.initialize());
server.use(passport.session());

// Redis connection
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis");
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
  }
};

connectRedis();

// Route handlers
server.get("/health", (_, res) => res.status(200).json({ status: "OK" }));
server.get("/", (req, res) => res.send("Server running"));
server.use("/auth", authRoutes);
server.use("/chat", chatRoutes);
server.use("/ai", aiRoutes);
server.use("/assist", assistRoutes);

// Server vroom vroom 💨
server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
