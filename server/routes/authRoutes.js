import express from "express";
import { autoLoginAIController, googleAuthController, refreshTokensController } from "../controllers/auth_Controller.js";

const router = express.Router();

router.post("/google", googleAuthController);
router.post("/auto-login-ai", autoLoginAIController);
router.post("/refresh-tokens", refreshTokensController);

export default router;
