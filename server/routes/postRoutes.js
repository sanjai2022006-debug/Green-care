import express from "express";
import Post from "../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* ---------------- MULTER SETUP ---------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ---------------- GET ALL POSTS ---------------- */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name profilePic")
      .populate("comments.user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- CREATE POST ---------------- */

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const newPost = new Post({
      caption: req.body.caption,
      image: req.file ? req.file.filename : null,
      user: req.user.id,
    });

    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "name profilePic")
      .populate("comments.user", "name profilePic");

    res.json(populatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- EDIT POST (OWNER ONLY) ---------------- */

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    post.caption = req.body.caption;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE POST (OWNER ONLY) ---------------- */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- LIKE (ANYONE) ---------------- */

router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ message: "Post not found" });

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- COMMENT (ANYONE) ---------------- */

router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.comments.push({
      text: req.body.text,
      user: req.user.id,
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("user", "name profilePic")
      .populate("comments.user", "name profilePic");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE COMMENT (COMMENT OWNER ONLY) ---------------- */

router.delete("/:postId/comment/:commentId", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    const comment = post.comments.id(req.params.commentId);

    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    comment.deleteOne();
    await post.save();

    const updatedPost = await Post.findById(req.params.postId)
      .populate("user", "name profilePic")
      .populate("comments.user", "name profilePic");

    res.json(updatedPost);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;