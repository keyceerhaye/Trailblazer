import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Delivery.css";
import {
  getStepConfig,
  getStepsWithActiveStates,
} from "../../utils/stepsConfig";

const Delivery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("pickup");
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);

  // Dynamically determine step configuration based on service type
  const stepConfig = getStepConfig(location.state?.templateData, location);
  const steps = getStepsWithActiveStates(stepConfig, "delivery");

  // Check if the payment method is Cash on Delivery
  useEffect(() => {
    const orderDetails = location.state?.orderDetails || {};
    const paymentMethod = orderDetails.paymentMethod || "";

    // Check if the payment method is Cash on Delivery
    if (paymentMethod === "Cash on Delivery") {
      setIsCashOnDelivery(true);
      // Automatically set to deliver since Cash on Delivery requires delivery
      setSelectedOption("deliver");
    }
  }, [location.state]);

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

  // Handle back navigation to basket page
  const handleBack = () => {
    // Pass the current state back when navigating to basket page
    navigate("/basket", {
      state: {
        ...location.state,
        basketItems: location.state?.basketItems || [],
        specifications: location.state?.specifications || {},
        templateData: location.state?.templateData || null,
      },
    });
  };

  return (
    <div className="delivery-wrapper">
      <div className="delivery-back-button-container">
        <button className="delivery-back-btn" onClick={handleBack}>
          Back
        </button>
      </div>

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

      {isCashOnDelivery && (
        <div className="delivery-notice">
          <p>Cash on Delivery requires delivery to your location.</p>
        </div>
      )}

      <div className="delivery-options">
        <div
          className={`delivery-option ${
            selectedOption === "pickup" ? "selected" : ""
          } ${isCashOnDelivery ? "disabled" : ""}`}
          onClick={() => !isCashOnDelivery && setSelectedOption("pickup")}
        >
          <input
            type="radio"
            name="delivery"
            value="pickup"
            checked={selectedOption === "pickup"}
            onChange={() => !isCashOnDelivery && setSelectedOption("pickup")}
            id="pickup-radio"
            disabled={isCashOnDelivery}
          />
          <div className="delivery-info">
            <h4>Pick-up</h4>
            <div className="delivery-details">
              <p>
                CEA Building
                <br />
                Ground Floor
                <br />
                10:00 AM
              </p>
              <p className="delivery-note">
                <em>
                  Note: Get your print in <strong>7 minutes</strong>
                </em>
              </p>
            </div>
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
            id="deliver-radio"
          />
          <div className="delivery-info">
            <h4>Deliver</h4>
            <div className="delivery-details">
              <p>
                If you choose deliver please enter your delivery address in the
                next step.
              </p>
              <p>
                Delivery Fee <strong>depends</strong> on what building.
              </p>
              <p className="delivery-note">
                <em>
                  Note: Delivery area is <strong>inside</strong> the Campus
                  only.
                </em>
              </p>
            </div>
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
