import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

import TeaLogin from "./pages/tealogin.jsx";
import StuLogin from "./pages/stulogin.jsx";
import ChooseUser from "./pages/chooseuser.jsx";
import TeaReg from "./pages/teareg.jsx";
import StuReg from "./pages/stureg.jsx";

import StudentDashboard from "./components/students/dashboard.jsx";
import TeacherDashboard from "./components/teachers/dashboard.jsx";

import ProtectedRoute from "./routes/ProtectedRoutes.jsx";

// Teacher components
import Attendance from "./components/teachers/attendance.jsx";
import Assignments from "./components/teachers/assignment.jsx";
import Announcements from "./components/teachers/announcement.jsx";
import Students from "./components/teachers/student.jsx";

// Student components
import StuAttendance from "./components/students/StuAttendance.jsx";
import StuAssignments from "./components/students/StuAssignments.jsx";
import StuAnnouncements from "./components/students/StuAnnouncements.jsx";


import downloadImg from "./assets/download.png";

function App() {
  return (
    <>
      <nav>
        <img src={downloadImg} alt="School Logo" className="logo" />
        <Link to="/" className="main">School Management System</Link>
      </nav>

      <Routes>

        <Route path="/" element={<ChooseUser />} />
        <Route path="/stulogin" element={<StuLogin />} />
        <Route path="/tealogin" element={<TeaLogin />} />
        <Route path="/stureg" element={<StuReg />} />
        <Route path="/teareg" element={<TeaReg />} />

        {/* STUDENT DASHBOARD */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="attendance" element={<StuAttendance />} />
          <Route path="assignments" element={<StuAssignments />} />
          <Route path="announcements" element={<StuAnnouncements />} />
        </Route>

        {/* TEACHER DASHBOARD */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="attendance" element={<Attendance />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="student" element={<Students />}/>
        </Route>

      </Routes>
    </>
  );
}

export default App;





