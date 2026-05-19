import { useState } from "react";
import Axios from "axios";

export function StuReg() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [course, setCourse] = useState("");
  const [regNo, setRegNo] = useState("");
  const [year, setYear] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");

  const register = () => {
    Axios.post("http://localhost:5000/api/stu/register", {
      username,
      password,
      course,
      regNo,
      year,
    })
      .then((response) => {
        setRegisterStatus(response.data.message || "Registration successful");
      })
      .catch((error) => {
        if (error.response) {
          setRegisterStatus(error.response.data.message);
        } else {
          setRegisterStatus("Server not responding");
        }
      });
  };

  return (
    <div className="page">
      <h1>Student Registration</h1>
      <p>Register for the student portal to access your dashboard.</p>

      <div className="registration">
        <h1>Register</h1>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Course</label>
        <input
          type="text"
          placeholder="Enter course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <label>Registration Number</label>
        <input
          type="text"
          placeholder="Enter registration number"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
        />

        <label>Year</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <button className="register" onClick={register}>
          Register
        </button>
      </div>

      {registerStatus && <h3>{registerStatus}</h3>}
    </div>
  );
}

export default StuReg;