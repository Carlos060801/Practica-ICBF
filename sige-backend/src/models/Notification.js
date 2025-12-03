import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  type: { type: String, default: "info" },  // info | success | warning
  title: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

export const Notification = mongoose.model("Notification", NotificationSchema);
