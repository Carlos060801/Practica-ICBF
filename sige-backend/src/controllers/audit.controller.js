// controllers/audit.controller.js
import { Audit } from "../models/Audit.js";

export const listAudit = async (req, res) => {
  try {
    const logs = await Audit.find()
      .populate("user_id", "nombre correo role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo auditoría", error: err.message });
  }
};
