const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET all posts
router.get("/", authMiddleware, async (req, res) => {
  const posts = await Post.find()
    .populate("user")
    .sort({ createdAt: -1 });

  res.json(posts);
});

// CREATE post
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const newPost = new Post({
        caption: req.body.caption,
        image: req.file ? req.file.filename : null,
        user: req.user.id,
      });

      await newPost.save();
      res.json(newPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// LIKE
router.post("/:id/like", authMiddleware, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  const alreadyLiked = post.likes.includes(req.user.id);

  if (alreadyLiked) {
    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user.id
    );
  } else {
    post.likes.push(req.user.id);
  }

  await post.save();
  res.json(post);
});

// COMMENT
router.post("/:id/comment", authMiddleware, async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.comments.push({
    text: req.body.text,
    user: req.user.id,
  });

  await post.save();
  res.json(post);
});

module.exports = router;
// DELETE POST
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ message: "Post not found" });

    // Only owner can delete
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});