import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    plantName: { type: String, required: true },
    type: { type: String, default: "watering" },
    date: { type: Date, required: true },
    repeat: { type: String, default: "none" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);