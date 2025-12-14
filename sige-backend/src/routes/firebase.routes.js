import { Router } from "express";
import multer from "multer";
import bucket from "../config/firebase.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!bucket) {
      return res.status(500).json({ message: "Firebase no inicializado" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Archivo no recibido" });
    }

    const fileName = `policies/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    stream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Error subiendo archivo" });
    });

    stream.on("finish", async () => {
      await file.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      res.json({
        ok: true,
        message: "Archivo subido a Firebase 🔥",
        url,
      });
    });

    stream.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno Firebase" });
  }
});

export default router;
