import React from "react";
import "./OrderConfirmed.css";
import { useNavigate } from "react-router-dom";
import checkmark from "../pages/img/checkmark.png";

export const OrderConfirmed = () => {
  const navigate = useNavigate();

  const steps = [
    { number: "1", label: "Template" },
    { number: "2", label: "Specifications" },
    { number: "3", label: "Basket" },
    { number: "4", label: "Delivery" },
    { number: "5", label: "Payment" },
  ];

  return (
    <div className="oc-container">
      <div className="oc-wrapper">
        <div className="oc-background">
          <div className="oc-progress">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="oc-line"></div>}
                <div className="oc-step-circle">{step.number}</div>
              </React.Fragment>
            ))}
          </div>

          <div className="oc-step-labels">
            {steps.map((step, i) => (
              <div key={i} className="oc-step-label">
                {step.label}
              </div>
            ))}
          </div>

          <img src={checkmark} alt="Approval" className="oc-checkmark" />

          <div className="oc-confirmed-message">
            Your order has been confirmed!
          </div>

          <div className="oc-thank-you">
            Thank you for choosing <br />
            Trailblazer Printing and Layout Services
          </div>

          <button
            className="oc-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmed;
