import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, LayoutDashboard, History } from "lucide-react";
import "./AdminDashboard.css";
import logoImage from "./logo.png";
import profilePic from "./profile.png";
import salesChartImage from "./img/sales.png";
import orderIcon from "./img/bag.png";
import pendingIcon from "./img/pending.png";
import completedIcon from "./img/complete.png";

const AdminDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRefs = useRef([]);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const toggleActionDropdown = (event, index) => {
    const button = dropdownRefs.current[index];
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX - 120,
    });
    setSelectedOrderIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleClickOutside = (event) => {
    if (
      !event.target.closest(".ad-floating-action-dropdown") &&
      !event.target.closest(".ad-dropdown")
    ) {
      setSelectedOrderIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => navigate("/profile");
  const handleLogOut = () => navigate("/");
  const handleNavClick = (path) => navigate(path);

  const orders = [
    { id: "#10001", name: "Vice Ganda", type: "Delivery", payment: "Paid (Gcash)", status: "On The Way", total: "₱50.00" },
    { id: "#10002", name: "Anne Curtis", type: "Delivery", payment: "Paid (Gcash)", status: "On The Way", total: "₱50.00" },
    { id: "#10003", name: "Jhong Hilario", type: "Pick-up", payment: "Paid (Gcash)", status: "Ready", total: "₱50.00" },
    { id: "#10004", name: "Ryan Bang", type: "Delivery", payment: "Paid (Gcash)", status: "Ready", total: "₱50.00" },
  ];

  const summaryCards = [
    { title: "25", subtitle: "Orders", image: orderIcon },
    { title: "16", subtitle: "Total Pending", image: pendingIcon },
    { title: "30", subtitle: "Completed", image: completedIcon },
  ];

  const navItems = [
    { title: "Live Orders", icon: LayoutDashboard, path: "/admindashboard" },
    { title: "Order History", icon: History, path: "/admin-orderhistory" },
    { title: "Sales", icon: salesChartImage, path: "/admin-sales" },
  ];

  return (
    <div className="ad-dashboard">
      <aside className="ad-sidebar">
        <div className="ad-sidebar-brand">
          <img src={logoImage} alt="Trailblazer Logo" className="ad-logo" />
          <div className="ad-logo-details">
            <h1 className="ad-logo-text">TRAILBLAZER</h1>
            <span className="ad-tagline">PRINTING & LAYOUT SERVICES</span>
          </div>
        </div>

        <nav className="ad-nav">
          {navItems.map((item, index) => {
            const isActive = window.location.pathname === item.path;
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`ad-nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.path)}
              >
                {isActive && <div className="ad-nav-indicator" />}
                {typeof Icon === "string" ? (
                  <img src={Icon} alt={item.title} className="nav-item-image" />
                ) : (
                  <Icon size={35} />
                )}
                <span>{item.title}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="ad-content-wrapper">
        <div className="ad-topbar">
          <div className="ad-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="ad-user-profile" onClick={toggleDropdown}>
            <img src={profilePic} alt="Avatar" className="ad-avatar" />
            <span>Kryzl Castañeda</span>
            <div className={`ad-dropdown-arrow ${isDropdownOpen ? "rotate" : ""}`}>v</div>
            {isDropdownOpen && (
              <div className="ad-dropdown-menu">
                <ul>
                  <li onClick={handleProfileClick}>
                    <User size={25} className="ad-dropdown-icon" /> Admin Profile
                  </li>
                  <li onClick={handleLogOut}>
                    <LogOut size={25} className="ad-dropdown-icon" /> Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="ad-main-content">
          <h2 className="ad-title">Live Orders</h2>

          <div className="ad-summary">
            {summaryCards.map((card, index) => (
              <div key={index} className="ad-summary-card">
                <div className="ad-summary-number">
                  <img src={card.image} alt={card.subtitle} className="summary-icon" />
                  {card.title}
                </div>
                <div className="ad-summary-label">{card.subtitle}</div>
              </div>
            ))}
          </div>

          <h2 className="ad-subtitle">Orders</h2>

          <div className="ad-orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className={index % 2 === 1 ? "alt-row" : ""}>
                    <td>{order.id}</td>
                    <td>{order.name}</td>
                    <td>{order.type}</td>
                    <td>{order.payment}</td>
                    <td>
                      <span className={`ad-status ${order.status === "Ready" ? "ready" : "ontheway"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.total}</td>
                    <td>
                      <div className="ad-action-wrapper">
                        <button
                          className="ad-dropdown"
                          onClick={(e) => toggleActionDropdown(e, index)}
                          ref={(el) => (dropdownRefs.current[index] = el)}
                        >
                          ⋮
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedOrderIndex !== null && (
            <div
              className="ad-floating-action-dropdown"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
            >
              <div onClick={() => alert(`Cancel ${orders[selectedOrderIndex].id}`)}>Cancel</div>
              <div onClick={() => alert(`Cancel product from ${orders[selectedOrderIndex].id}`)}>
                Cancel Product
              </div>
              <div onClick={() => alert(`Message ${orders[selectedOrderIndex].name}`)}>Message</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
