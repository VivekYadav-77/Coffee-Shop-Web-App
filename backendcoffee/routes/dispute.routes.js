import { Router } from "express";
import {
    raiseDispute, getMyDisputes, getAllDisputes,
    resolveDispute, getDispute,
} from "../controllers/dispute.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Customer / Agent / Vendor
router.post("/", requireAuth, raiseDispute);
router.get("/my-disputes", requireAuth, getMyDisputes);

// Admin
router.get("/all", requireAuth, requireRole("ADMIN"), getAllDisputes);
router.get("/:id", requireAuth, getDispute);
router.patch("/:id/resolve", requireAuth, requireRole("ADMIN"), resolveDispute);

export default router;
