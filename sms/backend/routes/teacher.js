import express from "express";
import db from "../db.js";
import auth from "../middleware/auth.js";

const router = express.Router();


/* --- TEACHER PROFILE (Must be last) --- */

router.get("/profile/:id", auth, (req, res) => {
  const id = req.params.id;
  console.log("/:id route hit with id:", id); // add this line

  // If id is not a number, it's not a teacher profile request
  if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

  db.get(
    `SELECT t.id, u.username, u.subject, u.course, u.year
     FROM tea_users u
     JOIN teachers t ON t.user_id = u.id
     WHERE u.id = ?`,
    [id],
    (err, row) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!row) return res.status(404).json({ message: "Teacher not found" });
      res.json(row);
    }
  );
});

export default router;