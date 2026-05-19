import { useEffect, useState } from "react";
import axios from "axios";

export default function Student() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    year: "",
    regno: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const token = localStorage.getItem("token");



  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teacher/student", {
  headers: { Authorization: `Bearer ${token}` }
});

      // Normalize data: map DB columns to frontend expectations
      const normalized = res.data.map(s => ({
        id: s.id,
        name: s.name || s.username || "",   // fallback if DB uses username
        course: s.course,
        year: s.year,
        regno: s.regno || s.reg_no || ""
      }));

      setStudents(normalized);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSave = async () => {
  try {
    // Check duplicate locally (before API call)
    const exists = students.some(
      s => s.regno === formData.regno && s.id !== editId
    );

    if (exists) {
      alert("Registration number must be unique!");
      return;
    }

    const url = editId 
      ? `http://localhost:5000/api/teacher/student/${editId}` 
      : "http://localhost:5000/api/teacher/student";

    const method = editId ? "put" : "post";

    await axios({
      method,
      url,
      data: formData,
      headers: { Authorization: `Bearer ${token}` }
    });

    alert(editId ? "Student updated successfully" : "Student added successfully");

    setEditId(null);
    setShowForm(false);
    setFormData({ name: "", course: "", year: "", regno: "" });
    fetchStudents();

  } catch (err) {
    alert(err.response?.data?.message || "Operation failed");
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Delete student?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/teacher/student/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete student");
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      course: student.course,
      year: student.year,
      regno: student.regno
    });
    setEditId(student.id);
    setShowForm(true);
  };

  return (
    <div className="page-content">
      <h2 className="page-title">👥 Student Management</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="dashboard-content">
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th><th>Course</th><th>Year</th><th>Reg No</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="5">No students found</td></tr>
            ) : (
              students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.course}</td>
                  <td>{s.year}</td>
                  <td>{s.regno}</td>
                  <td>
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    <button onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
            {showForm && (
              <tr>
                <td><input name="name" value={formData.name} onChange={handleChange} placeholder="Name" /></td>
                <td><input name="course" value={formData.course} onChange={handleChange} placeholder="Course" /></td>
                <td><input name="year" value={formData.year} onChange={handleChange} placeholder="Year" /></td>
                <td><input name="regno" value={formData.regno} onChange={handleChange} placeholder="Reg No" /></td>
                <button onClick={() => handleSave()}>{editId ? "Update" : "Save"}</button>              </tr>
            )}
            <button
        className="add-btn"
        onClick={() => {
          setShowForm(!showForm);
          setEditId(null);
        }}
      >
        {showForm ? "Cancel" : "+ Add Student"}
      </button>
          </tbody>
        </table>
        </div>
      )}

    </div>
  );
}
