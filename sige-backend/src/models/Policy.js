// models/Policy.js
import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },

    // ✅ Categoria en texto (NO ObjectId)
    category: { type: String, required: true },

    fileUrl: { type: String, required: true },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Policy = mongoose.model("Policy", policySchema);
