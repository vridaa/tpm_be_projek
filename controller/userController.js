import User from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// Register User
export const registerUser = async (req, res) => {
  try {
    const { nama, email, password, alamat } = req.body;

    // Validasi minimal
    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nama,
      email,
      password_hash: hashedPassword,
      alamat
    });

    const token = jwt.sign(
      { id: user.id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: "User berhasil dibuat",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nama', 'email', 'alamat', 'is_admin']
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'nama', 'email', 'alamat', 'foto_profil', 'is_admin']
    });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const { nama, email, alamat, password } = req.body;
    let password_hash = user.password_hash;

    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // Gunakan foto_profil dari req.body yang disediakan oleh UploadMiddleware
    let foto_profil = user.foto_profil;
    if (req.body.foto_profil) {
      foto_profil = req.body.foto_profil;
    }

    await user.update({
      nama: nama || user.nama,
      email: email || user.email,
      alamat: alamat || user.alamat,
      password_hash,
      foto_profil
    });

    res.status(200).json({
      message: "User berhasil diupdate",
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        alamat: user.alamat,
        foto_profil: user.foto_profil
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // Logika penghapusan foto profil dari GCS belum diimplementasikan di sini.
    // Untuk menghapus dari GCS, Anda perlu memanggil fungsi dari UploadMiddleware.
    // Untuk saat ini, kita hanya menghapus data user dari database.

    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
