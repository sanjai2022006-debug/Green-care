import express from "express";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const notifications = await Notification.find({ receiver: req.user.id })
    .populate("sender", "name profilePic")
    .sort({ createdAt: -1 });

  res.json(notifications);
});

export default router;