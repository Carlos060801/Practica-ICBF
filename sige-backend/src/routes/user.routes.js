import { Router } from "express";
import { verifyToken, allowRoles } from "../middleware/auth.middleware.js";
import {
  updateProfile,
  getAllUsers,
  changeUserRole,
  setAdminRole,
  setCoordPlaneacionRole
} from "../controllers/user.controller.js";

const router = Router();

// ===================================================
// EDITAR PERFIL DE USUARIO LOGUEADO
// ===================================================
router.put("/update-profile", verifyToken, updateProfile);

// ===================================================
// OBTENER TODOS LOS USUARIOS
// Roles permitidos: admin_app, coord_planeacion, coord_icbf
// ===================================================
router.get(
  "/all",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion", "coord_icbf"),
  getAllUsers
);

// ===================================================
// CAMBIAR ROL GENERAL
// Ej: PUT /api/user/:id/role  { role: "coord_planeacion" }
// ===================================================
router.put(
  "/:id/role",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion", "coord_icbf"),
  changeUserRole
);

// ===================================================
// ASIGNAR ROL ADMIN_APP
// Ej: PUT /api/user/:id/set-admin
// ===================================================
router.put(
  "/:id/set-admin",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion", "coord_icbf"),
  setAdminRole
);

// ===================================================
// DEVOLVER A COORDINACIÓN DE PLANEACIÓN
// Ej: PUT /api/user/:id/set-planeacion
// ===================================================
router.put(
  "/:id/set-planeacion",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion", "coord_icbf"),
  setCoordPlaneacionRole
);

export default router;
