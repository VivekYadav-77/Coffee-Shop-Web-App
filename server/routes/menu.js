const express = require('express');
const { body } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, requireAdmin, handleValidationErrors } = require('../middleware/auth');

const router = express.Router();

let menuItems = new Map();


const defaultMenuItems = [
  null
];


defaultMenuItems.forEach(item => menuItems.set(item.id, item));

const menuItemValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['coffee', 'pastry', 'merchandise']).withMessage('Invalid category'),
  body('image').isURL().withMessage('Image must be a valid URL')
];

router.get('/', (req, res) => {
  try {
    const { category, available } = req.query;
    let items = Array.from(menuItems.values());

  
    if (category && category !== 'all') {
      items = items.filter(item => item.category === category);
    }

    if (available !== undefined) {
      items = items.filter(item => item.available === (available === 'true'));
    }

    res.json({
      items: items.sort((a, b) => {
   
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.name.localeCompare(b.name);
      })
    });
  } catch (error) {
    console.error('Menu fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

router.get('/:itemId', (req, res) => {
  try {
    const { itemId } = req.params;
    const item = menuItems.get(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ item });
  } catch (error) {
    console.error('Menu item fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch menu item' });
  }
});


router.post('/', authenticateToken, requireAdmin, menuItemValidation, handleValidationErrors, (req, res) => {
  try {
    const { name, description, price, category, image, popular = false } = req.body;
    
    const itemId = uuidv4();
    const menuItem = {
      id: itemId,
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      popular,
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    menuItems.set(itemId, menuItem);

    res.status(201).json({
      message: 'Menu item created successfully',
      item: menuItem
    });
  } catch (error) {
    console.error('Menu item creation error:', error);
    res.status(500).json({ message: 'Failed to create menu item' });
  }
});

router.put('/:itemId', authenticateToken, requireAdmin, menuItemValidation, handleValidationErrors, (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, description, price, category, image, popular, available } = req.body;
    
    const existingItem = menuItems.get(itemId);
    if (!existingItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const updatedItem = {
      ...existingItem,
      name,
      description,
      price: parseFloat(price),
      category,
      image,
      popular: popular !== undefined ? popular : existingItem.popular,
      available: available !== undefined ? available : existingItem.available,
      updatedAt: new Date()
    };

    menuItems.set(itemId, updatedItem);

    res.json({
      message: 'Menu item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Menu item update error:', error);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
});


router.patch('/:itemId/availability', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { itemId } = req.params;
    const item = menuItems.get(itemId);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item.available = !item.available;
    item.updatedAt = new Date();

    res.json({
      message: `Menu item ${item.available ? 'enabled' : 'disabled'} successfully`,
      item: {
        id: item.id,
        name: item.name,
        available: item.available
      }
    });
  } catch (error) {
    console.error('Menu item availability error:', error);
    res.status(500).json({ message: 'Failed to update menu item availability' });
  }
});


router.delete('/:itemId', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { itemId } = req.params;
    
    if (!menuItems.has(itemId)) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    menuItems.delete(itemId);

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Menu item deletion error:', error);
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
});

module.exports = router;