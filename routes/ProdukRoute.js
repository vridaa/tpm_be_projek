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
router.get("/products", verifyToken, getProducts);
router.get("/products/:id", verifyToken, getProductById);

// Gunakan 'buketImage' sebagai tipe upload
router.post(
  "/products",
  verifyToken, 
  uploadImage('buketImage'), // Menggunakan konfigurasi buketImage
  createProduct
);

router.put(
  "/products/:id",
  verifyToken,
  uploadImage('buketImage'), // Menggunakan konfigurasi buketImage
  updateProduct
);

router.delete("/products/:id", verifyToken, deleteProduct);

export default router;