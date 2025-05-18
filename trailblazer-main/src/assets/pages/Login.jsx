import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import logoImage from "./logo.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { email, password });

    // Simulate successful login by setting loggedIn to true
    localStorage.setItem("loggedIn", "true");
    
    // Redirect to Landing Page
    navigate("/");

    axios.post('https://0690-27-110-167-200.ngrok-free.app', {
      email,
      password
    })
    .then(response => {
      setMessage('Login successful');
      // maybe save token or redirect
    })
    .catch(error => {
      setMessage('Login failed');
    });
  };

  return (
    <div className="login-container">
      <div className="login-layout">

        <div className="login-left-panel">
          <div className="logo-container">
            <img src={logoImage || "/placeholder.svg"} alt="Trailblazer Printing Logo" className="logo-img" />
            <div>
              <h1 className="brand-text">
                TRAILBLAZER
                <br />
                <span className="sub-text">PRINTING & LAYOUT SERVICES</span>
              </h1>
            </div>
          </div>

          <div className="welcome-content">
            <h2 className="welcome-heading">
              Hello,
              <br />
              Welcome.
            </h2>
            <p className="welcome-text">
              Log In To Access Your Designs And
              <br />
              Start Printing With Trailblazer Services.
            </p>
          </div>
        </div>

        <div className="login-right-panel">
          <div className="login-form-container">
            <h2 className="login-form-heading">LOGIN</h2>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <div className="input-icon">
                  <Mail className="icon" />
                </div>
                <input
                  type="text"
                  placeholder="Email / Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="input-group">
                <div className="input-icon">
                  <Lock className="icon" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
                <button type="button" className="password-toggle" onClick={togglePasswordVisibility}>
                  {showPassword ? <Eye className="icon" /> : <EyeOff className="icon" />}
                </button>
              </div>

              <div className="login-forgot-password-container">
                <Link to="/forgot-password" className="login-forgot-password-link">
                  Forgot your password?
                </Link>
              </div>

              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="admin-link-container">
        <Link className="admin-link" to="/AdminLogin">
          Admin
        </Link>
      </div>
    </div>
  );
}

export default Login;
