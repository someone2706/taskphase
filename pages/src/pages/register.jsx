import { useState } from "react";


export function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");    

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !email || !password) {
    setError("Please fill in all fields.");
    return;
  }

  setError("");

  try {
    const res = await fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setSuccess(true);
    } else {
      setError("Registration failed.");
    }

  } catch (err) {
    setError("Something went wrong. Please try again.");
  }
};


  

  return (
    <>
    <div>
        <h2>Register</h2>
        <p>Create an account to access exclusive features and stay updated with the latest news.</p>
        <p>Register below by filling the details!</p>
    </div>

    <div className="create">
        {success ? (
          <div className="success">
            <h3>🎉 Registration Successful!</h3>
            <p>Your account has been created successfully.</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <label>Username:</label>
            <input type="text" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required 
            />

            <label>Email:</label>
            <input type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
            />

            <label>Password:</label>
            
            <small>Password must be at least 6 characters long.</small>

            <input type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            />
            
          
            <button 
            type="submit"
          > Register</button>
       </form>)}
        
    </div>
    </>
  );
    }