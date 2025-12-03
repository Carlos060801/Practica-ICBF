import { Router } from "express";
import {
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roles.middleware.js";

const router = Router();

/**
 * Rutas para categorías
 * Solo admin_app puede crear, editar y eliminar
 */

router.get("/", listCategories);

router.post(
  "/",
  verifyToken,
  allowRoles("admin_app"),
  createCategory
);

router.put(
  "/:id",
  verifyToken,
  allowRoles("admin_app"),
  updateCategory
);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin_app"),
  deleteCategory
);

export default router;
