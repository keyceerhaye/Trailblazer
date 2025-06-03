import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Basket.css";
import uploadPeso from "../pages/img/peso.png";
import uploadDelete from "../pages/img/delete.png";
import uploadCheck from "../pages/img/check.png";
import PDF from "../pages/img/PDF.png";
import DOC from "../pages/img/DOC.png";
import PPT from "../pages/img/PPT.png";
import PNG from "../pages/img/PNG.png";
import JPG from "../pages/img/JPG.png";

const Basket = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const uploadedFile = location.state?.file || null;
  const passedDetails = location.state?.specifications || null;

  const steps = [
    { number: "1", label: "Upload files", active: true },
    { number: "2", label: "Basket", active: true },
    { number: "3", label: "Delivery", active: false },
    { number: "4", label: "Payment", active: false },
  ];

  const [basketItems, setBasketItems] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [orderDetails, setOrderDetails] = useState({
    paperSize: passedDetails?.paperSize || "Not selected",
    printOption: passedDetails?.printOption || "Not selected",
    turnaroundTime: passedDetails?.turnaroundTime || "Not selected",
    paymentMethod: passedDetails?.paymentMethod || "Not selected",
    price: passedDetails?.price || "00.00",
  });

  useEffect(() => {
    if (uploadedFile) {
      const fileDetails = {
        name: uploadedFile.name,
        status: "Uploaded Successfully",
        icon: getFileIcon(uploadedFile),
      };
      setBasketItems([fileDetails]);
      showFeedback("File added to basket");
    }

    if (passedDetails) {
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        ...passedDetails,
      }));
    }
  }, [uploadedFile, passedDetails]);

  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setTimeout(() => {
      setFeedbackMessage("");
    }, 3000);
  };

  const handleDeleteItem = () => {
    setBasketItems([]);
    setOrderDetails({
      paperSize: "Not selected",
      printOption: "Not selected",
      turnaroundTime: "Not selected",
      paymentMethod: "Not selected",
      price: "00.00",
    });
    showFeedback("Item removed from basket");
  };

  const handleAddFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileDetails = {
        name: file.name,
        status: "Uploaded Successfully",
        icon: getFileIcon(file),
      };
      setBasketItems([fileDetails]);
      showFeedback("File added to basket");
    }
  };

  const getFileIcon = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return PDF;
      case "doc":
      case "docx":
        return DOC;
      case "ppt":
      case "pptx":
        return PPT;
      case "jpg":
      case "jpeg":
        return JPG;
      case "png":
        return PNG;
      default:
        return PDF;
    }
  };

  const handleNextClick = () => {
    navigate("/delivery", {
      state: {
        basketItems,
        orderDetails,
      },
    });
  };

  const calculateTotal = () => {
    if (orderDetails.price === "00.00" || orderDetails.price === "Not selected") {
      return "00.00";
    }
    return orderDetails.price;
  };

  return (
    <div className="bs-wrapper">
      {feedbackMessage && (
        <div className="bs-feedback-message">
          {feedbackMessage}
        </div>
      )}
      
      <div className="bs-steps">
        <div className="bs-step-circles">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              {index > 0 && (
                <div
                  className={`bs-line ${
                    steps[index - 1].active ? "active" : ""
                  }`}
                ></div>
              )}
              <div className={`bs-step-circle ${step.active ? "active" : ""}`}>
                <span className="bs-step-num">{step.number}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="bs-step-labels">
          {steps.map((step) => (
            <div key={`label-${step.number}`} className="bs-step-label">
              {step.label}
            </div>
          ))}
        </div>
      </div>

      <h2 className="bs-title">Your Basket ({basketItems.length})</h2>

      <div className="bs-main">
        {basketItems.length > 0 ? (
          <>
            <div className="bs-basket-card bs-card">
              <div className="bs-basket-item">
                <img src={basketItems[0].icon} alt="File icon" className="bs-file-icon" />
                <div className="bs-file-info">
                  <p className="bs-file-name">{basketItems[0].name}</p>
                  <p className="bs-file-status">{basketItems[0].status}</p>
                </div>
                <img src={uploadCheck} alt="Done" className="bs-status-icon" />
                <button 
                  className="bs-delete-btn" 
                  onClick={handleDeleteItem}
                  aria-label="Delete item"
                  title="Remove item"
                >
                  <img src={uploadDelete} alt="Delete" />
                </button>
              </div>
            </div>

            <div className="bs-summary-card bs-card">
              <h3 className="bs-summary-title">Order Summary</h3>
              <div className="bs-summary-info">
                <p>{orderDetails.paperSize} Bondpaper</p>
                <p>{orderDetails.printOption}</p>
                <p>{orderDetails.turnaroundTime}</p>
                <p>{orderDetails.paymentMethod}</p>
              </div>
              <div className="bs-summary-price">
                <img src={uploadPeso} alt="Currency" className="bs-peso-icon" />
                <span className="bs-payment-value">{orderDetails.price}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="bs-empty-basket bs-card">
            <div className="bs-empty-content">
              <div className="bs-empty-icon">🛒</div>
              <h3>Your basket is empty</h3>
              <p>Add files to get started with your order</p>
              <button className="bs-add-btn bs-empty-add-btn" onClick={handleAddFiles}>
                Add Files
              </button>
            </div>
          </div>
        )}
      </div>

      {basketItems.length > 0 && (
        <div className="bs-footer">
          <div className="bs-footer-left">
            <button className="bs-add-btn" onClick={handleAddFiles}>
              Add Files
            </button>
          </div>

          <div className="bs-footer-right">
            <div className="bs-subtotal">
              <span>Sub-total Amount:</span>
              <span className="bs-payment-value">₱{calculateTotal()}</span>
            </div>

            <button 
              className="bs-next-btn" 
              onClick={handleNextClick}
              disabled={basketItems.length === 0}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
      />
    </div>
  );
};

export default Basket;
