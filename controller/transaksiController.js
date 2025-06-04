import Transaksi from "../models/TransaksiModel.js";

// CREATE: Buat transaksi baru
export const createTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.create(req.body);
    res.status(201).json({
      message: "Transaksi berhasil dibuat",
      data: transaksi
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Ambil semua transaksi
export const getAllTransaksi = async (req, res) => {
  try {
    const transaksiList = await Transaksi.findAll();
    res.status(200).json(transaksiList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Ambil transaksi by ID
export const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id);
    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
    res.status(200).json(transaksi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update transaksi
export const updateTransaksi = async (req, res) => {
  try {
    const [updated] = await Transaksi.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedTransaksi = await Transaksi.findByPk(req.params.id);
      return res.status(200).json({
        message: "Transaksi berhasil diupdate",
        data: updatedTransaksi
      });
    }
    res.status(404).json({ message: "Transaksi tidak ditemukan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Hapus transaksi
export const deleteTransaksi = async (req, res) => {
  try {
    const deleted = await Transaksi.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.status(200).json({ message: "Transaksi berhasil dihapus" });
    }
    res.status(404).json({ message: "Transaksi tidak ditemukan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createTransaksi,
  getAllTransaksi,
  getTransaksiById,
  updateTransaksi,
  deleteTransaksi
};