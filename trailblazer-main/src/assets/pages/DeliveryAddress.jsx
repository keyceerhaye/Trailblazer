import React from "react";
import "./DeliveryAddress.css";
import editIcon from './img/edit.png'; 
import { useNavigate } from "react-router-dom";

const accountDetails = [
  { label: "First Name", value: "Kryzl" },
  { label: "Last Name", value: "Castaneda" },
  { label: "Phone Number", value: "09900112233" },
  { label: "Payment Method", value: "Gcash" },
];

const deliveryAddress = [
  { label: "Building/Department", value: "CEA Building" },
  { label: "Room Number", value: "41-304" },
  { label: "Delivery Time", value: "1:00 PM" },
  { label: "Note:", value: "Deliver it faster", isBold: true },
];

const steps = [
  { number: "1", label: "Upload files", isActive: true },
  { number: "2", label: "Basket", isActive: true },
  { number: "3", label: "Delivery", isActive: true, isCurrent: true },
  { number: "4", label: "Payment", isActive: false },
];

const DeliveryAddress = () => {
  const navigate = useNavigate(); 

  const handleNext = () => {
    navigate("/payment"); 
  };
    return (
      <div className="da-wrapper">
       <div className="da-steps">
        <div className="da-step-circles">
            {steps.map((step, index) => (
            <React.Fragment key={step.number}>
                {index > 0 && (
                <div className={`da-step-line ${steps[index - 1].isActive ? 'active' : ''}`}></div>
                )}
                <div className={`da-step-circle ${step.isActive ? "active" : ""}`}>
                <span className="da-step-num">{step.number}</span>
                </div>
            </React.Fragment>
            ))}
        </div>
        <div className="da-step-labels">
            {steps.map((step) => (
            <div key={`label-${step.number}`} className="da-step-label">
                {step.label}
            </div>
            ))}
        </div>
        </div>

        <h2 className="da-heading">Enter Your Delivery Address</h2>

        <div className="da-cards">
          <div className="da-card">
            <div className="da-card-header">
              <h2>Account Details</h2>
              <img src={editIcon} alt="Edit" className="da-edit-icon"
              />
            </div>
            <div className="da-card-body">
              {accountDetails.map((item, idx) => (
                <div key={idx} className="da-row">
                  <span className="da-label">{item.label}</span>
                  <span className="da-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="da-card">
            <div className="da-card-header">
              <h2>Delivery Address</h2>
              <img src={editIcon} alt="Edit" className="da-edit-icon"
              />
            </div>
            <div className="da-card-body">
              {deliveryAddress.map((item, idx) => (
                <div key={idx} className="da-row">
                  <span className="da-label">{item.label}</span>
                  <span className={`da-value ${item.isBold ? "bold" : ""}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="da-buttons">
          <button className="da-btn-outline" onClick={() => navigate("/basket")}>Back</button>
          <button className="da-btn-filled" onClick={handleNext}>Next</button>
        </div>
      </div>
  );
};

export default DeliveryAddress;