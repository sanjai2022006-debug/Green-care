import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";

const router = express.Router();

// 📸 Multer setup for profile-pic uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* 🌿 UPDATE PROFILE */
router.put("/:id", upload.single("profilePic"), async (req, res) => {
  try {
   console.log("Incoming body:", req.body);
console.log("Incoming file:", req.file);
    console.log("Incoming body:", req.body);
    const { name, bio, interests } = req.body;
    
    const updateData = {};

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (interests) {
      updateData.interests = interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // If a new profile picture is uploaded
    if (req.file) {
      updateData.profilePic = req.file.filename;
    }

    console.log("Saving data:", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" } // ✅ replaces deprecated 'new: true'
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
});

export default router;