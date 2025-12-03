import { ChangeLog } from "../models/ChangeLog.js";

// ======================================================
// OBTENER HISTORIAL COMPLETO
// ======================================================
export const getChangeLogs = async (req, res) => {
  try {
    const logs = await ChangeLog.find().sort({ createdAt: -1 });

    return res.json(logs);
  } catch (err) {
    return res.status(500).json({
      message: "Error al obtener historial",
      error: err.message,
    });
  }
};

// ======================================================
// LIMPIAR HISTORIAL (solo coord_planeacion)
// ======================================================
export const clearChangeLogs = async (req, res) => {
  try {
    if (req.user.role !== "coord_planeacion") {
      return res.status(403).json({ message: "No autorizado" });
    }

    await ChangeLog.deleteMany();

    return res.json({ message: "Historial limpiado correctamente" });
  } catch (err) {
    return res.status(500).json({
      message: "Error al limpiar historial",
      error: err.message,
    });
  }
};
