import React, { useRef, useState, useEffect } from "react";
import "./UploadFiles.css";
import uploadImage from "../pages/img/upload.png";
import uploadPeso from "../pages/img/peso.png";
import PDF from "../pages/img/PDF.png";
import DOC from "../pages/img/DOC.png";
import PPT from "../pages/img/PPT.png";
import PNG from "../pages/img/PNG.png";
import JPG from "../pages/img/JPG.png";
import { useNavigate, useLocation } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import BackButton from "../../components/BackButton/BackButton";
import {
  orderManager,
  getFileIcon,
  formatPrice,
} from "../../utils/dataManager";

export const UploadFiles = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for previous state when coming back from basket page
  const previousState = location.state || {};
  const previousFiles = previousState.files || [];
  const previousSpecifications = previousState.specifications || {};

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  // Simplified step configuration
  const steps = [
    { number: 1, label: "Upload", active: true },
    { number: 2, label: "Basket", active: false },
    { number: 3, label: "Delivery", active: false },
    { number: 4, label: "Payment", active: false },
  ];

  const [specifications, setSpecifications] = useState({
    paperSize: previousSpecifications.paperSize || "",
    printOption: previousSpecifications.printOption || "",
    turnaroundTime: previousSpecifications.turnaroundTime || "Standard",
    paymentMethod: previousSpecifications.paymentMethod || "",
    notes: previousSpecifications.notes || "",
    emailAddress: previousSpecifications.emailAddress || "",
    phoneNumber: previousSpecifications.phoneNumber || "",
  });

  // Function to get page count from a PDF file
  const getPdfPageCount = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      return pdfDoc.getPageCount();
    } catch (error) {
      console.error("Error counting PDF pages:", error);
      return 1; // Default to 1 page if there's an error
    }
  };

  // Handle back navigation to homepage
  const handleBack = () => {
    navigate("/");
  };

  // Initialize component state once on mount
  useEffect(() => {
    // Check if there's already a payment method in the current order
    const currentOrder = orderManager.getCurrentOrder();
    const existingPaymentMethod = currentOrder?.paymentMethod || "";

    // Restore specifications from previous state if available
    if (
      previousSpecifications &&
      Object.keys(previousSpecifications).length > 0
    ) {
      console.log(
        "UPLOAD: Restoring specifications from previous state:",
        previousSpecifications
      );

      setSpecifications((prev) => ({
        ...prev,
        ...previousSpecifications,
        // Use existing payment method from order if available
        paymentMethod:
          existingPaymentMethod || previousSpecifications.paymentMethod || "",
      }));
    } else if (existingPaymentMethod) {
      // If no previous specifications but there's an existing payment method, use it
      console.log(
        "UPLOAD: Using existing payment method from order:",
        existingPaymentMethod
      );
      setSpecifications((prev) => ({
        ...prev,
        paymentMethod: existingPaymentMethod,
      }));
    }

    // Restore files from previous state if available (but NOT when coming from basket to add files)
    const isFromBasket = previousState.fromBasket || false;
    if (
      previousFiles.length > 0 &&
      selectedFiles.length === 0 &&
      !isFromBasket
    ) {
      console.log(
        "UPLOAD: Restoring files from previous state:",
        previousFiles
      );

      // Convert file objects back to the format needed
      const restoredFiles = previousFiles.map((fileInfo) => {
        // Create a placeholder file object since we can't restore the actual File object
        const placeholderFile = {
          name: fileInfo.name,
          type: fileInfo.type,
          size: fileInfo.size,
          lastModified: fileInfo.lastModified,
        };

        return {
          file: placeholderFile,
          id: fileInfo.id,
          pageCount: fileInfo.pageCount || 1,
        };
      });

      setSelectedFiles(restoredFiles);

      // Set progress to 100% for all restored files
      const progressObj = {};
      restoredFiles.forEach((file) => {
        progressObj[file.id] = 100;
      });
      setUploadProgress(progressObj);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Price constants
  const PRICES = {
    PRINTING: {
      "Black&White": {
        Short: 2,
        A4: 3,
        Long: 3,
      },
      "Full color": {
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

  // Calculate price based on current order in data manager
  const calculatePrice = () => {
    const currentOrder = orderManager.getCurrentOrder();
    if (!currentOrder || currentOrder.files.length === 0) {
      return "00.00";
    }

    // If coming from basket, only show the price of newly uploaded files
    if (isFromBasket) {
      if (selectedFiles.length === 0) {
        console.log("UPLOAD: From basket, no new files - showing ₱0.00");
        return "00.00"; // No new files uploaded yet
      }
      const additionalCost = calculateCurrentUploadPrice().toFixed(2);
      console.log(
        `UPLOAD: From basket, showing additional cost: ₱${additionalCost}`
      );
      return additionalCost;
    }

    const totalCost = currentOrder.totalAmount.toFixed(2);
    console.log(`UPLOAD: Fresh upload, showing total cost: ₱${totalCost}`);
    return totalCost;
  };

  // Calculate price for only the currently uploaded files in this session
  const calculateCurrentUploadPrice = () => {
    if (selectedFiles.length === 0) return 0;

    let total = 0;
    selectedFiles.forEach((fileObj) => {
      const specs = fileObj.specifications;
      if (specs.paperSize && specs.printOption) {
        // Use the correct key from PRICES constant
        const printOption = specs.printOption; // Don't convert, use as is
        const basePrice = PRICES.PRINTING[printOption]?.[specs.paperSize] || 0;
        const filePrice = basePrice * (fileObj.pageCount || 1);

        // Add rush fee if applicable (flat fee, not per page)
        const rushFee = specs.turnaroundTime === "Rush" ? PRICES.RUSH_FEE : 0;

        total += filePrice + rushFee;

        console.log(
          `UPLOAD: File ${
            fileObj.file.name
          }: Base ₱${filePrice}, Rush ₱${rushFee}, Total ₱${
            filePrice + rushFee
          }`
        );
      }
    });

    console.log(`UPLOAD: Total current upload cost: ₱${total}`);
    return total;
  };

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(Array.from(e.dataTransfer.files));
    }
  };

  const handleBrowseClick = () => fileInputRef.current.click();

  const simulateUpload = (fileId) => {
    setUploadProgress((prev) => ({
      ...prev,
      [fileId]: 0,
    }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prev) => ({
        ...prev,
        [fileId]: progress,
      }));
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleFileSelection = async (files) => {
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);

    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "image/png",
      "image/jpeg", // .jpg, .jpeg
    ];

    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length < files.length) {
      alert(
        "Some files were not added. Only PDF, DOC, DOCX, PPT, PPTX, PNG, and JPG files are allowed."
      );
    }

    if (validFiles.length === 0) {
      setIsProcessingFiles(false);
      return;
    }

    // Process each file with individual specifications
    const processedFiles = [];

    for (const file of validFiles) {
      // Generate page count for PDFs
      let pageCount = 1;
      if (file.type === "application/pdf") {
        try {
          pageCount = await getPdfPageCount(file);
          console.log(`PDF ${file.name} has ${pageCount} pages`);
        } catch (error) {
          console.error("Error counting PDF pages:", error);
        }
      }

      // Create file specification with current form values as defaults
      const fileSpecification = {
        paperSize: specifications.paperSize,
        printOption: specifications.printOption,
        colorMode: specifications.printOption, // Map printOption to colorMode
        turnaroundTime: specifications.turnaroundTime,
        customization: "None",
        notes: specifications.notes,
        pageCount: pageCount,
      };

      // Add file to order using data manager
      const fileData = orderManager.addFileToOrder(file, fileSpecification);

      processedFiles.push({
        file,
        id: fileData.id,
        pageCount: pageCount,
        specifications: fileData.specifications,
      });

      // Start upload simulation
      simulateUpload(fileData.id);
    }

    setSelectedFiles((prev) => [...prev, ...processedFiles]);
    setIsProcessingFiles(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(Array.from(e.target.files));
    }
  };

  const handleSpecChange = (label, value) => {
    setSpecifications((prevSpecs) => ({
      ...prevSpecs,
      [label]: value,
    }));
  };

  // Handle individual file specification changes
  const handleFileSpecChange = (fileId, specType, value) => {
    // Update in data manager
    const updateObj = { [specType]: value };
    if (specType === "printOption") {
      updateObj.colorMode = value; // Map printOption to colorMode
    }

    orderManager.updateFileSpecifications(fileId, updateObj);

    // Update local state
    setSelectedFiles((prev) =>
      prev.map((fileObj) => {
        if (fileObj.id === fileId) {
          return {
            ...fileObj,
            specifications: {
              ...fileObj.specifications,
              ...updateObj,
            },
          };
        }
        return fileObj;
      })
    );
  };

  const removeFile = (fileId) => {
    // Remove from data manager
    orderManager.removeFileFromOrder(fileId);

    // Remove from local state
    setSelectedFiles((prev) => prev.filter((fileObj) => fileObj.id !== fileId));

    // Also remove from progress tracking
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const handleConfirmClick = () => {
    const currentOrder = orderManager.getCurrentOrder();

    if (!currentOrder || currentOrder.files.length === 0) {
      alert("Please upload at least one file before proceeding.");
      return;
    }

    // Validate that all files have required specifications
    const incompleteFiles = currentOrder.files.filter(
      (file) =>
        !file.specifications.paperSize || !file.specifications.printOption
    );

    if (incompleteFiles.length > 0) {
      alert(
        "Please complete specifications for all uploaded files before proceeding."
      );
      return;
    }

    // Validate payment method is selected when files are uploaded
    // Check both local specifications and current order for payment method
    const effectivePaymentMethod =
      specifications.paymentMethod || currentOrder?.paymentMethod || "";
    if (selectedFiles.length > 0 && !effectivePaymentMethod) {
      alert("Please select a payment method before proceeding.");
      return;
    }

    if (isProcessingFiles) {
      alert("Please wait until all files are processed.");
      return;
    }

    // Enhanced order details with comprehensive payment method integration
    const orderDetails = {
      paymentMethod: effectivePaymentMethod, // Use the effective payment method (from local state or existing order)
      turnaroundTime: specifications.turnaroundTime || "Standard",
      notes: specifications.notes || "",
      customerEmail: specifications.emailAddress || "",
      customerPhone: specifications.phoneNumber || "",
      // Additional payment-related data
      totalAmount: calculatePrice(),
      additionalCost: isFromBasket ? calculatePrice() : null,
      fromBasket: isFromBasket,
      fileCount: selectedFiles.length,
      uploadSession: {
        timestamp: new Date().toISOString(),
        sessionFiles: selectedFiles.map((f) => ({
          id: f.id,
          name: f.file.name,
          pageCount: f.pageCount,
          specifications: f.specifications,
        })),
      },
    };

    // Update order with enhanced specifications
    orderManager.updateOrderDetails(orderDetails);

    console.log("UPLOAD: Enhanced order details:", orderDetails);
    console.log("UPLOAD: Navigating to basket with order:", currentOrder);

    // Navigate to basket with enhanced state data
    navigate("/basket", {
      state: {
        currentOrder: orderManager.getCurrentOrder(),
        fromUpload: true,
        orderDetails: orderDetails,
        paymentMethod: effectivePaymentMethod, // Use the effective payment method
        uploadedFiles: selectedFiles,
        sessionCost: calculatePrice(),
      },
    });
  };

  // Get the appropriate file icon based on file extension
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

  // Get the appropriate specification fields
  const getSpecFields = () => {
    const fields = [
      {
        label: "Paper size:",
        options: ["A4", "Short", "Long"],
        stateKey: "paperSize",
      },
      {
        label: "Printing options:",
        options: ["Full color", "Black&White"],
        stateKey: "printOption",
      },
      {
        label: "Turnaround Time:",
        options: ["Standard", "Rush"],
        stateKey: "turnaroundTime",
      },
    ];

    // Only include payment method if not already chosen in a previous upload session
    const currentOrder = orderManager.getCurrentOrder();
    const isFromBasket = previousState.fromBasket || false;
    const hasExistingPaymentMethod =
      currentOrder?.paymentMethod && currentOrder?.files?.length > 0;

    // Show payment method selection if:
    // 1. Not coming from basket (first upload), OR
    // 2. Coming from basket but no payment method was set previously
    if (!isFromBasket || !hasExistingPaymentMethod) {
      fields.push({
        label: "Payment method:",
        options: ["Cash on Delivery", "Gcash"],
        stateKey: "paymentMethod",
      });
    }

    return fields;
  };

  // Get the current specification fields
  const specs = getSpecFields();

  // Calculate existing basket items info (used throughout component)
  const existingBasketItems = previousState.basketItems || [];
  const isFromBasket = previousState.fromBasket || false;
  const existingFileCount = isFromBasket
    ? existingBasketItems.filter((item) => !item.isTemplate).length
    : 0;
  const totalFileCount = selectedFiles.length + existingFileCount;

  return (
    <div className="uf-container">
      <main className="uf-main">
        <BackButton onClick={handleBack} />

        <div className="uf-steps">
          <div className="uf-step-circles">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                {index > 0 && (
                  <div
                    className={`uf-line ${
                      steps[index - 1].active ? "active" : ""
                    }`}
                  ></div>
                )}
                <div
                  className={`uf-step-circle ${step.active ? "active" : ""}`}
                >
                  <span className="uf-step-num">{step.number}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="uf-step-labels">
            {steps.map((step) => (
              <div key={`label-${step.number}`} className="uf-step-label">
                {step.label}
              </div>
            ))}
          </div>
        </div>

        <h2 className="uf-title">Upload Files</h2>
        <p className="uf-subtitle">Upload your files you want to print</p>

        <div className="uf-content">
          <div
            className={`uf-upload-box ${
              selectedFiles.length > 0 ? "has-files" : ""
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {selectedFiles.length > 0 ? (
              <div className="uf-file-preview">
                <h3 className="uf-preview-title">
                  Uploaded Files ({selectedFiles.length})
                </h3>

                <div className="uf-files-list">
                  {selectedFiles.map((fileObj) => (
                    <div key={fileObj.id} className="uf-file-item">
                      <span
                        className="uf-remove-file"
                        onClick={() => removeFile(fileObj.id)}
                      >
                        &times;
                      </span>
                      <div className="uf-file-details">
                        <div className="uf-progress-bar-wrapper">
                          <div
                            className="uf-progress-bar"
                            style={{
                              width: `${uploadProgress[fileObj.id] || 0}%`,
                            }}
                          >
                            {fileObj.file.name} ({fileObj.pageCount} pages)
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="uf-accepted-label">Accepted file types</p>
                <div className="uf-file-icons">
                  <img src={PDF} alt="PDF" />
                  <img src={DOC} alt="DOC" />
                  <img src={PPT} alt="PPT" />
                  <img src={JPG} alt="JPG" />
                  <img src={PNG} alt="PNG" />
                </div>
              </div>
            ) : (
              <>
                <img
                  src={uploadImage}
                  alt="upload"
                  className="uf-upload-icon"
                />
                <p className="uf-upload-text">
                  Drag and drop files here
                  <br />
                  or
                </p>
                <button className="uf-btn-browse" onClick={handleBrowseClick}>
                  BROWSE FILES
                </button>
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              multiple
            />
          </div>

          <div className="uf-card">
            <h2 className="uf-card-title">SPECIFICATION</h2>

            <div className="uf-specs">
              {/* Individual File Specifications - Always visible */}
              {selectedFiles.length > 0 ? (
                selectedFiles.map((fileObj, index) => (
                  <div
                    key={`file-${fileObj.id}`}
                    className="uf-file-spec-group"
                  >
                    {/* Paper Size for individual file */}
                    <div className="uf-spec-item">
                      <p className="uf-spec-label">Paper size:</p>
                      <select
                        className="uf-spec-trigger"
                        value={fileObj.specifications?.paperSize || ""}
                        onChange={(e) =>
                          handleFileSpecChange(
                            fileObj.id,
                            "paperSize",
                            e.target.value
                          )
                        }
                      >
                        <option value="" disabled hidden>
                          Select
                        </option>
                        <option value="Short">Short</option>
                        <option value="A4">A4</option>
                        <option value="Long">Long</option>
                      </select>
                      {fileObj.specifications?.paperSize && (
                        <div className="uf-selected-value"></div>
                      )}
                    </div>

                    {/* Print Option for individual file */}
                    <div className="uf-spec-item">
                      <p className="uf-spec-label">Printing options:</p>
                      <select
                        className="uf-spec-trigger"
                        value={fileObj.specifications?.printOption || ""}
                        onChange={(e) =>
                          handleFileSpecChange(
                            fileObj.id,
                            "printOption",
                            e.target.value
                          )
                        }
                      >
                        <option value="" disabled hidden>
                          Select
                        </option>
                        <option value="Black&White">Black&White</option>
                        <option value="Full color">Full color</option>
                      </select>
                      {fileObj.specifications?.printOption && (
                        <div className="uf-selected-value"></div>
                      )}
                    </div>

                    {/* Turnaround Time for individual file */}
                    <div className="uf-spec-item">
                      <p className="uf-spec-label">Turnaround Time:</p>
                      <select
                        className="uf-spec-trigger"
                        value={
                          fileObj.specifications?.turnaroundTime || "Standard"
                        }
                        onChange={(e) =>
                          handleFileSpecChange(
                            fileObj.id,
                            "turnaroundTime",
                            e.target.value
                          )
                        }
                      >
                        <option value="Standard">Standard</option>
                        <option value="Rush">Rush</option>
                      </select>
                      {fileObj.specifications?.turnaroundTime && (
                        <div className="uf-selected-value"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Show placeholder when no files are uploaded
                <div className="uf-file-spec-group">
                  {/* Global specifications when no files */}
                  {specs.map((spec, index) => (
                    <div key={index} className="uf-spec-item">
                      <p className="uf-spec-label">{spec.label}</p>
                      <select
                        className="uf-spec-trigger"
                        value={specifications[spec.stateKey]}
                        onChange={(e) =>
                          handleSpecChange(spec.stateKey, e.target.value)
                        }
                      >
                        <option value="" disabled hidden>
                          Select
                        </option>
                        {spec.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {specifications[spec.stateKey] && (
                        <div className="uf-selected-value"></div>
                      )}
                    </div>
                  ))}
                  {/* Show selected payment method as read-only when already chosen and no files uploaded */}
                  {isFromBasket &&
                    orderManager.getCurrentOrder()?.paymentMethod &&
                    orderManager.getCurrentOrder()?.files?.length > 0 && (
                      <div className="uf-spec-item">
                        <p className="uf-spec-label">Payment Method:</p>
                        <div
                          className="uf-spec-display"
                          style={{
                            padding: "0.7rem",
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #dee2e6",
                            borderRadius: "4px",
                            color: "#6c757d",
                            fontStyle: "italic",
                          }}
                        >
                          {orderManager.getCurrentOrder()?.paymentMethod}{" "}
                          (Already selected)
                        </div>
                      </div>
                    )}
                </div>
              )}
              {/* Payment Method - Only show when files are uploaded and no payment method is already chosen in previous upload */}
              {selectedFiles.length > 0 &&
                (!isFromBasket ||
                  !(
                    orderManager.getCurrentOrder()?.paymentMethod &&
                    orderManager.getCurrentOrder()?.files?.length > 0
                  )) && (
                  <div className="uf-file-spec-group">
                    <div className="uf-spec-item">
                      <p className="uf-spec-label">Payment Method:</p>
                      <select
                        className="uf-spec-trigger"
                        value={specifications.paymentMethod}
                        onChange={(e) =>
                          handleSpecChange("paymentMethod", e.target.value)
                        }
                      >
                        <option value="" disabled hidden>
                          Select Payment Method
                        </option>
                        <option value="GCash">GCash</option>
                        <option value="Cash">Cash</option>
                        <option value="Cash on Delivery">
                          Cash on Delivery
                        </option>
                      </select>
                      {specifications.paymentMethod && (
                        <div className="uf-selected-value"></div>
                      )}
                    </div>
                  </div>
                )}
              {/* Show selected payment method as read-only when already chosen in previous upload */}
              {selectedFiles.length > 0 &&
                isFromBasket &&
                orderManager.getCurrentOrder()?.paymentMethod &&
                orderManager.getCurrentOrder()?.files?.length > 0 && (
                  <div className="uf-file-spec-group">
                    <div className="uf-spec-item">
                      <p className="uf-spec-label">Payment Method:</p>
                      <div
                        className="uf-spec-display"
                        style={{
                          padding: "0.7rem",
                          backgroundColor: "#f8f9fa",
                          border: "1px solid #dee2e6",
                          borderRadius: "4px",
                          color: "#6c757d",
                          fontStyle: "italic",
                        }}
                      >
                        {orderManager.getCurrentOrder()?.paymentMethod} (Already
                        selected)
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div className="uf-payment-section">
              <div className="uf-payment-info">
                <p className="uf-payment-label">
                  {isFromBasket ? "ADDITIONAL COST:" : "PAYMENT:"}
                </p>
                <div className="uf-payment-amount">
                  <img
                    src={uploadPeso}
                    alt="Currency"
                    className="uf-payment-icon"
                  />
                  <span className="uf-payment-value">{calculatePrice()}</span>
                </div>
              </div>
              <div className="uf-confirm-btn-wrapper">
                <button
                  className="uf-btn-primary"
                  onClick={handleConfirmClick}
                  disabled={isProcessingFiles}
                  style={{
                    backgroundColor: "#1C7ED6",
                    color: "white",
                    borderRadius: "2rem",
                    padding: "0.7rem 2rem",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  {isProcessingFiles ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadFiles;
