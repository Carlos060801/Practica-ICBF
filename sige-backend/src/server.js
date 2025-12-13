// =======================================================
// server.js — Backend SIGE (Estable para Windows y Railway)
// =======================================================

// 🔥 CARGA FORZADA DEL .env (SOLUCIÓN DEFINITIVA EN WINDOWS)
import dotenv from "dotenv";
dotenv.config({
  path: "D:/Aplicacion Bienestar/Practica-ICBF/sige-backend/.env",
});

// =========================
// Firebase (no rompe si no hay variables)
// =========================
import "./config/firebase.js";

// =========================
// Imports principales
// =========================
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// DB
import { connectDB } from "./config/db.js";

// =========================
// Rutas
// =========================
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import changeLogRoutes from "./routes/change_log.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// Middlewares
// =========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "25mb" }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
app.use(morgan("dev"));

// Timezone Colombia
process.env.TZ = "America/Bogota";

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
// Inicializar servidor
// =========================
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor SIGE corriendo en http://localhost:${PORT}`);
});
