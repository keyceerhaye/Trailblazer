import React from "react";
import "./OrderConfirmed.css";
import { useNavigate } from "react-router-dom";
import checkmark from "../pages/img/checkmark.png";

export const OrderConfirmed = () => {
  const navigate = useNavigate();

  const steps = [
    { number: "1", label: "Upload files" },
    { number: "2", label: "Basket" },
    { number: "3", label: "Delivery" },
    { number: "4", label: "Payment" },
  ];

  return (
    <div className="oc-container">
      <div className="oc-wrapper">
        <div className="oc-background">
          <div className="oc-progress">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <img
                    className="oc-line"
                    alt="Line"
                    style={{ left: `${90 + (i - 1) * 160}px` }}
                    src="https://c.animaapp.com/mac90t5x4ytHYc/img/line-1.svg"
                  />
                )}
                <div
                  className="oc-step-circle"
                  style={{ left: `${30 + i * 160}px` }}
                >
                  {step.number}
                </div>
              </React.Fragment>
            ))}
            {steps.map((step, i) => (
              <div
                key={i}
                className="oc-step-label"
                style={{
                  left: ["0", "182px", "338px", "492px"][i],
                  width: ["131px", "76px", "83px", "93px"][i],
                }}
              >
                {step.label}
              </div>
            ))}
          </div>

          <div className="oc-confirmed-message">
            Your order has been confirmed!
          </div>

          <img src={checkmark} alt="Approval" className="oc-checkmark" />

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
