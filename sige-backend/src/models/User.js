import mongoose from "mongoose";

// ✅ Roles permitidos en el sistema
export const ROLES = ["admin_app", "coord_planeacion", "coord_icbf"];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ROLES,
      required: true,
    },

    // ✅ Campos personales editables desde "Configuración de Cuenta"
    name: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
