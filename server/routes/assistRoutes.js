import express from "express";
import multer from "multer";
import {
  synthesizeSpeech,
  transcribeAudio,
  checkLimitsController,
  fetchAndMergeResponses,
  getRecommendationsController,
  saveUserQueryController,
} from "../controllers/assist_Controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// store temp files in mempry before processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"), false);
    }
  },
});

// Voice AI (Speech-to-Text & Text-to-Speech)
router.post("/speech-to-text", authMiddleware, upload.single("audio"), async (req, res) => {
  try {
    await transcribeAudio(req, res);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Speech-to-text processing failed",
        details: error.message,
      });
  }
});

router.post("/text-to-speech", authMiddleware, async (req, res) => {
  try {
    await synthesizeSpeech(req, res);
  } catch (error) {
    res
      .status(500)
      .json({
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
