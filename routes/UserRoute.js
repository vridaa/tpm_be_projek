import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controller/userController.js";

const router = express.Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User CRUD Routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;