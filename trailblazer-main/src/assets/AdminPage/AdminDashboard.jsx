/**
 * AdminDashboard.jsx - Main Admin Dashboard Component
 *
 * This is the central dashboard component that handles:
 * - Sidebar navigation with collapsible functionality
 * - Top navigation bar with search and user profile
 * - Routing between different admin pages (Live Orders, Order History, Sales, Messages)
 * - Responsive design for mobile and desktop
 *
 * Integration:
 * - AdminSales.jsx: Imported as AdminSalesComponent for modular sales page content
 * - AdminOrderHistory.jsx: Uses AdminOrderHistoryContent for modular order history
 * - AdminDashboard.css: Main stylesheet with shared component styles
 * - AdminSales.css: Minimal sales-specific styles (mostly empty, using shared styles)
 * - AdminOrderHistory.css: Order history specific styles and tab functionality
 *
 * Architecture:
 * - Single sidebar and top bar shared across all pages
 * - Page content components render in main content area
 * - Shared components (OrdersTable, status rendering) for consistency
 * - CSS variables for theming and responsive design
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import {
  User,
  LogOut,
  LayoutDashboard,
  History,
  Search,
  Mail,
  ShoppingBag,
  Clock,
  Truck,
  BarChartBig,
  Menu,
  Circle, // For status dot
} from "lucide-react";
import "./AdminDashboard.css";
import AdminSalesComponent from "./AdminSales"; // Import the separate AdminSales component
import { AdminOrderHistoryContent } from "./AdminOrderHistory"; // Import the order history content component
import logoImage from "../pages/logo.png"; // Ensure these paths are correct
import profilePic from "../pages/profile.png";
// Placeholder avatars for messages - replace with actual if available
import avatar1 from "../pages/profile.png"; // Example, replace
import avatar2 from "../pages/logo.png"; // Example, replace

const AdminDashboard = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedActionOrderIndex, setSelectedActionOrderIndex] =
    useState(null);
  const [actionDropdownPosition, setActionDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const actionDropdownRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleUserDropdown = () => setIsUserDropdownOpen((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  const toggleActionDropdown = (event, index) => {
    const button = actionDropdownRefs.current[index];
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setActionDropdownPosition({
      top: rect.bottom + window.scrollY + 5,
      // Adjust left based on dropdown width, could be more dynamic
      left: rect.left + window.scrollX - (150 - rect.width / 2),
    });
    setSelectedActionOrderIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const handleClickOutside = (event) => {
    // Close user dropdown
    if (!event.target.closest(".ad-user-profile")) {
      setIsUserDropdownOpen(false);
    }
    // Close action dropdown
    if (
      !event.target.closest(".ad-floating-action-dropdown") &&
      !event.target.closest(".ad-dropdown")
    ) {
      setSelectedActionOrderIndex(null);
    }
    // Close mobile sidebar if clicking outside on larger screens (optional behavior)
    // if (isMobileSidebarOpen && window.innerWidth > 768 && !event.target.closest('.ad-sidebar')) {
    //   setIsMobileSidebarOpen(false);
    // }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => navigate("/profile");
  const handleLogOut = () => navigate("/");
  const handleNavClick = (path) => {
    navigate(path);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false); // Close mobile sidebar on nav
    }
  };

  const orders = [
    {
      id: "#12345",
      name: "Vice Ganda",
      type: "Delivery",
      payment: "Paid(Gcash)",
      status: "Delivered",
      total: "₱50.00",
    },
    {
      id: "#12346",
      name: "Ryan Bang",
      type: "Delivery",
      payment: "Paid(Gcash)",
      status: "Delivered",
      total: "₱50.00",
    },
    {
      id: "#12347",
      name: "Jhong Hilario",
      type: "Pick-up",
      payment: "Paid(Gcash)",
      status: "Delivered",
      total: "₱50.00",
    },
    {
      id: "#12348",
      name: "Anne Curtis",
      type: "Delivery",
      payment: "Paid(Gcash)",
      status: "Delivered",
      total: "₱50.00",
    },
    // Add more orders if needed for different views
    {
      id: "#10001",
      name: "Karylle Tatlonghari",
      type: "Delivery",
      payment: "Paid (Card)",
      status: "On The Way",
      total: "₱75.00",
    },
    {
      id: "#10003",
      name: "Vhong Navarro",
      type: "Pick-up",
      payment: "COD",
      status: "Ready",
      total: "₱120.00",
    },
    {
      id: "#10004",
      name: "Toni Gonzaga",
      type: "Delivery",
      payment: "Paid(Gcash)",
      status: "Delivered",
      total: "₱85.00",
    },
    {
      id: "#10005",
      name: "Piolo Pascual",
      type: "Pick-up",
      payment: "COD",
      status: "Ready",
      total: "₱65.00",
    },
    {
      id: "#10006",
      name: "Angel Locsin",
      type: "Delivery",
      payment: "Paid (Card)",
      status: "On The Way",
      total: "₱95.00",
    },
    {
      id: "#10007",
      name: "John Lloyd Cruz",
      type: "Delivery",
      payment: "Paid(Gcash)",
      status: "Delivered",
      total: "₱110.00",
    },
    {
      id: "#10008",
      name: "Sarah Geronimo",
      type: "Pick-up",
      payment: "COD",
      status: "Ready",
      total: "₱45.00",
    },
    {
      id: "#10009",
      name: "Gerald Anderson",
      type: "Delivery",
      payment: "Paid(Gcash)",
      status: "Delivered",
      total: "₱80.00",
    },
    {
      id: "#10010",
      name: "Bea Alonzo",
      type: "Delivery",
      payment: "Paid (Card)",
      status: "On The Way",
      total: "₱70.00",
    },
    {
      id: "#10011",
      name: "Dingdong Dantes",
      type: "Pick-up",
      payment: "COD",
      status: "Ready",
      total: "₱55.00",
    },
    {
      id: "#10012",
      name: "Marian Rivera",
      type: "Delivery",
      payment: "Paid(Gcash)",
      status: "Delivered",
      total: "₱125.00",
    },
  ];

  const messagesPreviewData = [
    {
      avatar: avatar1,
      name: "Kathryn Bernardo",
      text: "Hi! I would like to ask about the pricing.",
    },
    {
      avatar: avatar2,
      name: "Daniel Padilla",
      text: "Thank you for your service! The prints are great.",
    },
  ];

  const summaryCardsData = {
    liveOrders: [
      { title: "25", subtitle: "Total Orders", icon: ShoppingBag },
      { title: "16", subtitle: "Pending", icon: Clock },
      { title: "09", subtitle: "Completed Today", icon: Truck },
    ],
    // Define more for other pages if needed
  };

  const navItems = [
    { title: "Live Orders", icon: LayoutDashboard, path: "/admindashboard" },
    { title: "Order History", icon: History, path: "/admin-orderhistory" },
    { title: "Sales", icon: BarChartBig, path: "/admin-sales" },
    { title: "Messages", icon: Mail, path: "/admin-messages" },
  ];

  const renderOrderStatus = (status) => {
    let statusClass = "";
    let statusIcon = null;
    switch (status.toLowerCase().replace(/\s+/g, "")) {
      case "delivered":
        statusClass = "delivered";
        statusIcon = <Circle size={10} className="ad-status-icon" />;
        break;
      case "ontheway":
        statusClass = "ontheway";
        break;
      case "ready":
        statusClass = "ready";
        break;
      default:
        statusClass = "default";
    }
    return (
      <span className={`ad-status ${statusClass}`}>
        {statusIcon}
        {status}
      </span>
    );
  };

  const OrdersTable = ({ orderData }) => (
    <div className="ad-orders-table-container">
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
            {(orderData || orders).map((order, index) => (
              <tr
                key={order.id + index} // Add index for potential duplicate IDs in example
                className={index % 2 === 1 ? "alt-row" : ""}
              >
                <td>{order.id}</td>
                <td>{order.name}</td>
                <td>{order.type}</td>
                <td>{order.payment}</td>
                <td>{renderOrderStatus(order.status)}</td>
                <td>{order.total}</td>
                <td>
                  <div className="ad-action-wrapper">
                    <button
                      className="ad-dropdown"
                      onClick={(e) => toggleActionDropdown(e, index)}
                      ref={(el) => (actionDropdownRefs.current[index] = el)}
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
      {selectedActionOrderIndex !== null && (
        <div
          className="ad-floating-action-dropdown"
          style={{
            top: actionDropdownPosition.top,
            left: actionDropdownPosition.left,
          }}
        >
          <div
            onClick={() => alert(`View ${orders[selectedActionOrderIndex].id}`)}
          >
            View Order
          </div>
          <div
            onClick={() =>
              alert(`Message ${orders[selectedActionOrderIndex].name}`)
            }
          >
            Message Customer
          </div>
          <div
            onClick={() =>
              alert(`Cancel ${orders[selectedActionOrderIndex].id}`)
            }
          >
            Cancel Order
          </div>
        </div>
      )}
    </div>
  );

  const LiveOrdersPageContent = () => (
    <div
      className="ad-live-orders-content-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%",
      }}
    >
      <h2 className="ad-title">Live Orders</h2>
      <div className="ad-summary">
        {summaryCardsData.liveOrders.map((card, index) => (
          <div key={index} className="ad-summary-card">
            <div className="ad-summary-icon-wrapper">
              <card.icon size={30} className="summary-icon-svg" />
            </div>
            <div className="ad-summary-text">
              <div className="ad-summary-number">{card.title}</div>
              <div className="ad-summary-label">{card.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="ad-subtitle">Current Orders</h2>
      <OrdersTable orderData={orders.filter((o) => o.status !== "Delivered")} />
    </div>
  );

  const OrderHistoryPageContent = () => (
    <AdminOrderHistoryContent
      OrdersTableComponent={OrdersTable}
      ordersData={orders}
    />
  );

  const SalesPageContent = () => (
    <AdminSalesComponent
      OrdersTableComponent={OrdersTable}
      ordersData={orders}
      messagesPreviewData={messagesPreviewData}
    />
  );

  const MessagesPageContent = () => (
    <>
      <h2 className="ad-title">Messages</h2>
      <p>Messages functionality will be implemented here.</p>
      {/* You can reuse the ad-messages-preview-card or build a full messages interface */}
      <div className="ad-messages-preview-card" style={{ maxWidth: "600px" }}>
        <h3 className="ad-messages-preview-card__header">All Messages</h3>
        <div className="ad-messages-preview-card__list">
          {messagesPreviewData.map((msg, index) => (
            <div key={index} className="ad-messages-preview-card__item">
              <img
                src={msg.avatar}
                alt={msg.name}
                className="ad-messages-preview-card__avatar"
              />
              <div className="ad-messages-preview-card__content">
                <div className="ad-messages-preview-card__name">{msg.name}</div>
                <div className="ad-messages-preview-card__text">{msg.text}</div>
              </div>
            </div>
          ))}
          {/* Add more messages */}
          <div className="ad-messages-preview-card__item">
            <img
              src={avatar1}
              alt="Another User"
              className="ad-messages-preview-card__avatar"
            />
            <div className="ad-messages-preview-card__content">
              <div className="ad-messages-preview-card__name">Another User</div>
              <div className="ad-messages-preview-card__text">
                Inquiry about bulk printing...
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderPageContent = () => {
    const currentPath = location.pathname.toLowerCase();
    console.log("Current Path in renderPageContent:", currentPath); // DEBUG LOG
    if (currentPath.includes("/admin-sales")) {
      console.log("Rendering Sales Route"); // DEBUG LOG
      return <SalesPageContent />;
    } else if (currentPath.includes("/admin-orderhistory")) {
      console.log("Rendering Order History Route"); // DEBUG LOG
      return <OrderHistoryPageContent />;
    } else if (currentPath.includes("/admin-messages")) {
      console.log("Rendering Messages Route"); // DEBUG LOG
      return <MessagesPageContent />;
    }
    // Default to Live Orders / AdminDashboard
    console.log("Rendering Live Orders (Default) Route"); // DEBUG LOG
    return <LiveOrdersPageContent />;
  };

  const sidebarClasses = `ad-sidebar ${isMobileSidebarOpen ? "open" : ""}`;

  return (
    <div
      className={`ad-dashboard ${isMobileSidebarOpen ? "sidebar-is-open" : ""}`}
    >
      <aside className={sidebarClasses}>
        <div className="ad-sidebar-brand">
          <img src={logoImage} alt="Trailblazer Logo" className="ad-logo" />
          <div className="ad-logo-details">
            <h1 className="ad-logo-text">TRAILBLAZER</h1>
            <span className="ad-tagline">PRINTING & LAYOUT SERVICES</span>
          </div>
        </div>

        <nav className="ad-nav">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`ad-nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.path)}
                title={item.title}
              >
                {isActive && <div className="ad-nav-indicator" />}
                <Icon size={24} className="ad-nav-icon" />
                <span>{item.title}</span>
              </div>
            );
          })}
        </nav>
        {/* You can add a footer to the sidebar if needed */}
        {/* <div className="ad-sidebar-footer"> ... </div> */}
      </aside>

      {isMobileSidebarOpen && (
        <div className="ad-mobile-overlay" onClick={toggleMobileSidebar}></div>
      )}

      <div className="ad-content-wrapper">
        <div className="ad-topbar">
          <button className="ad-hamburger-menu" onClick={toggleMobileSidebar}>
            <Menu size={28} />
          </button>
          <div className="ad-search">
            <Search className="ad-search-icon" size={20} />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="ad-user-profile" onClick={toggleUserDropdown}>
            <img src={profilePic} alt="Avatar" className="ad-avatar" />
            <span>Kryzl Castañeda</span> {/* Replace with dynamic user name */}
            <div
              className={`ad-dropdown-arrow ${
                isUserDropdownOpen ? "rotate" : ""
              }`}
            >
              ▼ {/* Using a simple arrow character */}
            </div>
            {isUserDropdownOpen && (
              <div className="ad-dropdown-menu">
                <ul>
                  <li onClick={handleProfileClick}>
                    <User size={20} className="ad-dropdown-icon" /> Admin
                    Profile
                  </li>
                  <li onClick={handleLogOut}>
                    <LogOut size={20} className="ad-dropdown-icon" /> Log Out
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="ad-main-content">{renderPageContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
