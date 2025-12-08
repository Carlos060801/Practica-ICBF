import mongoose from "mongoose";

const versionSchema = new mongoose.Schema({
  filename: String,           // nombre real en GridFS
  version: Number,            // versión: 1, 2, 3...
  fecha: { type: Date, default: Date.now },
  subidoPor: String           // admin, planeacion, principal
});

const documentoSchema = new mongoose.Schema({
  nombre_actual: String,      // nombre visible en la app
  categoria: String,          // politica, planeacion, interno
  visible_para: [String],     // ["admin", "planeacion", "principal"]
  versiones: [versionSchema], // historial
});

export default mongoose.model("Documento", documentoSchema);
