import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  lat: { type: Number },
  lng: { type: Number },
});

const deliveryPartnerSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  name: { type: String },
  location: { type: locationSchema },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [{ name: String, price: Number, cost: Number, quantity: Number }],
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 50 },
    deliveryAddress: { type: String, required: true },
    deliveryLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
    status: {
      type: String,
      enum: [
        "Confirmed",
        "Preparing",
        "Packed",
        "Available for Delivery",
        "Accepted by Agent",
        "Out for Delivery",
        "Delivered",
      ],
      default: "Confirmed",
    },
    deliveryOtp: { type: String },
    deliveryPartner: { type: deliveryPartnerSchema },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);
export { OrderModel };
