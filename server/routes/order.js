const express = require('express');
const { body } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, handleValidationErrors, requireAdmin } = require('../middleware/auth');
const { sendOrderConfirmationEmail } = require('../services/emailService');

const router = express.Router();
const orders = new Map();

const createOrderValidation = [
  body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
  body("items.*.itemid").notEmpty().withMessage("Item ID is required"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("total").isFloat({ min: 0 }).withMessage("Total must be a positive number"),
  body("customerInfo.phone").isMobilePhone().withMessage("Valid phone number is required"),
  body("orderType").isIn(["pickup", "delivery"]).withMessage("Order type must be either pickup or delivery")
];

router.post("/", authenticateToken, createOrderValidation, handleValidationErrors, async (req, res) => {
  try {
    const { items, total, customerInfo, orderType } = req.body;
    const orderId = uuidv4();
    const order = {
      id: orderId,
      userId: req.user.id,
      items,
      total,
      customerInfo,
      orderType,
      status: "pending",
      createdAt: new Date(),
      paymentStatus: "pending"
    };
    orders.set(orderId, order);

    const { users } = require("../routes/auth");
    const user = users?.get(req.user.id);
    if (user) {
      sendOrderConfirmationEmail(user.email, order).catch(err => console.error("Email error:", err));
    }

    setTimeout(() => updateOrderStatus(orderId, "pending"), 2000);
    setTimeout(() => updateOrderStatus(orderId, "in preparation"), 5000);
    setTimeout(() => updateOrderStatus(orderId, "completed"), 10000);
    setTimeout(() => updateOrderStatus(orderId, "delivered"), 15000);

    res.status(201).json({
      message: "order placed",
      orderId: {
        id: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        estimatedTime: order.estimatedTime
      }
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

router.get("/", authenticateToken, (req, res) => {
  try {
    const userOrders = Array.from(orders.values())
      .filter(order => order.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      orders: userOrders.map(order => ({
        id: order.id,
        items: order.items,
        total: order.total,
        status: order.status,
        orderType: order.orderType,
        createdAt: order.createdAt,
        estimatedTime: order.estimatedTime
      }))
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get('/:orderId', authenticateToken, (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

router.patch('/:orderId/status', authenticateToken, requireAdmin, [
  body('status').isIn(['pending', 'preparing', 'ready', 'completed', 'cancelled']).withMessage('Invalid status')
], handleValidationErrors, (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = new Date();

    res.json({
      message: 'Order status updated successfully',
      order: {
        id: order.id,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Order update error:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

router.delete('/:orderId', authenticateToken, (req, res) => {
  try {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Order cancellation error:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
});

function updateOrderStatus(orderId, status) {
  const order = orders.get(orderId);
  if (order && order.status !== 'cancelled') {
    order.status = status;
    order.updatedAt = new Date();
  }
}

module.exports = router;