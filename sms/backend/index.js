import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyJWT  from "./middleware/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

import attendanceRoutes from "./routes/attendance.js";
import authRoutes from "./routes/auth.js";
import announcementsRoutes from "./routes/announcements.js";
import assignmentsRoutes from "./routes/assignments.js";
import teacherRoutes from "./routes/teacher.js";
import studentRoutes from "./routes/student.js";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/uploads", express.static("uploads"));
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/teacher", studentRoutes);

app.use("/api/announcements", announcementsRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

const saltRounds = 10;
const jwtSecret = "superSecretKey";

// STUDENT REGISTER
app.post("/api/stu/register", async (req, res) => {
  const { username, password, course, regNo, year } = req.body;

  if (!username || !password || !course || !regNo || !year)
    return res.status(400).json({ message: "All fields required" });

  if (!/^\d{10}$/.test(regNo))
    return res.status(400).json({ message: "Registration number must be 10 digits" });

  try {
    const hash = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO stu_users (username,password,course,reg_no,year) VALUES (?,?,?,?,?)",
      [username, hash, course, regNo, year],
      function (err) {
        if (err) return res.status(500).json({ message: err.message });

        const userId = this.lastID;

        db.run(
          "INSERT INTO students (user_id,name,regno,course,year) VALUES (?,?,?,?,?)",
          [userId, username, regNo, course, year],
          function (err2) {
            if (err2) return res.status(500).json({ message: err2.message });

            res.json({
              message: "Student registered successfully",
              studentId: this.lastID
            });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//STUDENT LOGIN
app.post("/api/stu/login", (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT s.id AS student_id, u.*
    FROM stu_users u
    JOIN students s ON s.user_id = u.id
    WHERE u.username = ?
  `;

  db.get(sql, [username], async (err, user) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({
  student_id: user.student_id,
  role: "student",
  username: user.username,
  course: user.course,
  year: user.year
}, process.env.JWT_SECRET, {expiresIn:"1d"});

    res.json({
      token,
      user: {
        student_id: user.student_id,
        username: user.username,
        course: user.course,
        year: user.year,
        regno: user.reg_no
      }
    });
  });
});

// TEACHER REGISTER
app.post("/api/tea/register", async (req, res) => {
  const { username, password, subject, course, year } = req.body;

  if (!username || !password || !subject || !course || !year)
    return res.status(400).json({ message: "All fields required" });

  try {
    const hash = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO tea_users (username,password,subject,course,year) VALUES (?,?,?,?,?)",
      [username.trim().toLowerCase(), hash, subject, course, year],
      function (err) {
        if (err) return res.status(500).json({ message: err.message });

        const teacherUserId = this.lastID;

        db.run(
          "INSERT INTO teachers (user_id,subject,course,year) VALUES (?,?,?,?)",
          [teacherUserId, subject, course, year],
          err2 => {
            if (err2) return res.status(500).json({ message: err2.message });

            res.json({ message: "Teacher registered successfully" });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TEACHER LOGIN
app.post("/api/tea/login", (req, res) => { 
  const { username, password } = req.body; 

  db.get(`
  SELECT t.id AS teacher_id, u.*
  FROM tea_users u
  JOIN teachers t ON t.user_id = u.id
  WHERE u.username = ?
`, [username], async (err, user) => { 
    if (err) return res.status(500).json({ message: err.message }); 
    if (!user) return res.status(401).json({ message: "Invalid credentials" }); 

    const valid = await bcrypt.compare(password, user.password); 
    if (!valid) return res.status(401).json({ message: "Invalid credentials" }); 

    const token = jwt.sign(
  {
    id: user.teacher_id,   // ✅ IMPORTANT FIX
    role: "teacher",
    username: user.username,
    course: user.course,
    year: user.year
  },
  jwtSecret,
  { expiresIn: "1d" }
); 

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        course: user.course,
        year: user.year,
        regno: user.reg_no
      }
    });
  }); 
});

// AUTH CHECK
app.get("/isuserauth", verifyJWT, (req, res) => {
  res.json({ auth: true, role: req.role });
});

