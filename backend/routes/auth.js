const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔑 CHANGE THESE
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";  // change later

// LOGIN API
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({ token });
  }

  res.status(401).json({ error: "Invalid credentials ❌" });
});

module.exports = router;