// =======================================================
// routes/firebase.routes.js
// Subida de archivos a Firebase Storage (con token)
// =======================================================

import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import bucket from "../config/firebase.js";

const router = Router();

// -------------------------------------------------------
// 🔹 Configuración de Multer (memoria)
// -------------------------------------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
});

// -------------------------------------------------------
// 🔹 POST /api/firebase/upload
// -------------------------------------------------------
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // ---------------------------------------------------
    // 🔴 Validaciones críticas
    // ---------------------------------------------------
    if (!bucket) {
      return res.status(500).json({
        ok: false,
        message: "Firebase bucket no inicializado",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Archivo no recibido",
      });
    }

    // ---------------------------------------------------
    // 🔹 Ruta y nombre del archivo en Firebase
    // ---------------------------------------------------
    const fileName = `policies/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    // ---------------------------------------------------
    // 🔹 Crear stream de subida
    // ---------------------------------------------------
    const stream = file.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // ---------------------------------------------------
    // ❌ Error en subida
    // ---------------------------------------------------
    stream.on("error", (err) => {
      console.error("❌ Error Firebase Storage:", err);
      return res.status(500).json({
        ok: false,
        message: "Error al subir el archivo",
        error: err.message,
      });
    });

    // ---------------------------------------------------
    // ✅ Subida finalizada
    // ---------------------------------------------------
    stream.on("finish", async () => {
      try {
        // 🔐 Generar token de descarga
        const token = uuidv4();

        await file.setMetadata({
          metadata: {
            firebaseStorageDownloadTokens: token,
          },
        });

        // 🔗 URL pública con token
        const downloadUrl =
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/` +
          encodeURIComponent(fileName) +
          `?alt=media&token=${token}`;

        return res.status(200).json({
          ok: true,
          message: "Archivo subido correctamente",
          url: downloadUrl,
          path: fileName,
        });
      } catch (err) {
        console.error("❌ Error finalizando subida:", err);
        return res.status(500).json({
          ok: false,
          message: "Error finalizando subida",
          error: err.message,
        });
      }
    });

    // ---------------------------------------------------
    // 🚀 Enviar buffer del archivo
    // ---------------------------------------------------
    stream.end(req.file.buffer);
  } catch (error) {
    console.error("❌ Error general upload:", error);
    return res.status(500).json({
      ok: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

// -------------------------------------------------------
// 🔹 EXPORT DEFAULT (IMPORTANTE)
// -------------------------------------------------------
export default router;
