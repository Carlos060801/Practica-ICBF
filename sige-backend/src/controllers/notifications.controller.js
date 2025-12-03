import { Notification } from "../models/Notification.js";
import { fechaBogota } from "../utils/fechaBogota.js";

// Crear una notificación automática
export const createNotification = async ({ type, title, message }) => {
  try {
    await Notification.create({
      type,
      title,
      message,
      timestamp: fechaBogota(), // 🔥 Hora de Bogotá
    });
  } catch (err) {
    console.error("❌ Error creando notificación:", err.message);
  }
};

// Obtener todas
export const getNotifications = async (req, res) => {
  try {
    const list = await Notification.find().sort({ timestamp: -1 });
    res.json(list);
  } catch {
    res.status(500).json({ error: "Error obteniendo notificaciones" });
  }
};

// Borrar una
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notificación eliminada" });
  } catch {
    res.status(500).json({ error: "Error eliminando notificación" });
  }
};

// Borrar todas
export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: "Todas las notificaciones eliminadas" });
  } catch {
    res.status(500).json({ error: "Error borrando todas" });
  }
};
