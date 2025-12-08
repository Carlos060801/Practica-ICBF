// middleware/upload.js
import multer from "multer";

// =======================================================
// 📌 Multer configurado para subir archivos en memoria
// =======================================================

// ⚠️ Firebase necesita que el archivo esté en memoria (buffer)
// No uses diskStorage porque Firebase no trabaja con rutas locales
const storage = multer.memoryStorage();

// Validación opcional de tipos de archivo (solo imágenes)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo imágenes."), false);
  }
};

// Tamaño máximo por archivo (2MB)
const limits = {
  fileSize: 2 * 1024 * 1024,
};

// =======================================================
// 🔥 Exportar instancia lista
// =======================================================
export const upload = multer({
  storage,
  fileFilter,
  limits,
});
