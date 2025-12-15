// =======================================================
// server.js — Backend SIGE (Render + Android)
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
// IMPORTAR RUTAS
// =========================
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import changeLogRoutes from "./routes/change_log.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import firebaseRoutes from "./routes/firebase.routes.js";

const app = express();

// __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// MIDDLEWARES GENERALES
// =========================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
app.use(morgan("dev"));

// Zona horaria Colombia
process.env.TZ = "America/Bogota";

// Archivos públicos (opcional)
app.use(express.static(path.join(__dirname, "public")));

// =======================================================
// ✅ JSON PRIMERO (CLAVE)
// =======================================================
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

// =========================
// API ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/change-log", changeLogRoutes);
app.use("/api/notifications", notificationRoutes);

// =========================
// 🔥 SOLO FIREBASE USA MULTER
// =========================
app.use("/api/firebase", firebaseRoutes);

// =========================
// ROOT (HEALTH CHECK)
// =========================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "SIGE Backend operativo 🚀",
    time: new Date().toLocaleString("es-CO"),
  });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 SIGE Backend activo en puerto ${PORT}`);
  });
});
