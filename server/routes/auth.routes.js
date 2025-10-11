import express from "express";
import {
  register,
  login,
  me,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// POST /auth/register
router.post("/register", register);

// POST /auth/login
router.post("/login", login);
router.get("/me", authenticateToken, me);

//
router.patch("/update", authenticateToken, updateProfile);
router.patch("/change-password", authenticateToken, changePassword);

export default router;
