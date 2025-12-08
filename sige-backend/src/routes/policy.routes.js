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
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", listPolicies);

router.post(
  "/upload",
  verifyToken,
  allowRoles("admin_app"),
  upload.single("file"),
  uploadPolicy
);

router.put(
  "/:id",
  verifyToken,
  allowRoles("admin_app"),
  updatePolicy
);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin_app"),
  deletePolicy
);

router.get("/test-firebase", testFirebase);

export default router;
