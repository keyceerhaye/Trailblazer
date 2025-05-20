import React, { useState, useEffect } from "react";
import "./DeliveryAddress.css";
import editIcon from './img/edit.png';
import { useNavigate, useLocation } from "react-router-dom";

const steps = [
  { number: "1", label: "Upload files", isActive: true },
  { number: "2", label: "Basket", isActive: true },
  { number: "3", label: "Delivery", isActive: true, isCurrent: true },
  { number: "4", label: "Payment", isActive: false },
];

const DeliveryAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get payment method from passed state or default
  const paymentMethod = location.state?.orderDetails?.paymentMethod || "Not selected";

  const [accountDetails, setAccountDetails] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [deliveryDetails, setDeliveryDetails] = useState({
    building: "CEA Building",
    room: "41-304",
    deliveryTime: "1:00 PM",
    note: "",
  });

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setAccountDetails({
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        phoneNumber: storedUser.phoneNumber || "",
      });

      setDeliveryDetails((prev) => ({
        ...prev,
        building: storedUser.building || prev.building,
        room: storedUser.room || prev.room,
        deliveryTime: storedUser.deliveryTime || prev.deliveryTime,
        note: storedUser.note || "",
      }));
    }
  }, []);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Save updated user info in localStorage
    const updatedUser = {
      ...JSON.parse(localStorage.getItem("user")),
      ...accountDetails,
      ...deliveryDetails,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Navigate to payment passing current basket and updated order details
    navigate("/payment", {
      state: {
        basketItems: location.state?.basketItems || [],
        orderDetails: {
          ...location.state?.orderDetails,
          paymentMethod: paymentMethod,
          turnaroundTime: "Standard",
          price: location.state?.orderDetails?.price || "0.00",
        },
      },
    });
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
            <img
              src={editIcon}
              alt="Edit"
              className="da-edit-icon"
              onClick={() => setIsEditingAccount((prev) => !prev)}
            />
          </div>
          <div className="da-card-body">
            <div className="da-row">
              <span className="da-label">First Name</span>
              {isEditingAccount ? (
                <input
                  className="da-input"
                  type="text"
                  name="firstName"
                  value={accountDetails.firstName}
                  onChange={handleAccountChange}
                />
              ) : (
                <span className="da-value">{accountDetails.firstName}</span>
              )}
            </div>
            <div className="da-row">
              <span className="da-label">Last Name</span>
              {isEditingAccount ? (
                <input
                  className="da-input"
                  type="text"
                  name="lastName"
                  value={accountDetails.lastName}
                  onChange={handleAccountChange}
                />
              ) : (
                <span className="da-value">{accountDetails.lastName}</span>
              )}
            </div>
            <div className="da-row">
              <span className="da-label">Phone Number</span>
              {isEditingAccount ? (
                <input
                  className="da-input"
                  type="text"
                  name="phoneNumber"
                  value={accountDetails.phoneNumber}
                  onChange={handleAccountChange}
                />
              ) : (
                <span className="da-value">{accountDetails.phoneNumber}</span>
              )}
            </div>
            <div className="da-row">
              <span className="da-label">Payment Method</span>
              <span className="da-value">{paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="da-card">
          <div className="da-card-header">
            <h2>Delivery Address</h2>
            <img
              src={editIcon}
              alt="Edit"
              className="da-edit-icon"
              onClick={() => setIsEditingDelivery((prev) => !prev)}
            />
          </div>
          <div className="da-card-body">
            <div className="da-row">
              <span className="da-label">Building/Department</span>
              {isEditingDelivery ? (
                <input
                  className="da-input"
                  type="text"
                  name="building"
                  value={deliveryDetails.building}
                  onChange={handleDeliveryChange}
                />
              ) : (
                <span className="da-value">{deliveryDetails.building}</span>
              )}
            </div>
            <div className="da-row">
              <span className="da-label">Room/Office</span>
              {isEditingDelivery ? (
                <input
                  className="da-input"
                  type="text"
                  name="room"
                  value={deliveryDetails.room}
                  onChange={handleDeliveryChange}
                />
              ) : (
                <span className="da-value">{deliveryDetails.room}</span>
              )}
            </div>
            <div className="da-row">
              <span className="da-label">Delivery Time</span>
              {isEditingDelivery ? (
                <input
                  className="da-input"
                  type="time"
                  name="deliveryTime"
                  value={deliveryDetails.deliveryTime}
                  onChange={handleDeliveryChange}
                />
              ) : (
                <span className="da-value">{deliveryDetails.deliveryTime}</span>
              )}
            </div>
            <div className="da-row">
              <span className="da-label">Note</span>
              {isEditingDelivery ? (
                <input
                  className="da-input"
                  type="text"
                  name="note"
                  value={deliveryDetails.note}
                  onChange={handleDeliveryChange}
                />
              ) : (
                <span className="da-value">{deliveryDetails.note}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="da-btns">
        <button
          className="da-btn-outline"
          onClick={() => navigate("/basket", { state: location.state })}
        >
          Back
        </button>
        <button className="da-btn-primary" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DeliveryAddress;
