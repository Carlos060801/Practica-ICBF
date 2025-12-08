// =======================================================
// middleware/auth.middleware.js — VERSION FINAL
// =======================================================

import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token faltante" });

    // Decodificar token (solo contiene ID)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario REAL en la BD
    const user = await User.findById(decoded.id).select("email role name");
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Inyectar datos al request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();

  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// =======================================================
// Roles permitidos
// =======================================================
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No autorizado" });
    }
    next();
  };
};
