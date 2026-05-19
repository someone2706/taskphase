import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function Assignment() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [statusList, setStatusList] = useState([]);

  // ================= FETCH =================

  const fetchAssignments = async () => {
    try {
      const res = await API.get("/assignments/teacher");
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async (id) => {
    const res = await API.get(`/assignments/teacher/${id}/stats`);
    setStats(res.data);
  };

  const fetchSubmissions = async (id) => {
    try {
      const res = await API.get(`/assignments/teacher/${id}/submissions`);
      console.log("SUBMISSIONS:", res.data); // ✅ CORRECT PLACE
      setSubmissions(res.data);
      setSelectedAssignment(id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStatus = async (id) => {
    const res = await API.get(`/assignments/teacher/${id}/status`);
    setStatusList(res.data);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ================= CREATE =================

  const createAssignment = async () => {
    if (!title || !subject || !deadline) {
      return alert("Title, subject and deadline are required");
    }

    try {
      setLoading(true);

      await API.post("/assignments/teacher", {
        title,
        subject,
        description,
        deadline
      });

      alert("Assignment created successfully");

      setTitle("");
      setSubject("");
      setDescription("");
      setDeadline("");

      fetchAssignments();

    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="normal">
      <h1>📝 Create Assignment</h1>

      <div className="form-box">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

        <button onClick={createAssignment} disabled={loading}>
          {loading ? "Creating..." : "Create Assignment"}
        </button>
      </div>

      <hr />

      {/* ================= ASSIGNMENTS ================= */}
      <h2>📚 Your Assignments</h2>

      <table className="student-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr><td colSpan="4">No assignments</td></tr>
          ) : (
            assignments.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.subject}</td>
                <td>{new Date(a.deadline).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => {
                    fetchSubmissions(a.id);
                    fetchStats(a.id);
                    fetchStatus(a.id);
                  }}>
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= DETAILS ================= */}
      {selectedAssignment && (
        <>
          {/* 📊 STATS */}
          {stats && (
            <div className="stat-card">
              <h3>📊 Submission Stats</h3>
              <p>{stats.submitted} / {stats.total} submitted</p>
              <p>{stats.percentage}% completed</p>
            </div>
          )}

          {/* 📥 SUBMISSIONS */}
          <h3>📥 Submissions</h3>

          <table className="student-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Reg No</th>
                <th>Submitted At</th>
                <th>File</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr><td colSpan="5">No submissions yet</td></tr>
              ) : (
                submissions.map((s, i) => (
                  <tr key={i}>
                    <td>{s.student_name}</td>
                    <td>{s.reg_no}</td>
                    <td>{new Date(s.submitted_at).toLocaleString()}</td>

                    <td>
                      {s.file_path ? (
                        <a
                          href={`http://localhost:5000/uploads/${s.file_path}`}
                          target="_blank"
                        >
                          View File
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>

                    <td>
                      {s.status === "late" ? (
                        <span style={{ color: "orange" }}>Late</span>
                      ) : (
                        <span style={{ color: "green" }}>Submitted</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 📋 STATUS */}
          <h3>📋 Student Status</h3>

          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Reg No</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {statusList.length === 0 ? (
                <tr><td colSpan="3">No data</td></tr>
              ) : (
                statusList.map((s, i) => (
                  <tr key={i}>
                    <td>{s.username}</td>
                    <td>{s.reg_no}</td>
                    <td>
                      {s.status === "Not Submitted" ? (
                        <span style={{ color: "red" }}>Not Submitted</span>
                      ) : s.status === "late" ? (
                        <span style={{ color: "orange" }}>Late</span>
                      ) : (
                        <span style={{ color: "green" }}>Submitted</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}