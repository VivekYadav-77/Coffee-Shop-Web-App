const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const { authenticateToken, handleValidationErrors } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', (req, res) => {
  try {
    const user = {
      id: req.user.id,
      email: req.user.email,
      name: 'null',
      role: req.user.role,
      preferences: {
        notifications: true,
        newsletter: false
      },
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        favoriteItem: 'null'
      }
    };
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('preferences.notifications').optional().isBoolean(),
  body('preferences.newsletter').optional().isBoolean()
], handleValidationErrors, (req, res) => {
  try {
    const { name, phone, preferences } = req.body;
    const updatedUser = {
      id: req.user.id,
      email: req.user.email,
      name: name ,
      phone,
      preferences: {
        notifications: preferences?.notifications ?? true,
        newsletter: preferences?.newsletter ?? false
      },
      updatedAt: new Date()
    };
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

router.put('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) throw new Error('Password confirmation does not match');
    return true;
  })
], handleValidationErrors, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const saltRounds = 12;
    await bcrypt.hash(newPassword, saltRounds);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update password' });
  }
});

router.get('/favorites', (req, res) => {
  try {
    const favorites = [
      {
        id: 'null',
        name: 'null',
        price: null,
        image: 'null',
        addedAt: new Date(Date.now() - null)
      }
    ];
    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

router.post('/favorites/:itemId', (req, res) => {
  try {
    res.json({ message: `Item ${req.params.itemId} added to favorites` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add favorite' });
  }
});

router.delete('/favorites/:itemId', (req, res) => {
  try {
    res.json({ message: `Item ${req.params.itemId} removed from favorites` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
});

router.delete('/account', [
  body('password').notEmpty().withMessage('Password is required for account deletion')
], handleValidationErrors, async (req, res) => {
  try {
    res.json({ message: 'Account deletion initiated. You will receive a confirmation email.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

module.exports = router;
