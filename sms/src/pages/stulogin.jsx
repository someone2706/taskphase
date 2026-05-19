import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export function StuLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/stu/login", {
        username: loginUsername,
        password: loginPassword
      });

      if (res.data.token) {
        login(res.data.token, {
          ...res.data.user,
          role: "student"
        });

        navigate("/student");
      } else {
        setLoginStatus(res.data.message);
      }
    } catch (err) {
      setLoginStatus(err.response?.data?.message || "Server error");
    }
  };

  return (
    <>
      <div className="page">
        <h1>Student Login</h1>
        <div className="logincontainer">
          <h1>Login</h1>

          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(e) => setLoginUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button className="login" onClick={handleLogin}>
            Login
          </button>

          {loginStatus && <h3>{loginStatus}</h3>}
        </div>

        <h2>If not registered, please do so first</h2>
        <Link to="/stureg">Register Here</Link>
      </div>
    </>
  );
}

export default StuLogin;