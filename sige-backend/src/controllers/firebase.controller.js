import { bucket } from "../config/firebase.js";

export const uploadFile = async (req, res) => {
  try {
    if (!bucket) {
      return res.status(500).json({ message: "Firebase no inicializado" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Archivo requerido" });
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
      return res.status(500).json({ message: err.message });
    });

    blobStream.on("finish", async () => {
      await blob.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return res.status(201).json({
        message: "Archivo subido correctamente",
        fileUrl: publicUrl,
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
