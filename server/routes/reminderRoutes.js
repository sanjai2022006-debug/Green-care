import express from "express";
import Reminder from "../models/Reminder.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all reminders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id })
      .sort({ date: 1 });

    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE reminder
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, plantName, type, date, repeat } = req.body;

    const reminder = new Reminder({
      user: req.user.id,
      title,
      plantName,
      type,
      date,
      repeat,
    });

    await reminder.save();
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TOGGLE COMPLETE
router.put("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder)
      return res.status(404).json({ message: "Reminder not found" });

    reminder.completed = !reminder.completed;
    await reminder.save();

    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE reminder
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;