import express from "express";
import db from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* ---------------- TEACHER ---------------- */

// Fetch students by year
router.get("/teacher", auth, (req, res) => {
  if (req.user.role !== "teacher")
    return res.status(403).json({ message: "Forbidden" });

  const { year } = req.query;

  db.all(
    `SELECT id AS student_id, username AS name, reg_no AS regno, course, year
     FROM stu_users
     WHERE role='student' AND year=?`,
    [year],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows || []);
    }
  );
});


// Mark / update attendance
router.post("/mark", auth, (req, res) => {
  if (req.user.role !== "teacher")
    return res.status(403).json({ message: "Forbidden" });

  const { student_id, status } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  if (!student_id || !status)
    return res.status(400).json({ message: "Missing data" });

  // Get teacher's subject from teachers table
  db.get(
    `SELECT subject FROM teachers WHERE user_id=?`,
    [req.user.id], // assuming req.user.id is the teacher's user_id
    (err, teacher) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });

      const subject = teacher.subject;

      db.get(
        `SELECT id FROM attendance WHERE student_id=? AND date=?`,
        [student_id, today],
        (err, row) => {
          if (err) return res.status(500).json({ message: err.message });

          if (row) {
            db.run(
              `UPDATE attendance SET status=?, subject=? WHERE student_id=? AND date=?`,
              [status, subject, student_id, today],
              err => {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ message: "Attendance updated" });
              }
            );
          } else {
            db.run(
              `INSERT INTO attendance (student_id, subject, status, date)
               VALUES (?,?,?,?)`,
              [student_id, subject, status, today],
              err => {
                if (err) return res.status(500).json({ message: err.message });
                res.json({ message: "Attendance marked" });
              }
            );
          }
        }
      );
    }
  );
});


/* ---------------- STUDENT ---------------- */

// View own attendance
router.get("/student", auth, (req, res) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Forbidden" });

  db.all(
    `SELECT date, subject, status
     FROM attendance
     WHERE student_id=?
     ORDER BY date DESC`,
    [req.user.student_id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows || []);
    }
  );
});


export default router;