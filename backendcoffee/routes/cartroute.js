import express from "express";
import Cartmodel from "../models/cartschema.js";

const cartrouter = express.Router();

//  Get logged-in user cart
cartrouter.get("/", async (req, res) => {
  try {
    const cart = await Cartmodel.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );

    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
});

//  Add item to cart
cartrouter.post("/add", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cartmodel.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cartmodel({ userId: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (i) => i.productId.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: err.message });
  }
});

//  Update quantity
cartrouter.put("/update", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cartmodel.findOne({ userId: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
});

//  Remove item
cartrouter.delete("/remove/:productId", async (req, res) => {
  try {
    let cart = await Cartmodel.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== req.params.productId
    );
    await cart.save();

    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing item", error: err.message });
  }
});

//  Clear cart
cartrouter.delete("/clear", async (req, res) => {
  try {
    let cart = await Cartmodel.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: err.message });
  }
});

export default cartrouter;
