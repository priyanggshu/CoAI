import express from "express";
import { autoLoginAIController, getUserProfileController, googleAuthController, refreshTokensController } from "../controllers/auth_Controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/google", googleAuthController);
router.get("/me", authMiddleware, getUserProfileController);
router.post("/auto-login-ai", authMiddleware, autoLoginAIController);
router.post("/refresh-tokens", authMiddleware, refreshTokensController);

export default router;
