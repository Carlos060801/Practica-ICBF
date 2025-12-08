// routes/bienestar.routes.js

import { Router } from "express";
import {
  listBienestarPolicies,
  listBienestarByCategory,
} from "../controllers/bienestar.controller.js";

const router = Router();

// 🔹 Todas las políticas agrupadas por pilares
router.get("/", listBienestarPolicies);

// 🔹 Políticas de un pilar (ej: /bienestar/sgsi)
router.get("/:category", listBienestarByCategory);

export default router;
