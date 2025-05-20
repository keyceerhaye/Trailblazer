import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import imageLogo from './logo.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LayoutDashboard, History, LogOut } from 'lucide-react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState("");
  const dropdownRef = useRef();

  const isMinimalHeader = location.pathname === "/terms" || location.pathname === "/privacy";

  useEffect(() => {
    const updateLoginStatus = () => {
      const stored = localStorage.getItem("loggedIn");
      const user = JSON.parse(localStorage.getItem("user"));
      setIsLoggedIn(stored === "true");
      if (user) setUserName(`${user.firstName} ${user.lastName}`);
    };

    updateLoginStatus(); // Initial load
    window.addEventListener("storageUpdated", updateLoginStatus); // Listen for custom event

    return () => {
      window.removeEventListener("storageUpdated", updateLoginStatus);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("home");
    } else if (location.pathname === "/aboutus") {
      setActiveTab("aboutus");
    } else if (location.pathname === "/contact") {
      setActiveTab("contact");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    setShowDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isMinimalHeader) {
    return (
      <header className="header minimal-header">
        <div className="logo-section center-logo">
          <div className="Logo">
            <img src={imageLogo} alt="Trailblazer Logo" />
          </div>
          <div className="text-content">
            <h1 className="title">TRAILBLAZER</h1>
            <span className="subtext">PRINTING AND LAYOUT SERVICES</span>
          </div>
        </div>
      </header>
    );
  }

  const pathsWithShadow = [
    "/AboutUs",
    "/upload/print",
    "/upload/layout",
    "/basket",
    "/delivery",
    "/payment",
    "/confirmation",
  ];

  return (
    <header className={`header ${pathsWithShadow.includes(location.pathname) ? "header-shadow" : ""}`}>
      <div className="logo-section">
        <div className="Logo">
          <img src={imageLogo} alt="Trailblazer Logo" />
        </div>
        <div className="text-content">
          <h1 className="title">TRAILBLAZER</h1>
          <span className="subtext">PRINTING AND LAYOUT SERVICES</span>
        </div>
      </div>

      <div className="right-section" ref={dropdownRef}>
        <nav className="navbar">
          <button
            className={activeTab === "home" ? "active" : ""}
            onClick={() => {
              navigate('/');
              setActiveTab("home");
            }}
          >
            Home
          </button>
          <button
            className={activeTab === "aboutus" ? "active" : ""}
            onClick={() => {
              navigate('/aboutus');
              setActiveTab("aboutus");
            }}
          >
            About Us
          </button>
          <button
            className={activeTab === "contact" ? "active" : ""}
            onClick={() => {
              navigate('/contact');
              setActiveTab("contact");
            }}
          >
            Contact Us
          </button>
        </nav>

        {!isLoggedIn ? (
          <>
            <div className="Login">
              <button onClick={() => navigate('/Login')}>Login</button>
            </div>
            <div className="SignUp">
              <button onClick={() => navigate('/Signup')}>Sign Up</button>
            </div>
          </>
        ) : (
          <div className="user-dropdown">
            <div className="user-icon" onClick={() => setShowDropdown(!showDropdown)}>
              <User size={30} />
            </div>
            <div className="menu-icon" onClick={() => setShowDropdown(!showDropdown)}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            {showDropdown && (
              <div className="dropdown-menu custom-dropdown">
                <div className="dropdown-header">
                  <div className="user-avatar">
                    <img src="/path-to-avatar.png" alt="User Avatar" className="avatar-img" />
                  </div>
                  <div className="user-name">{userName || 'User'}</div>
                  <div className="close-icon" onClick={() => setShowDropdown(false)}>×</div>
                </div>

                <hr />

                <div className="dropdown-item-1" onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard size={20} className="dropdown-icon" />
                  <span>Dashboard</span>
                </div>

                <div className="dropdown-item-1" onClick={() => navigate('/profile')}>
                  <User size={20} className="dropdown-icon" />
                  <span>Profile</span>
                </div>

                <div className="dropdown-item-1" onClick={() => navigate('/orderhistory')}>
                  <History size={20} className="dropdown-icon" />
                  <span>Order History</span>
                </div>

                <div className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Log Out</span>
                </div>

                <div className="dropdown-footer">
                  <span className="footer-link1">
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      Terms & Conditions
                    </a>
                  </span>
                  <span className="footer-link2">
                    <a href="/privacy" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
