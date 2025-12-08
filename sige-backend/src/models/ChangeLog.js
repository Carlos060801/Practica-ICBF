// =======================================================
// models/ChangeLog.js
// =======================================================

import mongoose from "mongoose";
const { Schema } = mongoose;

const changeLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    changedBy: {
      type: String, // correo de quien hizo el cambio
      default: "Sistema",
    },
    action: {
      type: String, // Ej: "Actualización de perfil", "Cambio de rol"
      required: true,
    },
    oldRole: {
      type: String,
    },
    newRole: {
      type: String,
    },
    details: {
      type: String, // JSON.stringify({ ... })
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "change_logs",
  }
);

export const ChangeLog = mongoose.model("ChangeLog", changeLogSchema);
