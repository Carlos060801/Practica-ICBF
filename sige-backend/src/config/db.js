// =======================================================
// db.js — Conexión MongoDB segura
// =======================================================

import mongoose from "mongoose";

// 🔎 Debug temporal (puedes borrarlo luego)
console.log("MONGO_URI =", process.env.MONGO_URI);

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI no definida. MongoDB no se conecta.");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Conectado");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
  }
};
