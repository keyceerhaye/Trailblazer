import React, { useState } from "react";

const SalesPageContent = ({ OrdersTableComponent, ordersData }) => {
  console.log("Rendering SalesPageContent component"); // DEBUG LOG
  console.log("SalesPageContent Props:", {
    OrdersTableComponent,
    ordersData,
  }); // DEBUG LOG

  const [activeSalesTab, setActiveSalesTab] = useState("printing"); // Default to 'printing'

  // Calculate real sales figures from orders data
  const calculateSalesAmounts = () => {
    if (!ordersData || ordersData.length === 0) {
      return {
        printing: "₱0.00",
        layout: "₱0.00",
      };
    }

    let printingTotal = 0;
    let layoutTotal = 0;

    ordersData.forEach((order) => {
      // Extract numeric value from total (remove ₱ symbol)
      const orderAmount = parseFloat(order.total.replace("₱", ""));

      // For now, categorize all orders as printing
      // You can later add logic to distinguish between printing and layout orders
      // based on order.files or other properties
      printingTotal += orderAmount;
    });

    return {
      printing: `₱${printingTotal.toFixed(2)}`,
      layout: `₱${layoutTotal.toFixed(2)}`,
    };
  };

  const salesAmounts = calculateSalesAmounts();

  // Filter orders for the table based on the active tab if needed.
  // For this example, it shows all orders or could be filtered if orders have a category.
  const displayedOrders = ordersData
    ? ordersData.filter((order) => {
        // Add specific filtering logic if your 'ordersData' contains a 'category'
        // or some other field to distinguish between 'printing' and 'layout' orders.
        // For instance, if order.category === 'printing' or order.category === 'layout'
        // if (activeSalesTab === 'printing' && order.category === 'printing') return true;
        // if (activeSalesTab === 'layout' && order.category === 'layout') return true;
        // If no specific category, show all or a relevant subset for sales.
        // The original code showed all orders in the sales table.
        return true; // Shows all orders for now
      })
    : []; // Ensure displayedOrders is an array even if ordersData is null/undefined

  return (
    <div
      className="ad-sales-content-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* The h2 "Sales" title will be rendered by AdminDashboard's ad-title class */}
      <h2 className="ad-title">Sales</h2>

      <div className="ad-tabs-container">
        <div
          className={`ad-tab-item ${
            activeSalesTab === "printing" ? "active" : ""
          }`}
          onClick={() => setActiveSalesTab("printing")}
        >
          Printing
        </div>
        <div
          className={`ad-tab-item ${
            activeSalesTab === "layout" ? "active" : ""
          }`}
          onClick={() => setActiveSalesTab("layout")}
        >
          Layout
        </div>
      </div>

      {/* Sales figure card - full width */}
      <div className="ad-sales-figure-section">
        {activeSalesTab === "printing" && (
          <div className="ad-sales-figure-card">
            <div className="ad-sales-figure-card__amount">
              {salesAmounts.printing}
            </div>
            <div className="ad-sales-figure-card__label">Printing Sales</div>
          </div>
        )}
        {activeSalesTab === "layout" && (
          <div className="ad-sales-figure-card">
            <div className="ad-sales-figure-card__amount">
              {salesAmounts.layout}
            </div>
            <div className="ad-sales-figure-card__label">Layout Sales</div>
          </div>
        )}
      </div>

      <h2 className="ad-subtitle" style={{ marginTop: "var(--space-xl)" }}>
        {activeSalesTab === "printing" ? "Printing Orders" : "Layout Orders"}
      </h2>

      {/* Orders table - takes remaining space and allows scrolling */}
      <div className="ad-sales-orders-section">
        {OrdersTableComponent && Array.isArray(displayedOrders) && (
          <OrdersTableComponent orderData={displayedOrders} />
        )}
      </div>
    </div>
  );
};

export default SalesPageContent;
