// routes/policy.routes.js
import { Router } from "express";
import multer from "multer";

import {
  listPolicies,
  uploadPolicy,
  updatePolicy,
  deletePolicy,
  testFirebase
} from "../controllers/policy.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roles.middleware.js";

const router = Router();

/* ===========================================================
   ⚙️ MULTER CONFIG memoryStorage()
   Guarda archivos EN MEMORIA (obligatorio para Firebase)
=========================================================== */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ===========================================================
   📋 LISTAR POLÍTICAS (público)
=========================================================== */
router.get("/", listPolicies);

/* ===========================================================
   🔼 SUBIR NUEVO PDF A FIREBASE
   - Solo rol admin_app
=========================================================== */
router.post(
  "/upload",
  verifyToken,
  allowRoles("admin_app"),
  upload.single("file"),  // PDF
  uploadPolicy
);

/* ===========================================================
   ✏️ EDITAR POLÍTICA
=========================================================== */
router.put(
  "/:id",
  verifyToken,
  allowRoles("admin_app"),
  updatePolicy
);

/* ===========================================================
   🗑 ELIMINAR POLÍTICA
=========================================================== */
router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin_app"),
  deletePolicy
);

/* ===========================================================
   🔍 TEST FIREBASE STORAGE
=========================================================== */
router.get("/test-firebase", testFirebase);

export default router;
