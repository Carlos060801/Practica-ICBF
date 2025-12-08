import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import Documento from "../models/Documento.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

const mongoURI = process.env.MONGO_URI;
const connection = mongoose.createConnection(mongoURI);

let gfs;
connection.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(connection.db, { bucketName: "pdfs" });
});

// Storage Config
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => ({
    filename: Date.now() + "-" + file.originalname,
    bucketName: "pdfs",
  }),
});
const upload = multer({ storage });

/* ==========================
   SUBIR DOCUMENTO NUEVO
=========================== */
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  const { role } = req.user;
  const { categoria } = req.body;

  // Validación por rol
  if (role === "planeacion" && categoria !== "planeacion")
    return res.status(403).json({ message: "Solo puedes subir documentos de planeación" });

  if (role === "principal" && categoria !== "interno")
    return res.status(403).json({ message: "Solo puedes subir documentos internos" });

  const nuevo = new Documento({
    nombre_actual: req.file.originalname,
    categoria,
    visible_para: ["admin", "planeacion", "principal"],
    versiones: [
      { filename: req.file.filename, version: 1, subidoPor: role }
    ]
  });

  await nuevo.save();
  return res.json({ message: "✅ Documento registrado con versión 1", doc: nuevo });
});

/* ==========================
   LISTAR DOCUMENTOS SEGÚN ROL
=========================== */
router.get("/list", authMiddleware, async (req, res) => {
  const { role } = req.user;

  let docs;
  if (role === "admin") docs = await Documento.find();
  if (role === "planeacion") docs = await Documento.find({ categoria: { $in: ["planeacion", "politica"] } });
  if (role === "principal") docs = await Documento.find({ categoria: { $in: ["interno", "politica"] } });

  return res.json(docs);
});

/* ==========================
   VER HISTORIAL
=========================== */
router.get("/historial/:id", async (req, res) => {
  const doc = await Documento.findById(req.params.id);
  return res.json(doc.versiones.sort((a, b) => b.version - a.version));
});

/* ==========================
   DESCARGAR PDF
=========================== */
router.get("/view/:filename", (req, res) => {
  gfs.openDownloadStreamByName(req.params.filename).pipe(res);
});

/* ==========================
   SUBIR NUEVA VERSIÓN (solo admin)
=========================== */
router.post("/upload-version/:id", authMiddleware, upload.single("file"), async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Solo el administrador puede actualizar políticas" });

  const doc = await Documento.findById(req.params.id);

  doc.versiones.push({
    filename: req.file.filename,
    version: doc.versiones.length + 1,
    subidoPor: req.user.role,
  });

  doc.nombre_actual = req.file.originalname;
  await doc.save();

  return res.json({ message: "♻ Nueva versión registrada", doc });
});

/* ==========================
   ELIMINAR DOCUMENTO (solo admin)
=========================== */
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Solo el administrador puede eliminar documentos" });

  const doc = await Documento.findById(req.params.id);
  await Promise.all(doc.versiones.map(v => gfs.delete(new mongoose.Types.ObjectId(v.filename))));
  await doc.deleteOne();

  return res.json({ message: "🗑 Documento eliminado correctamente" });
});

export default router;
