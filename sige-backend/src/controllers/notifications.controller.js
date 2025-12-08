// =======================================================
// controllers/notifications.controller.js
// Sistema de notificaciones SIGE — Optimizado
// =======================================================

import { Notification } from "../models/Notification.js";
import { fechaBogota } from "../utils/fechaBogota.js";

// =======================================================
// 📌 Crear notificación (general, por rol o por usuario)
// =======================================================
export const createNotification = async ({
  type = "info",
  title = "",
  message = "",
  user = null,
  roles = [],
}) => {
  try {
    await Notification.create({
      type,
      title,
      message,
      user,
      roles,
      createdAt: fechaBogota(),
      isRead: false,
    });
  } catch (err) {
    console.error("❌ Error creando notificación:", err.message);
  }
};

// =======================================================
// 📌 Obtener notificaciones del usuario logueado
// General + por rol + específicas
// GET /api/notifications/my
// =======================================================
export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const list = await Notification.find({
      $or: [
        { user: userId },       // para este usuario
        { roles: userRole },    // según su rol
        { user: null },         // notificaciones generales
      ]
    })
    .sort({ createdAt: -1 });

    res.json(list);

  } catch (err) {
    res.status(500).json({
      message: "Error obteniendo notificaciones",
      error: err.message,
    });
  }
};

// =======================================================
// 📌 Marcar notificación como leída
// =======================================================
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({ message: "Notificación marcada como leída" });
  } catch (err) {
    res.status(500).json({
      message: "Error marcando notificación",
      error: err.message,
    });
  }
};

// =======================================================
// 📌 Eliminar 1 notificación
// =======================================================
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notificación eliminada" });
  } catch (err) {
    res.status(500).json({
      message: "Error eliminando notificación",
      error: err.message,
    });
  }
};

// =======================================================
// 📌 Eliminar todas (del usuario y generales)
// =======================================================
export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      $or: [
        { user: req.user.id },
        { user: null },
      ],
    });

    res.json({ message: "Todas las notificaciones fueron eliminadas" });
  } catch (err) {
    res.status(500).json({
      message: "Error eliminando todas",
      error: err.message,
    });
  }
};
