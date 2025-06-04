import React, { useState, useEffect } from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";
import Profile from "../pages/profile.png";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [currentDate, setCurrentDate] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(today.toLocaleDateString("en-US", options));
  }, []);

  const handleOrderHistoryLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

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

  return (
    <div className="oh-container">
      <Sidebar onCollapseChange={handleSidebarCollapse} />
      <div className={`main-content-wrapper ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className={`page-header ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
          <div className="page-header-title">
            <h2>Order History</h2>
            <p className="date">{currentDate}</p>
          </div>
          <AppHeader
            user={user}
            profilePic={Profile}
            handleLogout={handleOrderHistoryLogout}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>

        <main className="oh-main">
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
    </div>
  );
}
