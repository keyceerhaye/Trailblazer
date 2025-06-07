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
import AdminProfile from "./AdminProfile"; // Import the AdminProfile component
import OrderDetailView from "./OrderDetailView"; // Import the OrderDetailView component
import logoImage from "../pages/logo.png"; // Ensure these paths are correct
import profilePic from "../pages/profile.png";
import {
  orderManager,
  ORDER_STATUS,
  formatPrice,
  formatDate,
} from "../../utils/dataManager";

const AdminDashboard = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedActionOrderIndex, setSelectedActionOrderIndex] =
    useState(null);
  const [actionDropdownPosition, setActionDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const actionDropdownRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState("Jane Doe");

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

  const handleProfileClick = () => navigate("/admin-profile");
  const handleLogOut = () => navigate("/");
  const handleNavClick = (path) => {
    // Clear the viewing order when navigating to a different page
    setViewingOrder(null);
    navigate(path);
    if (isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false); // Close mobile sidebar on nav
    }
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setSelectedActionOrderIndex(null); // Close dropdown
  };

  const handleBackToOrders = () => {
    setViewingOrder(null);
    // Navigation will be handled by the current page state automatically
  };

  // Function to refresh admin name from localStorage
  const refreshAdminName = () => {
    // First check email consistency
    const emailConsistent = checkEmailConsistency();
    if (!emailConsistent) {
      setAdminName("Jane Doe");
      return;
    }

    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (storedAdmin && storedAdmin.firstName && storedAdmin.lastName) {
      setAdminName(`${storedAdmin.firstName} ${storedAdmin.lastName}`);
    } else {
      setAdminName("Jane Doe");
    }
  };

  // Function to check if current admin email matches stored profile
  const checkEmailConsistency = () => {
    const currentAdminEmail = localStorage.getItem("currentAdminEmail");
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));

    // If there's a current admin email and stored admin data
    if (currentAdminEmail && storedAdmin && storedAdmin.email) {
      // If emails don't match, it means a different admin logged in
      if (currentAdminEmail !== storedAdmin.email) {
        // Load the correct admin profile from registry
        const adminRegistry =
          JSON.parse(localStorage.getItem("adminRegistry")) || [];
        const correctAdmin = adminRegistry.find(
          (admin) => admin.email === currentAdminEmail
        );

        if (correctAdmin) {
          // Load correct admin profile
          localStorage.setItem("admin", JSON.stringify(correctAdmin));
          setAdminName(`${correctAdmin.firstName} ${correctAdmin.lastName}`);
        } else {
          // Admin not found in registry, reset to default
          localStorage.removeItem("admin");
          setAdminName("Jane Doe");
          return false; // Profile needs to be set up
        }
      }
    }
    return true; // Emails match or no conflict
  };

  // Function to check if admin profile is complete
  const checkProfileCompletion = () => {
    // First check email consistency
    const emailConsistent = checkEmailConsistency();
    if (!emailConsistent) {
      // Email mismatch detected, redirect to profile setup
      navigate("/admin-profile");
      return false;
    }

    const storedAdmin = JSON.parse(localStorage.getItem("admin"));

    // Check if required fields are present and not empty
    if (
      !storedAdmin ||
      !storedAdmin.firstName ||
      !storedAdmin.lastName ||
      !storedAdmin.email ||
      storedAdmin.firstName.trim() === "" ||
      storedAdmin.lastName.trim() === "" ||
      storedAdmin.email.trim() === ""
    ) {
      // Profile is incomplete, redirect to profile page
      navigate("/admin-profile");
      return false;
    }
    return true;
  };

  // Get real orders from data manager
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});

  useEffect(() => {
    // First check if profile is complete, redirect if not
    const isProfileComplete = checkProfileCompletion();

    // Only continue loading dashboard data if profile is complete
    if (isProfileComplete) {
      // Load orders and statistics
      const allOrders = orderManager.getAllOrders();
      const stats = orderManager.getOrderStatistics();

      // Add fake order data for demonstration
      const fakeOrders = [
        {
          id: "ORD-001",
          customerName: "John Smith",
          deliveryMethod: "deliver",
          paymentMethod: "GCash",
          status: ORDER_STATUS.PROCESSING,
          totalAmount: 250.0,
          orderDate: new Date().toISOString(),
          files: ["business_cards.pdf"],
        },
        {
          id: "ORD-002",
          customerName: "Maria Garcia",
          deliveryMethod: "pickup",
          paymentMethod: "Cash on Delivery",
          status: ORDER_STATUS.READY_FOR_PICKUP,
          totalAmount: 180.5,
          orderDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          files: ["flyers.pdf", "poster.jpg"],
        },
      ];

      // Combine real orders with fake orders
      const combinedOrders = [...allOrders, ...fakeOrders];

      // Transform orders to admin dashboard format
      const transformedOrders = combinedOrders.map((order) => ({
        id: order.id,
        name: order.customerName,
        type: order.deliveryMethod === "deliver" ? "Delivery" : "Pick-up",
        payment:
          order.paymentMethod === "Cash on Delivery"
            ? "COD"
            : `Paid(${order.paymentMethod})`,
        status: getDisplayStatus(order.status),
        total: formatPrice(order.totalAmount),
        orderDate: order.orderDate,
        files: order.files,
      }));

      setOrders(transformedOrders);
      setOrderStats(stats);

      // Load admin name from localStorage
      refreshAdminName();
    }
  }, [navigate]);

  // Effect to refresh admin name when location changes (e.g., returning from profile page)
  useEffect(() => {
    refreshAdminName();
  }, [location.pathname]);

  const getDisplayStatus = (status) => {
    switch (status) {
      case ORDER_STATUS.RECEIVED:
        return "Order Received";
      case ORDER_STATUS.PROCESSING:
        return "Processing";
      case ORDER_STATUS.ON_THE_WAY:
        return "On The Way";
      case ORDER_STATUS.READY_FOR_PICKUP:
        return "Ready";
      case ORDER_STATUS.DELIVERED:
        return "Delivered";
      case ORDER_STATUS.CANCELLED:
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    const success = orderManager.updateOrderStatus(orderId, newStatus);
    if (success) {
      // Refresh orders
      const allOrders = orderManager.getAllOrders();
      const transformedOrders = allOrders.map((order) => ({
        id: order.id,
        name: order.customerName,
        type: order.deliveryMethod === "deliver" ? "Delivery" : "Pick-up",
        payment:
          order.paymentMethod === "Cash on Delivery"
            ? "COD"
            : `Paid(${order.paymentMethod})`,
        status: getDisplayStatus(order.status),
        total: formatPrice(order.totalAmount),
        orderDate: order.orderDate,
        files: order.files,
      }));
      setOrders(transformedOrders);
    }
  };

  // Real chat message data - empty by default, will be populated from a real messaging system
  const chatUsers = [];

  // Calculate dynamic summary data based on real orders
  const getSummaryCardsData = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (order) => order.status !== "Delivered" && order.status !== "Cancelled"
    ).length;

    // Count orders delivered today
    const today = new Date().toDateString();
    const completedToday = orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return order.status === "Delivered" && orderDate.toDateString() === today;
    }).length;

    return {
      liveOrders: [
        {
          title: totalOrders.toString(),
          subtitle: "Total Orders",
          icon: ShoppingBag,
        },
        { title: pendingOrders.toString(), subtitle: "Pending", icon: Clock },
        {
          title: completedToday.toString(),
          subtitle: "Completed Today",
          icon: Truck,
        },
      ],
      // Define more for other pages if needed
    };
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
    let backgroundColor = "";
    let textColor = "";

    switch (status.toLowerCase().replace(/\s+/g, "")) {
      case "delivered":
        statusClass = "delivered";
        statusIcon = <Circle size={8} className="ad-status-icon" />;
        backgroundColor = "#e8f5e8";
        textColor = "#2d5a2d";
        break;
      case "ontheway":
        statusClass = "ontheway";
        statusIcon = <Truck size={12} className="ad-status-icon" />;
        backgroundColor = "#fff3cd";
        textColor = "#856404";
        break;
      case "ready":
      case "readyforpickup":
        statusClass = "ready";
        statusIcon = <Clock size={12} className="ad-status-icon" />;
        backgroundColor = "#d1ecf1";
        textColor = "#0c5460";
        break;
      case "processing":
        statusClass = "processing";
        statusIcon = <Circle size={8} className="ad-status-icon spinning" />;
        backgroundColor = "#e2e3ff";
        textColor = "#383d9a";
        break;
      case "orderreceived":
        statusClass = "received";
        statusIcon = <ShoppingBag size={12} className="ad-status-icon" />;
        backgroundColor = "#f8f9fa";
        textColor = "#495057";
        break;
      case "cancelled":
        statusClass = "cancelled";
        statusIcon = <Circle size={8} className="ad-status-icon" />;
        backgroundColor = "#f8d7da";
        textColor = "#721c24";
        break;
      default:
        statusClass = "default";
        statusIcon = <Circle size={8} className="ad-status-icon" />;
        backgroundColor = "#f8f9fa";
        textColor = "#495057";
    }

    return (
      <span
        className={`ad-status ${statusClass}`}
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "500",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          border: `1px solid ${textColor}20`,
          whiteSpace: "nowrap",
        }}
      >
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
            onClick={() => handleViewOrder(orders[selectedActionOrderIndex])}
            style={{ color: "black" }}
          >
            View Order
          </div>
          <div
            onClick={() =>
              alert(`Cancel order ${orders[selectedActionOrderIndex].id}`)
            }
            style={{ color: "red" }}
          >
            Cancel Product
          </div>
          <div
            onClick={() =>
              alert(`Message ${orders[selectedActionOrderIndex].name}`)
            }
            style={{ color: "black" }}
          >
            Message
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
        {getSummaryCardsData().liveOrders.map((card, index) => (
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
    />
  );

  const AdminProfilePageContent = () => <AdminProfile />;

  const MessagesPageContent = () => {
    const [messageInput, setMessageInput] = useState("");

    const handleUserClick = (user) => {
      setSelectedChatUser(user);
    };

    const handleSendMessage = (e) => {
      e.preventDefault();
      if (!messageInput.trim() || !selectedChatUser) return;

      // Update the chat messages for the selected user
      const updatedUsers = chatUsers.map((user) => {
        if (user.id === selectedChatUser.id) {
          return {
            ...user,
            messages: [
              ...user.messages,
              {
                id: user.messages.length + 1,
                sender: "admin",
                text: messageInput,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ],
            preview: `Admin: ${messageInput}`, // Update preview with admin's message
          };
        }
        return user;
      });

      // Update the selected chat user with new messages
      const updatedUser = updatedUsers.find(
        (user) => user.id === selectedChatUser.id
      );
      setSelectedChatUser(updatedUser);

      // Clear input
      setMessageInput("");
    };

    return (
      <div className="ad-messages-container">
        <h2 className="ad-title">Messages</h2>

        <div className="ad-chat-layout">
          {/* Left side - User list */}
          <div className="ad-messages-users-list">
            <h3 className="ad-messages-preview-card__header">Chatlist</h3>
            <div className="ad-messages-preview-card__list">
              {chatUsers.length > 0 ? (
                chatUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`ad-messages-preview-card__item ${
                      selectedChatUser?.id === user.id ? "active" : ""
                    }`}
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="ad-messages-user-avatar-container">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="ad-messages-preview-card__avatar"
                      />
                      {user.online && (
                        <span className="ad-messages-user-status"></span>
                      )}
                    </div>
                    <div className="ad-messages-preview-card__content">
                      <div className="ad-messages-preview-card__name">
                        {user.name}
                      </div>
                      <div className="ad-messages-preview-card__text">
                        {user.preview}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="ad-empty-chatlist">
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      💬
                    </div>
                    <h4 style={{ color: "#333", marginBottom: "8px" }}>
                      No Messages Yet
                    </h4>
                    <p style={{ margin: 0, lineHeight: "1.4" }}>
                      Customer messages will appear here when they contact you
                      through the platform.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Chat window */}
          {selectedChatUser ? (
            <div className="ad-chat-window">
              <div className="ad-chat-header">
                <div className="ad-chat-user-info">
                  <img
                    src={selectedChatUser.avatar}
                    alt={selectedChatUser.name}
                    className="ad-messages-preview-card__avatar"
                  />
                  <div>
                    <div className="ad-chat-username">
                      {selectedChatUser.name}
                    </div>
                    <div className="ad-chat-user-status-text">
                      {selectedChatUser.online ? "online" : "offline"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ad-chat-messages">
                {selectedChatUser.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`ad-chat-message ${
                      message.sender === "admin" ? "admin" : "user"
                    }`}
                  >
                    {message.sender === "user" && (
                      <div className="ad-chat-avatar-container">
                        <img
                          src={selectedChatUser.avatar}
                          alt={selectedChatUser.name}
                          className="ad-chat-message-avatar"
                        />
                      </div>
                    )}
                    <div className="ad-chat-message-content">
                      <div className="ad-chat-message-text">{message.text}</div>
                      <div className="ad-chat-message-time">{message.time}</div>
                    </div>
                    {message.sender === "admin" && (
                      <div className="ad-chat-avatar-container">
                        <img
                          src={profilePic}
                          alt="Admin"
                          className="ad-chat-message-avatar"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form
                className="ad-chat-input-container"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  placeholder="type your message here..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="ad-chat-input"
                />
                <button type="submit" className="ad-chat-send-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="#2f2785"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                  </svg>
                </button>
              </form>
            </div>
          ) : (
            <div className="ad-chat-placeholder">
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 40px",
                  color: "#666",
                  fontSize: "16px",
                }}
              >
                {chatUsers.length > 0 ? (
                  <>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>
                      💬
                    </div>
                    <h3 style={{ color: "#333", marginBottom: "12px" }}>
                      Select a conversation
                    </h3>
                    <p style={{ margin: 0, lineHeight: "1.5" }}>
                      Choose a conversation from the left to start chatting with
                      customers.
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "64px", marginBottom: "20px" }}>
                      📭
                    </div>
                    <h3 style={{ color: "#333", marginBottom: "12px" }}>
                      No Messages
                    </h3>
                    <p style={{ margin: 0, lineHeight: "1.5" }}>
                      Your customer messages will appear here. When customers
                      contact you through the platform, their conversations will
                      be listed on the left.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getCurrentPageName = () => {
    const currentPath = location.pathname.toLowerCase();
    if (currentPath.includes("/admin-sales")) {
      return "Sales";
    } else if (currentPath.includes("/admin-orderhistory")) {
      return "Order History";
    }
    return "Live Orders";
  };

  const renderPageContent = () => {
    // If viewing an order, show the detail view
    if (viewingOrder) {
      return (
        <OrderDetailView
          order={viewingOrder}
          onBack={handleBackToOrders}
          sourcePage={getCurrentPageName()}
          onNavigate={handleNavClick}
        />
      );
    }

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
    } else if (currentPath.includes("/admin-profile")) {
      console.log("Rendering Admin Profile Route"); // DEBUG LOG
      return <AdminProfilePageContent />;
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
            <span>{adminName}</span>
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
