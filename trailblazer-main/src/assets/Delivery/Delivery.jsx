import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Delivery.css";

const Delivery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("pickup");

  const steps = [
    { number: "1", label: "Upload files", active: true },
    { number: "2", label: "Basket", active: true },
    { number: "3", label: "Delivery", active: true },
    { number: "4", label: "Payment", active: false },
  ];

  const handleNext = () => {
    if (selectedOption === "deliver") {
      navigate("/deliveryaddress", {
        state: {
          ...location.state,
          deliveryMethod: selectedOption,
        },
      });
    } else {
      navigate("/payment", {
        state: {
          ...location.state,
          deliveryMethod: selectedOption,
        },
      });
    }
  };

  return (
    <div className="delivery-wrapper">
      <div className="delivery-steps">
        <div className="delivery-step-circles">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              {index > 0 && (
                <div
                  className={`delivery-line ${
                    steps[index - 1].active ? "active" : ""
                  }`}
                ></div>
              )}
              <div
                className={`delivery-step-circle ${
                  step.active ? "active" : ""
                }`}
              >
                <span className="delivery-step-num">{step.number}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="delivery-step-labels">
          {steps.map((step) => (
            <div key={`label-${step.number}`} className="delivery-step-label">
              {step.label}
            </div>
          ))}
        </div>
      </div>

      <h2 className="delivery-title">Delivery Method</h2>

      <div className="delivery-options">
        <div
          className={`delivery-option ${
            selectedOption === "pickup" ? "selected" : ""
          }`}
          onClick={() => setSelectedOption("pickup")}
        >
          <input
            type="radio"
            name="delivery"
            value="pickup"
            checked={selectedOption === "pickup"}
            onChange={() => setSelectedOption("pickup")}
          />
          <div className="delivery-info">
            <h4>Pick-up</h4>
            <p>
              CEA Building
              <br />
              Ground Floor
              <br />
              10:00 AM
            </p>
            <p>
              <em>
                Note: Get your print in <strong>7 minutes</strong>
              </em>
            </p>
          </div>
        </div>

        <div
          className={`delivery-option ${
            selectedOption === "deliver" ? "selected" : ""
          }`}
          onClick={() => setSelectedOption("deliver")}
        >
          <input
            type="radio"
            name="delivery"
            value="deliver"
            checked={selectedOption === "deliver"}
            onChange={() => setSelectedOption("deliver")}
          />
          <div className="delivery-info">
            <h4>Deliver</h4>
            <em>
              If you choose deliver please enter your delivery address in the
              next step.
              <br />
              Delivery Fee <strong>depends</strong> on what building.
              <br />
              <em>
                Note: Delivery area is <strong>inside</strong> the Campus only.
              </em>
            </em>
          </div>
        </div>
      </div>

      <div className="delivery-footer">
        <button className="delivery-next-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Delivery;
