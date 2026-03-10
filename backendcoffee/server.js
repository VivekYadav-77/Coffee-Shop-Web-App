/**
 * ============================================
 *  The Roasting House — Multi-Vendor Platform
 *  Production-Grade Server Entry Point
 * ============================================
 */
import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Config
dotenv.config();
import conf from "./config/config.js";
import mongoconnectionforCoffee from "./connection/mongoconnection.js";

// Middleware
import { extractUser } from "./middleware/auth.middleware.js";
import errorHandler from "./middleware/errorHandler.js";

// Services
import { initializeSocket } from "./services/socket.service.js";
import { startTokenCleanupJob } from "./expiretokenDelete.js/tokenCleanupJob.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import disputeRoutes from "./routes/dispute.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import couponRoutes from "./routes/coupon.routes.js";

// --- App Setup ---
const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_ADDRESS || "http://localhost:5173";

// --- Security ---
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
    })
);

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    })
);

// Global rate limiter
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many requests. Please wait before trying again.",
        });
    },
});
app.use(globalLimiter);

// Auth-specific strict rate limiter
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    handler: (_req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many authentication attempts. Please wait 15 minutes.",
        });
    },
});

// --- Parsers ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

// --- Extract User from Cookie (non-blocking) ---
app.use(extractUser);

// --- HTTP + Socket.IO Server ---
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: FRONTEND_URL, credentials: true },
});
initializeSocket(io);

// --- Database ---
mongoconnectionforCoffee(conf.dburl)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB error:", err));

// --- Routes ---
app.use("/auth", authLimiter, authRoutes);
app.use("/vendors", vendorRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/disputes", disputeRoutes);
app.use("/wallet", walletRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/bot", chatbotRoutes);
app.use("/coupons", couponRoutes);

// Health check
app.get("/health", (_req, res) => {
    res.json({ success: true, message: "Server is healthy", timestamp: new Date().toISOString() });
});

// --- Global Error Handler (must be last) ---
app.use(errorHandler);

// --- Cron Jobs ---
startTokenCleanupJob();

// --- Start Server ---
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Frontend: ${FRONTEND_URL}`);
});
