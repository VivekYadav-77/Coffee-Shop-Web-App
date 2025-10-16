import { ProductModel } from "../models/productschema.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // calculate total price
    let totalPrice = 0;
    for (const i of items) {
      const menuItem = await ProductModel.findById(i.menuItemId);
      if (!menuItem)
        return res.status(404).json({ error: "Menu item not found" });
      totalPrice += menuItem.price * i.qty;
    }

    const order = await Ordermodel.create({
      userId: req.user.id,
      items,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const order = await Ordermodel.findById(req.params.id).populate(
      "items.menuItemId",
      "name price"
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Ordermodel.find().populate("userId", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Ordermodel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
