import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppHeader from "../../components/AppHeader/AppHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.css";
import { LogOut, Phone, Info, Settings, Home } from "lucide-react";
import profilePic from "../pages/profile.png";
import OrderReceived from "../pages/OrderReceived.png";
import OrderProcessing from "../pages/2.png";
import Otw from "../pages/3.png";
import Delivered from "../pages/4.png";
import BusinesswomanWavingHello from "../pages/businesswomanwavinghello.svg";
import {
  orderManager,
  ORDER_STATUS,
  formatPrice,
} from "../../utils/dataManager";

export default function Dashboard() {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedCollapsedState = localStorage.getItem("sidebarCollapsed");
    return savedCollapsedState ? JSON.parse(savedCollapsedState) : false;
  });
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [currentDate, setCurrentDate] = useState("");

  // Debug: Log image imports
  useEffect(() => {
    console.log("Dashboard images loaded:", {
      OrderReceived,
      OrderProcessing,
      Otw,
      Delivered,
    });
  }, []);

  useEffect(() => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(today.toLocaleDateString("en-US", options));

    // Get the most recent order for this user
    if (user?.id) {
      const orders = orderManager.getOrdersByUser(user.id);
      setUserOrders(orders);

      // Get the most recent order
      if (orders.length > 0) {
        const recentOrder = orders[orders.length - 1];
        setCurrentOrder(recentOrder);
      }
    }
  }, [location.state, user?.id]);

  // Auto-collapse sidebar on mobile screens
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(true));
      } else if (!isMobile && sidebarCollapsed) {
        // Auto-expand on larger screens if it was collapsed due to mobile view
        const savedCollapsedState = localStorage.getItem("sidebarCollapsed");
        if (savedCollapsedState === "true" && window.innerWidth > 768) {
          setSidebarCollapsed(false);
          localStorage.setItem("sidebarCollapsed", JSON.stringify(false));
        }
      }
    };

    // Check on initial load
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarCollapsed]);

  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleDashboardLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Sidebar onCollapseChange={handleSidebarCollapse} />
      <div
        className={`main-content-wrapper ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div
          className={`page-header ${
            sidebarCollapsed ? "sidebar-collapsed" : ""
          }`}
        >
          <div className="page-header-title">
            <h2>Dashboard</h2>
            <p className="date">{currentDate}</p>
          </div>
          <AppHeader
            user={user}
            profilePic={profilePic}
            handleLogout={handleDashboardLogout}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>

        <main className="main-dashboard">
          <div className="welcome-card">
            <div>
              <h2>Hi, {user?.firstName}!</h2>
              <p>
                Welcome To Trailblazer Printing And
                <br />
                Layout Services.
              </p>
            </div>
            <img
              src={BusinesswomanWavingHello}
              alt="Welcome Illustration"
              className="welcome-card-svg"
            />
          </div>

          <div className="order-progress">
            <h3>Order Progress</h3>
            <div className="order-info">
              <div className="order-line">
                <div className="order-row">
                  <span className="order-label">Order ID:</span>
                  <span className="order-value">
                    {currentOrder?.id || "No orders yet"}
                  </span>
                </div>
                <div className="order-row">
                  <span className="order-label">Files:</span>
                  <span className="order-value">
                    {currentOrder?.files?.length || 0} file(s)
                  </span>
                </div>
                <div className="order-row">
                  <span className="order-label">Total Amount:</span>
                  <span className="order-value1">
                    {formatPrice(currentOrder?.totalAmount || 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="progress-steps">
              <div
                className={`step ${
                  currentOrder?.status === ORDER_STATUS.RECEIVED ||
                  currentOrder?.status === ORDER_STATUS.PROCESSING ||
                  currentOrder?.status === ORDER_STATUS.ON_THE_WAY ||
                  currentOrder?.status === ORDER_STATUS.DELIVERED
                    ? "active"
                    : ""
                }`}
              >
                <div
                  className={`icon-circle ${
                    currentOrder?.status === ORDER_STATUS.RECEIVED ||
                    currentOrder?.status === ORDER_STATUS.PROCESSING ||
                    currentOrder?.status === ORDER_STATUS.ON_THE_WAY ||
                    currentOrder?.status === ORDER_STATUS.DELIVERED
                      ? "highlight"
                      : ""
                  }`}
                >
                  <img
                    src={OrderReceived}
                    alt="1"
                    className="step-img"
                    onLoad={() =>
                      console.log(
                        "OrderReceived image loaded successfully, src:",
                        OrderReceived
                      )
                    }
                    onError={(e) =>
                      console.error(
                        "Failed to load OrderReceived image:",
                        e.target.src
                      )
                    }
                  />
                </div>
                <p>Order Received</p>
              </div>
              <div className="line"></div>
              <div
                className={`step ${
                  currentOrder?.status === ORDER_STATUS.PROCESSING ||
                  currentOrder?.status === ORDER_STATUS.ON_THE_WAY ||
                  currentOrder?.status === ORDER_STATUS.DELIVERED
                    ? "active"
                    : ""
                }`}
              >
                <div
                  className={`icon-circle ${
                    currentOrder?.status === ORDER_STATUS.PROCESSING ||
                    currentOrder?.status === ORDER_STATUS.ON_THE_WAY ||
                    currentOrder?.status === ORDER_STATUS.DELIVERED
                      ? "highlight"
                      : ""
                  }`}
                >
                  <img src={OrderProcessing} alt="2" className="step-img" />
                </div>
                <p>Order Processing</p>
              </div>
              <div className="line"></div>
              <div
                className={`step ${
                  currentOrder?.status === ORDER_STATUS.ON_THE_WAY ||
                  currentOrder?.status === ORDER_STATUS.DELIVERED
                    ? "active"
                    : ""
                }`}
              >
                <div
                  className={`icon-circle ${
                    currentOrder?.status === ORDER_STATUS.ON_THE_WAY ||
                    currentOrder?.status === ORDER_STATUS.DELIVERED
                      ? "highlight"
                      : ""
                  }`}
                >
                  <img src={Otw} alt="3" className="step-img" />
                </div>
                <p>On the way</p>
              </div>
              <div className="line"></div>
              <div
                className={`step ${
                  currentOrder?.status === ORDER_STATUS.DELIVERED
                    ? "active"
                    : ""
                }`}
              >
                <div
                  className={`icon-circle ${
                    currentOrder?.status === ORDER_STATUS.DELIVERED
                      ? "highlight"
                      : ""
                  }`}
                >
                  <img src={Delivered} alt="4" className="step-img" />
                </div>
                <p>Delivered!</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
