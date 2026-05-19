import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home.jsx';
import Navbar from './component/Navbar.jsx';
import Single from './component/Single.jsx';

const App = () => {

  const url = "http://www.omdbapi.com/?apikey=c37d2ee9&";

  return (
  <Router>
    <Navbar />
    <div className="App">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/single/:imdbID" element={<Single/>} />
      </Routes>
    </div>
  </Router>
  );
};

export default App;