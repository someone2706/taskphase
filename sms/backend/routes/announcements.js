import express from "express";
import db from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ---------------- TEACHER ---------------- */

// Create announcement
router.post("/teacher", auth, (req, res) => {
  if (req.user.role !== "teacher")
    return res.status(403).json({ message: "Forbidden" });

  const { title, subject, message } = req.body;

  if (!title || !subject || !message)
    return res.status(400).json({ message: "All fields required" });

  const date = new Date().toISOString().split("T")[0];

  db.run(
    `INSERT INTO announcements (title, subject, message, teacher_name, course, year, date)
     VALUES (?,?,?,?,?,?,?)`,
    [title, subject, message, req.user.username, req.user.course, req.user.year, date],
    err => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Announcement created" });
    }
  );
});

// View own announcements
router.get("/teacher", auth, (req, res) => {
  if (req.user.role !== "teacher")
    return res.status(403).json({ message: "Forbidden" });

  db.all(
    `SELECT *
     FROM announcements
     WHERE teacher_name=?
     ORDER BY date DESC`,
    [req.user.username],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows || []);
    }
  );
});

/* ---------------- STUDENT ---------------- */

// View announcements for class
router.get("/student", auth, (req, res) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Forbidden" });

  db.all(
    `SELECT *
     FROM announcements
     WHERE course=? AND year=?
     ORDER BY date DESC`,
    [req.user.course, req.user.year],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows || []);
    }
  );
});

export default router;