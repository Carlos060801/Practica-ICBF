// =======================================================
// routes/auth.routes.js
// =======================================================

import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

// =========================
// Login
// =========================
router.post("/login", login);

// =========================
// Ruta de prueba
// =========================
router.get("/test", (req, res) => {
  res.json({
    ok: true,
    message: "Ruta /api/auth/test funcionando correctamente 🚀",
  });
});

export default router;
