import { Router } from "express";
import Product from "../models/product.model.js";
import upload from "../config/cloudinary.config.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import Vendor from "../models/vendor.model.js";
import { emitToAll } from "../services/socket.service.js";
import { AppError } from "../middleware/errorHandler.js";

const router = Router();

// --- Public: Get All Products (with optional vendor filter) ---
router.get("/", async (req, res, next) => {
    try {
        const { vendor, category, search, page = 1, limit = 30 } = req.query;
        const filter = { isActive: true };
        if (vendor) filter.vendor = vendor;
        if (category) filter.category = category;
        if (search) filter.$text = { $search: search };

        const products = await Product.find(filter)
            .populate("vendor", "storeName")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        const total = await Product.countDocuments(filter);
        res.json({ success: true, products, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
});

// --- Public: Get Single Product ---
router.get("/:id", async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("reviews.user", "name")
            .populate("vendor", "storeName logoUrl");
        if (!product) throw new AppError("Product not found", 404);
        res.json({ success: true, product });
    } catch (err) {
        next(err);
    }
});

// --- Vendor: Add Product ---
router.post(
    "/",
    requireAuth,
    requireRole("VENDOR"),
    upload.single("image"),
    async (req, res, next) => {
        try {
            const vendor = await Vendor.findOne({ owner: req.user._id });
            if (!vendor) throw new AppError("Vendor profile not found", 404);

            const { name, price, description, category, roastLevel, inStock, notes, cost } = req.body;
            const product = new Product({
                vendor: vendor._id,
                name,
                price: parseFloat(price),
                cost: parseFloat(cost || 0),
                description,
                category,
                roastLevel,
                inStock: inStock === "true" || inStock === true,
                notes,
                imageUrl: req.file ? req.file.path : "",
            });

            await product.save();
            emitToAll("product_add", product);
            res.status(201).json({ success: true, product });
        } catch (err) {
            next(err);
        }
    }
);

// --- Vendor: Update Product ---
router.put(
    "/:id",
    requireAuth,
    requireRole("VENDOR"),
    upload.single("image"),
    async (req, res, next) => {
        try {
            const vendor = await Vendor.findOne({ owner: req.user._id });
            if (!vendor) throw new AppError("Vendor profile not found", 404);

            const product = await Product.findById(req.params.id);
            if (!product) throw new AppError("Product not found", 404);
            if (product.vendor.toString() !== vendor._id.toString()) {
                throw new AppError("Not your product", 403);
            }

            const updates = { ...req.body };
            if (updates.price) updates.price = parseFloat(updates.price);
            if (updates.cost) updates.cost = parseFloat(updates.cost);
            if (updates.inStock !== undefined) updates.inStock = updates.inStock === "true" || updates.inStock === true;
            if (req.file) updates.imageUrl = req.file.path;

            Object.assign(product, updates);
            await product.save();

            emitToAll("product_update", product);
            res.json({ success: true, product });
        } catch (err) {
            next(err);
        }
    }
);

// --- Vendor: Toggle Stock ---
router.patch("/:id/toggle-stock", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ owner: req.user._id });
        const product = await Product.findById(req.params.id);
        if (!product) throw new AppError("Product not found", 404);
        if (product.vendor.toString() !== vendor._id.toString()) {
            throw new AppError("Not your product", 403);
        }

        product.inStock = !product.inStock;
        await product.save();

        emitToAll("product_update", product);
        res.json({ success: true, product });
    } catch (err) {
        next(err);
    }
});

// --- Vendor: Delete Product ---
router.delete("/:id", requireAuth, requireRole("VENDOR", "ADMIN"), async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) throw new AppError("Product not found", 404);

        emitToAll("product_delete", req.params.id);
        res.json({ success: true, message: "Product deleted" });
    } catch (err) {
        next(err);
    }
});

// --- Submit Review ---
router.post("/:id/reviews", requireAuth, async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) throw new AppError("Product not found", 404);

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) throw new AppError("Already reviewed", 400);

        product.reviews.push({ rating: Number(rating), comment, user: req.user._id });
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, r) => r.rating + acc, 0) / product.reviews.length;
        await product.save();

        const updated = await Product.findById(req.params.id).populate("reviews.user", "name");
        emitToAll("product_update", updated);
        res.status(201).json({ success: true, product: updated });
    } catch (err) {
        next(err);
    }
});

export default router;
