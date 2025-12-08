import { Router } from "express";
import multer from "multer";
import { verifyToken, allowRoles } from "../middleware/auth.middleware.js";

import {
  getProfile,
  updateProfile,
  uploadPhoto,
  deletePhoto,  // ✅ Esta función sí existe en tu user.controller.js
  getAllUsers,
  changeUserRole,
  setAdminRole,
  setCoordPlaneacionRole,
} from "../controllers/user.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


// =======================================================
// 📌 PERFIL
// =======================================================
router.get("/profile", verifyToken, getProfile);
router.put("/update-profile", verifyToken, updateProfile);


// =======================================================
// 📌 FOTO DE PERFIL
// =======================================================

// subir foto (multipart/form-data)
router.post(
  "/upload-photo",
  verifyToken,
  upload.single("photo"),
  uploadPhoto
);

// eliminar foto
router.delete(
  "/delete-photo",
  verifyToken,
  deletePhoto   // ✅ Corregido y emparejado correctamente
);


// =======================================================
// 📌 OBTENER TODOS LOS USUARIOS
// =======================================================
router.get(
  "/all",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion"),
  getAllUsers
);


// =======================================================
// 📌 CAMBIO DE ROLES
// =======================================================

router.put(
  "/:id/role",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion"),
  changeUserRole
);

// asignar rol admin_app
router.put(
  "/:id/set-admin",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion"),
  setAdminRole
);

// asignar rol coord_planeacion
router.put(
  "/:id/set-planeacion",
  verifyToken,
  allowRoles("admin_app", "coord_planeacion"),
  setCoordPlaneacionRole
);


export default router;
