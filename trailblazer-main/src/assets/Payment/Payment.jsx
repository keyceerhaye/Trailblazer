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
    JSON.parse(localStorage.getItem("user"))?.deliveryMethod ||
    "pickup";

  const [userDetails, setUserDetails] = useState({
    name: "",
    phoneNumber: "",
    building: "CEA Building",
    room: "41-304",
    deliveryTime: "1:00 PM",
    turnaround: orderDetails.turnaroundTime || "Standard",
    paymentMethod: orderDetails.paymentMethod || "Cash",
    deliveryAddress: "",
    deliveryMethod: initialDeliveryMethod,
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const name = `${storedUser.firstName || ""} ${
        storedUser.lastName || ""
      }`.trim();
      setUserDetails((prev) => ({
        ...prev,
        name: name || "Kryll Castaneda",
        phoneNumber: storedUser.phoneNumber || "09900112233",
        building: storedUser.building || "CEA Building",
        room: storedUser.room || "41-304",
        deliveryTime: storedUser.deliveryTime || "1:00 PM",
        deliveryAddress: storedUser.deliveryAddress || "",
        // Prefer location.state deliveryMethod if present, else localStorage user
        deliveryMethod:
          location.state?.deliveryMethod ||
          storedUser.deliveryMethod ||
          "pickup",
      }));
    }
  }, [location.state]);

  const handleProceed = () => {
    navigate("/confirmation");
  };

  const handleBack = () => {
    // Pass the current state back when navigating to delivery page
    navigate("/delivery", {
      state: {
        ...location.state,
        orderDetails: {
          ...orderDetails,
          paymentMethod: userDetails.paymentMethod,
        },
      },
    });
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const openTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  const acceptTerms = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
  };

  const declineTerms = () => {
    setTermsAccepted(false);
    setShowTermsModal(false);
  };

  // Apply delivery fee if delivery method is "deliver" OR payment method is "Cash on Delivery"
  const isCashOnDelivery = userDetails.paymentMethod === "Cash on Delivery";

  // If payment method is Cash on Delivery, always apply delivery fee
  // Otherwise, apply delivery fee only if delivery method is "deliver"
  const deliveryFee =
    isCashOnDelivery || userDetails.deliveryMethod === "deliver" ? 10.0 : 0.0;

  const turnaroundFee = 0.0;
  const filesFee = parseFloat(orderDetails.price || 0);
  const totalAmount = (deliveryFee + turnaroundFee + filesFee).toFixed(2);

  return (
    <div className="pay-wrapper">
      {showTermsModal && (
        <div className="pay-modal-overlay">
          <div className="pay-modal">
            <div className="pay-modal-header">
              <h3 style={{ textAlign: "left" }}>Terms & Conditions</h3>
              <button className="pay-modal-close" onClick={closeTermsModal}>
                ×
              </button>
            </div>
            <div className="pay-modal-content">
              <div className="pay-terms-section">
                <div className="pay-terms-number">1</div>
                <div className="pay-terms-text">
                  <p>
                    Welcome to Trailblazer Printing and Layout Services! These
                    Terms and Conditions govern your use of our website and
                    services. By accessing or using our website and services,
                    you agree to be bound by these Terms and Conditions.
                  </p>
                </div>
              </div>

              <div className="pay-terms-section">
                <div className="pay-terms-number">2</div>
                <div className="pay-terms-text">
                  <p>
                    <strong>Limitations</strong>
                  </p>
                  <ul>
                    <li>
                      You must be at least 18 years old to use our services.
                    </li>
                    <li>
                      You agree not to use our website for any illegal or
                      unauthorized purpose.
                    </li>
                    <li>
                      You agree not to violate any laws in your jurisdiction.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pay-terms-section">
                <div className="pay-terms-number">3</div>
                <div className="pay-terms-text">
                  <p>
                    <strong>Services and Pricing</strong>
                  </p>
                  <ul>
                    <li>
                      We reserve the right to modify our services and prices at
                      any time.
                    </li>
                    <li>
                      All prices are in Philippine Peso and include applicable
                      taxes.
                    </li>
                    <li>
                      Payment is required before printing services are provided.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pay-terms-section">
                <div className="pay-terms-number">4</div>
                <div className="pay-terms-text">
                  <p>
                    <strong>Intellectual Property</strong>
                  </p>
                  <ul>
                    <li>
                      You retain all rights to your content submitted for
                      printing.
                    </li>
                    <li>
                      You guarantee that you have the necessary rights to print
                      all submitted content.
                    </li>
                    <li>
                      We are not responsible for copyright violations in
                      user-submitted materials.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pay-terms-section">
                <div className="pay-terms-number">5</div>
                <div className="pay-terms-text">
                  <p>
                    <strong>Refunds and Cancellations</strong>
                  </p>
                  <ul>
                    <li>
                      Refunds are only available for orders canceled before
                      production starts.
                    </li>
                    <li>No refunds will be issued for completed print jobs.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pay-modal-footer">
              <button className="pay-btn-outline" onClick={declineTerms}>
                Decline
              </button>
              <button className="pay-btn-filled" onClick={acceptTerms}>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div key={i} className="pay-step-label">
              {label}
            </div>
          ))}
        </div>
      </div>

      <h2 className="pay-title">Payment Details</h2>

      <div className="pay-card">
        <div className="pay-doc-preview">
          <div className="pay-doc-box">
            {basketItems.length > 0 && (
              <div className="pay-doc-preview-content">
                {/* Document preview would go here */}
              </div>
            )}
          </div>
          <div className="pay-doc-info">
            {basketItems.length > 0 && (
              <>
                <div className="pay-doc-title">{basketItems[0].name}</div>
                <div className="pay-doc-detail">
                  {orderDetails.paperSize || "A4"} Bondpaper
                </div>
                <div className="pay-doc-detail">
                  {orderDetails.printOption || "Black&White"}
                </div>
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
                  {userDetails.deliveryAddress ||
                    `${userDetails.building}, Room ${userDetails.room}`}
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
                <span className="pay-label">Delivery Time</span>
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
            <div className="pay-row">
              <span>Delivery Fee</span>
              <span>
                {!isCashOnDelivery &&
                userDetails.deliveryMethod === "pickup" ? (
                  <span style={{ color: "#4CAF50" }}>FREE</span>
                ) : (
                  `₱${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="pay-row">
              <span>Turnaround Fee</span>
              <span>₱{turnaroundFee.toFixed(2)}</span>
            </div>
            <div className="pay-row">
              <span>File/s Fee</span>
              <span>₱{filesFee.toFixed(2)}</span>
            </div>
            <hr className="pay-separator" />
            <div className="pay-total">
              <span>Total Amount</span>
              <span>₱{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pay-terms">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={handleTermsChange}
        />
        <label htmlFor="terms">
          I agree to the{" "}
          <a href="#" className="pay-link" onClick={openTermsModal}>
            terms and conditions
          </a>
          .
        </label>
      </div>

      <div className="pay-actions">
        <button className="pay-btn-outline" onClick={handleBack}>
          Back
        </button>
        <button
          className="pay-btn-filled"
          onClick={handleProceed}
          disabled={!termsAccepted}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Payment;
