import React, { useState } from "react";
import {
  LayoutDashboard,
  User,
  History,
  Home,
  Settings,
  Phone,
  Info,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./OrderHistory.css";
import logoImage from "./logo.png";
import Profile from "./profile.png";

export default function OrderHistoryPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="oh-container">
      <aside className="oh-sidebar">
        <div className="oh-sidebar-brand">
          <img src={logoImage} alt="Trailblazer Logo" className="oh-logo" />
          <div className="oh-brand-info">
            <h1 className="oh-brand-title">TRAILBLAZER</h1>
            <span className="oh-brand-subtitle">
              PRINTING & LAYOUT SERVICES
            </span>
          </div>
        </div>
        <nav className="oh-nav">
          <ul>
            <li>
              <a href="/dashboard">
                <LayoutDashboard className="oh-icon" />
                Dashboard
              </a>
            </li>
            <li>
              <a href="/profile">
                <User className="oh-icon" />
                Profile
              </a>
            </li>
            <li className="active">
              <a href="#">
                <History className="oh-icon" />
                Order History
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="oh-main">
        <div className="oh-header-bar">
          <h2 className="oh-title">Order History</h2>

          <div
            className={`D-user-profile-box ${isDropdownOpen ? "active" : ""}`}
            onClick={toggleDropdown}
          >
            <img src={Profile} alt="Profile" className="D-profile-img" />
            <div className="D-user-details">
              <div className="name">Kryzl</div>
              <div className="name lastname">Castañeda</div>
            </div>
            <div className={`D-dropdown-icon ${isDropdownOpen ? "rotate" : ""}`}>
              ⌄
            </div>
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
                <img src={Profile} alt="Avatar" className="D-profile-img" />
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

              <Link to="/" className="D-dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                <Home className="D-dropdown-icon" size={25} />
                Home
              </Link>
              <div className="D-dropdown-item">
                <Link
                  to="/#service"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="D-dropdown-icon" size={25} />
                  Services
                </Link>
              </div>
              <div className="D-dropdown-item">
                <Link
                  to="/contact"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Phone className="D-dropdown-icon" size={25} />
                  Contact Us
                </Link>
              </div>
              <div className="D-dropdown-item">
                <Link
                  to="/aboutus"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Info className="D-dropdown-icon" size={25} />
                  About Us
                </Link>
              </div>
              <div className="D-dropdown-item" onClick={handleLogout}>
                <LogOut className="D-dropdown-icon" size={25} />
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

        <div className="oh-search-sort">
          <input type="text" placeholder="Search..." className="oh-search-box" />
          <select className="oh-sort-dropdown">
            <option>Sort by</option>
          </select>
        </div>

        <div className="oh-table">
          <table>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>File Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td>#12345</td>
                  <td>SDE Docs</td>
                  <td>PDF</td>
                  <td>01-03-25</td>
                  <td>Paid (Gcash)</td>
                  <td>Completed</td>
                  <td>₱50.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
    