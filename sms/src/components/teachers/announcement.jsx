import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Announcements() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get("/announcements/teacher");
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch announcements error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const postAnnouncement = async () => {
    if (!title || !subject || !message) {
      return alert("All fields required");
    }

    try {
      const res = await API.post("/announcements/teacher", {
        title,
        subject,
        message
      });

      // Safe append
      setList(prev => Array.isArray(prev) ? [res.data, ...prev] : [res.data]);

      setTitle("");
      setSubject("");
      setMessage("");

    } catch (err) {
      alert(err.response?.data?.message || "Post failed");
    }
  };

  if (loading) return <h2>Loading announcements...</h2>;

  return (
    <div className="normal">
      <h1>📢 Manage Announcements</h1>

      <div className="form-box">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Write announcement..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={postAnnouncement}>Post</button>
      </div>
<div className="announce-container">
      <ul className="announce-list">
        {list.length > 0 ? (
          list.map((a) => (
            <li key={a.id}>
              <h3>{a.title}</h3>
              <p>{a.message}</p>
              <small>
                📘 {a.subject} | 👨‍🏫 {a.teacher_name} | 📅 {a.date}
              </small>
            </li>
          ))
        ) : (
          <li>No announcements yet</li>
        )}
      </ul>
      </div>
    </div>
  );
}