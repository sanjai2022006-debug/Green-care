const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  plantName: String,
  type: String,
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Reminder", reminderSchema);