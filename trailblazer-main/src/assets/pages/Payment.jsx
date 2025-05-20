import React, { useEffect, useState } from "react";
import "./Payment.css";
import { useNavigate, useLocation } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const basketItems = location.state?.basketItems || [];
  const orderDetails = location.state?.orderDetails || {};

  // Use deliveryMethod from location.state if available, else fallback to localStorage user or default
  const initialDeliveryMethod =
    location.state?.deliveryMethod ||
    (JSON.parse(localStorage.getItem("user"))?.deliveryMethod) ||
    "pickup";

  const [userDetails, setUserDetails] = useState({
    name: "",
    phoneNumber: "",
    building: "CEA Building",
    room: "41-304",
    deliveryTime: "1:00 PM",
    turnaround: orderDetails.turnaroundTime || "Standard",
    paymentMethod: orderDetails.paymentMethod || "Not selected",
    deliveryAddress: "",
    deliveryMethod: initialDeliveryMethod,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const name = `${storedUser.firstName || ""} ${storedUser.lastName || ""}`.trim();
      setUserDetails((prev) => ({
        ...prev,
        name,
        phoneNumber: storedUser.phoneNumber || "",
        building: storedUser.building || "CEA Building",
        room: storedUser.room || "41-304",
        deliveryTime: storedUser.deliveryTime || "1:00 PM",
        deliveryAddress: storedUser.deliveryAddress || "",
        // Prefer location.state deliveryMethod if present, else localStorage user
        deliveryMethod: location.state?.deliveryMethod || storedUser.deliveryMethod || "pickup",
      }));
    }
  }, [location.state]);

  const handleProceed = () => {
    navigate("/confirmation");
  };

  const handleBack = () => {
    navigate("/delivery");
  };

  const paymentBreakdown = [
    { label: "Delivery Fee", value: "₱10.00" },
    { label: "Turnaround Fee", value: "₱0.00" },
    { label: "File/s Fee", value: `₱${orderDetails.price || "00.00"}` },
  ];

  return (
    <div className="pay-wrapper">
      <div className="pay-steps">
        <div className="pay-step-circles">
          {[1, 2, 3, 4].map((num, index) => (
            <React.Fragment key={num}>
              {index > 0 && <div className="pay-line active" />}
              <div className="pay-step-circle active">
                <span className="pay-step-num">{num}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="pay-step-labels">
          {["Upload files", "Basket", "Delivery", "Payment"].map((label, i) => (
            <div key={i} className="pay-step-label">{label}</div>
          ))}
        </div>
      </div>

      <h2 className="pay-title">Payment Details</h2>

      <div className="pay-card">
        <div className="pay-doc-preview">
          <div className="pay-doc-box"></div>
          <div className="pay-doc-info">
            {basketItems.length > 0 && (
              <>
                <div className="pay-doc-title">{basketItems[0].name}</div>
                <div className="pay-doc-detail">{orderDetails.paperSize || "A4"}</div>
                <div className="pay-doc-detail">{orderDetails.printOption || "Black&White"}</div>
              </>
            )}
          </div>
        </div>

        <div className="pay-info">
          <div className="pay-row">
            <span className="pay-label">Name</span>
            <span className="pay-value">{userDetails.name}</span>
          </div>
          <div className="pay-row">
            <span className="pay-label">Phone Number</span>
            <span className="pay-value">{userDetails.phoneNumber}</span>
          </div>

          {userDetails.deliveryMethod === "deliver" ? (
            <>
              <div className="pay-row">
                <span className="pay-label">Delivery Address</span>
                <span className="pay-value">
                  {userDetails.deliveryAddress || `${userDetails.building}, Room ${userDetails.room}`}
                </span>
              </div>
              <div className="pay-row">
                <span className="pay-label">Delivery Time</span>
                <span className="pay-value">{userDetails.deliveryTime}</span>
              </div>
            </>
          ) : (
            <>
              <div className="pay-row">
                <span className="pay-label">Building/Department</span>
                <span className="pay-value">{userDetails.building}</span>
              </div>
              <div className="pay-row">
                <span className="pay-label">Room Number</span>
                <span className="pay-value">{userDetails.room}</span>
              </div>
              <div className="pay-row">
                <span className="pay-label">Pickup Time</span>
                <span className="pay-value">{userDetails.deliveryTime}</span>
              </div>
            </>
          )}

          <div className="pay-row">
            <span className="pay-label">Turnaround Time</span>
            <span className="pay-value">{userDetails.turnaround}</span>
          </div>
          <div className="pay-row">
            <span className="pay-label">Payment Method</span>
            <span className="pay-value">{userDetails.paymentMethod}</span>
          </div>

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
              <span>
                ₱
                {(
                  10 + // delivery
                  0 + // turnaround
                  parseFloat(orderDetails.price || 0)
                ).toFixed(2)}
              </span>
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
        <button className="pay-btn-outline" onClick={handleBack}>Back</button>
        <button className="pay-btn-filled" onClick={handleProceed}>Proceed</button>
      </div>
    </div>
  );
};

export default Payment;
