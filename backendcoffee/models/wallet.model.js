import mongoose from "mongoose";

const WalletTransactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["CREDIT", "DEBIT", "ESCROW_HOLD", "ESCROW_RELEASE", "REFUND"],
            required: true,
        },
        amount: { type: Number, required: true, min: 0 },
        description: { type: String, default: "" },
        relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        balanceAfter: { type: Number, required: true },
    },
    { timestamps: true }
);

WalletTransactionSchema.index({ user: 1, createdAt: -1 });

const WalletTransaction = mongoose.model("WalletTransaction", WalletTransactionSchema);
export default WalletTransaction;
