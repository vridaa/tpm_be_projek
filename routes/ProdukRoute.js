import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from "../controller/produkController.js";

const router = express.Router();

// Rute untuk produk
router.get("/products", getProducts);              // Ambil semua produk
router.get("/products/:id", getProductById);       // Ambil satu produk berdasarkan ID
router.post("/add-product", createProduct);        // Tambah produk baru
router.put("/edit-product/:id", updateProduct);    // Edit/update produk
router.delete("/delete-product/:id", deleteProduct); // Hapus produk

export default router;
