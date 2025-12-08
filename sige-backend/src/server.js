// =======================================================
// server.js — Backend SIGE Optimizado y Funcional
// =======================================================

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
// Importar Rutas
// =========================
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import changeLogRoutes from "./routes/change_log.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// Middlewares Generales
// =========================

// 🔥 ESTA LÍNEA ES CLAVE PARA QUE Render reciba POST JSON
app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "25mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Forzar timezone Bogotá
app.use((req, res, next) => {
  process.env.TZ = "America/Bogota";
  next();
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// =========================
// Rutas API
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/change-log", changeLogRoutes);
app.use("/api/notifications", notificationRoutes);

// =========================
// Ruta base
// =========================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "SIGE Backend operativo 🚀",
    horaBogota: new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
    }),
  });
});

// =========================
// Inicializar Servidor
// =========================
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SIGE corriendo en http://localhost:${PORT}`);
});
