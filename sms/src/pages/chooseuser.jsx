import { Link } from "react-router-dom";
import studentImg from "../assets/student.png";
import teacherImg from "../assets/teacher.png";

export function ChooseUser() {
  return (
    <div className="choose-user">
      <div className="user-card">
        <img src={studentImg} alt="Student" />
        <Link to="/stulogin">Student Login</Link>
      </div>

      <div className="user-card">
        <img src={teacherImg} alt="Teacher" />
        <Link to="/tealogin">Teacher Login</Link>
      </div>
    </div>
  );
}

export default ChooseUser;


