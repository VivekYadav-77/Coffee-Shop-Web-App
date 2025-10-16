import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
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
      ],
      required: true,
    },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    imageUrl: { type: String },
    roastLevel: { type: String },
    notes: { type: String },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);
export { ProductModel };
