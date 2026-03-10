import mongoose from "mongoose";

const DisputeSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        raisedByRole: {
            type: String,
            enum: ["CUSTOMER", "AGENT", "VENDOR"],
            required: true,
        },
        againstRole: {
            type: String,
            enum: ["CUSTOMER", "AGENT", "VENDOR", "SYSTEM"],
            required: true,
        },
        type: {
            type: String,
            enum: [
                "FAKE_DELIVERY",         // Agent marked delivered without OTP
                "MISSING_ITEMS",         // Customer: items missing from order
                "WRONG_ITEMS",           // Customer: received wrong items
                "DAMAGED_ORDER",         // Customer: order arrived damaged/spilled
                "AGENT_ABANDONMENT",     // System: agent abandoned delivery mid-route
                "EXCESSIVE_WAIT",        // Agent: waited too long at vendor
                "VENDOR_DELAY",          // System: vendor exceeded prep time
                "QUALITY_ISSUE",         // Customer: food quality complaint
                "PAYMENT_ISSUE",         // Any payment-related dispute
                "OTHER",
            ],
            required: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            maxlength: 1000,
        },
        evidenceUrls: [{ type: String }],  // Photo proof uploads

        status: {
            type: String,
            enum: ["OPEN", "UNDER_REVIEW", "RESOLVED", "DISMISSED"],
            default: "OPEN",
        },
        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "MEDIUM",
        },
        resolution: {
            type: String,
            default: "",
            maxlength: 1000,
        },
        resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        resolvedAt: { type: Date },

        // Financial impact
        refundAmount: { type: Number, default: 0 },
        penaltyAmount: { type: Number, default: 0 },
        penaltyAppliedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
        },
    },
    { timestamps: true }
);

DisputeSchema.index({ order: 1 });
DisputeSchema.index({ status: 1, priority: -1 });
DisputeSchema.index({ raisedBy: 1 });

const Dispute = mongoose.model("Dispute", DisputeSchema);
export default Dispute;
