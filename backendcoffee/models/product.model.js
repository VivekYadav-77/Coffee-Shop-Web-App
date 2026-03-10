import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Customer",
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, maxlength: 500 },
    },
    { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: [true, "Vendor is required"],
            index: true,
        },
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        description: { type: String, default: "", maxlength: 500 },
        category: {
            type: String,
            enum: [
                "coffee",
                "tea",
                "snacks",
                "dessert",
                "shake",
                "cookie",
                "sandwich",
                "cake",
                "beverage",
                "meal",
                "other",
            ],
            required: [true, "Category is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        cost: { type: Number, default: 0, min: 0 },
        inStock: { type: Boolean, default: true },
        imageUrl: { type: String, default: "" },
        roastLevel: { type: String, default: "" },
        notes: { type: String, default: "" },
        reviews: [reviewSchema],
        rating: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

ProductSchema.index({ vendor: 1, category: 1 });
ProductSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
