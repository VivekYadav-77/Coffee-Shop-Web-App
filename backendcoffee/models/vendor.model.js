import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            unique: true,
        },
        storeName: {
            type: String,
            required: [true, "Store name is required"],
            trim: true,
            maxlength: [100, "Store name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: "",
        },
        logoUrl: { type: String, default: "" },
        bannerUrl: { type: String, default: "" },
        cuisine: {
            type: [String],
            default: ["coffee"],
        },
        address: {
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            state: { type: String, default: "" },
            pincode: { type: String, default: "" },
        },
        location: {
            lat: { type: Number },
            lng: { type: Number },
        },
        phone: { type: String, required: [true, "Phone number is required"] },

        // Operating Hours
        operatingHours: {
            open: { type: String, default: "08:00" },
            close: { type: String, default: "22:00" },
        },
        isOpen: { type: Boolean, default: true },

        // Metrics
        rating: { type: Number, default: 0, min: 0, max: 5 },
        totalOrders: { type: Number, default: 0 },
        estimatedPrepTime: { type: Number, default: 20 }, // minutes

        // Status
        isApproved: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },

        // Financials
        totalEarnings: { type: Number, default: 0 },
        pendingPayout: { type: Number, default: 0 },
    },
    { timestamps: true }
);

VendorSchema.index({ "location.lat": 1, "location.lng": 1 });
VendorSchema.index({ isApproved: 1, isActive: 1 });

const Vendor = mongoose.model("Vendor", VendorSchema);
export default Vendor;
