import express from "express";
import mongoose from "mongoose";
import { OrderModel } from "../models/orderschema.js";
import {
  adminMiddleware,
  agentMiddleware,
  authMiddleware,
} from "../middleware/authvalidatemiddleware.js";

const analyticsrouter = express.Router();

// Admin Analytics Route
analyticsrouter.get("/admin", adminMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const adminData = await OrderModel.aggregate([
      { $match: { status: "Delivered" } },
      {
        $facet: {
          keyMetrics: [
            { $unwind: "$items" },
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: { $multiply: ["$items.price", "$items.quantity"] },
                },
                totalProfit: {
                  $sum: {
                    $multiply: [
                      { $subtract: ["$items.price", "$items.cost"] },
                      "$items.quantity",
                    ],
                  },
                },
                totalOrders: { $addToSet: "$_id" },
              },
            },
            {
              $project: {
                _id: 0,
                totalRevenue: 1,
                totalProfit: 1,
                totalOrders: { $size: "$totalOrders" },
              },
            },
          ],
          salesLast7Days: [
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                dailySales: { $sum: "$totalAmount" },
              },
            },
            { $sort: { _id: 1 } },
            { $project: { day: "$_id", sales: "$dailySales", _id: 0 } },
          ],
        },
      },
    ]);

    res.json({
      metrics: adminData[0].keyMetrics[0] || {
        totalRevenue: 0,
        totalProfit: 0,
        totalOrders: 0,
      },
      salesLast7Days: adminData[0].salesLast7Days,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Agent Analytics Route
analyticsrouter.get("/agent/:agentId", agentMiddleware, async (req, res) => {
  try {
    const { agentId } = req.params;

    const metrics = await OrderModel.aggregate([
      {
        $match: {
          "deliveryPartner.agentId": new mongoose.Types.ObjectId(agentId),
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
      metrics: metrics[0] || { totalDeliveries: 0, totalEarnings: 0 },
    });
  } catch (error) {
    console.error("Agent analytics error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default analyticsrouter;
