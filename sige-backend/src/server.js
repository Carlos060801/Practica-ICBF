import "dotenv/config";
import "./config/firebase.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";

// =========================
// 📌 Importar todas las RUTAS
// =========================
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import changeLogRoutes from "./routes/change_log.routes.js";
import notificationRoutes from "./routes/notification.routes.js";   // 🔥 nueva ruta

const app = express();

// Necesario para que __dirname funcione en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// 🛡️ Middlewares generales
// =========================
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Forzar siempre hora de Bogotá
app.use((req, res, next) => {
  process.env.TZ = "America/Bogota";
  next();
});

// Carpeta pública
app.use(express.static(path.join(__dirname, "public")));

// =========================
// 📌 Registrar todas las RUTAS
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/change-log", changeLogRoutes);
app.use("/api/notifications", notificationRoutes);   // 🔥 ACTIVADA RUTA DE NOTIFICACIONES

// =========================
// Ruta raíz de prueba
// =========================
app.get("/", (req, res) => {
  res.json({
    message: "Backend operativo 🚀",
    fecha: new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
    })
  });
});

// =========================
// 🚀 Conectar BD y levantar servidor
// =========================
connectDB();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
