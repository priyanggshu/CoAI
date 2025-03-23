import express from "express"; 
import { exportConversationsController, getUserConversationController, saveMessageController, searchConversationsController } from "../controllers/chat_Controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/save', authMiddleware, saveMessageController);
router.get('/:userId', authMiddleware, getUserConversationController);
router.get('/export/:userId', authMiddleware, exportConversationsController);
router.get('/search/:userId', authMiddleware, searchConversationsController);

export default router;