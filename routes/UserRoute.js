import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controller/userController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { uploadImage } from "../middleware/UploadMiddleware.js";
const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User CRUD Routes
router.get('/users', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);
router.put(
  '/users/:id',
  verifyToken,
  uploadImage('profilePicture'), // Use appropriate type
  updateUser
);
router.delete('/users/:id', verifyToken, deleteUser);

export default router;