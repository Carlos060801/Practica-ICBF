// =======================================================
// routes/firebase.routes.js — Subida de archivos a Firebase
// =======================================================

import { Router } from "express";
import multer from "multer";
import bucket from "../config/firebase.js";

const router = Router();

// 📦 Multer en memoria (ideal para Railway / serverless)
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
        ok: false,
        message: "Firebase no inicializado (bucket null)",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Archivo no recibido",
      });
    }

    // 📄 Nombre del archivo en Firebase
    const fileName = `policies/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    // ⬆️ Stream de subida
    const stream = file.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // ❌ Error en subida
    stream.on("error", (error) => {
      console.error("❌ Error Firebase Stream:", error);
      return res.status(500).json({
        ok: false,
        message: "Error subiendo archivo a Firebase",
        error: error.message,
      });
    });

    // ✅ Subida exitosa
    stream.on("finish", async () => {
      try {
        // 🔓 Hacer público el archivo (FUNCIONA EN PLAN FREE)
        await file.makePublic();

        const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        return res.status(200).json({
          ok: true,
          message: "Archivo subido correctamente 🔥",
          path: fileName,
          url,
        });
      } catch (err) {
        console.error("❌ Error haciendo público el archivo:", err);
        return res.status(500).json({
          ok: false,
          message: "Archivo subido pero no se pudo publicar",
          error: err.message,
        });
      }
    });

    // 🚀 Enviar buffer
    stream.end(req.file.buffer);
  } catch (error) {
    console.error("❌ Error general Firebase:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno Firebase",
      error: error.message,
    });
  }
});

export default router;
