import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* MULTER CONFIG */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* GET PROFILE */

router.get("/profile", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    res.json(user);

  } catch (error) {

    res.status(500).json({ message: "Server error" });

  }

});

/* UPDATE PROFILE */

router.put(
  "/update",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {

    try {

      const { name, bio, interests } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          name,
          bio,
          interests: interests
            ? interests.split(",").map((i) => i.trim())
            : [],
          ...(req.file && { profilePic: req.file.filename }),
        },
        { new: true }
      ).select("-password");

      res.json(updatedUser);

    } catch (error) {

      console.error(error);

      res.status(500).json({ message: "Profile update failed" });

    }

  }
);

export default router;