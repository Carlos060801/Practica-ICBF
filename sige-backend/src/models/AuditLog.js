import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },

  oldRole: { type: String, required: true },
  newRole: { type: String, required: true },

  changedBy: { type: String, required: true }, // email de quien cambió el rol

  createdAt: { type: Date, default: Date.now }
});

export const AuditLog = mongoose.model("AuditLog", AuditLogSchema);
