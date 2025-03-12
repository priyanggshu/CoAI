import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";

import aiRoutes from "./routes/aiRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"

import { redisClient } from "./config/redis.js";
import passport from "passport";

dotenv.config();
const server = express();

server.use(cors());
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(helmet({ crossOriginOpenerPolicy: false }));

server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

server.use(passport.initialize());
server.use(passport.session());

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

connectRedis();

server.get("/", (req, res) => res.send("Server running"));

server.use("/auth", authRoutes);
server.use("/chat", chatRoutes);
server.use("/ai", aiRoutes);

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
