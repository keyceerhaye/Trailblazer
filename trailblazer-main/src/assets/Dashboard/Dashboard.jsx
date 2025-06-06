import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppHeader from "../../components/AppHeader/AppHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import OrderProgress from "../../components/OrderProgress/OrderProgress";
import "./Dashboard.css";
import { LogOut, Phone, Info, Settings, Home } from "lucide-react";
import profilePic from "../pages/profile.png";
import BusinesswomanWavingHello from "../pages/businesswomanwavinghello.svg";
import {
  orderManager,
  ORDER_STATUS,
  formatPrice,
} from "../../utils/dataManager";

export default function Dashboard() {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [mockOrders, setMockOrders] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedCollapsedState = localStorage.getItem("sidebarCollapsed");
    return savedCollapsedState ? JSON.parse(savedCollapsedState) : false;
  });
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [currentDate, setCurrentDate] = useState("");

  // Create mock order data with different progress stages
  const createMockOrders = () => {
    return [
      {
        id: "#12346",
        userId: user?.id || "user1",
        customerName: `${user?.firstName || "Jane"} ${
          user?.lastName || "Smith"
        }`,
        customerEmail: user?.email || "jane.smith@example.com",
        status: ORDER_STATUS.PROCESSING,
        orderType: "layout",
        deliveryMethod: "pickup",
        files: [
          {
            id: "file3",
            fileName: "Wedding Invitation.png",
            fileType: "image/png",
            pageCount: 1,
          },
        ],
        totalAmount: 350.0,
        orderDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        turnaroundTime: "Rush",
        templateData: {
          templateType: "Invitation",
          title: "Wedding Invitation Design",
          description: "Custom wedding invitation with floral theme",
        },
      },
      {
        id: "#12347",
        userId: user?.id || "user1",
        customerName: `${user?.firstName || "Alex"} ${
          user?.lastName || "Garcia"
        }`,
        customerEmail: user?.email || "alex.garcia@example.com",
        status: ORDER_STATUS.ON_THE_WAY,
        orderType: "layout",
        deliveryMethod: "delivery",
        files: [
          {
            id: "file4a",
            fileName: "Company Brochure.psd",
            fileType: "image/psd",
            pageCount: 6,
          },
          {
            id: "file4b",
            fileName: "Business Card Design.ai",
            fileType: "application/illustrator",
            pageCount: 2,
          },
        ],
        totalAmount: 480.0,
        orderDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        turnaroundTime: "Standard",
        templateData: {
          templateType: "Business Materials",
          title: "Corporate Branding Package",
          description: "Complete branding materials for startup company",
        },
      },
      {
        id: "#12348",
        userId: user?.id || "user1",
        customerName: `${user?.firstName || "Emma"} ${
          user?.lastName || "Davis"
        }`,
        customerEmail: user?.email || "emma.davis@example.com",
        status: ORDER_STATUS.READY_FOR_PICKUP,
        orderType: "printing",
        deliveryMethod: "pickup",
        files: [
          {
            id: "file5a",
            fileName: "Photo Album.pdf",
            fileType: "application/pdf",
            pageCount: 50,
          },
        ],
        totalAmount: 220.0,
        orderDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        turnaroundTime: "Standard",
        templateData: null,
      },
      {
        id: "#12349",
        userId: user?.id || "user1",
        customerName: `${user?.firstName || "Mike"} ${
          user?.lastName || "Johnson"
        }`,
        customerEmail: user?.email || "mike.johnson@example.com",
        status: ORDER_STATUS.DELIVERED,
        orderType: "printing",
        deliveryMethod: "delivery",
        files: [
          {
            id: "file4",
            fileName: "Thesis Report.pdf",
            fileType: "application/pdf",
            pageCount: 120,
          },
          {
            id: "file5",
            fileName: "Appendix.pdf",
            fileType: "application/pdf",
            pageCount: 25,
          },
        ],
        totalAmount: 580.0,
        orderDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        turnaroundTime: "Standard",
        templateData: null,
      },
      {
        id: "#12350",
        userId: user?.id || "user1",
        customerName: `${user?.firstName || "Lisa"} ${
          user?.lastName || "Chen"
        }`,
        customerEmail: user?.email || "lisa.chen@example.com",
        status: ORDER_STATUS.CANCELLED,
        orderType: "layout",
        deliveryMethod: "pickup",
        files: [
          {
            id: "file6a",
            fileName: "Event Poster.jpg",
            fileType: "image/jpeg",
            pageCount: 1,
          },
        ],
        totalAmount: 150.0,
        orderDate: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
        turnaroundTime: "Rush",
        templateData: {
          templateType: "Event Materials",
          title: "Concert Poster Design",
          description: "Promotional poster for music concert",
        },
      },
    ];
  };

  useEffect(() => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(today.toLocaleDateString("en-US", options));

    // Initialize mock orders
    const mockOrderData = createMockOrders();
    setMockOrders(mockOrderData);

    // Get the most recent order for this user
    if (user?.id) {
      const orders = orderManager.getOrdersByUser(user.id);
      setUserOrders(orders);

      // Use mock data for demonstration, or real order if available
      if (mockOrderData.length > 0) {
        setCurrentOrder(mockOrderData[0]); // Just use first order for reference if needed
      } else if (orders.length > 0) {
        const recentOrder = orders[orders.length - 1];
        setCurrentOrder(recentOrder);
      }
    } else {
      // For demo purposes, always show mock data
      if (mockOrderData.length > 0) {
        setCurrentOrder(mockOrderData[0]); // Just use first order for reference if needed
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

          {/* All Order Progress Components */}
          <div className="all-orders-container">
            <h3 className="all-orders-title">All Orders Progress</h3>
            <div className="orders-column">
              {mockOrders.map((order, index) => (
                <div key={order.id} className="order-progress-item">
                  <OrderProgress
                    orderData={order}
                    showTitle={false}
                    showOrderInfo={true}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
