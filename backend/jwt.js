const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, "your-secret-key", { expiresIn: "1h" });
};

const jwtAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { generateToken, jwtAuthMiddleware };