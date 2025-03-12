import express from "express"; 
import { getUserConversationController, saveMessageController } from "../controllers/chat_Controller.js";

const router = express.Router();

router.post('/save', saveMessageController);
router.post('/:userId', getUserConversationController);

export default router;