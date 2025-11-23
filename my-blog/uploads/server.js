const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const uploadRoutes = require("./routes/upload");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);

// health
app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
