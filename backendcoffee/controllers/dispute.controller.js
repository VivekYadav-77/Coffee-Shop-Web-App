import Dispute from "../models/dispute.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { emitToRoom } from "../services/socket.service.js";
import { sendDisputeNotification } from "../services/email.service.js";
import { refundToWallet } from "../services/wallet.service.js";

// --- Raise a Dispute ---
export const raiseDispute = async (req, res, next) => {
    try {
        const { orderId, type, description, againstRole } = req.body;

        if (!orderId || !type || !description) {
            throw new AppError("Order ID, type, and description are required", 400);
        }

        const order = await Order.findById(orderId);
        if (!order) throw new AppError("Order not found", 404);

        // Check if dispute already exists for this order
        const existing = await Dispute.findOne({ order: orderId, status: { $in: ["OPEN", "UNDER_REVIEW"] } });
        if (existing) throw new AppError("A dispute is already active for this order", 409);

        // Determine priority
        let priority = "MEDIUM";
        if (["FAKE_DELIVERY", "PAYMENT_ISSUE"].includes(type)) priority = "CRITICAL";
        if (["DAMAGED_ORDER", "MISSING_ITEMS"].includes(type)) priority = "HIGH";

        const dispute = await Dispute.create({
            order: orderId,
            raisedBy: req.user._id,
            raisedByRole: req.user.role,
            againstRole: againstRole || "VENDOR",
            type,
            description,
            priority,
            evidenceUrls: req.body.evidenceUrls || [],
        });

        // Mark order as disputed
        order.status = "Disputed";
        order.dispute = dispute._id;
        await order.save();

        // Notify admin
        emitToRoom("admin_room", "new_dispute", dispute);

        // Try to notify affected parties via email
        try {
            const admins = await User.find({ role: "ADMIN" });
            for (const admin of admins) {
                await sendDisputeNotification(admin, order.orderId, type);
            }
        } catch {
            // Email failure should not block dispute creation
        }

        res.status(201).json({ success: true, dispute });
    } catch (err) {
        next(err);
    }
};

// --- Get Disputes for User ---
export const getMyDisputes = async (req, res, next) => {
    try {
        const disputes = await Dispute.find({ raisedBy: req.user._id })
            .populate("order", "orderId status totalAmount")
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, disputes });
    } catch (err) {
        next(err);
    }
};

// --- Admin: Get All Disputes ---
export const getAllDisputes = async (req, res, next) => {
    try {
        const { status, priority, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const disputes = await Dispute.find(filter)
            .populate("order", "orderId status totalAmount")
            .populate("raisedBy", "name email role")
            .sort({ priority: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        const total = await Dispute.countDocuments(filter);
        res.json({ success: true, disputes, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// --- Admin: Resolve Dispute ---
export const resolveDispute = async (req, res, next) => {
    try {
        const { resolution, refundAmount, penaltyAmount, penaltyAppliedTo, status } = req.body;

        const dispute = await Dispute.findById(req.params.id);
        if (!dispute) throw new AppError("Dispute not found", 404);

        dispute.status = status || "RESOLVED";
        dispute.resolution = resolution || "";
        dispute.resolvedBy = req.user._id;
        dispute.resolvedAt = new Date();
        dispute.refundAmount = refundAmount || 0;
        dispute.penaltyAmount = penaltyAmount || 0;
        if (penaltyAppliedTo) dispute.penaltyAppliedTo = penaltyAppliedTo;
        await dispute.save();

        // Process refund
        if (refundAmount > 0) {
            const order = await Order.findById(dispute.order);
            if (order) {
                await refundToWallet(order.customer, refundAmount, order._id);
                order.paymentStatus = "REFUNDED";
                await order.save();
            }
        }

        // Apply penalty (deduct agent/vendor rating)
        if (penaltyAppliedTo && penaltyAmount > 0) {
            const penalizedUser = await User.findById(penaltyAppliedTo);
            if (penalizedUser && penalizedUser.role === "AGENT") {
                penalizedUser.agentRating = Math.max(0, penalizedUser.agentRating - 0.5);
                await penalizedUser.save({ validateBeforeSave: false });
            }
        }

        emitToRoom("admin_room", "dispute_resolved", dispute);

        res.json({ success: true, dispute });
    } catch (err) {
        next(err);
    }
};

// --- Get Single Dispute ---
export const getDispute = async (req, res, next) => {
    try {
        const dispute = await Dispute.findById(req.params.id)
            .populate("order")
            .populate("raisedBy", "name email role")
            .populate("resolvedBy", "name email")
            .populate("penaltyAppliedTo", "name email role");

        if (!dispute) throw new AppError("Dispute not found", 404);
        res.json({ success: true, dispute });
    } catch (err) {
        next(err);
    }
};
