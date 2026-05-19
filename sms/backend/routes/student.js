import express from "express";
import db from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();
/* --- STUDENT MANAGEMENT (For Teachers) --- */

// GET all students: matches /api/teacher/student
// ✅ GET (must be exact match)
router.get("/student", auth, (req, res) => {
  console.log("✅ GET STUDENTS HIT");

  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Forbidden" });
  }

  db.all("SELECT id, name, course, year, regno FROM students", [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(rows);
  });
});

// POST new student: matches /api/teacher/students
router.post("/student", auth, (req, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ message: "Forbidden" });
  const { name, course, year, regno } = req.body;
  db.run(
    "INSERT INTO students (name, course, year, regno) VALUES (?,?,?,?)",
    [name, course, year, regno],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// PUT update student: matches /api/teacher/students/:id
router.put("/student/:id", auth, (req, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ message: "Forbidden" });
  const { name, course, year, regno } = req.body;
  db.run(
    "UPDATE students SET name=?, course=?, year=?, regno=? WHERE id=?",
    [name, course, year, regno, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE student: matches /api/teacher/students/:id
router.delete("/student/:id", auth, (req, res) => {
  const id = req.params.id;

  // ✅ STRICT CHECK
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  db.run("DELETE FROM students WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ deleted: this.changes });
  });
});


export default router;