import express from "express";
import admin from "../config/firebase.js";

const router = express.Router();

router.post("/google-login", async(req, res) => {
    const { idToken } = req.body;
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        res.json({uid, name, email, picture, message: "Login successful" });
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error});
    }
});

export default router;