const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, name, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;
