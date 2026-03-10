import { Router } from "express";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Vendor from "../models/vendor.model.js";
import Dispute from "../models/dispute.model.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Admin Analytics
router.get("/admin", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [orderMetrics] = await Order.aggregate([
            { $match: { status: "Delivered" } },
            {
                $facet: {
                    keyMetrics: [
                        { $unwind: "$items" },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                                totalProfit: {
                                    $sum: { $multiply: [{ $subtract: ["$items.price", "$items.cost"] }, "$items.quantity"] },
                                },
                                totalOrders: { $addToSet: "$_id" },
                            },
                        },
                        {
                            $project: {
                                _id: 0, totalRevenue: 1, totalProfit: 1, totalOrders: { $size: "$totalOrders" },
                            },
                        },
                    ],
                    salesLast7Days: [
                        { $match: { createdAt: { $gte: sevenDaysAgo } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                dailySales: { $sum: "$totalAmount" },
                            },
                        },
                        { $sort: { _id: 1 } },
                        { $project: { day: "$_id", sales: "$dailySales", _id: 0 } },
                    ],
                },
            },
        ]);

        const totalVendors = await Vendor.countDocuments({ isApproved: true });
        const openDisputes = await Dispute.countDocuments({ status: { $in: ["OPEN", "UNDER_REVIEW"] } });

        res.json({
            success: true,
            metrics: orderMetrics.keyMetrics[0] || { totalRevenue: 0, totalProfit: 0, totalOrders: 0 },
            salesLast7Days: orderMetrics.salesLast7Days,
            totalVendors,
            openDisputes,
        });
    } catch (err) {
        next(err);
    }
});

// Vendor Analytics
router.get("/vendor", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ owner: req.user._id });
        if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [metrics] = await Order.aggregate([
            { $match: { vendor: vendor._id, status: "Delivered" } },
            {
                $facet: {
                    totals: [
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: "$totalAmount" },
                                totalOrders: { $sum: 1 },
                            },
                        },
                    ],
                    salesLast7Days: [
                        { $match: { createdAt: { $gte: sevenDaysAgo } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                                dailySales: { $sum: "$totalAmount" },
                                dailyOrders: { $sum: 1 },
                            },
                        },
                        { $sort: { _id: 1 } },
                        { $project: { day: "$_id", sales: "$dailySales", orders: "$dailyOrders", _id: 0 } },
                    ],
                },
            },
        ]);

        res.json({
            success: true,
            metrics: metrics.totals[0] || { totalRevenue: 0, totalOrders: 0 },
            salesLast7Days: metrics.salesLast7Days,
            vendorRating: vendor.rating,
        });
    } catch (err) {
        next(err);
    }
});

// Agent Analytics
router.get("/agent", requireAuth, requireRole("AGENT"), async (req, res, next) => {
    try {
        const [metrics] = await Order.aggregate([
            {
                $match: {
                    "deliveryPartner.agentId": new mongoose.Types.ObjectId(req.user._id),
                    status: "Delivered",
                },
            },
            {
                $group: {
                    _id: null,
                    totalDeliveries: { $sum: 1 },
                    totalEarnings: { $sum: "$deliveryFee" },
                },
            },
        ]);

        res.json({
            success: true,
            metrics: metrics || { totalDeliveries: 0, totalEarnings: 0 },
        });
    } catch (err) {
        next(err);
    }
});

export default router;
