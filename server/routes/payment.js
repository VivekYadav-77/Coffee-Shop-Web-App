const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { body } = require('express-validator');
const { authenticateToken, handleValidationErrors, requireAdmin } = require('../middleware/auth');
const { orders } = require('../routes/orders'); // same orders map you use

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', authenticateToken, [
  body('amount').isFloat({ min: 0.5 }).withMessage('Amount must be positive'),
  body('currency').isIn(['INR']).withMessage('Only INR supported for now'),
  body('orderId').notEmpty().withMessage('Order ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: orderId,
      notes: { userId: req.user.id }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Confirm payment (signature verification)
router.post('/confirm', authenticateToken, [
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required'),
  body('orderId').notEmpty().withMessage('Order ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      const order = orders.get(orderId);
      if (order) {
        order.paymentStatus = 'completed';
        order.status = 'paid';
        order.updatedAt = new Date();
      }

      res.json({
        message: 'Payment confirmed successfully',
        paymentStatus: 'completed',
        transactionId: razorpay_payment_id
      });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Razorpay payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment', error: error.message });
  }
});

// Webhook for Razorpay (optional)
router.post('/webhook', express.json({ type: 'application/json' }), (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== signature) {
    console.error('Invalid Razorpay webhook signature');
    return res.status(400).send('Invalid signature');
  }

  const event = req.body.event;
  const payload = req.body.payload.payment ? req.body.payload.payment.entity : null;

  if (event === 'payment.captured' && payload) {
    const orderId = payload.notes?.orderId;
    const order = orders.get(orderId);
    if (order) {
      order.paymentStatus = 'completed';
      order.status = 'paid';
      order.updatedAt = new Date();
      console.log(`Order ${orderId} marked as paid via webhook`);
    }
  }

  if (event === 'payment.failed' && payload) {
    const orderId = payload.notes?.orderId;
    const order = orders.get(orderId);
    if (order) {
      order.paymentStatus = 'failed';
      order.updatedAt = new Date();
      console.log(`Order ${orderId} payment failed`);
    }
  }

  res.json({ received: true });
});

// Refund payment
router.post('/refund', authenticateToken, requireAdmin, [
  body('paymentId').notEmpty().withMessage('Payment ID is required'),
  body('amount').optional().isFloat({ min: 0.5 }).withMessage('Refund amount must be positive')
], handleValidationErrors, async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined
    });

    res.json({
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Razorpay refund error:', error);
    res.status(500).json({ message: 'Failed to process refund', error: error.message });
  }
});

module.exports = router;
