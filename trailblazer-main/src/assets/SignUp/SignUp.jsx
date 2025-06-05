import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import "./SignUp.css";
import logoImage from "../pages/logo.png";

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");

  // Clear any error message when user types
  useEffect(() => {
    if (formError) setFormError("");
  }, [firstName, lastName, emailUsername, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const user = {
      firstName,
      lastName,
      emailUsername,
      password,
    };

    // Get existing users array from localStorage or empty array
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user email/username already exists
    const userExists = existingUsers.some(
      (u) => u.emailUsername === emailUsername
    );

    if (userExists) {
      setFormError("User with this Email/Username already exists.");
      return;
    }

    // Append new user to array
    const updatedUsers = [...existingUsers, user];

    // Save updated array back to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Set loggedIn and current user
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));

    // Dispatch storage updated event for other components to detect
    window.dispatchEvent(new Event("storageUpdated"));

    navigate("/");
  };

  return (
    <div className="su-layout">
      <div className="su-left-panel">
        <div className="su-logo-container">
          <img
            src={logoImage}
            alt="Trailblazer Printing Logo"
            className="logo-img"
          />
          <div>
            <h1 className="su-brand-text">
              TRAILBLAZER
              <br />
              <span className="su-sub-text">PRINTING & LAYOUT SERVICES</span>
            </h1>
          </div>
        </div>

        <div className="su-welcome-content">
          <h2 className="su-welcome-heading">
            Hello, <br />
            Welcome
          </h2>
          <p className="su-welcome-text">
            Welcome To Trailblazer Printing And Layout Services. Sign Up To
            Access Your Designs And Start Printing With Trailblazer Services.
          </p>
        </div>
      </div>

      <div className="su-right-panel">
        <div className="su-form-container">
          <h3 className="su-form-heading">SIGN UP</h3>

          <form onSubmit={handleSubmit} className="su-form">
            <div className="su-form-input-name">
              <div className="su-input-group" style={{ maxWidth: "none" }}>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="su-name-fields"
                  required
                />
              </div>
              <div className="su-input-group" style={{ maxWidth: "none" }}>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="su-name-fields"
                  required
                />
              </div>
            </div>

            <div className="su-input-group">
              <div className="su-input-icon">
                <Mail className="su-icon" />
              </div>
              <input
                type="text"
                value={emailUsername}
                onChange={(e) => setEmailUsername(e.target.value)}
                placeholder="Email / Username"
                className="su-form-input"
                required
              />
            </div>

            <div className="su-input-group">
              <div className="su-input-icon">
                <Lock className="su-icon" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="su-form-input"
                required
              />
              <button
                type="button"
                className="su-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="su-icon" />
                ) : (
                  <EyeOff className="su-icon" />
                )}
              </button>
            </div>

            <div className="su-input-group">
              <div className="su-input-icon">
                <Lock className="su-icon" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="su-form-input"
                required
              />
              <button
                type="button"
                className="su-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Eye className="su-icon" />
                ) : (
                  <EyeOff className="su-icon" />
                )}
              </button>
            </div>

            {formError && (
              <div
                style={{
                  color: "#ff3333",
                  textAlign: "center",
                  fontSize: "14px",
                  marginTop: "-10px",
                }}
              >
                {formError}
              </div>
            )}

            <div className="su-submit-and-login-container">
              <Link to="/Login" className="su-login-link">
                Already have an account?
              </Link>
              <button type="submit" className="su-submit-btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
