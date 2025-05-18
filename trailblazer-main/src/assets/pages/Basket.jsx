import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Basket.css";
import uploadPeso from './img/peso.png'; 
import uploadDelete from './img/delete.png'; 
import uploadCheck from './img/check.png'; 
import PDF from './img/PDF.png'; 
import DOC from './img/DOC.png'; 
import PPT from './img/PPT.png'; 
import PNG from './img/PNG.png'; 
import JPG from './img/JPG.png'; 

const Basket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const uploadedFile = location.state?.file || null;
  const passedDetails = location.state?.specifications || null;

  console.log("Passed Details:", passedDetails);

  const steps = [
    { number: "1", label: "Upload files", active: true },
    { number: "2", label: "Basket", active: true },
    { number: "3", label: "Delivery", active: false },
    { number: "4", label: "Payment", active: false },
  ];

  const [basketItems, setBasketItems] = useState([]);

  const [orderDetails, setOrderDetails] = useState({
    paperType: passedDetails?.paperType || "Not selected",
    printType: passedDetails?.printType || "Not selected",
    quality: passedDetails?.quality || "Not selected",
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
    }

    if (passedDetails) {
      console.log("Updating orderDetails with passedDetails:", passedDetails);
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        ...passedDetails,
      }));
    }
  }, [uploadedFile, passedDetails]);

  const handleDeleteFile = () => {
    setBasketItems([]);
    setOrderDetails({
      paperSize: "Not selected",
      printOption: "Not selected",
      turnaroundTime: "Not selected",
      paymentMethod: "Not selected",
      price: "00.00",
    });
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

  return (
    <div className="bs-wrapper">
      <div className="bs-steps">
        <div className="bs-step-circles">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              {index > 0 && (
                <div className={`bs-line ${steps[index - 1].active ? 'active' : ''}`}></div>
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
        {basketItems.map((item, index) => (
          <div key={index} className="bs-card bs-basket-card">
            <div className="bs-basket-item">
              <img src={item.icon} alt="File icon" className="bs-file-icon" />
              <div className="bs-file-info">
                <p className="bs-file-name">{item.name}</p>
                <p className="bs-file-status">{item.status}</p>
              </div>
              <img src={uploadCheck} alt="Done" className="bs-status-icon" />
            </div>
          </div>
        ))}

        <div>
          <button className="bs-delete-btn" onClick={handleDeleteFile}>
            <img src={uploadDelete} alt="Delete" />
          </button>
        </div>

        <div className="bs-card bs-summary-card">
          <div className="bs-summary-info">
            <p><strong></strong> {orderDetails.paperSize} Bondpaper</p>
            <p><strong></strong> {orderDetails.printOption}</p>
            <p><strong></strong> {orderDetails.turnaroundTime}</p>
            <p><strong></strong> {orderDetails.paymentMethod}</p>
          </div>
          <div className="bs-summary-price">
            <img src={uploadPeso} alt="Currency" className="bs-peso-icon" />
            <span className="bs-payment-value">{orderDetails.price}</span>
          </div>
        </div>
      </div>

      <div className="bs-footer">
        <div className="bs-footer-left">
          <button className="bs-add-btn" onClick={handleAddFiles}>Add Files</button>
        </div>

        <div className="bs-footer-right">
          <div className="bs-subtotal">
            Sub-total Amount: 
            <span className="bs-payment-value">₱{orderDetails.price}</span>
          </div>

          <button className="bs-next-btn" onClick={handleNextClick}>Next</button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />
    </div>
  );
};

export default Basket;