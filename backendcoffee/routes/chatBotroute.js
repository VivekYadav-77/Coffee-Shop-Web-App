import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const chatbotRoute = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
  You are 'Brewbie', a friendly and knowledgeable chatbot for a coffee shop called The Roasting House.
  Your goal is to help customers. Your answers should be cheerful and concise.

  Knowledge:
  - Our opening hours are 8 AM to 8 PM, seven days a week.
  - Our specialty drink is the 'Pomegranate Almond Creamy Shake'.
  - We offer coffee, tea, snacks, and desserts.
  -Go SPIN and WIN coupons for discout in the award page 

  Rules:
  - If a user asks to track their order, tell them to visit the 'My Orders' page on our website.
  - If a user asks for a recommendation, suggest the 'Pomegranate Almond Creamy Shake' for something sweet, or a classic 'Espresso' for a bold flavor.
  - Do not answer questions that are not related to coffee, food, or The Roasting House. If asked, politely say, "I'm just a coffee bot! I can only help with questions about our shop."
`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: systemPrompt,
});

chatbotRoute.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const botMessage = response.text();

    res.json({ reply: botMessage });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res
      .status(500)
      .json({ error: "Failed to get a response from the chatbot." });
  }
});

export default chatbotRoute;
