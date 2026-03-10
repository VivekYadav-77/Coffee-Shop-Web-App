import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            index: true,
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true, min: 1, max: 50 },
            },
        ],
    },
    { timestamps: true }
);

CartSchema.index({ userId: 1, vendor: 1 }, { unique: true });

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
