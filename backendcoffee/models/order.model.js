import mongoose from "mongoose";
import { randomInt } from "node:crypto";

const locationSchema = new mongoose.Schema(
    {
        lat: { type: Number },
        lng: { type: Number },
    },
    { _id: false }
);

const deliveryPartnerSchema = new mongoose.Schema(
    {
        agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        name: { type: String },
        location: { type: locationSchema },
    },
    { _id: false }
);

const orderItemSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        cost: { type: Number, default: 0 },
        quantity: { type: Number, required: true, min: 1 },
        imageUrl: { type: String, default: "" },
    },
    { _id: false }
);

const OrderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true, min: 0 },
        deliveryFee: { type: Number, default: 40 },
        deliveryAddress: { type: String, required: true },
        deliveryLocation: locationSchema,

        // Payment
        paymentMethod: {
            type: String,
            enum: ["COD", "WALLET"],
            default: "COD",
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "ESCROW", "RELEASED", "REFUNDED"],
            default: "PENDING",
        },

        // Order Status
        status: {
            type: String,
            enum: [
                "Placed",                 // Customer places order
                "Accepted by Vendor",     // Vendor accepts
                "Preparing",              // Vendor starts cooking
                "Ready for Pickup",       // Vendor signals food is ready
                "Available for Delivery", // System alerts agents
                "Accepted by Agent",      // Agent picks it up
                "Out for Delivery",       // Agent en route
                "Delivered",              // Confirmed via OTP
                "Cancelled",              // Cancelled by customer, vendor, or system
                "Disputed",               // Under dispute review
            ],
            default: "Placed",
        },

        // Delivery
        deliveryOtp: { type: String, select: false },
        deliveryPartner: deliveryPartnerSchema,
        estimatedDeliveryTime: { type: Date },

        // Vendor tracking
        vendorAcceptedAt: { type: Date },
        vendorReadyAt: { type: Date },
        agentAcceptedAt: { type: Date },
        agentPickedUpAt: { type: Date },
        deliveredAt: { type: Date },

        // Cancellation
        cancelledBy: {
            type: String,
            enum: ["CUSTOMER", "VENDOR", "AGENT", "SYSTEM", null],
            default: null,
        },
        cancellationReason: { type: String, default: "" },

        // Coupon
        couponCode: { type: String, default: "" },
        discountAmount: { type: Number, default: 0 },

        // Dispute reference
        dispute: { type: mongoose.Schema.Types.ObjectId, ref: "Dispute" },
    },
    { timestamps: true }
);

// Indexes
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ vendor: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ "deliveryPartner.agentId": 1 });

// Generate secure delivery OTP
OrderSchema.methods.generateDeliveryOtp = function () {
    const otp = randomInt(1000, 9999).toString();
    this.deliveryOtp = otp;
    return otp;
};

// Static helper for generating unique order IDs
OrderSchema.statics.generateOrderId = function () {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = randomInt(1000, 9999);
    return `ORD-${timestamp}-${random}`;
};

const Order = mongoose.model("Order", OrderSchema);
export default Order;
