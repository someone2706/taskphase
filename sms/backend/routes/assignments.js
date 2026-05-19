import express from "express";
import db from "../db.js";
import auth from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();

/* ================= MULTER ================= */

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= TEACHER ================= */

// Create assignment
router.post("/teacher", auth, (req, res) => {
  if (req.user.role !== "teacher")
    return res.status(403).json({ message: "Forbidden" });

  const { title, subject, description, deadline } = req.body;

  if (!title || !subject || !deadline)
    return res.status(400).json({ message: "Missing required fields" });

  const date = new Date().toISOString().split("T")[0];

  db.run(
    `INSERT INTO assignments 
     (teacher_id, course, year, subject, title, description, deadline, date)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      req.user.id,
      req.user.course,
      req.user.year,
      subject,
      title,
      description || "",
      deadline,
      date
    ],
    (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Assignment created successfully" });
    }
  );
});

// View assignments
router.get("/teacher", auth, (req, res) => {
  db.all(
    `SELECT * FROM assignments WHERE teacher_id=? ORDER BY date DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows || []);
    }
  );
});

// View submissions
router.get("/teacher/:assignment_id/submissions", auth, (req, res) => {
  const id = req.params.assignment_id;

  db.all(
  `SELECT 
      s.assignment_id,
      s.student_id,
      s.status,
      s.submitted_at,
      s.file_path,

      st.name AS student_name,
      st.regno,

      u.username

   FROM assignment_submissions s

   JOIN students st ON s.student_id = st.id
   JOIN stu_users u ON st.user_id = u.id

   WHERE s.assignment_id = ?`,

  [req.params.assignment_id],

  (err, rows) => {
    if (err) {
      console.error("ERROR:", err.message);
      return res.status(500).json({ message: err.message });
    }

    console.log("FINAL DATA:", rows);
    res.json(rows || []);
  }
);
});

// Stats
router.get("/teacher/:assignment_id/stats", auth, (req, res) => {
  const id = req.params.assignment_id;

  db.get(
    `SELECT COUNT(*) AS total_students FROM stu_users 
     WHERE role='student' AND course=? AND year=?`,
    [req.user.course, req.user.year],
    (err, totalRes) => {
      if (err) return res.status(500).json({ message: err.message });

      db.get(
        `SELECT COUNT(*) AS submitted FROM assignment_submissions 
         WHERE assignment_id=?`,
        [id],
        (err2, subRes) => {
          if (err2) return res.status(500).json({ message: err2.message });

          const total = totalRes.total_students || 0;
          const submitted = subRes.submitted || 0;
          const percentage = total ? ((submitted / total) * 100).toFixed(1) : 0;

          res.json({ total, submitted, percentage });
        }
      );
    }
  );
});

// Status
router.get("/teacher/:assignment_id/status", auth, (req, res) => {
  const id = req.params.assignment_id;

  db.all(
    `SELECT 
        u.username,
        u.reg_no,
        CASE 
          WHEN s.assignment_id IS NULL THEN 'Not Submitted'
          ELSE s.status
        END AS status
     FROM stu_users u
     LEFT JOIN assignment_submissions s
     ON u.id = s.student_id AND s.assignment_id = ?
     WHERE u.role='student' AND u.course=? AND u.year=?`,
    [id, req.user.course, req.user.year],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows);
    }
  );
});

/* ================= STUDENT ================= */

// View assignments
router.get("/student/assignments", auth, (req, res) => {
  db.all(
    `SELECT * FROM assignments WHERE course=? AND year=? ORDER BY date DESC`,
    [req.user.course, req.user.year],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows || []);
    }
  );
});

// View own submissions
router.get("/student/submissions", auth, (req, res) => {
  db.all(
    `SELECT s.*, a.title FROM assignment_submissions s
     JOIN assignments a ON s.assignment_id = a.id
     WHERE s.student_id = ?`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(rows || []);
    }
  );
});

// Submit TEXT
router.post("/", auth, (req, res) => {
  const { assignment_id, submission_text } = req.body;

  if (!assignment_id || !submission_text)
    return res.status(400).json({ message: "All fields required" });

  const submitted_at = new Date().toISOString();

  db.get(
  `SELECT id FROM students WHERE user_id=?`,
  [req.user.id],
  (err, student) => {

    const student_id = student.id;

    db.run(
      `INSERT OR REPLACE INTO assignment_submissions
       (assignment_id, student_id, status, submitted_at, submission_text)
       VALUES (?, ?, ?, ?, ?)`,
      [assignment_id, student_id, status, submitted_at, submission_text]
    );
  }
);
});

// Submit FILE
router.post("/upload", auth, upload.single("file"), (req, res) => {
  const { assignment_id } = req.body;
  const filePath = req.file.filename;

  const submitted_at = new Date().toISOString();

  // 🔥 STEP 1: Get student_id from students table
  db.get(
    `SELECT id FROM students WHERE user_id=?`,
    [req.user.id],
    (err, student) => {
      if (err) return res.status(500).json({ message: err.message });

      if (!student) {
        return res.status(400).json({ message: "Student not found" });
      }

      const student_id = student.id;

      // 🔥 STEP 2: INSERT CORRECTLY
      db.run(
        `INSERT OR REPLACE INTO assignment_submissions
         (assignment_id, student_id, status, submitted_at, file_path)
         VALUES (?, ?, ?, ?, ?)`,
        [assignment_id, student_id, "submitted", submitted_at, filePath],
        function (err2) {
          if (err2) return res.status(500).json({ message: err2.message });

          res.json({ message: "File uploaded successfully" });
        }
      );
    }
  );
});

export default router;