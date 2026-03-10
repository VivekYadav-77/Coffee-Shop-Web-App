import { Router } from "express";
import {
    registerVendor, getVendorProfile, updateVendorProfile,
    toggleVendorStatus, listVendors, getVendorMenu,
    approveVendor, adminListVendors,
} from "../controllers/vendor.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import upload from "../config/cloudinary.config.js";

const router = Router();

// Public
router.get("/", listVendors);
router.get("/:id", getVendorProfile);
router.get("/:vendorId/menu", getVendorMenu);

// Vendor
router.post("/register", requireAuth, registerVendor);
router.put("/profile", requireAuth, requireRole("VENDOR"), upload.single("logo"), updateVendorProfile);
router.patch("/toggle-status", requireAuth, requireRole("VENDOR"), toggleVendorStatus);

// Admin
router.patch("/:id/approve", requireAuth, requireRole("ADMIN"), approveVendor);
router.get("/admin/all", requireAuth, requireRole("ADMIN"), adminListVendors);

export default router;
