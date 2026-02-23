const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "8h" }
      );

      return res.json({ token });
    }

    res.status(401).json({ error: "Invalid credentials ❌" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error ❌" });
  }
});

module.exports = router;