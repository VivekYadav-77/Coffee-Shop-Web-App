import { Router } from "express";
import { ProductModel } from "../models/productschema.js";
import multer from "multer";
import path from "path";
const adminroute = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/products/"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;

    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

adminroute.post("/products", upload.single("image"), async (req, res) => {
  const io = req.app.get("socketio");
  try {
    const { name, price, description, category, roastLevel, inStock, notes } =
      req.body;
    const newProduct = new ProductModel({
      name,
      price: parseFloat(price),
      description,
      category,
      roastLevel,
      inStock: inStock === "true",
      notes,
      imageUrl: req.file ? `/products/${req.file.filename}` : "",
    });
    await newProduct.save();
    io.emit("product_add", newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error from me " });
  }
});

// UPDATE a full product at /admin/products/:id
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
      updateData.imageUrl = `/products/${req.file.filename}`;
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
