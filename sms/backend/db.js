import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./student_management.db");

db.serialize(() => {

  db.run(`CREATE TABLE IF NOT EXISTS stu_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  course TEXT,
  reg_no TEXT UNIQUE,
  year TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  name TEXT,
  regno TEXT UNIQUE,
  course TEXT,
  year TEXT,
  FOREIGN KEY(user_id) REFERENCES stu_users(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS tea_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  subject TEXT,
  course TEXT,
  year TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS teachers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE,
  subject TEXT,
  course TEXT,
  year TEXT,
  FOREIGN KEY(user_id) REFERENCES tea_users(id)
)`);

  db.run(`CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER,
    title TEXT,
    subject TEXT,
    deadline TEXT,
    course TEXT,
    year TEXT,
    FOREIGN KEY(teacher_id) REFERENCES tea_users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS assignment_submissions (
    assignment_id INTEGER,
    student_id INTEGER,
    status TEXT DEFAULT 'submitted',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (assignment_id, student_id),
    FOREIGN KEY(assignment_id) REFERENCES assignments(id),
    FOREIGN KEY(student_id) REFERENCES students(id)
  )`);
});

export default db;