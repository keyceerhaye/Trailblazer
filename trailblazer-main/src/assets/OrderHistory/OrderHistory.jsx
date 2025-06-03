import React, { useState, useEffect, useRef } from "react";
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
import logoImage from "../pages/logo.png";
import Profile from "../pages/profile.png";

export default function OrderHistoryPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const [orders, setOrders] = useState([
    {
      orderId: "#12345",
      fileName: "SDE Docs",
      type: "PDF",
      date: "2025-03-01",
      payment: "Paid (Gcash)",
      status: "Completed",
      amount: "₱50.00",
    },
    {
      orderId: "#12346",
      fileName: "Alpha Report",
      type: "DOCX",
      date: "2025-02-25",
      payment: "Paid (Cash)",
      status: "Pending",
      amount: "₱30.00",
    },
    {
      orderId: "#12344",
      fileName: "Zebra Notes",
      type: "PDF",
      date: "2025-04-15",
      payment: "Paid (Gcash)",
      status: "Completed",
      amount: "₱45.00",
    },
  ]);

  const handleSort = (criteria) => {
    const sorted = [...orders].sort((a, b) => {
      switch (criteria) {
        case "date":
          return new Date(b.date) - new Date(a.date);
        case "az":
          return a.fileName.localeCompare(b.fileName);
        case "orderId":
          return a.orderId.localeCompare(b.orderId);
        default:
          return 0;
      }
    });
    setOrders(sorted);
  };

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
            className={`oh-user-profile-box ${isDropdownOpen ? "active" : ""}`}
            onClick={toggleDropdown}
          >
            <img src={Profile} alt="Profile" className="D-profile-img" />
            <div className="oh-user-details">
              <div className="name">{user?.firstName}</div>
              <div className="name lastname">{user?.lastName}</div>
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
                <img src={Profile} alt="Avatar" className="D-profile-img" />
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
                <Home className="oh-dropdown-icon" size={25} />
                Home
              </Link>
              <div className="D-dropdown-item">
                <Link
                  to="/#service"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="oh-dropdown-icon-1" size={25} />
                  Services
                </Link>
              </div>
              <div className="D-dropdown-item">
                <Link
                  to="/contact"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Phone className="oh-dropdown-icon-1" size={25} />
                  Contact Us
                </Link>
              </div>
              <div className="D-dropdown-item">
                <Link
                  to="/aboutus"
                  className="D-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Info className="oh-dropdown-icon-1" size={25} />
                  About Us
                </Link>
              </div>
              <div className="D-dropdown-item" onClick={handleLogout}>
                <LogOut className="oh-dropdown-icon" size={25} />
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
          <input
            type="text"
            placeholder="Search..."
            className="oh-search-box"
          />
          <select
            className="oh-sort-dropdown"
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="date">Date (Newest)</option>
            <option value="az">File Name (A-Z)</option>
            <option value="orderId">Order ID</option>
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
              {orders.map((order, i) => (
                <tr key={i}>
                  <td>{order.orderId}</td>
                  <td>{order.fileName}</td>
                  <td>{order.type}</td>
                  <td>{new Date(order.date).toLocaleDateString("en-PH")}</td>
                  <td>{order.payment}</td>
                  <td>{order.status}</td>
                  <td>{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
