import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const stored = localStorage.getItem("user");
  let authData = null;

  if (stored && stored !== "undefined") {
    try {
      authData = JSON.parse(stored);
    } catch (e) {
      console.error("Invalid JSON in localStorage.user:", e);
      authData = null;
    }
  }

  const token = localStorage.getItem("token");

  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [lowAttendance, setLowAttendance] = useState([]);

  useEffect(() => {
    if (authData) {
      fetchPendingAssignments();
      fetchAnnouncements();
      fetchLowAttendance();
    }
  }, []);

  const fetchPendingAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assignments/student", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pending = (res.data || []).filter(a => a.status !== "completed");
      setPendingAssignments(pending.slice(0, 3));
    } catch (err) {
      console.error("Assignments error:", err.response?.data || err.message);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/announcements/student", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements((res.data || []).slice(0, 2));
    } catch (err) {
      console.error("Announcements error:", err.response?.data || err.message);
    }
  };

  const fetchLowAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/attendance/student", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const low = (res.data || []).filter(s => s.percentage < 75);
      setLowAttendance(low);
    } catch (err) {
      console.error("Attendance error:", err.response?.data || err.message);
    }
  };

  if (!authData) return <h2>Loading...</h2>;

  return (
    <div className="dashboard-container student-theme">
      <Sidebar role="student" />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h2>🎓 Welcome, {authData.username || "Student"}</h2>
          <p className="subtitle">
            Course: {authData.course || "N/A"} | Year: {authData.year || "N/A"} | Reg No: {authData.regno || "N/A"}
          </p>
        </header>

        <div className="dashboard-snippets">

          <section className="snippet">
            <h3>⏳ Pending Assignments</h3>
            {pendingAssignments.length === 0 ? (
              <p>No pending assignments</p>
            ) : (
              <ul>
                {pendingAssignments.map(a => (
                  <li key={a.id}>
                    {a.title} – {a.subject} (Due {a.deadline}) | Teacher: {a.teacher_name}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="snippet">
            <h3>📣 Announcements</h3>
            {announcements.length === 0 ? (
              <p>No announcements yet</p>
            ) : (
              <ul>
                {announcements.map(a => (
                  <li key={a.id}>
                    <strong>{a.title}</strong> – {a.message}<br />
                    <small>Subject: {a.subject} | Date: {a.date} | By {a.teacher_name}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="snippet">
            <h3>⚠️ Low Attendance (&lt;75%)</h3>
            {lowAttendance.length === 0 ? (
              <p>All subjects above 75%</p>
            ) : (
              <ul>
                {lowAttendance.map((s, idx) => (
                  <li key={idx}>{s.subject}: {s.percentage.toFixed(1)}%</li>
                ))}
              </ul>
            )}
          </section>

        </div>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

