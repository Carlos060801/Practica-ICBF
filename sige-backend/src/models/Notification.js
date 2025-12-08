// =======================================================
// models/Notification.js
// =======================================================

import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,  // notificación general
    },
    roles: {
      type: [String], // Ej: ["colaborador", "coord_planeacion"]
      default: [],
    },
    type: {
      type: String,
      enum: ["info", "success", "warning"],
      default: "info",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "notifications",
  }
);

export const Notification = mongoose.model("Notification", NotificationSchema);
