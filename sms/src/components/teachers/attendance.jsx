import { useEffect, useState } from "react";
import axios from "axios";

export default function Attendance() {
  const [year, setYear] = useState("1");
  const [attendance, setAttendance] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAttendance();
  }, [year]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/teacher?year=${year}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAttendance(res.data);
    } catch (err) {
      console.error("Attendance fetch error:", err.response?.data || err.message);
    }
  };

  const updateStatus = async (student_id, status) => {
  try {
    await axios.post(
      "http://localhost:5000/api/attendance/mark",
      { student_id, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Attendance update error:", err.response?.data || err.message);
  }
};

  return (
    <div className="page">
      <h1>📋 Daily Attendance</h1>

      <select value={year} onChange={e => setYear(e.target.value)}>
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
        <option value="3">3rd Year</option>
        <option value="4">4th Year</option>
      </select>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Reg No</th>
            <th>Year</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>
        </thead>

        <tbody>
          {attendance.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No students found
              </td>
            </tr>
          ) : (
            attendance.map(row => (
              <tr key={row.student_id}>
                <td>{row.name}</td>
                <td>{row.regno}</td>
                <td>{row.year}</td>

                <td>
                  <input
                    type="radio"
                    name={`attendance-${row.student_id}`}
                    onChange={() => updateStatus(row.student_id, "Present")}
                  />
                </td>
                <td>
                  <input
                    type="radio"
                    name={`attendance-${row.student_id}`}
                    onChange={() => updateStatus(row.student_id, "Absent")}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}