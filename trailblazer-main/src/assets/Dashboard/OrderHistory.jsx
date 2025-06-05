import React, { useState, useEffect } from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "./OrderHistory.css";
import Profile from "../pages/profile.png";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [currentDate, setCurrentDate] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedCollapsedState = localStorage.getItem("sidebarCollapsed");
    return savedCollapsedState ? JSON.parse(savedCollapsedState) : false;
  });
  const [searchTerm, setSearchTerm] = useState("");

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
      date: "2023-03-01",
      payment: "Paid (Gcash)",
      status: "Completed",
      amount: "₱50.00",
    },
    {
      orderId: "#12346",
      fileName: "Alpha Report",
      type: "DOCX",
      date: "2023-04-15",
      payment: "Paid (Cash)",
      status: "Pending",
      amount: "₱30.00",
    },
    {
      orderId: "#12347",
      fileName: "Marketing Presentation",
      type: "PPT",
      date: "2023-02-22",
      payment: "Paid (Gcash)",
      status: "Completed",
      amount: "₱75.00",
    },
    {
      orderId: "#12348",
      fileName: "Financial Statement",
      type: "XLS",
      date: "2023-05-10",
      payment: "Paid (Credit Card)",
      status: "Pending",
      amount: "₱120.00",
    },
    {
      orderId: "#12349",
      fileName: "Project Proposal",
      type: "PDF",
      date: "2023-04-03",
      payment: "Paid (Gcash)",
      status: "Completed",
      amount: "₱65.00",
    },
    {
      orderId: "#12350",
      fileName: "Thesis Paper",
      type: "DOCX",
      date: "2023-05-18",
      payment: "Paid (Cash)",
      status: "Processing",
      amount: "₱95.00",
    },
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Format date as "dd-MM-yy"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2);
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="oh-container">
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
            <h2>Order History</h2>
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
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="oh-search-box"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="search-icon" size={20} color="#2f2785" />
            </div>
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
                {filteredOrders.map((order, i) => (
                  <tr key={i}>
                    <td>{order.orderId}</td>
                    <td>{order.fileName}</td>
                    <td>{order.type}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>{order.payment}</td>
                    <td className={`status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </td>
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
