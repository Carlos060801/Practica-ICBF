router.post("/upload", upload.single("file"), async (req, res) => {
  try {
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

    const fileName = `policies/${Date.now()}_${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      resumable: false,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("❌ Firebase error:", err);
      res.status(500).json({ ok: false, error: err.message });
    });

    stream.on("finish", async () => {
      await file.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      res.status(200).json({
        ok: true,
        message: "Archivo subido correctamente",
        url,
      });
    });

    stream.end(req.file.buffer);
  } catch (err) {
    console.error("❌ Error general:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});
