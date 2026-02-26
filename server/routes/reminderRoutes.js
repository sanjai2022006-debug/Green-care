const express = require("express");
const Reminder = require("../models/Reminder");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* GET USER REMINDERS */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id });
    res.json(reminders);
  } catch (error) {
    console.error("GET REMINDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* CREATE REMINDER */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { plantName, type, date } = req.body;

    const reminder = await Reminder.create({
      plantName,
      type,
      date,
      user: req.user.id
    });

    res.json(reminder);
  } catch (error) {
    console.error("CREATE REMINDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* DELETE REMINDER */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted" });
  } catch (error) {
    console.error("DELETE REMINDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;