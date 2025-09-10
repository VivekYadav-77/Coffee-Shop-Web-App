const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body } = require('express-validator');
const { authenticateToken, handleValidationErrors, requireAdmin } = require('../middleware/auth');
const { orders } = require('../routes/orders'); // import the same orders map you use

const router = express.Router();

// Create payment intent
router.post('/create-intent', authenticateToken, [
  body('amount').isFloat({ min: 0.5 }).withMessage('Amount must be a positive number'),
  body('currency').isIn(['usd', 'eur', 'gbp']).withMessage('Invalid currency'),
  body('orderId').notEmpty().withMessage('Order ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId, userId: req.user.id },
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
  }
});

// Confirm payment
router.post('/confirm', authenticateToken, [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('orderId').notEmpty().withMessage('Order ID is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const order = orders.get(orderId);
      if (order) {
        order.paymentStatus = 'completed';
        order.status = 'paid';
        order.updatedAt = new Date();
      }

      res.json({
        message: 'Payment confirmed successfully',
        paymentStatus: 'completed',
        transactionId: paymentIntent.id
      });
    } else {
      res.status(400).json({ message: 'Payment not completed', paymentStatus: paymentIntent.status });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment', error: error.message });
  }
});

// Webhook for Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    const order = orders.get(orderId);
    if (order) {
      order.paymentStatus = 'completed';
      order.status = 'paid';
      order.updatedAt = new Date();
      console.log(`Order ${orderId} marked as paid via webhook`);
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
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
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('amount').optional().isFloat({ min: 0.5 }).withMessage('Refund amount must be positive')
], handleValidationErrors, async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
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
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Failed to process refund', error: error.message });
  }
});

module.exports = router;
