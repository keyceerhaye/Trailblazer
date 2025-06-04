import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Import the new sidebar CSS
import { LayoutDashboard, History, User, Clock, LogOut, LayoutGrid, PanelLeftDashed } from "lucide-react";
import logoImage from "../../assets/pages/logo.png"; // Corrected path to logo

// Define the navigation items
const navItems = [
  {
    to: "/dashboard",
    icon: LayoutGrid,
    label: "Home",
    pageName: "dashboard",
  },
  { 
    to: "/profile", 
    icon: User, 
    label: "Profile", 
    pageName: "profile" 
  },
  {
    to: "/orderhistory",
    icon: Clock,
    label: "Order History",
    pageName: "orderhistory",
  },
  { 
    to: "/", 
    icon: LogOut, 
    label: "Log Out", 
    pageName: "logout",
    action: true 
  },
];

export default function Sidebar({ onCollapseChange }) {
  const location = useLocation(); // Get current location
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    }
  }, [collapsed, onCollapseChange]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="logo-section">
        {!collapsed && (
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
        )}
        {collapsed && (
          <div className="S-sidebar-brand-collapsed">
            <img
              src={logoImage}
              alt="Trailblazer Printing Logo"
              className="brand-logo-collapsed"
            />
          </div>
        )}
      </div>

      <nav className="S-sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            if (item.action) {
              return (
                <li
                  key={item.pageName}
                  className={currentPath === item.to ? "active" : ""}
                >
                  <Link to={item.to} onClick={handleLogout}>
                    <IconComponent className="icon" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            }
            return (
              <li
                key={item.pageName}
                className={currentPath === item.to ? "active" : ""}
              >
                <Link to={item.to}>
                  <IconComponent className="icon" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="collapse-btn" onClick={toggleCollapse}>
          <PanelLeftDashed size={24} color="white" />
        </button>
      </div>
    </aside>
  );
}
