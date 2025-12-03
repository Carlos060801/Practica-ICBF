import mongoose from "mongoose";

const ChangeLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    email: { type: String, required: true }, // usuario afectado

    changedBy: { type: String, required: true }, // correo del que hizo el cambio

    action: { type: String, required: true },

    oldRole: { type: String, required: true },

    newRole: { type: String, required: true },

    createdAt: { type: Date, default: null }
  },
  { timestamps: false }
);

export const ChangeLog = mongoose.model("ChangeLog", ChangeLogSchema);
