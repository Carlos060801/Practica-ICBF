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
        error: "Firebase no inicializado correctamente",
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Archivo requerido" });
    }

    const fileName = `uploads/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      res.status(500).json({ error: error.message });
    });

    blobStream.on("finish", async () => {
      // Hacer público el archivo
      await blob.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      res.status(201).json({
        message: "Archivo subido correctamente",
        url: publicUrl,
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
