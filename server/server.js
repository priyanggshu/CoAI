import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";

import { redisClient } from "./config/redis.js";
import passport from "passport";

dotenv.config();
const server = express();

server.use(cors());
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(helmet());

server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

server.use(passport.initialize());
server.use(passport.session());

redisClient.connect().catch(console.error);

server.get("/", (req, res) => res.send("Server running"));

server.use("/auth", authRoutes);
server.use("/chat", chatRoutes);
server.use("/ai", aiRoutes);

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
