import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const redisClient =  createClient({ url: process.env.UPSTASH_REDIS_URL });

redisClient.on("connect", () => console.log("🟢 Redis connected"));
redisClient.on("error", (err) => {
    console.log("🔴 Redis error", err);
    setTimeout(() => redisClient.connect(), 5000); // Auto-reconnect
});
