import { Router } from "express";
import { verifyToken, allowRoles } from "../middleware/auth.middleware.js";
import { getUserLogs, getAllLogs, clearChangeLogs } from "../controllers/change_log.controller.js";

const router = Router();

// Historial propio
router.get(
  "/user",
  verifyToken,
  getUserLogs
);

// Historial completo (solo admin y planeación)
router.get(
  "/all",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion"),
  getAllLogs
);

// Limpiar historial (solo coordinación)
router.delete(
  "/clear",
  verifyToken,
  allowRoles("coord_planeacion"),
  clearChangeLogs
);

export default router;
