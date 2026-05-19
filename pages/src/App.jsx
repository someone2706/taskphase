import { Link, Route, Routes } from 'react-router-dom';
import { Home } from './pages/home.jsx';
import { Contact } from './pages/contact.jsx';
import { About } from './pages/about.jsx';
import { Register } from './pages/register.jsx';
import './App.css';


function App() {
  return (
  <>
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/contact">Contact</Link></li>
      <li><Link to="/register">Register</Link></li>
    </ul>
  </nav>
  <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} /> 
      <Route path="/register" element={<Register />} />   
    </Routes>
  </>

  )
  
}

export default App; 