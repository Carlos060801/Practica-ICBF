import dotenv from "dotenv";
dotenv.config();

import "./config/firebase.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import changeLogRoutes from "./routes/change_log.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import firebaseRoutes from "./routes/firebase.routes.js";

const app = express();

// 🔐 Middlewares básicos
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// 🔥 RUTAS QUE USAN MULTER ANTES DE JSON
app.use("/api/firebase", firebaseRoutes);

// 🔽 JSON DESPUÉS (clave)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

// 🔽 Resto de rutas
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/change-log", changeLogRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.json({ status: "OK", message: "SIGE Backend operativo 🚀" });
});

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor SIGE corriendo en puerto ${PORT}`)
);
