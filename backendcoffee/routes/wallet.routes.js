import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { creditWallet, getWalletHistory } from "../services/wallet.service.js";
import User from "../models/user.model.js";

const router = Router();

// Get wallet balance
router.get("/balance", requireAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("walletBalance");
        res.json({ success: true, balance: user.walletBalance });
    } catch (err) {
        next(err);
    }
});

// Add funds to wallet (simulated top-up)
router.post("/topup", requireAuth, async (req, res, next) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }
        const balance = await creditWallet(req.user._id, amount, "Wallet top-up");
        res.json({ success: true, balance });
    } catch (err) {
        next(err);
    }
});

// Get transaction history
router.get("/history", requireAuth, async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const data = await getWalletHistory(req.user._id, Number(page), Number(limit));
        res.json({ success: true, ...data });
    } catch (err) {
        next(err);
    }
});

export default router;
