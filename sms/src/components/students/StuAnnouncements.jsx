import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function StuAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await API.get("/announcements/student");
        setAnnouncements(res.data || []);
      } catch (err) {
        console.error("Announcements error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) return <h3>Loading announcements...</h3>;

  return (
    <div className="page-content">
  <h1>📢 Announcements</h1>

  {announcements.length === 0 ? (
    <p>No announcements yet</p>
  ) : (
    <div className="announce-container">  {/* 👈 NEW */}
      <ul className="announce-list">
        {announcements.map((a) => (
          <li key={a.id} className="announce-card">
            <h2>{a.title}</h2>
            <p>{a.message}</p>
            <p><strong>Subject:</strong> {a.subject}</p>
            <p><strong>Teacher:</strong> {a.teacher_name}</p>
            <small>📅 {a.date}</small>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
  );
}
