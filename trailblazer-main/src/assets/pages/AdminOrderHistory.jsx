import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation
import "./AdminOrderHistory.css";
import { User, LogOut, LayoutDashboard, History } from "lucide-react";  // Import the icons
import logoImage from "./logo.png";
import profilePic from "./profile.png";
import salesChartImage from "./img/sales.png";

const AdminOrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();  // Initialize navigate hook

  // Handle the navigation when "Live Orders" is clicked
  const handleLiveOrdersClick = () => {
    navigate("/admindashboard"); // This will navigate to the Admin Dashboard
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    return order.status.toLowerCase() === activeTab;
  });

  const tabs = [
    { label: "All Order", value: "all" },
    { label: "Completed", value: "delivered" },
    { label: "Cancelled", value: "cancelled" }
  ];

  return (
    <div className="aoh-container">
      <aside className="ad-sidebar">
        <div className="ad-sidebar-brand">
          <img src={logoImage} alt="Trailblazer Logo" className="aoh-logo" />
          <div className="aoh-logo-details">
            <h1 className="aoh-logo-text">TRAILBLAZER</h1>
            <span className="aoh-tagline">PRINTING & LAYOUT SERVICES</span>
          </div>
        </div>
        <nav className="ad-nav">
          {/* "Live Orders" with icon */}
          <div className="ad-nav-item" onClick={handleLiveOrdersClick}>
            <LayoutDashboard className="aoh-icon" size={35} />
            <span>Live Orders</span>
          </div>

          {/* Active Order History menu with icon */}
          <div className="ad-nav-item active">
            <div className="ad-nav-indicator" />
            <History className="aoh-icon" size={35}/>
            <span>Order History</span>
          </div>

          {/* "Sales" section with icon */}
          <div className="ad-nav-item">
            <img src={salesChartImage} alt="Sales" className="nav-item-image"/>
            <span>Sales</span>
          </div>
        </nav>
      </aside>

      <div className="ad-content-wrapper">
        <div className="ad-topbar">
          <div className="ad-search">
            <input type="text" placeholder="Search..." />
          </div>
          <div className="ad-user-profile">
            <img src={profilePic} alt="Avatar" className="ad-avatar" />
            <span>Kryzl Castañeda</span>
          </div>
        </div>

        <div className="ad-main-content">
          <h2 className="ad-title">Order History</h2>

          <div className="aoh-tabs">
            {tabs.map(tab => (
              <button
                key={tab.value}
                className={`aoh-tab-btn ${activeTab === tab.value ? "active" : ""}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="ad-orders-table">
            {filteredOrders.length > 0 ? (
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
                  {filteredOrders.map((order, index) => (
                    <tr key={index} className={index % 2 === 1 ? "alt-row" : ""}>
                      <td>{order.id}</td>
                      <td>{order.name}</td>
                      <td>{order.type}</td>
                      <td>{order.payment}</td>
                      <td>
                        <span className={`ad-status ${order.status === "Delivered" ? "ready" : "ontheway"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>₱{order.total}</td>
                      <td>
                        <button className="ad-action-btn">⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="aoh-empty-message">No orders found in this tab.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderHistory;

const orders = [
  { id: "#12345", name: "Vice Ganda", type: "Delivery", payment: "Paid(Gcash)", status: "Delivered", total: "50.00" },
  { id: "#12346", name: "Anne Curtis", type: "Delivery", payment: "Paid(Gcash)", status: "Cancelled", total: "50.00" },
  { id: "#12347", name: "Jhong Hilario", type: "Pick-up", payment: "Paid(Gcash)", status: "Cancelled", total: "50.00" },
  { id: "#12348", name: "Ryan Bang", type: "Delivery", payment: "Paid(Gcash)", status: "Delivered", total: "50.00" },
  { id: "#12349", name: "Jhong Hilario", type: "Pick-up", payment: "Paid(Gcash)", status: "Cancelled", total: "50.00" },
  { id: "#12350", name: "Ryan Bang", type: "Delivery", payment: "Paid(Gcash)", status: "Delivered", total: "50.00" },
  { id: "#12351", name: "Vice Ganda", type: "Delivery", payment: "Paid(Gcash)", status: "Delivered", total: "50.00" },
  { id: "#12352", name: "Anne Curtis", type: "Delivery", payment: "Paid(Gcash)", status: "Cancelled", total: "50.00" }
];
