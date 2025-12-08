// models/Audit.js
import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    table: {
      type: String,
      required: true,
    },

    record_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Audit = mongoose.model("Audit", AuditSchema);
