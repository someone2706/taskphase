document.addEventListener("DOMContentLoaded", () => {

    const el = document.getElementById("intro");
    const text = el.textContent.trim();
    el.textContent = "";
    let i = 0;

    function type() {
        if (i < text.length) {e
            el.textContent += text.charAt(i);
            i++;
            setTimeout(type, 80);
        }
    }

    const btn = document.getElementById("btn");
    const body = document.body;

    btn.addEventListener("click", () => {
        body.classList.toggle('dark-mode');
        
        const isDarkMode = body.classList.contains('dark-mode');
        btn.textContent = isDarkMode ? '☀️' : '🌙';
        
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    const boxshadow = "0 0 10px azure";
    const about = document.querySelector(".abt");
    const element = document.querySelector(".int");
    const ele = document.querySelector(".ski");
    const ainfo = document.getElementById("ainfo");
    const winfo = document.getElementById("winfo");
    
    if (about){
        about.addEventListener("mouseover", () =>{
            about.style.boxShadow = boxshadow;
            about.style.transition = "box-shadow 0.3s ease-in-out";
        })
    }

    if (element){
        element.addEventListener("mouseover", () =>{
            element.style.boxShadow = boxshadow;
            element.style.transition = "box-shadow 0.3s ease-in-out";
        })
    }

    if (ele){
        ele.addEventListener("mouseover", () =>{
            ele.style.boxShadow = boxshadow;
            ele.style.transition = "box-shadow 0.3s ease-in-out";
        })
    }

    winfo.addEventListener("mouseover", () =>{
        winfo.style.boxShadow = "0 0 15px whitesmoke";
        winfo.style.borderRadius = "50px";
        winfo.style.transition = "box-shadow 0.3s ease-in-out";
    })

    ainfo.addEventListener("mouseover", () =>{
        ainfo.style.boxShadow = "0 0 15px whitesmoke";
        ainfo.style.borderRadius = "50px";
        ainfo.style.transition = "box-shadow 0.3s ease-in-out";
    })
    
    if (about){
        about.addEventListener("mouseout", () =>{
            about.style.boxShadow = "none";
        })
    }

    if (element){
        element.addEventListener("mouseout", () =>{
            element.style.boxShadow = "none";
        })
    }

    if (ele){
        ele.addEventListener("mouseout", () =>{
            ele.style.boxShadow = "none";
        })
    }

    winfo.addEventListener("mouseout", () =>{
        winfo.style.boxShadow = "none";
    })

    ainfo.addEventListener("mouseout", () =>{
        ainfo.style.boxShadow = "none";
    })

    type();
});
