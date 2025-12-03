import { Router } from "express";
import { listRoleAssignments } from "../controllers/roleAssignment.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/roles.middleware.js";

const router = Router();

// Solo principal_icbf puede ver asignaciones
router.get(
  "/",
  verifyToken,
  allowRoles("principal_icbf"),
  listRoleAssignments
);

export default router;
