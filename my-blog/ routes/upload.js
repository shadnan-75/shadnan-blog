const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  // return path to be stored in DB
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
