import express from "express";
import { ProductModel } from "../models/productschema.js";
import { authMiddleware } from "../middleware/authvalidatemiddleware.js";

const productreviewrouter = express.Router();
productreviewrouter.post("/:id/reviews", authMiddleware, async (req, res) => {
  const io = req.app.get("socketio");
  try {
    const { rating, comment } = req.body;
    const product = await ProductModel.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Product already reviewed" });
      }

      const review = {
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();

      const updatedProduct = await ProductModel.findById(
        req.params.id
      ).populate("reviews.user", "name");
      io.emit("product_update", updatedProduct);
      res.status(201).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default productreviewrouter;
