import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 🟢 Convertimos el correo a minúsculas
    const emailLower = email.toLowerCase();

    // Verificar si el usuario existe ya con el correo normalizado
    const exist = await User.findOne({ email: emailLower });
    if (exist) return res.status(409).json({ message: "El usuario ya existe" });

    const hashed = await bcrypt.hash(password, 10);

    // Guardar correo en minúsculas
    const user = await User.create({ email: emailLower, password: hashed, role });

    res.json({ message: "Usuario registrado correctamente", user });
  } catch (err) {
    res.status(500).json({ message: "Error en registro", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🟢 Normalizar correo a minúsculas para comparar correctamente
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

    return res.json({
      message: "Login exitoso",
      token,
      role: user.role
    });

  } catch (err) {
    return res.status(500).json({ message: "Error en login", error: err.message });
  }
};
