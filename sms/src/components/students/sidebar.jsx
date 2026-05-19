import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function StuSidebar({ role }) {
  const { logout } = useAuth();

  return (
    <div className="sidebar">
      <h3>{role === "student" ? "Student Menu" : "Teacher Menu"}</h3>
      <ul>
        {role === "student" ? (
          <>
            <li><Link to="/student/">Dashboard</Link></li>
            <li><Link to="/student/attendance">Attendance</Link></li>
            <li><Link to="/student/assignments">Assignments</Link></li>
            <li><Link to="/student/announcements">Announcements</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/teacher/">Dashboard</Link></li>
            <li><Link to="/teacher/attendance">Attendance</Link></li>
            <li><Link to="/teacher/assignments">Assignments</Link></li>
            <li><Link to="/teacher/announcements">Announcements</Link></li>
          </>
        )}
      </ul>
      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}