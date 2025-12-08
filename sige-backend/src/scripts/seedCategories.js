import mongoose from "mongoose";
import { Category } from "../models/Category.js";
import dotenv from "dotenv";

dotenv.config();

const categories = [
  { title: "SGSI", description: "Sistema de Gestión de Seguridad de la Información" },
  { title: "SST", description: "Seguridad y Salud en el Trabajo" },
  { title: "Ambiental", description: "Gestión Ambiental Institucional" },
  { title: "Calidad", description: "Sistema de Gestión de Calidad" },
  { title: "Riesgos", description: "Gestión del Riesgo Institucional" },
  { title: "Tratamiento de Datos", description: "Tratamiento de Datos Personales" },
  { title: "Política Integrada", description: "Política Integrada del ICBF" },
];

async function seed() {
  try {
    console.log("🌱 Conectando a MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🗑 Eliminando categorías anteriores...");
    await Category.deleteMany();

    console.log("➕ Insertando nuevas categorías...");
    await Category.insertMany(categories);

    console.log("✅ Categorías registradas con éxito");
    process.exit();
  } catch (err) {
    console.error("❌ Error sembrando categorías:", err);
    process.exit(1);
  }
}

seed();
