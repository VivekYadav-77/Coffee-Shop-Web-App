import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },
        value: { type: Number, required: true, min: 0 },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            default: null, // null = platform-wide coupon
        },
        expiresAt: { type: Date, required: true },
        isUsed: { type: Boolean, default: false },
        minOrderAmount: { type: Number, default: 0 },
        maxDiscount: { type: Number, default: null }, // Cap for percentage discounts
    },
    { timestamps: true }
);

CouponSchema.index({ user: 1, isUsed: 1 });
CouponSchema.index({ code: 1 });

const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
