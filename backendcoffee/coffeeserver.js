import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { checkforauthcookie } from "./middleware/authcookiemiddle.js";
import mongoconnectionforCoffee from "./connection/mongoconnection.js";
import orderrouter from "./routes/orderroute.js";
import cartrouter from "./routes/cartroute.js";
import conf from "./config/config.js";
import adminrouter from "./routes/adminrouter.js";
import { ProductModel } from "./models/productschema.js";
import { userrouter } from "./routes/authrouter.js";
import {
  adminMiddleware,
  authMiddleware,
  customerMiddleware,
} from "./middleware/authvalidatemiddleware.js";
import analyticrouter from "./routes/analytics.js";
import chatbotRoute from "./routes/chatBotroute.js";
import productreviewrouter from "./routes/productReviewroute.js";
import couponrouter from "./routes/cuponroute.js";
import { startTokenCleanupJob } from "./expiretokenDelete.js/tokenCleanupJob.js";
import dotenv from "dotenv";
dotenv.config();
const frontednapi = process.env.FRONTEND_ADDRESS;
const PORT = process.env.PORT || 3000
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: `${frontednapi}` } });
app.set("socketio", io);
mongoconnectionforCoffee(conf.dburl)
  .then((res) => console.log("mongodb is connected"))
  .catch((err) => console.log(`error occured ${err}`));
app.use(
  cors({
    origin: `${frontednapi}`,
    credentials: true,
  })
);
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });
});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(express.json());
app.use(checkforauthcookie("token"));
app.get("/products", async (req, res) => {
  const products = await ProductModel.find({});
  return res.json({ products: products });
});
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id).populate(
      "reviews.user",
      "name"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ product: product });
  } catch (error) {
    res.status(500).json({ message: "Server Error fro the get one " });
  }
});
app.use("/auth", userrouter);
app.use("/productreview", productreviewrouter);
app.use("/admin", adminMiddleware, adminrouter);
app.use("/analytics", authMiddleware, analyticrouter);
app.use("/coupons", authMiddleware, couponrouter);
app.use("/orders", authMiddleware, orderrouter);
app.use("/bot", chatbotRoute);
app.use("/cart", authMiddleware, customerMiddleware, cartrouter);
startTokenCleanupJob();
server.listen(PORT, () => {
  console.log(`server is running on the port ${PORT}`);
});
