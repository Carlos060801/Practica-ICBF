// =======================================================
// firebase-test.routes.js — Prueba Firebase Storage
// =======================================================

import { Router } from "express";
import multer from "multer";
import bucket from "../config/firebase.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// =========================
// POST /api/firebase/upload-test
// =========================
router.post("/upload-test", upload.single("file"), async (req, res) => {
  try {
    if (!bucket) {
      return res.status(500).json({
        message: "Firebase NO inicializado",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No se envió ningún archivo",
      });
    }

    const fileName = `test/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("❌ Error subiendo archivo:", err);
      res.status(500).json({ message: "Error subiendo archivo" });
    });

    stream.on("finish", async () => {
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      res.json({
        message: "Archivo subido correctamente a Firebase 🔥",
        fileName,
        publicUrl,
      });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error("❌ Firebase error:", error);
    res.status(500).json({
      message: "Error Firebase",
      error: error.message,
    });
  }
});

export default router;
