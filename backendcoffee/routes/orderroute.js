import express from "express";
import { Customermodel } from "../models/customerschema.js";
import { OrderModel } from "../models/orderschema.js";
import { ProductModel } from "../models/productschema.js";
import { CouponModel } from "../models/cuponschema.js";
import {
  authMiddleware,
  adminMiddleware,
  agentMiddleware,
  customerMiddleware,
  AdminorAgentMiddleware,
} from "../middleware/authvalidatemiddleware.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const orderrouter = express.Router();
// Customer: Place an order
orderrouter.post("/", customerMiddleware, async (req, res) => {
  const io = req.app.get("socketio");
  const { items, customer, deliveryAddress, couponCode, deliveryLocation } =
    req.body;

  try {
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const productInDb = await ProductModel.findById(item.productId);
      if (!productInDb || !productInDb.inStock) {
        return res
          .status(400)
          .json({ message: `Sorry, ${item.name} is no longer available.` });
      }
      if (productInDb.price !== item.price) {
        return res
          .status(400)
          .json({ message: `The price of ${item.name} has changed.` });
      }
      subtotal += productInDb.price * item.quantity;
      validatedItems.push({
        productId: productInDb._id,
        name: productInDb.name,
        price: productInDb.price,
        quantity: item.quantity,
      });
    }

    let finalTotalAmount = subtotal;

    if (couponCode) {
      const coupon = await CouponModel.findOne({
        code: couponCode,
        user: customer,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });

      if (coupon) {
        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
          discountAmount = (subtotal * coupon.value) / 100;
        } else if (coupon.discountType === "fixed") {
          discountAmount = coupon.value;
        }

        finalTotalAmount = subtotal - discountAmount;

        coupon.isUsed = true;
        await coupon.save();
      }
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const orderData = {
      orderId: `COFFEE-${Date.now().toString().slice(-6)}`,
      customer,
      items: validatedItems,
      deliveryOtp: otp,
      totalAmount: finalTotalAmount > 0 ? finalTotalAmount : 0, // Save the final discounted amount
      deliveryAddress,
      deliveryLocation: deliveryLocation,
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    io.to("admin_room").emit("order_update", newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
});
orderrouter.get("/:id/route", authMiddleware, async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    const { agentLat, agentLng } = req.query;
    if (!order?.deliveryLocation?.lat || !agentLat) {
      return res
        .status(400)
        .json({ message: "Missing location data for route calculation" });
    }

    const orsApiKey = process.env.OPENROUTESERVICE_KEY;
    // Format for ORS is Lng,Lat
    const start = `${agentLng},${agentLat}`;
    const end = `${order.deliveryLocation.lng},${order.deliveryLocation.lat}`;

    const orsResponse = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsApiKey}&start=${start}&end=${end}`
    );
    const routeData = await orsResponse.json();

    if (routeData.error) throw new Error(routeData.error.message);

    const path = routeData.features[0].geometry.coordinates.map((p) => [
      p[1],
      p[0],
    ]);

    res.json({ path });
  } catch (error) {
    console.error("Route calculation error:", error);
    res.status(500).json({ message: "Failed to calculate route" });
  }
});

// Customer: Get their own orders
orderrouter.get("/customer/:userId", customerMiddleware, async (req, res) => {
  try {
    const orders = await OrderModel.find({ customer: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Get all active orders
orderrouter.get("/admin", adminMiddleware, async (req, res) => {
  const orders = await OrderModel.find({ status: { $ne: "Delivered" } }).sort({
    createdAt: -1,
  });
  res.json({ orders });
});
//Admin: get admin order history
orderrouter.get("/admin/history", adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = 15;
    const orders = await OrderModel.find({ status: "Delivered" })
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .populate("customer", "name");
    const total = await OrderModel.countDocuments({ status: "Delivered" });

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// Agent: Get available orders to accept
orderrouter.get(
  "/agent/dashboard/:agentId",
  agentMiddleware,
  async (req, res) => {
    try {
      const { agentId } = req.params;

      const orders = await OrderModel.find({
        $or: [
          { status: "Available for Delivery" },
          { "deliveryPartner.agentId": agentId },
        ],
        status: { $ne: "Delivered" },
      }).sort({ createdAt: -1 });

      res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);
// PATCH /api/orders/:id/location
orderrouter.patch("/:id/location", authMiddleware, async (req, res) => {
  const io = req.app.get("socketio");
  try {
    const { lat, lng } = req.body;
    const order = await OrderModel.findById(req.params.id);

    if (!order || !order.deliveryPartner) {
      return res.status(404).json({ message: "Order or partner not found" });
    }

    order.deliveryPartner.location = { lat, lng };
    await order.save();

    if (order.customer) {
      io.to(`customer_${order.customer}`).emit("location_update", {
        orderId: order._id,
        location: { lat, lng },
      });
    }

    res.json({ message: "Location updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// Agent: Accept an order
orderrouter.patch("/:id/accept", agentMiddleware, async (req, res) => {
  const io = req.app.get("socketio");
  const { agentId } = req.body;
  const { id: orderId } = req.params;

  try {
    const agent = await Customermodel.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status: "Accepted by Agent",
          deliveryPartner: {
            agentId: agent._id,
            name: agent.name,
          },
        },
      },
      { new: true }
    ).populate("customer");

    // Notify all clients about the updated order
    io.to("admin_room").emit("order_update", updatedOrder);
    io.to(`agent_${agentId}`).emit("order_update", updatedOrder);
    if (updatedOrder.customer) {
      io.to(`customer_${updatedOrder.customer._id}`).emit(
        "order_update",
        updatedOrder
      );
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Customer: Get their own orders
orderrouter.get("/customer/:userId", authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { customer: req.params.userId };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    const orders = await OrderModel.find(filter).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin or Agent: Update order status
orderrouter.patch("/:id/status", async (req, res) => {
  const io = req.app.get("socketio");
  const { status, otp } = req.body;
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Add the OTP verification block
    // This runs ONLY if the new status is 'Delivered'
    if (status === "Delivered") {
      if (order.deliveryOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP!" });
      }
    }

    // 3. If OTP is correct (or not required), update the status and save
    order.status = status;
    let updatedOrder = await order.save();

    // 4. Re-populate the customer details for the response and WebSocket
    updatedOrder = await updatedOrder.populate("customer");

    // 5. Your original WebSocket logic is preserved here
    io.to("admin_room").emit("order_update", updatedOrder);

    if (updatedOrder.status === "Available for Delivery") {
      io.to("agent_room").emit("order_update", updatedOrder);
    }

    if (updatedOrder.deliveryPartner?.agentId) {
      io.to(`agent_${updatedOrder.deliveryPartner.agentId}`).emit(
        "order_update",
        updatedOrder
      );
    }

    if (updatedOrder.customer) {
      io.to(`customer_${updatedOrder.customer._id}`).emit(
        "order_update",
        updatedOrder
      );
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
export default orderrouter;
