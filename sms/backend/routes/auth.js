import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
        auth: true,
      token,
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        course: user.course,
        regno: user.regno,
        year: user.year,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  const { username, password, course, regno, year } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (username, password, course, regno, year, role) VALUES (?,?,?,?,?,?)",
      [username, hashed, course, regno, year, "student"]
    );

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.put("/teacher/attendance/:id", auth, (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Forbidden" });
  }
  // proceed with update
});


export default router;
