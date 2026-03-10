import Vendor from "../models/vendor.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { AppError } from "../middleware/errorHandler.js";

// --- Register Vendor ---
export const registerVendor = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const existing = await Vendor.findOne({ owner: userId });
        if (existing) throw new AppError("You already have a vendor profile", 409);

        const { storeName, description, cuisine, address, location, phone, operatingHours } = req.body;
        if (!storeName || !phone) throw new AppError("Store name and phone are required", 400);

        const vendor = await Vendor.create({
            owner: userId,
            storeName,
            description,
            cuisine: cuisine || ["coffee"],
            address: address || {},
            location: location || {},
            phone,
            operatingHours: operatingHours || {},
        });

        // Update user role to VENDOR
        await User.findByIdAndUpdate(userId, { role: "VENDOR", vendorProfile: vendor._id });

        res.status(201).json({ success: true, vendor });
    } catch (err) {
        next(err);
    }
};

// --- Get Vendor Profile ---
export const getVendorProfile = async (req, res, next) => {
    try {
        const vendor = await Vendor.findById(req.params.id).populate("owner", "name email");
        if (!vendor) throw new AppError("Vendor not found", 404);
        res.json({ success: true, vendor });
    } catch (err) {
        next(err);
    }
};

// --- Update Vendor Profile ---
export const updateVendorProfile = async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ owner: req.user._id });
        if (!vendor) throw new AppError("Vendor profile not found", 404);

        const allowedFields = [
            "storeName", "description", "cuisine", "address",
            "location", "phone", "operatingHours", "estimatedPrepTime",
        ];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) vendor[field] = req.body[field];
        });

        if (req.file) vendor.logoUrl = req.file.path;

        await vendor.save();
        res.json({ success: true, vendor });
    } catch (err) {
        next(err);
    }
};

// --- Toggle Vendor Open/Close ---
export const toggleVendorStatus = async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ owner: req.user._id });
        if (!vendor) throw new AppError("Vendor profile not found", 404);

        vendor.isOpen = !vendor.isOpen;
        await vendor.save();

        res.json({ success: true, isOpen: vendor.isOpen });
    } catch (err) {
        next(err);
    }
};

// --- List All Approved Vendors (Customer facing) ---
export const listVendors = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const filter = { isApproved: true, isActive: true };

        if (search) {
            filter.storeName = { $regex: search, $options: "i" };
        }

        const vendors = await Vendor.find(filter)
            .select("storeName logoUrl cuisine rating totalOrders isOpen estimatedPrepTime location")
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        const total = await Vendor.countDocuments(filter);
        res.json({ success: true, vendors, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// --- Get Vendor Menu ---
export const getVendorMenu = async (req, res, next) => {
    try {
        const { vendorId } = req.params;
        const { category } = req.query;

        const filter = { vendor: vendorId, isActive: true };
        if (category) filter.category = category;

        const products = await Product.find(filter).sort({ category: 1, name: 1 }).lean();
        res.json({ success: true, products });
    } catch (err) {
        next(err);
    }
};

// --- Admin: Approve/Reject Vendor ---
export const approveVendor = async (req, res, next) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) throw new AppError("Vendor not found", 404);

        vendor.isApproved = req.body.approved !== false;
        await vendor.save();

        res.json({ success: true, vendor });
    } catch (err) {
        next(err);
    }
};

// --- Admin: List All Vendors (including unapproved) ---
export const adminListVendors = async (req, res, next) => {
    try {
        const vendors = await Vendor.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 })
            .lean();
        res.json({ success: true, vendors });
    } catch (err) {
        next(err);
    }
};
