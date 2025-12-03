import { Router } from "express";
import { verifyToken, allowRoles } from "../middleware/auth.middleware.js";
import { getChangeLogs, clearChangeLogs } from "../controllers/change_log.controller.js";

const router = Router();

// Obtener historial
router.get(
  "/logs",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion", "coord_icbf"),
  getChangeLogs
);

// Limpiar historial — solo coord_planeacion
router.delete(
  "/clear",
  verifyToken,
  allowRoles("coord_planeacion"),
  clearChangeLogs
);

export default router;
