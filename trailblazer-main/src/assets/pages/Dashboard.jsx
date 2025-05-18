import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import {
  LayoutDashboard,
  User,
  History,
  LogOut,
  Phone,
  Info,
  Settings,
  Home,
} from "lucide-react";
import profilePic from "./profile.png";
import logoImage from "./logo.png";
import OrderReceived from "./1.png";
import OrderProcessing from "./2.png";
import Otw from "./3.png";
import Delivered from "./4.png";

export default function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Hook to programmatically navigate

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const handleLogout = () => {
    // Clear user session or authentication data
    localStorage.clear(); // Example: clearing localStorage (adjust as needed)

    // Optionally, you can reset any user-specific states or contexts here

    // Close the dropdown
    setIsDropdownOpen(false);

    // Navigate to the homepage
    navigate("/"); // Redirect to the homepage after logging out
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-section">
          <div className="D-sidebar-brand">
            <img src={logoImage} alt="Trailblazer Printing Logo" className="brand-logo" />
            <div className="brand-info">
              <h1 className="brand-title">TRAILBLAZER</h1>
              <span className="brand-subtitle">PRINTING & LAYOUT SERVICES</span>
            </div>
          </div>
        </div>

        <nav className="D-sidebar-nav">
          <ul>
            <li className="active">
              <Link to="/dashboard">
                <LayoutDashboard className="icon" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <User className="icon" />
                Profile
              </Link>
            </li>
            <li>
              <Link to="/orderhistory">
                <History className="icon" />
                Order History
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-dashboard">
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p className="date">{formattedDate}</p>
          </div>

          <div
            className={`D-user-profile-box ${isDropdownOpen ? "active" : ""}`}
            onClick={toggleDropdown}
          >
            <img src={profilePic} alt="Profile" className="D-profile-img" />
            <div className="D-user-details">
              <div className="name">Kryzl</div>
              <div className="name">Castañeda</div>
            </div>
            <div className={`D-dropdown-icon ${isDropdownOpen ? "rotate" : ""}`}>⌄</div>
          </div>

          {isDropdownOpen && (
            <div className="D-profile-dropdown">
              <div
                className="D-dropdown-header"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
              >
                <img src={profilePic} alt="Avatar" className="D-profile-img" />
                <div className="D-dropdown-details">
                  <div className="name1">Kryzl</div>
                  <div className="name1">Castañeda</div>
                </div>
                <div
                  className="D-dropdown-icon rotate"
                  onClick={toggleDropdown}
                  style={{ cursor: "pointer" }}
                >
                 ⌄
                </div>
              </div>

              <hr />

              <Link
                to="/"
                className="D-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Home className="D-dropdown-icon" />
                Home
              </Link>
              <div className="D-dropdown-item">
                <Link
                  to="/#service"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="D-dropdown-icon"  />
                  Services
                </Link>
              </div>
              <div className="D-dropdown-item">
                <Link
                  to="/contact"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Phone className="D-dropdown-icon" />
                  Contact Us
                </Link>
              </div>
              <div className="D-dropdown-item">
                <Link
                  to="/aboutus"
                  className="D-dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                  }}
                >
                  <Info className="D-dropdown-icon" />
                  About Us
                </Link>
              </div>
              <div className="D-dropdown-item" onClick={handleLogout}>
                <LogOut className="D-dropdown-icon" />
                Log Out
              </div>

              <div className="D-dropdown-footer">
                <a 
                  className="D-footer-link" 
                  href="/terms" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Terms & Conditions
                </a>
                <a 
                  className="D-footer-link" 
                  href="/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="welcome-card">
          <h2>Hi, Kryzl</h2>
          <p>
            Welcome To Trailblazer Printing And
            <br />
            Layout Services.
          </p>
        </div>

        <div className="order-progress">
          <h3>Order Progress</h3>
          <div className="order-info">
            <div className="order-line">
              <div className="order-row">
                <span className="order-label">File Name:</span>
                <span className="order-value">SDE Docs</span>
              </div>
              <div className="order-row">
                <span className="order-label">Payment:</span>
                <span className="order-value1">₱25.00</span>
              </div>
            </div>
          </div>

          <div className="progress-steps">
            <div className="step active">
              <div className="icon-circle highlight">
                <img src={OrderReceived} alt="1" className="step-img" />
              </div>
              <p>Order Received</p>
            </div>
            <div className="line"></div>
            <div className="step">
              <div className="icon-circle">
                <img src={OrderProcessing} alt="2" className="step-img" />
              </div>
              <p>Order Processing</p>
            </div>
            <div className="line"></div>
            <div className="step">
              <div className="icon-circle">
                <img src={Otw} alt="3" className="step-img" />
              </div>
              <p>On the way</p>
            </div>
            <div className="line"></div>
            <div className="step">
              <div className="icon-circle">
                <img src={Delivered} alt="4" className="step-img" />
              </div>
              <p>Delivered!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
