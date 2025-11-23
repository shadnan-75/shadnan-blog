const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  author: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  author: { type: String, default: "Anonymous" },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coverImage: String, // filepath (e.g., /uploads/imagename.jpg)
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports = mongoose.model("Post", PostSchema);
