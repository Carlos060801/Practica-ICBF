// controllers/policy.controller.js
import { Policy } from "../models/Policy.js";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// =========================================================
// 📂 Cargar credenciales del Service Account
// =========================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "../config/serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// =========================================================
// 🔐 Inicializar Firebase Admin SDK (una sola vez)
// =========================================================
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "sige-95d85.firebasestorage.app", // <--- BUCKET CORRECTO
  });
  console.log("✅ Firebase Admin SDK inicializado correctamente");
}

const bucket = admin.storage().bucket();

// =========================================================
// 📋 Listar todas las políticas (MongoDB)
// =========================================================
export const listPolicies = async (req, res) => {
  try {
    const policies = await Policy.find().sort({ updatedAt: -1 });
    res.json(policies);
  } catch (err) {
    res.status(500).json({
      message: "Error obteniendo políticas",
      error: err.message,
    });
  }
};

// =========================================================
// 📤 Subir PDF → Firebase Storage + MongoDB
// =========================================================
export const uploadPolicy = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const { title, category } = req.body;
    const filePath = req.file.path;
    const fileName = `policies/${Date.now()}-${req.file.originalname}`;

    console.log("📤 Subiendo archivo a Firebase:", fileName);

    // Subir PDF al bucket
    await bucket.upload(filePath, {
      destination: fileName,
      metadata: { contentType: "application/pdf" },
    });

    // Crear URL pública firmada (válida hasta 2100)
    const file = bucket.file(fileName);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2100",
    });

    // Guardar referencia en MongoDB
    const newPolicy = await Policy.create({
      title,
      category,
      fileUrl: url,
      uploadedBy: req.user?.id || null,
    });

    // Borrar archivo temporal local
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({
      message: "✅ PDF subido y guardado correctamente",
      policy: newPolicy,
    });

  } catch (err) {
    console.error("❌ Error subiendo política:", err);
    res.status(500).json({
      message: "Error subiendo política",
      error: err.message,
    });
  }
};

// =========================================================
// ✏️ Editar título o categoría del documento
// =========================================================
export const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category } = req.body;

    const updated = await Policy.findByIdAndUpdate(
      id,
      { title, category },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Política no encontrada" });
    }

    res.json({
      message: "✅ Política actualizada",
      policy: updated,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error actualizando política",
      error: err.message,
    });
  }
};

// =========================================================
// 🗑 Eliminar PDF → Firebase + MongoDB
// =========================================================
export const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findById(id);

    if (!policy) {
      return res.status(404).json({ message: "Política no encontrada" });
    }

    // Extraer nombre de archivo desde la URL
    const match = policy.fileUrl.match(/policies%2F([^?]+)/);
    if (match) {
      const fileName = decodeURIComponent(match[1]);
      await bucket.file(`policies/${fileName}`).delete().catch(() => {});
    }

    await Policy.findByIdAndDelete(id);

    res.json({ message: "✅ Política eliminada correctamente" });

  } catch (err) {
    console.error("❌ Error eliminando política:", err);
    res.status(500).json({
      message: "Error eliminando política",
      error: err.message,
    });
  }
};

// =========================================================
// 🚀 Comprobar conexión con Firebase Storage
// =========================================================
export const testFirebase = async (req, res) => {
  try {
    const [files] = await bucket.getFiles({ prefix: "policies/" });
    res.json({
      message: "✅ Conexión exitosa con Firebase Storage",
      files: files.map((f) => f.name),
    });
  } catch (err) {
    console.error("❌ Error accediendo a Firebase Storage:", err);
    res.status(500).json({
      message: "Error conectando a Firebase",
      error: err.message,
    });
  }
};
