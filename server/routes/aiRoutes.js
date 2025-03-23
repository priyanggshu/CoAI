import express from "express"; 
import { AIResponseController, getAvailableAIController } from "../controllers/ai_Controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/query', authMiddleware,  AIResponseController);
router.post('/available', authMiddleware, getAvailableAIController);

export default router;