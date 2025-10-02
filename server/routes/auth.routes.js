import express from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// POST /auth/register
router.post("/register", register);

// POST /auth/login
router.post("/login", login);
router.get("/me", authenticateToken, me);

export default router;
