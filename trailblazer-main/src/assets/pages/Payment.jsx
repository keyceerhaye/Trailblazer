import React from "react";
import "./Payment.css";
import { useNavigate } from "react-router-dom";

const customerInfo = [
  { label: "Name", value: "Kryzl Castaneda" },
  { label: "Phone Number", value: "09900112233" },
  { label: "Building/Department", value: "CEA Building" },
  { label: "Room Number", value: "41-304" },
  { label: "Delivery Time", value: "1:00 PM" },
  { label: "Turnaround Time", value: "Standard" },
  { label: "Payment Method", value: "Gcash" },
];

const paymentBreakdown = [
  { label: "Delivery Fee", value: "₱10.00" },
  { label: "Turnaround Fee", value: "₱0.00" },
  { label: "File/s Fee", value: "₱25.00" },
];

const documentDetails = [
  { label: "SDE Docs", type: "title" },
  { label: "A4", type: "detail" },
  { label: "Black&White", type: "detail" },
];

const steps = [
    { number: "1", label: "Upload files", active: true },
    { number: "2", label: "Basket", active: true },
    { number: "3", label: "Delivery", active: true },
    { number: "4", label: "Payment", active: true },
  ];


const Payment = () => {
    const navigate = useNavigate(); 
  
    const handleBack = () => {
      navigate("/delivery"); 
    };
  
    const handleProceed = () => {
      navigate("/confirmation"); 
    };
  return (
    <div className="pay-wrapper">
            <div className="pay-steps">
                    <div className="pay-step-circles">
                      {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                          {index > 0 && (
                            <div className={`pay-line ${steps[index - 1].active ? 'active' : ''}`}></div>
                          )}
                          <div className={`pay-step-circle ${step.active ? "active" : ""}`}>
                            <span className="pay-step-num">{step.number}</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="pay-step-labels">
                      {steps.map((step) => (
                        <div key={`label-${step.number}`} className="pay-step-label">
                          {step.label}
                        </div>
                      ))}
                    </div>
                  </div>

      <h2 className="pay-title">Payment Details</h2>

      <div className="pay-card">
        <div className="pay-doc-preview">
          <div className="pay-doc-box"></div>
          <div className="pay-doc-info">
            {documentDetails.map((detail, i) => (
              <div
                key={i}
                className={
                  detail.type === "title"
                    ? "pay-doc-title"
                    : "pay-doc-detail"
                }
              >
                {detail.label}
              </div>
            ))}
          </div>
        </div>
        <div className="pay-info">
          {customerInfo.map((item, i) => (
            <div className="pay-row" key={i}>
              <span className="pay-label">{item.label}</span>
              <span className="pay-value">{item.value}</span>
            </div>
          ))}

          <div className="pay-breakdown">
            {paymentBreakdown.map((item, i) => (
              <div className="pay-row" key={i}>
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
            <hr className="pay-separator" />
            <div className="pay-total">
              <span>Total Amount</span>
              <span>₱35.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pay-terms">
        <input type="checkbox" id="terms" />
        <label htmlFor="terms">
          I agree to the <span className="pay-link">terms and conditions</span>.
        </label>
      </div>

      <div className="pay-actions">
        <button className="pay-btn-outline">Back</button>
        <button className="pay-btn-filled" onClick={handleProceed}>Proceed</button>
      </div>
    </div>
  );
};

export default Payment;