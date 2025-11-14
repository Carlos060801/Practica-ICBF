import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";

// ✅ Importamos rutas
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import policyRoutes from "./routes/policy.routes.js";

// ✅ Creamos la app
const app = express();

// ✅ Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middlewares globales
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// ✅ Servir archivos estáticos (por ejemplo los PDFs)
// Esto permite abrir `http://localhost:3000/pdf/archivo.pdf`
app.use(express.static(path.join(__dirname, "public")));

// ✅ Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/policies", policyRoutes);

// ✅ Ruta base para prueba rápida
app.get("/", (req, res) => {
  res.json({ message: "✅ SIGE Backend Activo", fecha: new Date().toLocaleString() });
});

// ✅ Conectar a base de datos y levantar servidor
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
