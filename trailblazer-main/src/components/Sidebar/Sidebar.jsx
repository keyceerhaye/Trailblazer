import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css"; // Import the new sidebar CSS
import { LayoutDashboard, History, Home } from "lucide-react";
import logoImage from "../../assets/pages/logo.png"; // Corrected path to logo

// Define the navigation items
const navItems = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    pageName: "dashboard",
  },
  { to: "/", icon: Home, label: "Home", pageName: "home" },
  {
    to: "/orderhistory",
    icon: History,
    label: "Order History",
    pageName: "orderhistory",
  },
];

export default function Sidebar() {
  const location = useLocation(); // Get current location
  const currentPath = location.pathname;

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="S-sidebar-brand">
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

      <nav className="S-sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li
                key={item.pageName}
                className={currentPath === item.to ? "active" : ""}
              >
                <Link to={item.to}>
                  <IconComponent className="icon" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Optional: Add a footer or other elements here if needed later */}
    </aside>
  );
}
