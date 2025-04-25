import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import assistRoutes from "./routes/assistRoutes.js"

import { redisClient } from "./config/redis.js";
import passport from "passport";

// env config
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

const httpServer = createServer(server);
const io = new SocketServer(httpServer, {
  cors: { origin: "*" }
});

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

server.get("/health/db", async (req, res) => {
  try {
    await prisma.user.findFirst();
    res.send("Database connected!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// webtrc
io.on("connection", socket => {
  console.log("🔌 New socket connection:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("signal", ({ to, signal }) => {
    io.to(to).emit("signal", { from: socket.id, signal });
  });  

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit("User-left");
    console.log("User disconnected:", socket.id);
  });
});

// Server vroom vroom 💨
httpServer.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running with WebSocket on port ${process.env.PORT}`);
});
