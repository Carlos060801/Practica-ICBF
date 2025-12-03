import { Router } from "express";
import { 
  getNotifications, 
  deleteNotification, 
  deleteAllNotifications 
} from "../controllers/notifications.controller.js";

const router = Router();

router.get("/", getNotifications);
router.delete("/:id", deleteNotification);
router.delete("/", deleteAllNotifications);

export default router;
