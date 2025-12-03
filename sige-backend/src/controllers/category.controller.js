// controllers/category.controller.js
import { Category } from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { title, description } = req.body;

    const category = await Category.create({
      title,
      description,
    });

    res.json({
      message: "Categoría creada correctamente",
      category,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creando categoría", error: err.message });
  }
};

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo categorías", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json({
      message: "Categoría actualizada",
      category,
    });
  } catch (err) {
    res.status(500).json({ message: "Error actualizando categoría", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando categoría", error: err.message });
  }
};
