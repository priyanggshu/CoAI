import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import FormData from "form-data";
import {
  synthesizeSpeech,
  checkLimitsController,
  fetchAndMergeResponses,
  getRecommendationsController,
  saveUserQueryController,
} from "../controllers/assist_Controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
dotenv.config();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Voice AI (Speech-to-Text & Text-to-Speech)
router.post( "/speech-to-text", authMiddleware, upload.single("audio"), async (req, res) => {
  for (let i = 0; i < 4; i++) {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const formData = new FormData();
      formData.append("file", fs.createReadStream(req.file.path));

      const response = await axios.post(
        "https://api-inference.huggingface.co/models/openai/whisper-tiny",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            ...formData.getHeaders(),
          }
        }
      );

      if (!response.data || !response.data.text) {
        console.error("STT Error:", response.data);
        return res.status(500).json({ error: "Transcription failed" });
      }

      fs.unlinkSync(req.file.path);
      res.json({ transcript: response.data.text });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      res.status(500).json({ error: "Transcription failed" });
    }
  }
}
);

router.post("/text-to-speech", authMiddleware, async (req, res) => {
  try {
    await synthesizeSpeech(req, res);
  } catch (error) {
    res.status(500).json({
      error: "Text-to-speech processing failed",
      details: error.message,
    });
  }
});

// AI service's limit checking
router.get("/check-limits", authMiddleware, checkLimitsController);

// AI-Based Recommendations
router.get("/", authMiddleware, getRecommendationsController);
router.post("/save-query", authMiddleware, saveUserQueryController);

// smart AI aggregator/ merger
router.post("/fusion", authMiddleware, async (req, res) => {
  try {
    const response = await fetchAndMergeResponses(req.body);
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "AI merging failed", details: error.message });
  }
});

export default router;
