import { Router } from "express";
import User from "../models/user.model.js";
import Coupon from "../models/coupon.model.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { randomInt } from "node:crypto";

const router = Router();

const prizes = [
    { id: 1, text: "10% OFF", type: "percentage", value: 10, probability: 0.5 },
    { id: 2, text: "Better Luck Next Time", type: "none", value: 0, probability: 0.3 },
    { id: 3, text: "₹50 OFF", type: "fixed", value: 50, probability: 0.15 },
    { id: 4, text: "FREE COFFEE", type: "free_item", value: 1, probability: 0.05 },
];

const getWeightedPrize = () => {
    const rand = Math.random();
    let cumulative = 0;
    for (const prize of prizes) {
        cumulative += prize.probability;
        if (rand < cumulative) return prize;
    }
    return prizes.find((p) => p.type === "none");
};

// Get my coupons
router.get("/my-coupons", requireAuth, async (req, res, next) => {
    try {
        const coupons = await Coupon.find({
            user: req.user._id,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        }).lean();

        res.json({ success: true, coupons });
    } catch (err) {
        next(err);
    }
});

// Spin the wheel
router.post("/spin", requireAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.lastSpinAt && new Date() - new Date(user.lastSpinAt) < 24 * 60 * 60 * 1000) {
            return res.status(429).json({ success: false, message: "You can only spin once a day!" });
        }

        const prize = getWeightedPrize();
        let coupon = null;

        if (prize.type !== "none" && prize.type !== "free_item") {
            const code = `SPIN-${randomInt(100000, 999999)}`;
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            coupon = await Coupon.create({
                code,
                discountType: prize.type,
                value: prize.value,
                user: user._id,
                expiresAt,
            });
            user.coupons.push(coupon._id);
        }

        user.lastSpinAt = new Date();
        await user.save({ validateBeforeSave: false });

        res.json({ success: true, prize, coupon });
    } catch (err) {
        next(err);
    }
});

// Apply coupon
router.post("/apply", requireAuth, async (req, res, next) => {
    try {
        const { couponCode, cartTotal } = req.body;

        const coupon = await Coupon.findOne({
            code: couponCode.toUpperCase(),
            user: req.user._id,
            isUsed: false,
            expiresAt: { $gt: new Date() },
        });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid or expired coupon" });
        }
        if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount is ₹${coupon.minOrderAmount}`,
            });
        }

        let discount = 0;
        if (coupon.discountType === "percentage") {
            discount = (cartTotal * coupon.value) / 100;
            if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
            discount = coupon.value;
        }

        res.json({
            success: true,
            discountAmount: discount,
            newTotal: Math.max(cartTotal - discount, 0),
            coupon,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
