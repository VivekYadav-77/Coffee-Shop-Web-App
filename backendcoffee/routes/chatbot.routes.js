import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireAuth } from "../middleware/auth.middleware.js";
import dotenv from "dotenv";
dotenv.config();

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are 'Brewbie', a friendly and knowledgeable chatbot for The Roasting House — a multi-vendor food platform.
Your goal is to help customers. Your answers should be cheerful, concise, and helpful.

// --- Knowledge Base ---
- We are a multi-vendor platform. Multiple restaurants and cafes sell their food through us.
- Our opening hours vary by vendor, but most are open 8 AM to 10 PM.
- Customers can browse vendors, view menus, add items to cart, and place orders.
- We offer Cash on Delivery (COD) and Wallet payments.
- Go to the 'Awards' section on our website to spin the wheel and win discount coupons!

// --- Chat Rules ---
- If a user asks to track their order, tell them to visit the 'My Orders' page.
- If a user has a complaint about an order, tell them to go to 'My Orders' and click 'Report Issue' to raise a dispute.
- If a user asks about becoming a vendor, tell them to sign up and select 'Vendor' during registration.
- Do NOT answer questions unrelated to food, our platform, or deliveries.
`;

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
});

router.post("/chat", async (req, res, next) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const chat = model.startChat({ history: history || [] });
        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        res.json({ success: true, reply });
    } catch (err) {
        console.error("Chatbot error:", err);
        res.status(500).json({ success: false, message: "Chatbot unavailable" });
    }
});

export default router;
