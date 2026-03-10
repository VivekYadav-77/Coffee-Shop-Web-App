import { Router } from "express";
import {
    signup, login, logout, getMe,
    verifyCode, resendVerification,
    forgotPassword, resetPassword,
    updateProfile, changePassword,
    refreshToken,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-code", verifyCode);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.post("/refresh", refreshToken);

// Protected
router.get("/me", getMe);
router.get("/logout", logout);
router.put("/profile", requireAuth, updateProfile);
router.put("/change-password", requireAuth, changePassword);

export default router;
