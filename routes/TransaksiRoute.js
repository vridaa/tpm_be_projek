import express from "express";
import {
  createTransaksi,
  getAllTransaksi,
  getTransaksiById,
  updateTransaksi,
  deleteTransaksi
} from "../controller/transaksiController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// CRUD Routes
router.post('/transaksi', verifyToken, createTransaksi);
router.get('/transaksi', verifyToken, getAllTransaksi);
router.get('/transaksi/:id', verifyToken, getTransaksiById);
router.put('/transaksi/:id', verifyToken, updateTransaksi);
router.delete('/transaksi/:id', verifyToken, deleteTransaksi);

export default router;