import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Conectado");
  } catch (err) {
    console.log("❌ Error conectando a MongoDB:", err.message);
  }
};
