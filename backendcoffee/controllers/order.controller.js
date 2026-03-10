import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";
import Vendor from "../models/vendor.model.js";
import { AppError } from "../middleware/errorHandler.js";
import { emitToRoom } from "../services/socket.service.js";
import { debitWallet, holdEscrow } from "../services/wallet.service.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

// --- Customer: Place Order ---
export const placeOrder = async (req, res, next) => {
    try {
        const { items, deliveryAddress, couponCode, deliveryLocation, vendorId, paymentMethod } = req.body;

        if (!items?.length || !deliveryAddress || !vendorId) {
            throw new AppError("Items, delivery address, and vendor are required", 400);
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor || !vendor.isApproved || !vendor.isActive) {
            throw new AppError("Vendor not available", 400);
        }

        // Validate items and calculate total
        let subtotal = 0;
        const validatedItems = [];
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product || !product.inStock) {
                throw new AppError(`Product "${item.name || item.productId}" is unavailable`, 400);
            }
            if (product.vendor.toString() !== vendorId) {
                throw new AppError("All items must be from the same vendor", 400);
            }
            validatedItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                cost: product.cost || 0,
                quantity: item.quantity,
                imageUrl: product.imageUrl,
            });
            subtotal += product.price * item.quantity;
        }

        // Apply coupon
        let discountAmount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                user: req.user._id,
                isUsed: false,
                expiresAt: { $gt: new Date() },
            });
            if (coupon) {
                if (coupon.discountType === "percentage") {
                    discountAmount = (subtotal * coupon.value) / 100;
                    if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
                } else {
                    discountAmount = coupon.value;
                }
                coupon.isUsed = true;
                await coupon.save();
            }
        }

        const deliveryFee = 40;
        const totalAmount = Math.max(subtotal - discountAmount + deliveryFee, 0);
        const method = paymentMethod === "WALLET" ? "WALLET" : "COD";

        // For WALLET payment, hold escrow
        if (method === "WALLET") {
            await holdEscrow(req.user._id, totalAmount, null);
        }

        const orderId = Order.generateOrderId();
        const order = new Order({
            orderId,
            customer: req.user._id,
            vendor: vendorId,
            items: validatedItems,
            totalAmount,
            deliveryFee,
            deliveryAddress,
            deliveryLocation: deliveryLocation || {},
            paymentMethod: method,
            paymentStatus: method === "WALLET" ? "ESCROW" : "PENDING",
            couponCode: couponCode || "",
            discountAmount,
        });
        const otp = order.generateDeliveryOtp();
        await order.save();

        // Notify vendor
        emitToRoom(`vendor_${vendorId}`, "new_order", order);
        emitToRoom("admin_room", "order_update", order);

        res.status(201).json({ success: true, order, deliveryOtp: otp });
    } catch (err) {
        next(err);
    }
};

// --- Vendor: Accept Order ---
export const vendorAcceptOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError("Order not found", 404);
        if (order.status !== "Placed") throw new AppError("Order cannot be accepted at this stage", 400);

        order.status = "Accepted by Vendor";
        order.vendorAcceptedAt = new Date();
        await order.save();

        emitToRoom(`customer_${order.customer}`, "order_update", order);
        emitToRoom("admin_room", "order_update", order);

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// --- Vendor: Mark Preparing ---
export const vendorStartPreparing = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError("Order not found", 404);
        if (order.status !== "Accepted by Vendor") throw new AppError("Cannot start preparing", 400);

        order.status = "Preparing";
        await order.save();

        emitToRoom(`customer_${order.customer}`, "order_update", order);
        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// --- Vendor: Mark Ready for Pickup ---
export const vendorMarkReady = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError("Order not found", 404);
        if (order.status !== "Preparing") throw new AppError("Order is not being prepared", 400);

        order.status = "Available for Delivery";
        order.vendorReadyAt = new Date();
        await order.save();

        // Notify agents
        emitToRoom("agent_room", "order_available", order);
        emitToRoom(`customer_${order.customer}`, "order_update", order);
        emitToRoom("admin_room", "order_update", order);

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// --- Vendor: Cancel (Reject) Order ---
export const vendorCancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError("Order not found", 404);
        if (["Delivered", "Cancelled"].includes(order.status)) {
            throw new AppError("Cannot cancel at this stage", 400);
        }

        order.status = "Cancelled";
        order.cancelledBy = "VENDOR";
        order.cancellationReason = req.body.reason || "Vendor cancelled";
        await order.save();

        emitToRoom(`customer_${order.customer}`, "order_update", order);
        emitToRoom("admin_room", "order_update", order);

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// --- Agent: Accept Order ---
export const agentAcceptOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError("Order not found", 404);
        if (order.status !== "Available for Delivery") throw new AppError("Order not available", 400);

        const agent = await User.findById(req.user._id);
        order.status = "Accepted by Agent";
        order.agentAcceptedAt = new Date();
        order.deliveryPartner = {
            agentId: agent._id,
            name: agent.name,
            location: {},
        };
        await order.save();

        emitToRoom(`vendor_${order.vendor}`, "order_update", order);
        emitToRoom(`customer_${order.customer}`, "order_update", order);
        emitToRoom("admin_room", "order_update", order);

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// --- Agent: Update Location ---
export const agentUpdateLocation = async (req, res, next) => {
    try {
        const { lat, lng } = req.body;
        const orders = await Order.find({
            "deliveryPartner.agentId": req.user._id,
            status: { $in: ["Accepted by Agent", "Out for Delivery"] },
        });

        for (const order of orders) {
            order.deliveryPartner.location = { lat, lng };
            await order.save();
            emitToRoom(`customer_order_${order._id}`, "agent_location_update", {
                orderId: order._id,
                location: { lat, lng },
            });
        }

        res.json({ success: true, message: "Location updated" });
    } catch (err) {
        next(err);
    }
};

