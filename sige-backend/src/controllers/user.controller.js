// controllers/user.controller.js

import { User } from "../models/User.js";
import { ChangeLog } from "../models/ChangeLog.js";
import { createNotification } from "./notifications.controller.js";

// =======================================================
// 🛠 Obtener fecha/hora de Bogotá
// =======================================================
const fechaBogota = () => {
  const ahora = new Date();
  return new Date(ahora.getTime() - (5 * 60 * 60 * 1000)); // UTC-5
};

// =======================================================
// 👤 ACTUALIZAR PERFIL
// =======================================================
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    );

    return res.json({
      message: "Perfil actualizado correctamente",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error al actualizar perfil",
      error: err.message,
    });
  }
};

// =======================================================
// 👥 OBTENER TODOS LOS USUARIOS
// =======================================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch {
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// =======================================================
// 🔄 CAMBIAR ROL GENERAL
// =======================================================
export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const rolesValidos = ["admin_app", "coord_planeacion", "coord_icbf"];
    if (!rolesValidos.includes(role)) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const oldRole = usuario.role;
    usuario.role = role;
    await usuario.save();

    // Registrar auditoría
    await ChangeLog.create({
      user: usuario._id,
      email: usuario.email,
      changedBy: req.user?.email || "Sistema",
      action: "Cambio de rol",
      oldRole,
      newRole: role,
      createdAt: fechaBogota(),
    });

    // Notificación automática
    await createNotification({
      type: "info",
      title: "Cambio de rol",
      message: `El usuario ${usuario.email} ahora tiene el rol ${role}`,
    });

    return res.json({
      message: "Rol actualizado correctamente",
      user: usuario,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error al cambiar el rol",
      error: err.message,
    });
  }
};

// =======================================================
// 🛡 ASIGNAR ADMIN_APP
// =======================================================
export const setAdminRole = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const oldRole = usuario.role;
    usuario.role = "admin_app";
    await usuario.save();

    await ChangeLog.create({
      user: usuario._id,
      email: usuario.email,
      changedBy: req.user?.email || "Sistema",
      action: "Cambio de rol",
      oldRole,
      newRole: "admin_app",
      createdAt: fechaBogota(),
    });

    // Notificación automática
    await createNotification({
      type: "success",
      title: "Nuevo Administrador",
      message: `El usuario ${usuario.email} ahora es administrador de la aplicación.`,
    });

    return res.json({
      message: "Rol admin_app asignado correctamente",
      user: usuario,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error al asignar rol admin_app",
      error: err.message,
    });
  }
};

// =======================================================
// 🔁 DEVOLVER A COORDINACIÓN DE PLANEACIÓN
// =======================================================
export const setCoordPlaneacionRole = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const oldRole = usuario.role;
    usuario.role = "coord_planeacion";
    await usuario.save();

    await ChangeLog.create({
      user: usuario._id,
      email: usuario.email,
      changedBy: req.user?.email || "Sistema",
      action: "Cambio de rol",
      oldRole,
      newRole: "coord_planeacion",
      createdAt: fechaBogota(),
    });

    // Notificación automática
    await createNotification({
      type: "warning",
      title: "Rol actualizado",
      message: `El usuario ${usuario.email} fue asignado nuevamente como Coordinación de Planeación.`,
    });

    return res.json({
      message: "Rol cambiado correctamente",
      user: usuario,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error al cambiar rol",
      error: err.message,
    });
  }
};
