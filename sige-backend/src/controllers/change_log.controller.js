// =======================================================
// controllers/change_log.controller.js
// =======================================================

import { ChangeLog } from "../models/ChangeLog.js";

// 📌 Historial del usuario logueado
export const getUserLogs = async (req, res) => {
  try {
    const logs = await ChangeLog.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener historial",
      error: err.message,
    });
  }
};

// 📌 Historial completo
export const getAllLogs = async (req, res) => {
  try {
    const logs = await ChangeLog.find()
      .populate("user", "name email role photo")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener logs",
      error: err.message,
    });
  }
};

// 📌 Eliminar Historial
export const clearChangeLogs = async (req, res) => {
  try {
    await ChangeLog.deleteMany({});
    res.json({ message: "Historial limpiado correctamente" });
  } catch (err) {
    res.status(500).json({
      message: "Error al limpiar historial",
      error: err.message,
    });
  }
};
