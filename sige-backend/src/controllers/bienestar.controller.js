// controllers/bienestar.controller.js

import { Policy } from "../models/Policy.js";
import { Category } from "../models/Category.js";

/**
 * =========================================================
 * 📌 LISTAR POLÍTICAS AGRUPADAS POR PILAR (Bienestar)
 * =========================================================
 * Este endpoint devuelve algo como:
 * {
 *   "bienestar": [
 *       { title, description, category, fileUrl }
 *   ],
 *   "sgsi": [...],
 *   ...
 * }
 * 
 * Ideal para la página de Colaborador en SIGE
 */
export const listBienestarPolicies = async (req, res) => {
  try {
    // 1) Obtener todas las categorías registradas
    const categories = await Category.find().sort({ createdAt: -1 });

    // 2) Obtener todas las políticas
    const policies = await Policy.find().sort({ createdAt: -1 });

    // 3) Agrupar políticas por categoría
    const agrupado = {};

    categories.forEach((cat) => {
      const catKey = cat.title
        .toLowerCase()
        .trim()
        .replace(/ /g, "_")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      agrupado[catKey] = policies.filter((p) => p.category === catKey);
    });

    return res.json({
      message: "Políticas agrupadas por pilares del Bienestar",
      totalCategorias: categories.length,
      totalPolicies: policies.length,
      data: agrupado,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error obteniendo información del Bienestar",
      error: err.message,
    });
  }
};

/**
 * =========================================================
 * 📌 OBTENER POLÍTICAS DE UN PILAR ESPECÍFICO
 * =========================================================
 * GET /bienestar/:category
 */
export const listBienestarByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const cleanCategory = category
      .toLowerCase()
      .trim()
      .replace(/ /g, "_")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const policies = await Policy.find({ category: cleanCategory })
      .sort({ createdAt: -1 });

    return res.json({
      category: cleanCategory,
      count: policies.length,
      policies,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error obteniendo las políticas del pilar",
      error: err.message,
    });
  }
};
