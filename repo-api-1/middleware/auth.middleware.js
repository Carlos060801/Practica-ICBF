import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

  console.log("==========================================");
  console.log("🔵 verifyToken ejecutado");
  console.log("🟦 Headers recibidos:", req.headers);

  const authHeader = req.headers.authorization;

  console.log("🟨 Authorization recibido:", authHeader);

  if (!authHeader) {
    console.log("🟥 ERROR: No se envió Authorization");
    return res.status(401).json({ message: "Token faltante" });
  }

  const token = authHeader.split(" ")[1];

  console.log("🟦 TOKEN EXTRAÍDO:", token);

  if (!token) {
    console.log("🟥 ERROR: El token vino vacío");
    return res.status(401).json({ message: "Token faltante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟩 TOKEN DECODIFICADO:", decoded);
    req.user = decoded;
    console.log("==========================================");
    next();
  } catch (err) {
    console.log("🟥 ERROR AL VERIFICAR TOKEN:", err.message);
    console.log("==========================================");
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
