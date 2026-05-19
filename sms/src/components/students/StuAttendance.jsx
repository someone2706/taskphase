import { useEffect, useState } from "react";
import axios from "axios";

export default function StuAttendance() {
  const [attendance, setAttendance] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/attendance/student", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setAttendance(res.data))
      .catch(() => alert("Failed to load attendance"));
  }, []);

  return (
    <div className="page">
      <h1>📊 My Attendance</h1>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((row, i) => (
            <tr key={i}>
              <td>{row.date}</td>
              <td>{row.subject}</td>
              <td style={{ color: row.status === "Present" ? "green" : "red" }}>
  {row.status}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
