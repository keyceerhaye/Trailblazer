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
  const isLayoutService =
    location.state?.templateData?.templateType === "layout";

  // If payment method is Cash on Delivery, always apply delivery fee
  // Otherwise, apply delivery fee only if delivery method is "deliver"
  // For layout services, use a higher delivery fee (20 pesos)
  const deliveryFee =
    isCashOnDelivery || userDetails.deliveryMethod === "deliver"
      ? isLayoutService
        ? 20.0
        : 10.0
      : 0.0;

  // Calculate turnaround fee based on selected turnaround time
  const turnaroundFee = userDetails.turnaround === "Rush" ? 7.0 : 0.0;

  // Get the base file fee from order details
  const filesFee = parseFloat(orderDetails.price || 0);

  // Calculate total amount by adding all fees together
  const totalAmount = (deliveryFee + turnaroundFee + filesFee).toFixed(2);

  return (
    <div className="pay-wrapper">
      {showTermsModal && (
        <div className="pay-modal-overlay" onClick={closeTermsModal}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pay-modal-content">
              <h3 className="pay-terms-title">
                Terms & Conditions
                <button className="pay-terms-close" onClick={closeTermsModal}>
                  ×
                </button>
              </h3>

              <div className="pay-terms-container">
                <p className="pay-terms-intro">
                  Welcome to Trailblazers Printing and Layout Services! These
                  Terms and Conditions govern your use of our website and
                  services. By accessing or using our website, you agree to
                  comply with these terms.
                </p>

                <div className="pay-terms-section">
                  <span className="pay-terms-label">i. Definitions</span>
                  <p className="pay-terms-text">
                    "CPE" and "Our" refer to CPE 2D Students, the operator of
                    this website.
                    <br />
                    "You" and "Your" refer to the user of our website and
                    services.
                    <br />
                    "Services" refer to our printing and layout customization
                    offerings.
                  </p>
                </div>

                <div className="pay-terms-section">
                  <span className="pay-terms-label">ii. Use of Services</span>
                  <p className="pay-terms-text">
                    You must be a USTP-CDO student.
                    <br />
                    You agree to provide accurate and complete information when
                    placing an order.
                    <br />
                    Unauthorized use of our services or website may result in
                    termination of access.
                  </p>
                </div>

                <div className="pay-terms-section">
                  <span className="pay-terms-label">
                    iii. Orders and Payments
                  </span>
                  <p className="pay-terms-text">
                    All orders must be paid in full before processing.
                    <br />
                    Payment methods accepted include (list payment methods).
                    <br />
                    Prices are subject to change without prior notice.
                  </p>
                </div>

                <div className="pay-terms-section">
                  <span className="pay-terms-label">
                    iv. Customization and Approval
                  </span>
                  <p className="pay-terms-text">
                    Customers must review and approve all design proofs before
                    printing.
                    <br />
                    Once approved, we are not responsible for errors (spelling,
                    layout, color, etc.).
                  </p>
                </div>

                <div className="pay-terms-section">
                  <span className="pay-terms-label">
                    v. Pick-up and Delivery
                  </span>
                  <p className="pay-terms-text">
                    Estimated delivery times vary based on location and service
                    selection.
                    <br />
                    Estimated pick-up time is subject to the admin's
                    availability, and the final schedule will be determined and
                    confirmed by the admin.
                  </p>
                </div>

                <div className="pay-terms-section">
                  <span className="pay-terms-label">
                    vi. Refunds and Cancellations
                  </span>
                  <p className="pay-terms-text">
                    Orders can only be canceled before production starts.
                  </p>
                </div>
              </div>

              <div className="pay-terms-buttons">
                <button className="pay-terms-decline" onClick={declineTerms}>
                  Decline
                </button>
                <button className="pay-terms-accept" onClick={acceptTerms}>
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pay-steps">
        <div className="pay-step-circles">
          {[1, 2, 3, 4, 5].map((num, index) => (
            <React.Fragment key={num}>
              {index > 0 && <div className="pay-line active" />}
              <div className="pay-step-circle active">
                <span className="pay-step-num">{num}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="pay-step-labels">
          {["Template", "Specifications", "Basket", "Delivery", "Payment"].map(
            (label, i) => (
              <div key={i} className="pay-step-label">
                {label}
              </div>
            )
          )}
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
              <span>₱{deliveryFee.toFixed(2)}</span>
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
