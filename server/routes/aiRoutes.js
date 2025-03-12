import express from "express"; 
import { AIResponseController, getAvailableAIController } from "../controllers/ai_Controller.js";

const router = express.Router();

router.post('/query', AIResponseController);
router.post('/available', getAvailableAIController);

export default router;