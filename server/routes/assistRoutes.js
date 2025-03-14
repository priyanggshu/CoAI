import express from "express";
import multer from "multer";
import { synthesizeSpeech, transcribeAudio } from "../controllers/voice_Controller.js";
import { checkLimitsController } from "../controllers/limit_Controller.js";
import { fetchAndMergeResponses } from "../controllers/multiAI_Controller.js";
import { getRecommendationsController, saveUserQueryController } from "../controllers/suggest_Controller.js";

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
router.post("/speech-to-text", upload.single("audio"), async (req, res) => {
  try { await transcribeAudio(req, res); } 
  catch (error) { res.status(500).json({ error: "Speech-to-text processing failed", details: error.message }); }
});

router.post("/text-to-speech", async (req, res) => {
  try { await synthesizeSpeech(req, res); } 
    catch (error) { res.status(500).json({ error: "Text-to-speech processing failed", details: error.message }); }
});

// Multi-AI Query Merging
router.get("/check-limits", checkLimitsController);

// AI-Based Recommendations
router.get('/', getRecommendationsController);
router.post('/save-query', saveUserQueryController);

// smart AI aggregator
router.post("/fusion", async (req, res) => {
  try { 
    const response = await fetchAndMergeResponses(req.body); 
    res.json(response);
  } catch (error) { res.status(500).json({ error: "AI merging failed", details: error.message }) }

});

export default router;