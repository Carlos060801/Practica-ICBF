// =======================================================
// routes/auth.routes.js
// =======================================================

import { Router } from "express";
import { register, login, changePassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// Registro
router.post("/register", register);

// Login
router.post("/login", login);

// Cambio de contraseña
router.post("/change-password", verifyToken, changePassword);

export default router;
