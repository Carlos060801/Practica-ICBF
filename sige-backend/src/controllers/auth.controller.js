import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { createNotification } from "../controllers/notifications.controller.js";

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const emailLower = email.toLowerCase();

    const exist = await User.findOne({ email: emailLower });
    if (exist) return res.status(409).json({ message: "El usuario ya existe" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ email: emailLower, password: hashed, role });

    // 🔥 Notificación automática
    await createNotification({
      type: "success",
      title: "Nuevo usuario creado",
      message: `El usuario ${emailLower} ha sido registrado`
    });

    res.json({ message: "Usuario registrado correctamente", user });
  } catch (err) {
    res.status(500).json({ message: "Error en registro", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 🔥 Notificación de inicio de sesión (opcional)
    await createNotification({
      type: "info",
      title: "Nuevo inicio de sesión",
      message: `El usuario ${emailLower} inició sesión`
    });

    return res.json({
      message: "Login exitoso",
      token,
      role: user.role
    });

  } catch (err) {
    return res.status(500).json({ message: "Error en login", error: err.message });
  }
};
