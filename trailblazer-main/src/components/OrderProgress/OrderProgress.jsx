import React from "react";
import "./OrderProgress.css";
import { formatPrice } from "../../utils/dataManager";
import OrderReceived from "../../assets/pages/orderreceived.png";
import OrderProcessing from "../../assets/pages/2.png";
import Otw from "../../assets/pages/3.png";
import Delivered from "../../assets/pages/4.png";

const OrderProgress = ({
  orderData,
  showTitle = true,
  showOrderInfo = true,
}) => {
  if (!orderData) {
    return (
      <div className="op-container">
        {showTitle && <h3 className="op-title">Order Progress</h3>}
        <p className="op-no-order">No active orders</p>
      </div>
    );
  }

  // Handle cancelled orders
  if (orderData.status === "cancelled") {
    return (
      <div className="op-container">
        {showTitle && <h3 className="op-title">Order Progress</h3>}
        {showOrderInfo && (
          <div className="op-order-info">
            <div className="op-order-line">
              <div className="op-order-row">
                <span className="op-order-label">Order ID:</span>
                <span className="op-order-value">{orderData.id}</span>
              </div>
              <div className="op-order-row">
                <span className="op-order-label">Status:</span>
                <span className="op-order-value" style={{ color: "#e74c3c" }}>
                  CANCELLED
                </span>
              </div>
              <div className="op-order-row">
                <span className="op-order-label">Total Amount:</span>
                <span className="op-order-value-amount">
                  {formatPrice(orderData.totalAmount || 0)}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="op-cancelled-message">
          <p>❌ This order has been cancelled</p>
        </div>
      </div>
    );
  }

  // Define the progress steps
  const progressSteps = [
    {
      id: "received",
      label: "Order Received",
      icon: OrderReceived,
      statuses: ["received", "processing", "on_the_way", "ready", "delivered"],
    },
    {
      id: "processing",
      label: "Order Processing",
      icon: OrderProcessing,
      statuses: ["processing", "on_the_way", "ready", "delivered"],
    },
    {
      id: "on_the_way",
      label:
        orderData.deliveryMethod === "pickup"
          ? "Ready for Pickup"
          : "On the way",
      icon: Otw,
      statuses: ["on_the_way", "ready", "delivered"],
    },
    {
      id: "delivered",
      label:
        orderData.deliveryMethod === "pickup" ? "Picked Up!" : "Delivered!",
      icon: Delivered,
      statuses: ["delivered"],
    },
  ];

  // Check if a step is completed
  const isStepCompleted = (stepStatuses) => {
    return stepStatuses.includes(orderData.status);
  };

  // Determine order type display
  const getOrderTypeLabel = () => {
    if (orderData.orderType === "layout" || orderData.templateData) {
      return "Layout & Printing";
    }
    return "Printing";
  };

  return (
    <div className="op-container">
      {showTitle && <h3 className="op-title">Order Progress</h3>}

      {showOrderInfo && (
        <div className="op-order-info">
          <div className="op-order-line">
            <div className="op-order-row">
              <span className="op-order-label">Order ID:</span>
              <span className="op-order-value">{orderData.id}</span>
            </div>
            <div className="op-order-row">
              <span className="op-order-label">Type:</span>
              <span className="op-order-value">{getOrderTypeLabel()}</span>
            </div>
            <div className="op-order-row">
              <span className="op-order-label">Files:</span>
              <span className="op-order-value">
                {orderData.files?.length || 0} file(s)
              </span>
            </div>
            <div className="op-order-row">
              <span className="op-order-label">Total Amount:</span>
              <span className="op-order-value-amount">
                {formatPrice(orderData.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="op-progress-steps">
        {progressSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <div
                className={`op-line ${
                  isStepCompleted(progressSteps[index - 1].statuses)
                    ? "op-completed"
                    : ""
                }`}
              />
            )}
            <div
              className={`op-step ${
                isStepCompleted(step.statuses) ? "op-active" : ""
              }`}
            >
              <div
                className={`op-icon-circle ${
                  isStepCompleted(step.statuses) ? "op-completed" : "op-pending"
                }`}
              >
                <img src={step.icon} alt={step.label} className="op-step-img" />
              </div>
              <p className="op-step-label">{step.label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderProgress;
