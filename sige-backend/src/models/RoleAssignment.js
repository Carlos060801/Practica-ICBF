// models/RoleAssignment.js
import mongoose from "mongoose";

const RoleAssignmentSchema = new mongoose.Schema(
  {
    user_assigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    user_assigner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    new_role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const RoleAssignment = mongoose.model(
  "RoleAssignment",
  RoleAssignmentSchema
);
