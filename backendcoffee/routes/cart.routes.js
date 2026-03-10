import { Router } from "express";
import Cart from "../models/cart.model.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// Get cart for current user + vendor
router.get("/", requireAuth, requireRole("CUSTOMER"), async (req, res, next) => {
    try {
        const { vendor } = req.query;
        const filter = { userId: req.user._id };
        if (vendor) filter.vendor = vendor;

        const carts = await Cart.find(filter).populate("items.productId").populate("vendor", "storeName");
        res.json({ success: true, carts });
    } catch (err) {
        next(err);
    }
});

// Add item to cart
router.post("/add", requireAuth, requireRole("CUSTOMER"), async (req, res, next) => {
    try {
        const { productId, quantity, vendorId } = req.body;
        if (!productId || !quantity || !vendorId) {
            throw new AppError("productId, quantity, and vendorId required", 400);
        }

        let cart = await Cart.findOne({ userId: req.user._id, vendor: vendorId });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, vendor: vendorId, items: [] });
        }

        const existing = cart.items.find((i) => i.productId.toString() === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.json({ success: true, cart });
    } catch (err) {
        next(err);
    }
});

// Update quantity
router.put("/update", requireAuth, requireRole("CUSTOMER"), async (req, res, next) => {
    try {
        const { productId, quantity, vendorId } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id, vendor: vendorId });
        if (!cart) throw new AppError("Cart not found", 404);

        const item = cart.items.find((i) => i.productId.toString() === productId);
        if (!item) throw new AppError("Item not in cart", 404);

        item.quantity = quantity;
        await cart.save();
        res.json({ success: true, cart });
    } catch (err) {
        next(err);
    }
});

// Remove item
router.delete("/remove/:productId", requireAuth, requireRole("CUSTOMER"), async (req, res, next) => {
    try {
        const { vendorId } = req.query;
        const cart = await Cart.findOne({ userId: req.user._id, vendor: vendorId });
        if (!cart) throw new AppError("Cart not found", 404);

        cart.items = cart.items.filter((i) => i.productId.toString() !== req.params.productId);
        await cart.save();
        res.json({ success: true, cart });
    } catch (err) {
        next(err);
    }
});

// Clear cart
router.delete("/clear", requireAuth, requireRole("CUSTOMER"), async (req, res, next) => {
    try {
        const { vendorId } = req.query;
        if (vendorId) {
            await Cart.findOneAndDelete({ userId: req.user._id, vendor: vendorId });
        } else {
            await Cart.deleteMany({ userId: req.user._id });
        }
        res.json({ success: true, message: "Cart cleared" });
    } catch (err) {
        next(err);
    }
});

export default router;
