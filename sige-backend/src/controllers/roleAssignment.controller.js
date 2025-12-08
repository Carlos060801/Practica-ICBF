import { RoleAssignment } from "../models/RoleAssignment.js";

export const listRoleAssignments = async (req, res) => {
  try {
    const list = await RoleAssignment.find()
      .populate("user_assigned", "nombre correo")
      .populate("user_assigner", "nombre correo")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo asignaciones", error: err.message });
  }
};
