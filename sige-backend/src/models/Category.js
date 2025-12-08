// models/Category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
