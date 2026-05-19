import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./sidebar";

const TeacherDashboard = () => {
  const stored = localStorage.getItem("user");
  const authData = stored ? JSON.parse(stored) : null;
  const [teacherInfo, setTeacherInfo] = useState(null);
  const token = localStorage.getItem("token");

 useEffect(() => {
  if (authData?.id) {
    axios.get(`http://localhost:5000/api/teacher/profile/${authData.id}`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
    .then(res => setTeacherInfo(res.data))
    .catch(err => console.error("Teacher info error:", err.response?.data || err.message));
  }
}, [authData?.id]);

  if (!authData) return <h2>Loading...</h2>;

  return (
    <div className="dashboard-container teacher-theme">
      <Sidebar role="teacher" />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h2>👩‍🏫 Welcome, {authData.username || "Teacher"}</h2>
          <p className="subtitle">
            Manage classes, assignments, announcements, and attendance
          </p>
          {teacherInfo && (
            <div className="teacher-details">
              <p><strong>Subject:</strong> {teacherInfo.subject}</p>
              <p><strong>Course:</strong> {teacherInfo.course}</p>
              <p><strong>Year:</strong> {teacherInfo.year}</p>
            </div>
          )}
        </header>

        {/* Nested routes render here */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

