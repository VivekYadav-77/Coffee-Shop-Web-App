import express from "express";
import { Customermodel } from "../models/customerschema.js";
import { CouponModel } from "../models/cuponschema.js";
import { authMiddleware } from "../middleware/authvalidatemiddleware.js";

const couponrouter = express.Router();
const prizes = [
  { id: 1, text: "10% OFF", type: "percentage", value: 10, probability: 0.5 },
  {
    id: 2,
    text: "Better Luck Next Time",
    type: "none",
    value: 0,
    probability: 0.3,
  },
  { id: 3, text: "₹50 OFF", type: "fixed", value: 50, probability: 0.15 },
  {
    id: 4,
    text: "FREE COFFEE",
    type: "free_item",
    value: 1,
    probability: 0.05,
  },
];

const getWeightedPrize = () => {
  const rand = Math.random();
  let cumulativeProbability = 0;
  for (const prize of prizes) {
    cumulativeProbability += prize.probability;
    if (rand < cumulativeProbability) {
      return prize;
    }
  }
  return prizes.find((p) => p.type === "none");
};
couponrouter.get("/my-coupons", authMiddleware, async (req, res) => {
  try {
    const coupons = await CouponModel.find({
      user: req.user._id,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
// POST /api/coupons/spin
couponrouter.post("/spin", authMiddleware, async (req, res) => {
  try {
    const user = await Customermodel.findById(req.user._id);

    // Optional: Limit spins to once every 24 hours
    if (
      user.lastSpinAt &&
      new Date() - new Date(user.lastSpinAt) < 24 * 60 * 60 * 1000
    ) {
      return res.status(429).json({ message: "You can only spin once a day!" });
    }

    const winningPrize = getWeightedPrize();
    let newCoupon = null;

    if (winningPrize.type !== "none" && winningPrize.type !== "free_item") {
      const code = `SPINWIN-${Date.now().toString().slice(-6)}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Coupon expires in 7 days

      newCoupon = new CouponModel({
        code,
        discountType: winningPrize.type,
        value: winningPrize.value,
        user: user._id,
        expiresAt,
      });
      await newCoupon.save();
      user.coupons.push(newCoupon._id);
    }

    user.lastSpinAt = new Date();
    await user.save();

    res.json({
      prize: winningPrize,
      coupon: newCoupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
// POST /api/coupons/apply
couponrouter.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { couponCode, cartTotal } = req.body;

    const coupon = await CouponModel.findOne({
      code: couponCode,
      user: req.user._id,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return res
        .status(404)
        .json({ message: "Coupon is invalid or has expired" });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartTotal * coupon.value) / 100;
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.value;
    }

    const newTotal = cartTotal - discountAmount;

    res.json({
      discountAmount,
      newTotal: newTotal > 0 ? newTotal : 0,
      coupon,
    });
  } catch (error) {
    console.error("Apply coupon error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default couponrouter;
