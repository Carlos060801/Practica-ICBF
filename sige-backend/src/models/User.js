// =======================================================
// models/User.js
// =======================================================

import mongoose from "mongoose";

const { Schema } = mongoose;

export const ROLES = ["admin_app", "coord_planeacion", "colaborador"];

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
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
    phone: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ROLES,
      default: "colaborador",
    },
    photo: {
      type: String, // URL de Cloudinary
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    collection: "users",
  }
);

export const User = mongoose.model("User", userSchema);
