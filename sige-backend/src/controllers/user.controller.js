// =======================================================
// controllers/user.controller.js — VERSION FIREBASE COMPLETA
// =======================================================

import { User } from "../models/User.js";
import { ChangeLog } from "../models/ChangeLog.js";
import { createNotification } from "./notifications.controller.js";
import { bucket } from "../config/firebase.js";

// =======================================================
// FECHA BOGOTÁ
// =======================================================
const fechaBogota = () => new Date(Date.now() - 5 * 60 * 60 * 1000);

// =======================================================
// GET PROFILE
// =======================================================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({
      message: "Error obteniendo perfil",
      error: err.message,
    });
  }
};

// =======================================================
// UPDATE PROFILE (Nombre, Teléfono y Foto BASE64 → FIREBASE)
// =======================================================
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, photoBase64 } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // ================= FOTO BASE64 → FIREBASE =================
    if (bucket && photoBase64?.startsWith("data:image")) {
      try {
        const base64 = photoBase64.split(",")[1];
        const buffer = Buffer.from(base64, "base64");

        const fileName = `perfiles/${req.user.id}-${Date.now()}.jpg`;
        const file = bucket.file(fileName);

        await file.save(buffer, {
          metadata: { contentType: "image/jpeg" },
          public: true,
        });

        updateData.photo = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      } catch (err) {
        console.error("❌ Error subiendo imagen:", err.message);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    await ChangeLog.create({
      user: user._id,
      email: user.email,
      changedBy: req.user.email,
      action: "Actualización de perfil",
      details: JSON.stringify(updateData),
      createdAt: fechaBogota(),
    });

    res.json({
      message: "Perfil actualizado correctamente",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al actualizar perfil",
      error: err.message,
    });
  }
};

// =======================================================
// UPLOAD PHOTO (MULTIPART) → FIREBASE
// =======================================================
export const uploadPhoto = async (req, res) => {
  try {
    if (!bucket) {
      return res.status(500).json({ message: "Firebase no inicializado" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No se envió ninguna imagen" });
    }

    const user = await User.findById(req.user.id);

    // -------- eliminar foto anterior ----------
    if (user.photo) {
      try {
        const marker = `${bucket.name}/`;
        const idx = user.photo.indexOf(marker);
        if (idx !== -1) {
          const oldPath = user.photo.substring(idx + marker.length);
          await bucket.file(oldPath).delete().catch(() => {});
        }
      } catch {}
    }

    const fileName = `perfiles/${req.user.id}-${Date.now()}.jpg`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
      public: true,
    });

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    user.photo = imageUrl;
    await user.save();

    await ChangeLog.create({
      user: user._id,
      email: user.email,
      changedBy: req.user.email,
      action: "Actualización de foto",
      createdAt: fechaBogota(),
    });

    res.json({
      message: "Foto actualizada correctamente",
      photoUrl: imageUrl,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al subir foto",
      error: err.message,
    });
  }
};

// =======================================================
// DELETE PHOTO
// =======================================================
export const deletePhoto = async (req, res) => {
  try {
    if (!bucket) {
      return res.status(500).json({ message: "Firebase no inicializado" });
    }

    const user = await User.findById(req.user.id);
    if (!user.photo) {
      return res.status(400).json({ message: "El usuario no tiene foto" });
    }

    try {
      const marker = `${bucket.name}/`;
      const idx = user.photo.indexOf(marker);
      if (idx !== -1) {
        const path = user.photo.substring(idx + marker.length);
        await bucket.file(path).delete().catch(() => {});
      }
    } catch {}

    user.photo = "";
    await user.save();

    await ChangeLog.create({
      user: user._id,
      email: user.email,
      changedBy: req.user.email,
      action: "Foto eliminada",
      createdAt: fechaBogota(),
    });

    res.json({ message: "Foto eliminada correctamente" });
  } catch (err) {
    res.status(500).json({
      message: "Error eliminando foto",
      error: err.message,
    });
  }
};

// =======================================================
// GET ALL USERS
// =======================================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener usuarios",
      error: err.message,
    });
  }
};

// =======================================================
// CHANGE ROLE (GENÉRICO)
// =======================================================
export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["admin_app", "coord_planeacion", "colaborador"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await ChangeLog.create({
      user: user._id,
      email: user.email,
      changedBy: req.user.email,
      action: "Cambio de rol",
      oldRole,
      newRole: role,
      createdAt: fechaBogota(),
    });

    await createNotification({
      type: "warning",
      title: "Cambio de rol",
      message: `Tu rol fue cambiado a ${role}`,
      roles: [role],
    });

    res.json({
      message: "Rol actualizado correctamente",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al cambiar rol",
      error: err.message,
    });
  }
};

// =======================================================
// SET ADMIN ROLE
// =======================================================
export const setAdminRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const oldRole = user.role;
    user.role = "admin_app";
    await user.save();

    await ChangeLog.create({
      user: user._id,
      email: user.email,
      changedBy: req.user.email,
      action: "Asignar rol admin_app",
      oldRole,
      newRole: "admin_app",
      createdAt: fechaBogota(),
    });

    res.json({
      message: "Rol admin_app asignado correctamente",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error asignando rol admin",
      error: err.message,
    });
  }
};

// =======================================================
// SET COORD_PLANEACION ROLE
// =======================================================
export const setCoordPlaneacionRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const oldRole = user.role;
    user.role = "coord_planeacion";
    await user.save();

    await ChangeLog.create({
      user: user._id,
      email: user.email,
      changedBy: req.user.email,
      action: "Asignar rol coord_planeacion",
      oldRole,
      newRole: "coord_planeacion",
      createdAt: fechaBogota(),
    });

    res.json({
      message: "Rol coord_planeacion asignado correctamente",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error asignando rol coordinación",
      error: err.message,
    });
  }
};
