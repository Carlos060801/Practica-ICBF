// =======================================================
// routes/auth.routes.js
// =======================================================

import { Router } from "express";
import {
  register,
  login,
  changePassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// =========================
// Rutas reales del sistema
// =========================

// Registro
router.post("/register", register);

// Login
router.post("/login", login);

// Cambio de contraseña
router.post("/change-password", verifyToken, changePassword);

// =========================
// Ruta de prueba (GET)
// =========================
router.get("/test", (req, res) => {
  res.json({
    ok: true,
    message: "Ruta /api/auth/test funcionando correctamente 🚀",
    info: "Backend SIGE operativo",
    fecha: new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
    }),
  });
});

// =========================
export default router;