// --- Agent: Deliver with OTP ---
export const agentDeliverOrder = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const order = await Order.findById(req.params.id).select("+deliveryOtp");
        if (!order) throw new AppError("Order not found", 404);

        if (!["Accepted by Agent", "Out for Delivery"].includes(order.status)) {
            throw new AppError("Order not in delivery stage", 400);
        }
        if (order.deliveryOtp !== otp) {
            throw new AppError("Invalid delivery OTP", 400);
        }

        order.status = "Delivered";
        order.deliveredAt = new Date();
        if (order.paymentMethod === "COD") order.paymentStatus = "PAID";
        await order.save();

        emitToRoom(`customer_${order.customer}`, "order_update", order);
        emitToRoom(`vendor_${order.vendor}`, "order_update", order);
        emitToRoom("admin_room", "order_update", order);

        // Update agent stats
        await User.findByIdAndUpdate(req.user._id, { $inc: { totalDeliveries: 1 } });

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// --- Customer: Get My Orders ---
export const getCustomerOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, startDate, endDate } = req.query;
        const filter = { customer: req.user._id };

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const orders = await Order.find(filter)
            .populate("vendor", "storeName logoUrl")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        const total = await Order.countDocuments(filter);
        res.json({ success: true, orders, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// --- Vendor: Get Vendor Orders ---
export const getVendorOrders = async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ owner: req.user._id });
        if (!vendor) throw new AppError("Vendor not found", 404);

        const { status, page = 1, limit = 20 } = req.query;
        const filter = { vendor: vendor._id };
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .populate("customer", "name email phone")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        const total = await Order.countDocuments(filter);
        res.json({ success: true, orders, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// --- Agent: Get Dashboard ---
export const getAgentDashboard = async (req, res, next) => {
    try {
        const available = await Order.find({ status: "Available for Delivery" })
            .populate("vendor", "storeName location")
            .sort({ createdAt: -1 })
            .lean();

        const active = await Order.find({
            "deliveryPartner.agentId": req.user._id,
            status: { $in: ["Accepted by Agent", "Out for Delivery"] },
        })
            .populate("vendor", "storeName location")
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, available, active });
    } catch (err) {
        next(err);
    }
};

// --- Admin: Get All Orders ---
export const adminGetOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 30, status, startDate, endDate } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const orders = await Order.find(filter)
            .populate("customer", "name email")
            .populate("vendor", "storeName")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        const total = await Order.countDocuments(filter);
        res.json({ success: true, orders, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// --- Admin/Agent: Update Order Status ---
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError("Order not found", 404);

        order.status = status;
        await order.save();

        emitToRoom(`customer_${order.customer}`, "order_update", order);
        emitToRoom(`vendor_${order.vendor}`, "order_update", order);
        emitToRoom("admin_room", "order_update", order);

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};

// --- Route Calculation ---
export const getDeliveryRoute = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        const { agentLat, agentLng } = req.query;

        if (!order?.deliveryLocation?.lat || !agentLat) {
            throw new AppError("Missing location data", 400);
        }

        const apiKey = process.env.OPENROUTESERVICE_KEY;
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${agentLng},${agentLat}&end=${order.deliveryLocation.lng},${order.deliveryLocation.lat}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.features?.[0]?.geometry?.coordinates) {
            throw new AppError("Could not calculate route", 500);
        }

        const path = data.features[0].geometry.coordinates.map((p) => [p[1], p[0]]);
        res.json({ success: true, path });
    } catch (err) {
        next(err);
    }
};

// --- Customer: Cancel Order ---
export const customerCancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError("Order not found", 404);
        if (order.customer.toString() !== req.user._id) {
            throw new AppError("Not your order", 403);
        }
        if (!["Placed", "Accepted by Vendor"].includes(order.status)) {
            throw new AppError("Cannot cancel at this stage", 400);
        }

        order.status = "Cancelled";
        order.cancelledBy = "CUSTOMER";
        order.cancellationReason = req.body.reason || "Customer cancelled";
        await order.save();

        emitToRoom(`vendor_${order.vendor}`, "order_update", order);
        emitToRoom("admin_room", "order_update", order);

        res.json({ success: true, order });
    } catch (err) {
        next(err);
    }
};
