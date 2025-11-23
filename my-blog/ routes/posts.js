const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyToken = require("../middleware/auth");

// Create post (protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content, coverImage } = req.body;
    const post = new Post({
      title,
      content,
      author: req.user.name,
      authorId: req.user.id,
      coverImage
    });
    await post.save();
    res.json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts (with basic pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Post.countDocuments();
    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update post (author or admin)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message:"Post not found"});
    if(String(post.authorId) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({message:"Not allowed"});
    }
    const { title, content, coverImage } = req.body;
    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.coverImage = coverImage ?? post.coverImage;
    post.updatedAt = Date.now();
    await post.save();
    res.json({ message: "Updated", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete post
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message:"Post not found"});
    if(String(post.authorId) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({message:"Not allowed"});
    }
    await post.remove();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* COMMENT ROUTES (on post) */

// Add comment (any logged-in user)
router.post("/:id/comments", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message:"Post not found"});
    const comment = { author: req.user.name, text, userId: req.user.id };
    post.comments.push(comment);
    await post.save();
    res.json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete comment (comment author or post author or admin)
router.delete("/:id/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({message:"Post not found"});
    const comment = post.comments.id(req.params.commentId);
    if(!comment) return res.status(404).json({message:"Comment not found"});
    // check permission
    if(String(comment.userId) !== req.user.id && String(post.authorId) !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({message:"Not allowed"});
    }
    comment.remove();
    await post.save();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
