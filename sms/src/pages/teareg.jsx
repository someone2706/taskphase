import { useState } from 'react';
import Axios from 'axios';
import { Link } from "react-router-dom";    

export function TeaReg() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [subject, setSubject] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [registerStatus, setRegisterStatus] = useState("");

  const register = () => {
    Axios.post('http://localhost:5000/api/tea/register', {
      username,
      password,
      subject,
      course,
      year
    }).then((response) => {
      if (response.data.message) {
        setRegisterStatus(response.data.message);
      } else {
        setRegisterStatus("Registration successful");
      }
    }).catch((error) => {
      if (error.response) {
        setRegisterStatus(error.response.data.message);
      } else {
        setRegisterStatus("Server not responding");
      }
    });
  };

  return (
    <div className="page">
      <h1>Teacher Registration</h1>
      <p>Register for the teacher portal to manage your courses and student records.</p>
      <div className='app'>
        <div className='registration'>
          <h1>Register</h1>
          <label>Username</label>
          <input 
            type='text' 
            placeholder='Enter username' 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className='username'
          />

          <label>Password</label>
          <input 
            type='password' 
            placeholder='Enter password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className='password'
          />

          <label>Subject</label>
          <input 
            type='text' 
            placeholder='Enter subject you teach' 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            className='subject'
          />

          <label>Course</label>
          <input 
            type='text' 
            placeholder='Enter course' 
            value={course} 
            onChange={(e) => setCourse(e.target.value)} 
            className='course'
          />

          <label>Year</label>
          <input 
            type='text' 
            placeholder='Enter year' 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            className='year'
          />

          <button className='register' onClick={register}>Register</button>
        </div>
        {registerStatus && <h3>{registerStatus}</h3>}
      </div>
      <h2>If already registered, please login</h2>
      <Link to="/tealogin">Login Here</Link>
    </div>
  );
}

export default TeaReg;
