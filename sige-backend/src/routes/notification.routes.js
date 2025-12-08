// =======================================================
// routes/notification.routes.js
// =======================================================

import { Router } from "express";
import {
  getMyNotifications,
  deleteNotification,
  deleteAllNotifications,
  markAsRead,
} from "../controllers/notifications.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/my", verifyToken, getMyNotifications);
router.put("/read/:id", verifyToken, markAsRead);
router.delete("/:id", verifyToken, deleteNotification);
router.delete("/", verifyToken, deleteAllNotifications);

export default router;
