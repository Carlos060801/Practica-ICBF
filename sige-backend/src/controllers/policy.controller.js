// controllers/policy.controller.js

import { Policy } from "../models/Policy.js";
import bucket from "../config/firebase.js";
import { createAudit } from "../utils/audit.js";

// =========================================================
// 🛠 Normalizador de categorías
// =========================================================
const normalizeCategory = (cat) => {
  return cat
    .toLowerCase()
    .trim()
    .replace(/ /g, "_")
    .normalize("NFD")     // Quitar tildes
    .replace(/[\u0300-\u036f]/g, "");
};

// =========================================================
// 📋 LISTAR POLÍTICAS
// =========================================================
export const listPolicies = async (req, res) => {
  try {
    const policies = await Policy.find()
      .populate("created_by", "nombre correo")
      .sort({ createdAt: -1 });

    return res.json(policies);
  } catch (err) {
    return res.status(500).json({
      message: "Error obteniendo políticas",
      error: err.message,
    });
  }
};

// =========================================================
// 📤 SUBIR POLÍTICA
// =========================================================
export const uploadPolicy = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "title y category son obligatorios" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No se recibió archivo PDF" });
    }

    // Normalizar categoría
    const cleanCategory = normalizeCategory(category);

    // Guardar PDF en Firebase
    const fileName = `policies/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype },
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2100",
    });

    // Guardar en Mongo
    const newPolicy = await Policy.create({
      title,
      description,
      category: cleanCategory,
      fileUrl: url,
      created_by: req.user?.id || null,
    });

    await createAudit(
      req.user.id,
      "Subió una política",
      "Política",
      newPolicy._id
    );

    return res.status(201).json({
      message: "Política subida correctamente",
      policy: newPolicy,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error subiendo política",
      error: err.message,
    });
  }
};

// =========================================================
// ✏️ EDITAR POLÍTICA
// =========================================================
export const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const cleanCategory = normalizeCategory(category);

    const updated = await Policy.findByIdAndUpdate(
      id,
      { title, description, category: cleanCategory },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Política no encontrada" });
    }

    await createAudit(req.user.id, "Editó política", "Política", id);

    return res.json({
      message: "Política actualizada correctamente",
      policy: updated,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error actualizando política",
      error: err.message,
    });
  }
};

// =========================================================
// 🗑 ELIMINAR POLÍTICA
// =========================================================
export const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await Policy.findById(id);
    if (!policy) {
      return res.status(404).json({ message: "Política no encontrada" });
    }

    // Eliminar archivo en Firebase
    const match = policy.fileUrl.match(/policies%2F([^?]+)/);
    if (match) {
      const fileName = decodeURIComponent(match[1]);
      await bucket.file(`policies/${fileName}`).delete().catch(() => {});
    }

    // Eliminar documento en Mongo
    await Policy.findByIdAndDelete(id);

    await createAudit(req.user.id, "Eliminó política", "Política", id);

    return res.json({ message: "Política eliminada correctamente" });

  } catch (err) {
    return res.status(500).json({
      message: "Error eliminando política",
      error: err.message,
    });
  }
};

// =========================================================
// 🔍 TEST FIREBASE
// =========================================================
export const testFirebase = async (req, res) => {
  try {
    const [files] = await bucket.getFiles({ prefix: "policies/" });

    return res.json({
      message: "Conexión exitosa con Firebase Storage",
      files: files.map((f) => f.name),
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error conectando a Firebase",
      error: err.message,
    });
  }
};
