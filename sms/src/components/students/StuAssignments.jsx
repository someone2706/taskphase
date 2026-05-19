import { useEffect, useState } from "react";
import axios from "axios";

export default function StuAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [files, setFiles] = useState({}); // 🔥 store file per assignment
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/assignments/student/assignments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignments(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // 🔥 Handle file change per assignment
  const handleFileChange = (id, file) => {
    setFiles((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  // 🔥 FILE SUBMISSION
  const submit = async (id) => {
    const file = files[id];

    if (!file) {
      return alert("Please select a file");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("assignment_id", id);
      formData.append("file", file);

      await axios.post(
        "http://localhost:5000/api/assignments/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Assignment submitted successfully!");

      // ✅ reset only that assignment file
      setFiles((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      setSelectedId(null);

    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h2 className="page-title">📚 Assignments</h2>

      {assignments.length === 0 ? (
        <p>No assignments available</p>
      ) : (
        assignments.map((a) => (
          <div
            key={a.id}
            className="dashboard-content"
            style={{ marginBottom: "20px" }}
          >
            <h3>{a.title}</h3>

            <p><strong>Subject:</strong> {a.subject}</p>

            <p>
              <strong>Deadline:</strong>{" "}
              {new Date(a.deadline).toLocaleDateString()}
            </p>

            <button
              onClick={() =>
                setSelectedId(selectedId === a.id ? null : a.id)
              }
              style={{ marginTop: "10px" }}
            >
              {selectedId === a.id ? "Cancel" : "Upload Assignment"}
            </button>

            {selectedId === a.id && (
              <div style={{ marginTop: "15px" }}>
                
                {/* FILE INPUT */}
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChange(a.id, e.target.files[0])
                  }
                />

                {files[a.id] && (
                  <p style={{ marginTop: "5px", color: "#555" }}>
                    📄 {files[a.id].name}
                  </p>
                )}

                <button
                  onClick={() => submit(a.id)}
                  disabled={loading}
                  style={{ marginTop: "10px" }}
                >
                  {loading ? "Submitting..." : "Submit File"}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}