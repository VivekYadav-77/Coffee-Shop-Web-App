import { Router } from "express";
import { ProductModel } from "../models/productschema.js";
import upload from "../config/cloudinary.config.js";
const adminroute = Router();

adminroute.post("/products", upload.single("image"), async (req, res) => {
  const io = req.app.get("socketio");
      console.log("hello from coudinary")

  try {
    const { name, price, description, category, roastLevel, inStock, notes } =
      req.body;
          console.log("hello from try")

    const newProduct = new ProductModel({
      name,
      price: parseFloat(price),
      description,
      category,
      roastLevel,
      inStock: inStock === "true",
      notes,
      imageUrl: req.file ? req.file.path: "",
    });
    await newProduct.save();
    io.emit("product_add", newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
console.log("hello from catch - THE ERROR IS:", error); // Will now print the detailed error
    res.status(500).json({ message: "Server error from me " });
  }
});

adminroute.put("/products/:id", upload.single("image"), async (req, res) => {
  const io = req.app.get("socketio");

  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    if (updateData.inStock) {
      updateData.inStock = updateData.inStock === "true";
    }
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    io.emit("product_update", updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH to toggle inStock status at /admin/products/:id/toggle-stock
adminroute.patch("/products/:id/toggle-stock", async (req, res) => {
  const io = req.app.get("socketio");

  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { inStock: !product.inStock },
      { new: true }
    );
    io.emit("product_update", updatedProduct);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a product at /admin/products/:id
adminroute.delete("/products/:id", async (req, res) => {
  const io = req.app.get("socketio");

  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    io.emit("product_delete", id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default adminroute;
