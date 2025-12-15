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
      type: String,
      default: "Sistema",
    },
    action: {
      type: String,
      required: true,
    },
    oldRole: {
      type: String,
    },
    newRole: {
      type: String,
    },
    details: {
      type: String,
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
