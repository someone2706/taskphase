import "./App.css";
import { useEffect } from "react";

function App() {

  document.body.classList.add("dark-mode");

  useEffect(() => {
    const el = document.getElementById("intro");
    if (!el) return;

    const text = el.textContent.trim();
    el.textContent = "";
    let i = 0;

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, 80);
      }
    }

    type();
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
  };

  return (
    <>
      <header className="main_title" id="maintitle">
        <div className="heading">PORTFOLIO</div>
        <div className="subheading">
          <a href="#About" className="nav">About</a>
          <a href="#Skills" className="nav">Skills</a>
          <a href="#Projects" className="nav">Projects</a>
          <a href="#Interests" className="nav">Interests</a>
          <button id="btn" onClick={toggleTheme}>🌙</button>
        </div>
      </header>

      <main>
        <div className="container" >
            <div className="pic">
                <div className="name" ><p id="intro">Hey! I'm Nyasha, a beginner web developer in the learning!</p>
                    <img className ="pfp" src="/pfp.webp"  width="250" height="250" alt="Profile picture"/>
                    <div className="contact">
                        <p><a href="https://www.linkedin.com/in/nyasha-singh/" target="_blank" ><i className="fab fa-linkedin" id="icon"/></a></p>
                        <p><a href="mailto:nyashasingh.27@gmail.com" target="_blank"><i className="fas fa-envelope" id="icon"/></a></p>
                        <p><a href="https://github.com/someone2706" target="_blank"><i className="fab fa-github" id="icon"/></a></p>
                    </div>
                    <p style= {{fontsize: 'medium', paddingtop: '0'}} >Phone number: +91 1234567809</p> 
                </div> 
            </div>
            <div className="info">
                <div className="abt">
                <div className="title" id="About">About Me</div>
                    <div style={{fontSize: "medium"}} ><p>I am a 2nd-year BTech student studying VLSI engineering at Manipal Institute of Technology, Manipal, with a strong interest in technology, programming, and astronomy. Currently, I am enhancing my technical skills on Python programming, which complements my academic journey in chip design and electronic systems.
                    During my school years, I actively participated in various sports, including basketball, volleyball, athletics, and marathons. I was also a member of the Cultural club and participated in various dance events driven by my passion for performance. These experiences shaped my ability to work in teams, stay disciplined, and approach challenges with determination.
                    I am exploring career opportunities that align with my academic strengths and personal interests, whether in VLSI technology, astronomical research, or innovative fields that bridge the two.
                    </p></div>
                </div>
                
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }} >
                    <div className="ski">
                        <div className="title" id="Skills">Skills</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', marginTop: '3px', rowGap: '3px' }}>
                            <ul>
                                <li>Python <i className="fa-brands fa-python" /></li>
                                <li>C coding <i className="fa-solid fa-c" /></li>
                                <li>HTML <i className="fa-brands fa-html5" /></li>
                                <li>CSS <i className="fa-brands fa-css3-alt" /></li>
                            </ul>
                        </div>
                    </div>

                    <div className="int">
                        <div className="title" id="Interests">Interests</div>
                        <ul>
                            <li>Web Development</li>
                            <li>Generative AI</li>
                            <li>Astronomy</li>
                        </ul>
                    </div>
                </div>
                
            </div> 

        <div className="prj">
            <div className="title" id="Projects">Projects</div>
            <ol>
                <div style={{display: "flex",
                flexDirection: "column"}}  className="prjts">
                <li className="app_title">Weather App</li>
                    <div className="app">

                        <div style={{textAlign: "center", marginTop: "10"}} >
                            <img src="/app1.png" className="app_pic"/>
                        </div>
                        <div className="app_info" style={{height: "auto" ,id:"ainfo"}} >
                            <p>
                                This is a desktop application built with Python (PyQt5) that allows users to check real-time weather conditions for any city. 
                                It connects to the OpenWeather API to fetch temperature, weather description, and displays a matching emoji icon for easy visualization. 
                                The app includes error handling for invalid inputs or connection issues and features a clean, user-friendly interface.
                            </p>
                            <p>Here's a link to test my small project:  <a href="Weather API app.exe" target="_blank" download class="lnk">Weather app</a></p>
                        </div>
                    </div>
                    <li className="prj_title">Static restaurant Website</li>
                    <div className="resto">

                    
                    <div style={{textAlign: "center", marginTop: "10"}} >
                        <img src="/restp.png" className="resto_pic" alt="pic"/>
                    </div>
                    <div className="web_info" style={{height: "auto" ,id:"winfo"}}>
                        <p>
                            I built a responsive, static website for a restaurant called David Chu China Bistro as one of my web development projects. 
                            The site is designed using HTML and CSS with a clean layout that highlights the restaurant's branding, menu, and contact information. 
                            It mimics a real-world business website and focuses on user-friendly navigation and mobile responsiveness. Through this project, 
                            I practiced structuring pages with semantic HTML, organizing content into sections, and styling with modern CSS techniques.
                        </p>
                        <p>Here's a link to my Website: <a href="coursera/index.html" target="_blank" className="lnk" >Restaurant website</a></p>
                    </div>
                    </div>
                </div>
            </ol> 
        </div>
      </main>
    </>
  );}

export default App;
