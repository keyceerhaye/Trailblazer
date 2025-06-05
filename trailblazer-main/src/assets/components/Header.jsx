import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import imageLogo from "./logo.png";
import defaultUserAvatar from "../pages/profile.png";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  LayoutDashboard,
  History,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const dropdownRef = useRef();
  const mobileMenuRef = useRef();

  const isMinimalHeader =
    location.pathname === "/terms" || location.pathname === "/privacy";

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
    setShowMobileMenu(false);
    navigate("/");
  };

  const handleNavigation = (path, tab) => {
    navigate(path);
    setActiveTab(tab);
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        e.target.className !== "mobile-menu-toggle"
      ) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMinimalHeader) {
    return (
      <header className="header minimal-header">
        <div className="logo-section">
          <div className="brand-container">
            <div className="logo-container">
              <img src={imageLogo} alt="Trailblazer Logo" />
            </div>
            <div className="text-content">
              <h1 className="title">TRAILBLAZER</h1>
              <span className="subtext">PRINTING AND LAYOUT SERVICES</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const pathsWithShadow = [
    "/upload/print",
    "/upload/layout",
    "/upload",
    "/basket",
    "/delivery",
    "/deliveryaddress",
    "/payment",
    "/confirmation",
    "/layout",
    "/service",
    "/specifications",
  ];

  // Check if the current path starts with /template/
  const isTemplatePath = location.pathname.startsWith("/template/");

  return (
    <header
      className={`header ${
        pathsWithShadow.includes(location.pathname) || isTemplatePath
          ? "header-shadow"
          : ""
      }`}
    >
      <div className="logo-section">
        <div className="brand-container">
          <div className="logo-container">
            <img
              src={imageLogo}
              alt="Trailblazer Logo"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="text-content">
            <h1 className="title">TRAILBLAZER</h1>
            <span className="subtext">PRINTING AND LAYOUT SERVICES</span>
          </div>
        </div>
      </div>

      {/* Mobile menu toggle button */}
      <button
        className="mobile-menu-toggle"
        aria-label="Toggle menu"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`right-section ${showMobileMenu ? "show-mobile" : ""}`}
        ref={mobileMenuRef}
      >
        <div className="navbar-container">
          <nav className="navbar">
            <button
              className={activeTab === "home" ? "active" : ""}
              onClick={() => handleNavigation("/", "home")}
            >
              Home
            </button>
            <button
              className={activeTab === "aboutus" ? "active" : ""}
              onClick={() => handleNavigation("/aboutus", "aboutus")}
            >
              About Us
            </button>
            <button
              className={activeTab === "contact" ? "active" : ""}
              onClick={() => handleNavigation("/contact", "contact")}
            >
              Contact Us
            </button>
          </nav>
        </div>

        {!isLoggedIn ? (
          <div className="auth-buttons">
            <div className="Login">
              <button
                onClick={() => {
                  navigate("/Login");
                  setShowMobileMenu(false);
                }}
              >
                Login
              </button>
            </div>
            <div className="SignUp">
              <button
                onClick={() => {
                  navigate("/Signup");
                  setShowMobileMenu(false);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        ) : (
          <div className="user-dropdown" ref={dropdownRef}>
            <div
              className={`user-icon ${showDropdown ? "active" : ""}`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={defaultUserAvatar}
                alt="User"
                className="user-icon-avatar-img"
              />
            </div>
            <div
              className="menu-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>

            {showDropdown && (
              <div className="dropdown-menu custom-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar-container">
                    <img
                      src={defaultUserAvatar}
                      alt="User Avatar"
                      className="avatar-img-header"
                    />
                  </div>
                  <div className="user-name">{userName || "User"}</div>
                  <div
                    className="close-icon"
                    onClick={() => setShowDropdown(false)}
                  >
                    ×
                  </div>
                </div>

                <hr />

                <div
                  className="dropdown-item-1"
                  onClick={() => {
                    navigate("/dashboard");
                    setShowDropdown(false);
                    setShowMobileMenu(false);
                  }}
                >
                  <LayoutDashboard size={24} className="dropdown-icon" />
                  <span>Dashboard</span>
                </div>

                <div
                  className="dropdown-item-1"
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                    setShowMobileMenu(false);
                  }}
                >
                  <User size={24} className="dropdown-icon" />
                  <span>Profile</span>
                </div>

                <div
                  className="dropdown-item-1"
                  onClick={() => {
                    navigate("/orderhistory");
                    setShowDropdown(false);
                    setShowMobileMenu(false);
                  }}
                >
                  <History size={24} className="dropdown-icon" />
                  <span>Order History</span>
                </div>

                <div className="dropdown-item-1" onClick={handleLogout}>
                  <LogOut size={24} className="dropdown-icon" />
                  <span>Log Out</span>
                </div>

                <div className="dropdown-footer">
                  <span className="footer-link1">
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      Terms & Conditions
                    </a>
                  </span>
                  <span className="footer-link2">
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
