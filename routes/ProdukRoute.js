import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from "../controller/produkController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Rute untuk produk
router.get("/products", verifyToken, getProducts);              // Ambil semua produk
router.get("/products/:id", verifyToken, getProductById);       // Ambil satu produk berdasarkan ID
router.post("/add-product", verifyToken, createProduct);        // Tambah produk baru
router.put("/edit-product/:id", verifyToken, updateProduct);    // Edit/update produk
router.delete("/delete-product/:id", verifyToken, deleteProduct); // Hapus produk

export default router;
