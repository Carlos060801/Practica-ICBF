// =======================================================
// controllers/auth.controller.js — FIX FINAL SIGE
// =======================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, ROLES } from "../models/User.js";
import { createNotification } from "./notifications.controller.js";

// =====================================================
// REGISTRO
// =====================================================
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const emailLower = email.toLowerCase().trim();

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Rol inválido" });
    }

    const exist = await User.findOne({ email: emailLower });
    if (exist) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: emailLower,
      password: hashed,
      role,
      name: "",
      phone: "",
    });

    await createNotification({
      type: "success",
      title: "Nuevo usuario creado",
      message: `El usuario ${emailLower} fue registrado`,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("❌ Register:", err);
    return res.status(500).json({ message: "Error en registro" });
  }
};

// =====================================================
// LOGIN (🔥 ESTE ERA EL PROBLEMA)
// =====================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase().trim();

    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    await createNotification({
      type: "info",
      title: "Inicio de sesión",
      message: `El usuario ${emailLower} inició sesión`,
    });

    // 🔥 RESPUESTA CORRECTA PARA FLUTTER
    return res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name || "",
        photo: user.photo || "",
      },
    });

  } catch (err) {
    console.error("❌ Login:", err);
    return res.status(500).json({ message: "Error en login" });
  }
};

// =====================================================
// CAMBIAR CONTRASEÑA
// =====================================================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Contraseña actualizada correctamente" });

  } catch (err) {
    return res.status(500).json({ message: "Error al cambiar contraseña" });
  }
};
