import { Router } from "express";
import { listAudit } from "../controllers/audit.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roles.middleware.js";

const router = Router();

// Solo el rol principal_icbf puede ver auditoría
router.get(
  "/",
  verifyToken,
  allowRoles("principal_icbf"),
  listAudit
);

export default router;
