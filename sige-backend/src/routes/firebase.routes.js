// =======================================================
// firebase.routes.js — Firebase Storage Upload
// =======================================================

import { Router } from "express";
import multer from "multer";
import bucket from "../config/firebase.js";

const router = Router();

// Multer en memoria (OBLIGATORIO para Firebase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

// =======================================================
// POST /api/firebase/upload
// =======================================================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // 🔒 Validaciones
    if (!bucket) {
      return res.status(500).json({
        message: "Firebase no inicializado",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No se envió ningún archivo",
      });
    }

    // Nombre del archivo en Firebase
    const fileName = `uploads/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    // Stream hacia Firebase
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (error) => {
      console.error("❌ Error Firebase:", error);
      return res.status(500).json({
        message: "Error subiendo archivo a Firebase",
      });
    });

    stream.on("finish", async () => {
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return res.status(200).json({
        message: "Archivo subido correctamente a Firebase 🔥",
        fileName,
        publicUrl,
      });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("❌ Error general Firebase:", error);
    return res.status(500).json({
      message: "Error interno Firebase",
      error: error.message,
    });
  }
});

export default router;
