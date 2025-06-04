import express from "express";
import {
  createTransaksi,
  getAllTransaksi,
  getTransaksiById,
  updateTransaksi,
  deleteTransaksi
} from "../controller/transaksiController.js";

const router = express.Router();

// CRUD Routes
router.post('/transaksi', createTransaksi);
router.get('/transaksi', getAllTransaksi);
router.get('/transaksi/:id', getTransaksiById);
router.put('/transaksi/:id', updateTransaksi);
router.delete('/transaksi/:id', deleteTransaksi);

export default router;