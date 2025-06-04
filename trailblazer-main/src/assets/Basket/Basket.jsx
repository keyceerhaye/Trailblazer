import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Basket.css";
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

  // Handle both single file (legacy) and multiple files (new)
  const uploadedFiles =
    location.state?.files ||
    (location.state?.file ? [location.state.file] : null);
  const passedDetails = location.state?.specifications || null;
  const templateData = location.state?.templateData || null;

  const steps = [
    { number: "1", label: "Upload files", active: true },
    { number: "2", label: "Basket", active: true },
    { number: "3", label: "Delivery", active: false },
    { number: "4", label: "Payment", active: false },
  ];

  const [basketItems, setBasketItems] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const [orderDetails, setOrderDetails] = useState({
    paperSize: passedDetails?.paperSize || "A4",
    printOption: passedDetails?.printOption || "Black&White",
    turnaroundTime: passedDetails?.turnaroundTime || "Standard",
    paymentMethod: passedDetails?.paymentMethod || "Cash",
    emailAddress: passedDetails?.emailAddress || "",
    phoneNumber: passedDetails?.phoneNumber || "",
    price: "00.00",
    customization: "None", // Added customization level
  });

  // Price constants
  const PRICES = {
    PRINTING: {
      "Black&White": {
        Short: 2,
        A4: 3,
        Long: 3,
      },
      Colored: {
        Short: 10,
        A4: 12,
        Long: 12,
      },
    },
    CUSTOMIZATION: {
      None: 0,
      Basic: 100,
      High: 150,
    },
    RUSH_FEE: 7,
  };

  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      // Calculate total pages from all files
      let totalPageCount = 0;

      const fileItems = uploadedFiles.map((file) => {
        // Get page count from file or default to 1
        const pageCount = file.pageCount || 1;
        totalPageCount += pageCount;

        return {
          id:
            file.id ||
            `${file.name}-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
          name: file.name,
          status: "Uploaded Successfully",
          icon: getFileIcon(file),
          file: file,
          pageCount: pageCount,
        };
      });

      setBasketItems(fileItems);
      setTotalPages(totalPageCount);
      showFeedback(`${fileItems.length} file(s) added to basket`);

      // Calculate price after adding items
      if (passedDetails) {
        setOrderDetails((prevDetails) => {
          const updatedDetails = {
            ...prevDetails,
            ...passedDetails,
          };
          return {
            ...updatedDetails,
            price: calculatePrice(
              fileItems,
              updatedDetails,
              templateData?.templateType
            ),
          };
        });
      }
    }
  }, [uploadedFiles, passedDetails]);

  // Calculate price based on specifications and file page counts
  const calculatePrice = (items, details, templateType) => {
    if (!items || items.length === 0) {
      return "00.00";
    }

    let totalPrice = 0;

    if (templateType === "presentation" || templateType === "poster") {
      // For presentations and posters, use a fixed price
      totalPrice = 50;
    } else if (templateType === "resume") {
      // For resumes, use printing prices based on paper size and print option
      // Map "Full color" from upload page to "Colored" in basket if needed
      const printOption =
        details.printOption === "Full color" ? "Colored" : details.printOption;
      let basePrice = PRICES.PRINTING[printOption]?.[details.paperSize] || 0;

      // Calculate price based on each file's page count
      items.forEach((item) => {
        totalPrice += basePrice * (item.pageCount || 1);
      });
    } else {
      // Default calculation for other templates
      const printOption =
        details.printOption === "Full color" ? "Colored" : details.printOption;
      let basePrice = PRICES.PRINTING[printOption]?.[details.paperSize] || 0;

      // Calculate price based on each file's page count
      items.forEach((item) => {
        totalPrice += basePrice * (item.pageCount || 1);
      });

      // Add customization fee if applicable
      if (details.customization && details.customization !== "None") {
        totalPrice += PRICES.CUSTOMIZATION[details.customization];
      }
    }

    // Add rush fee if applicable
    if (details.turnaroundTime === "Rush") {
      totalPrice += PRICES.RUSH_FEE;
    }

    return totalPrice.toFixed(2);
  };

  useEffect(() => {
    // Recalculate price whenever order details or basket items change
    if (basketItems.length > 0) {
      setOrderDetails((prev) => ({
        ...prev,
        price: calculatePrice(basketItems, prev, templateData?.templateType),
      }));
    }
  }, [
    basketItems,
    orderDetails.paperSize,
    orderDetails.printOption,
    orderDetails.turnaroundTime,
    orderDetails.customization,
  ]);

  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setTimeout(() => {
      setFeedbackMessage("");
    }, 3000);
  };

  const handleDeleteItem = (itemId) => {
    setBasketItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId);

      // Recalculate total pages after removing an item
      const newTotalPages = newItems.reduce(
        (total, item) => total + (item.pageCount || 1),
        0
      );
      setTotalPages(newTotalPages);

      // If basket is now empty, reset order details
      if (newItems.length === 0) {
        setOrderDetails({
          paperSize: "A4",
          printOption: "Black&White",
          turnaroundTime: "Standard",
          paymentMethod: "Cash",
          customization: "None",
          price: "00.00",
        });
      }

      return newItems;
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
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      const fileItems = newFiles.map((file) => {
        return {
          id: `${file.name}-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          name: file.name,
          status: "Uploaded Successfully",
          icon: getFileIcon(file),
          file: file,
          pageCount: 1, // Default to 1 page for newly added files
        };
      });

      const updatedBasketItems = [...basketItems, ...fileItems];
      setBasketItems(updatedBasketItems);

      // Update total pages count
      const newTotalPages = updatedBasketItems.reduce(
        (total, item) => total + (item.pageCount || 1),
        0
      );
      setTotalPages(newTotalPages);

      showFeedback(`${fileItems.length} file(s) added to basket`);
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
        templateData,
      },
    });
  };

  // Function to render appropriate order details based on template type
  const renderOrderDetails = () => {
    if (templateData?.templateType === "resume") {
      return (
        <p>
          <strong>{orderDetails.paperSize}</strong>
          <br />
          {orderDetails.printOption}
          <br />
          {orderDetails.turnaroundTime || "Standard"}
          <br />
          {orderDetails.paymentMethod}
        </p>
      );
    } else if (
      templateData?.templateType === "presentation" ||
      templateData?.templateType === "poster"
    ) {
      return (
        <p>
          <strong>Email:</strong> {orderDetails.emailAddress}
          <br />
          <strong>Phone:</strong> {orderDetails.phoneNumber}
          <br />
          {orderDetails.turnaroundTime || "Standard"}
          <br />
          {orderDetails.paymentMethod}
        </p>
      );
    } else {
      return (
        <p>
          <strong>{orderDetails.paperSize}</strong>
          <br />
          {orderDetails.printOption}
          <br />
          {orderDetails.turnaroundTime || "Standard"}
          <br />
          {orderDetails.paymentMethod}
        </p>
      );
    }
  };

  // Handle back navigation to upload page
  const handleBack = () => {
    // Navigate back to upload page with current state
    navigate("/upload/print", {
      state: {
        files: basketItems.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.file?.type,
          size: item.file?.size,
          lastModified: item.file?.lastModified,
          pageCount: item.pageCount || 1,
        })),
        specifications: orderDetails,
        templateInfo: templateData
          ? {
              templateId: templateData.templateId,
              notes: templateData.notes,
              turnaroundTime: orderDetails.turnaroundTime,
            }
          : null,
        templateData,
      },
    });
  };

  return (
    <div className="bs-wrapper">
      {feedbackMessage && (
        <div className="bs-feedback-message">{feedbackMessage}</div>
      )}

      <div className="bs-back-button-container">
        <button className="bs-back-btn" onClick={handleBack}>
          Back
        </button>
      </div>

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
              {basketItems.map((item) => (
                <div className="bs-basket-item" key={item.id}>
                  <img
                    src={item.icon}
                    alt="File icon"
                    className="bs-file-icon"
                  />
                  <div className="bs-file-info">
                    <p className="bs-file-name">{item.name}</p>
                    <p className="bs-file-status">
                      {item.status}
                      {item.pageCount > 1 && ` • ${item.pageCount} pages`}
                    </p>
                  </div>
                  <img
                    src={uploadCheck}
                    alt="Done"
                    className="bs-status-icon"
                  />
                  <button
                    className="bs-delete-btn"
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label="Delete item"
                    title="Remove item"
                  >
                    <img src={uploadDelete} alt="Delete" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bs-summary-card bs-card">
              <div className="bs-summary-info">
                {renderOrderDetails()}
                {templateData && (
                  <div className="bs-template-info">
                    <p>
                      <strong>Template:</strong> {templateData.templateId}
                      {templateData.notes && (
                        <>
                          <br />
                          <span className="bs-template-notes">
                            Notes: {templateData.notes}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                )}
                <p className="bs-summary-price">
                  <span className="bs-payment-value">
                    ₱{orderDetails.price}
                  </span>
                </p>
                {totalPages > basketItems.length && (
                  <div className="bs-page-info">
                    <p>Total pages: {totalPages}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bs-empty-basket bs-card">
            <div className="bs-empty-content">
              <h3>Your basket is empty</h3>
              <p>Add files to get started with your order</p>
              <button
                className="bs-add-btn bs-empty-add-btn"
                onClick={handleAddFiles}
              >
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
              Add files
            </button>
          </div>

          <div className="bs-footer-right">
            <div className="bs-subtotal">
              <span>Sub-Total Amount: ₱{orderDetails.price}</span>
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
        multiple
      />
    </div>
  );
};

export default Basket;
