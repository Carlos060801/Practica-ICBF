import { Router } from "express";
import multer from "multer";
import { bucket } from "../config/firebase.js";

const router = Router();

// Multer en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

// ===============================
// 📤 SUBIR ARCHIVO A FIREBASE
// ===============================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!bucket) {
      return res.status(500).json({
        message: "Firebase no inicializado",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Archivo requerido",
      });
    }

    const file = req.file;
    const fileName = `uploads/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      console.error("❌ Error Firebase:", err);
      return res.status(500).json({
        message: "Error al subir archivo a Firebase",
      });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return res.status(201).json({
        message: "Archivo subido correctamente",
        fileUrl: publicUrl, // 👈 CLAVE
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error("❌ Error general:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
