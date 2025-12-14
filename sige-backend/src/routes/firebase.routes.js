// =======================================================
// routes/firebase.routes.js — Subida de archivos Firebase (OK)
// =======================================================

import { Router } from "express";
import multer from "multer";
import bucket from "../config/firebase.js";

const router = Router();

// Multer en memoria (Railway-friendly)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// =======================================================
// POST /api/firebase/upload
// =======================================================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
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

    const fileName = `policies/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (error) => {
      console.error("❌ Error Firebase Stream:", error);
      return res.status(500).json({
        ok: false,
        message: "Error subiendo archivo",
        error: error.message,
      });
    });

    stream.on("finish", async () => {
      try {
        // ✅ URL firmada (NO makePublic)
        const [url] = await file.getSignedUrl({
          action: "read",
          expires: "03-01-2035",
        });

        return res.status(200).json({
          ok: true,
          message: "Archivo subido correctamente 🔥",
          path: fileName,
          url,
        });
      } catch (err) {
        console.error("❌ Error generando URL:", err);
        return res.status(500).json({
          ok: false,
          message: "Archivo subido pero no se pudo generar URL",
          error: err.message,
        });
      }
    });

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
