import { Router } from "express";
import {
    placeOrder, vendorAcceptOrder, vendorStartPreparing, vendorMarkReady,
    vendorCancelOrder, agentAcceptOrder, agentUpdateLocation, agentDeliverOrder,
    getCustomerOrders, getVendorOrders, getAgentDashboard, adminGetOrders,
    updateOrderStatus, getDeliveryRoute, customerCancelOrder,
} from "../controllers/order.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Customer
router.post("/", requireAuth, requireRole("CUSTOMER"), placeOrder);
router.get("/my-orders", requireAuth, requireRole("CUSTOMER"), getCustomerOrders);
router.patch("/:id/cancel", requireAuth, requireRole("CUSTOMER"), customerCancelOrder);

// Vendor
router.get("/vendor-orders", requireAuth, requireRole("VENDOR"), getVendorOrders);
router.patch("/:id/vendor-accept", requireAuth, requireRole("VENDOR"), vendorAcceptOrder);
router.patch("/:id/vendor-prepare", requireAuth, requireRole("VENDOR"), vendorStartPreparing);
router.patch("/:id/vendor-ready", requireAuth, requireRole("VENDOR"), vendorMarkReady);
router.patch("/:id/vendor-cancel", requireAuth, requireRole("VENDOR"), vendorCancelOrder);

// Agent
router.get("/agent-dashboard", requireAuth, requireRole("AGENT"), getAgentDashboard);
router.patch("/:id/agent-accept", requireAuth, requireRole("AGENT"), agentAcceptOrder);
router.post("/agent-location", requireAuth, requireRole("AGENT"), agentUpdateLocation);
router.patch("/:id/deliver", requireAuth, requireRole("AGENT"), agentDeliverOrder);
router.get("/:id/route", requireAuth, getDeliveryRoute);

// Admin
router.get("/admin/all", requireAuth, requireRole("ADMIN"), adminGetOrders);
router.patch("/:id/status", requireAuth, requireRole("ADMIN", "AGENT"), updateOrderStatus);

export default router;
