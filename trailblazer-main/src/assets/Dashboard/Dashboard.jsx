import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import profilePic from "../pages/profile.png";
import logoImage from "../pages/logo.png";
import OrderReceived from "../pages/1.png";
import OrderProcessing from "../pages/2.png";
import Otw from "../pages/3.png";
import Delivered from "../pages/4.png";

export default function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fileName, setFileName] = useState("SDE Docs");
  const [price, setPrice] = useState(25.0);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Try to get order info from location.state first
    const basketItems = location.state?.basketItems || [];
    const orderDetails = location.state?.orderDetails || {};

    if (basketItems.length > 0) {
      setFileName(basketItems[0].name);
    } else {
      // fallback localStorage
      const savedOrder = JSON.parse(localStorage.getItem("order"));
      if (savedOrder?.fileName) {
        setFileName(savedOrder.fileName);
      }
    }

    if (orderDetails.price !== undefined) {
      setPrice(orderDetails.price);
    } else {
      const savedOrder = JSON.parse(localStorage.getItem("order"));
      if (savedOrder?.price !== undefined) {
        setPrice(savedOrder.price);
      }
    }
  }, [location.state]); // re-run if location.state changes

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-section">
          <div className="D-sidebar-brand">
            <img
              src={logoImage}
              alt="Trailblazer Printing Logo"
              className="brand-logo"
            />
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
            <img src={profilePic} alt="Profile" className="D-profile" />
            <div className="D-user-details">
              <div className="name">{user?.firstName}</div>
              <div className="name">{user?.lastName}</div>
            </div>
            <div
              className={`D-dropdown-icon ${isDropdownOpen ? "rotate" : ""}`}
            >
              ⌄
            </div>
          </div>

          {isDropdownOpen && (
            <div className="D-profile-dropdown" ref={dropdownRef}>
              <div
                className="D-dropdown-header"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown();
                }}
              >
                <img src={profilePic} alt="Avatar" className="D-profile-img" />
                <div className="D-dropdown-details">
                  <div className="name1">{user?.firstName}</div>
                  <div className="name1">{user?.lastName}</div>
                </div>
                <div
                  className="D-dropdown-icon rotate"
                  onClick={toggleDropdown}
                  style={{ cursor: "pointer" }}
                ></div>
              </div>

              <hr />

              <Link
                to="/"
                className="D-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Home className="dropdown-icon" />
                Home
              </Link>
              <div className="D-dropdown-item">
                <Link
                  to="/#service"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="dropdown-icon-1" />
                  Services
                </Link>
              </div>
              <div className="D-dropdown-item">
                <Link
                  to="/contact"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Phone className="dropdown-icon-1" />
                  Contact Us
                </Link>
              </div>
              <div className="D-dropdown-item">
                <Link
                  to="/aboutus"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Info className="dropdown-icon-1" />
                  About Us
                </Link>
              </div>
              <div className="D-dropdown-item" onClick={handleLogout}>
                <LogOut className="dropdown-icon" />
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
          <h2>Hi, {user?.firstName}!</h2>
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
                <span className="order-value">{fileName}</span>
              </div>
              <div className="order-row">
                <span className="order-label">Payment:</span>
                <span className="order-value1">₱{price.toFixed(2)}</span>
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
