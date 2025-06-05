import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from "../controller/produkController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { uploadImage } from "../middleware/UploadMiddleware.js";

const router = express.Router();

// Rute untuk produk
router.get("/products", verifyToken, getProducts);              // Ambil semua produk
router.get("/products/:id", verifyToken, getProductById);       // Ambil satu produk berdasarkan ID
router.post("/add-product", verifyToken, uploadImage('image_url'), createProduct);        // Tambah produk baru dengan upload gambar
router.put("/edit-product/:id", verifyToken, uploadImage('image_url'), updateProduct);    // Edit/update produk dengan upload gambar
router.delete("/delete-product/:id", verifyToken, deleteProduct); // Hapus produk

export default router;
