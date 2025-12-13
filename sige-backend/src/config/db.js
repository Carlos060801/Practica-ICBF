// =======================================================
// db.js — Conexión MongoDB (versión final)
// =======================================================

import mongoose from "mongoose";

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
