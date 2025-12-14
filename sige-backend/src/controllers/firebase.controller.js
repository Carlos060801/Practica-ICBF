import { bucket } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";

export const uploadToFirebase = async (req, res) => {
  try {
    // 🔴 ESTE ES TU ERROR ACTUAL
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Archivo no recibido",
      });
    }

    const fileName = `policies/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    stream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ ok: false, message: "Error al subir archivo" });
    });

    stream.on("finish", async () => {
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      res.json({
        ok: true,
        message: "Archivo subido correctamente",
        url: publicUrl,
      });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error });
  }
};
