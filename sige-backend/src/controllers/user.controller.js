// =======================================================
// controllers/user.controller.js — VERSION FIREBASE COMPLETA
// =======================================================

import { User } from "../models/User.js";
import { ChangeLog } from "../models/ChangeLog.js";
import { createNotification } from "./notifications.controller.js";
import bucket from "../config/firebase.js"; // 🔥 Firebase Storage

// =======================================================
// FECHA BOGOTÁ
// =======================================================
const fechaBogota = () =>
  new Date(Date.now() - 5 * 60 * 60 * 1000);

// =======================================================
// GET PROFILE
// =======================================================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

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

    // =============================================
    // FOTO BASE64 → Convertir y subir a Firebase
    // =============================================
    if (photoBase64 && photoBase64.startsWith("data:image")) {
      try {
        const base64 = photoBase64.split(",")[1];
        const buffer = Buffer.from(base64, "base64");

        const fileName = `perfiles/${req.user.id}-${Date.now()}.jpg`;
        const file = bucket.file(fileName);

        await file.save(buffer, {
          metadata: { contentType: "image/jpeg" },
          public: true,
        });

        const downloadURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        updateData.photo = downloadURL;

      } catch (err) {
        console.log("❌ Error subiendo imagen a Firebase:", err.message);
      }
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    }).select("-password");

    await ChangeLog.create({
      user: user._id,
      email: user.email,
      changedBy: req.user.email,
      action: "Actualización de perfil",
      details: JSON.stringify(updateData),
      createdAt: fechaBogota(),
    });

    res.json({ message: "Perfil actualizado correctamente", user });

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
    if (!req.file)
      return res.status(400).json({ message: "No se envió ninguna imagen" });

    const user = await User.findById(req.user.id);

    // =============================================
    // Si tiene foto previa: eliminarla
    // =============================================
    if (user.photo) {
      try {
        let photoPath = "";

        const marker = `${bucket.name}/`;
        const index = user.photo.indexOf(marker);

        if (index !== -1) {
          photoPath = user.photo.substring(index + marker.length);
        } else {
          const parts = user.photo.split("/");
          photoPath = parts.slice(-2).join("/");
        }

        await bucket.file(photoPath).delete().catch(() => {});
      } catch (err) {
        console.log("⚠ Error borrando foto anterior:", err.message);
      }
    }

    // =============================================
    // Subida nueva foto
    // =============================================
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
      message: "Error al subir foto a Firebase",
      error: err.message,
    });
  }
};

// =======================================================
// DELETE PHOTO (Firebase)
// =======================================================
export const deletePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.photo)
      return res.status(400).json({ message: "El usuario no tiene foto registrada" });

    try {
      let photoPath = "";
      const marker = `${bucket.name}/`;
      const idx = user.photo.indexOf(marker);

      if (idx !== -1) {
        photoPath = user.photo.substring(idx + marker.length);
      } else {
        const parts = user.photo.split("/");
        photoPath = parts.slice(-2).join("/");
      }

      await bucket.file(photoPath).delete().catch(() => {});
    } catch (err) {
      console.log("⚠ Error al eliminar foto:", err.message);
    }

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
// CHANGE ROLE
// =======================================================
export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const validRoles = ["admin_app", "coord_planeacion", "colaborador"];
    if (!validRoles.includes(role))
      return res.status(400).json({ message: "Rol inválido" });

    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "Usuario no encontrado" });

    const old = u.role;
    u.role = role;
    await u.save();

    await ChangeLog.create({
      user: u._id,
      email: u.email,
      changedBy: req.user.email,
      action: "Cambio de rol",
      oldRole: old,
      newRole: role,
      createdAt: fechaBogota(),
    });

    if (role !== "admin_app") {
      await createNotification({
        type: "warning",
        title: "Cambio de rol",
        message: `El usuario ${u.name} ahora tiene el rol ${role}.`,
        roles: ["coord_planeacion"],
      });
    }

    res.json({ message: "Rol actualizado correctamente", user: u });

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
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "Usuario no encontrado" });

    const old = u.role;
    u.role = "admin_app";
    await u.save();

    await ChangeLog.create({
      user: u._id,
      email: u.email,
      changedBy: req.user.email,
      action: "Asignar admin_app",
      oldRole: old,
      newRole: "admin_app",
      createdAt: fechaBogota(),
    });

    res.json({ message: "Ahora es admin_app", user: u });

  } catch (err) {
    res.status(500).json({
      message: "Error al asignar admin",
      error: err.message,
    });
  }
};

// =======================================================
// SET COORD_PLANEACIÓN
// =======================================================
export const setCoordPlaneacionRole = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: "Usuario no encontrado" });

    const old = u.role;
    u.role = "coord_planeacion";
    await u.save();

    await ChangeLog.create({
      user: u._id,
      email: u.email,
      changedBy: req.user.email,
      action: "Asignar coord_planeacion",
      oldRole: old,
      newRole: "coord_planeacion",
      createdAt: fechaBogota(),
    });

    res.json({ message: "Ahora es coord_planeacion", user: u });

  } catch (err) {
    res.status(500).json({
      message: "Error al asignar coordinación",
      error: err.message,
    });
  }
};
