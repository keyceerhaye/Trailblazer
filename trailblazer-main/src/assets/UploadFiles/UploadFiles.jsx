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

export const UploadFiles = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get template info from location state
  const templateInfo = location.state?.templateInfo;

  // Check for previous state when coming back from basket page
  const previousState = location.state || {};
  const previousFiles = previousState.files || [];
  const previousSpecifications = previousState.specifications || {};

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  const steps = [
    { number: "1", label: "Upload files", active: true },
    { number: "2", label: "Basket", active: false },
    { number: "3", label: "Delivery", active: false },
    { number: "4", label: "Payment", active: false },
  ];

  const [specifications, setSpecifications] = useState({
    paperSize: previousSpecifications.paperSize || "A4",
    printOption: previousSpecifications.printOption || "Full color",
    turnaroundTime:
      templateInfo?.turnaroundTime ||
      previousSpecifications.turnaroundTime ||
      "",
    paymentMethod: previousSpecifications.paymentMethod || "",
    notes: templateInfo?.notes || previousSpecifications.notes || "",
    emailAddress: previousSpecifications.emailAddress || "",
    phoneNumber: previousSpecifications.phoneNumber || "",
  });

  const [hasTemplate, setHasTemplate] = useState(false);
  const [templateType, setTemplateType] = useState(
    previousState.templateData?.templateType || ""
  ); // To track the template type

  // Handle back navigation to template page
  const handleBack = () => {
    if (templateInfo) {
      navigate(`/template/${templateInfo.templateId}`, {
        state: {
          templateInfo: {
            ...templateInfo,
            notes: specifications.notes,
            turnaroundTime: specifications.turnaroundTime,
          },
        },
      });
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    // Check if coming from template selection
    if (templateInfo) {
      setHasTemplate(true);
      setSpecifications((prev) => ({
        ...prev,
        turnaroundTime: templateInfo.turnaroundTime,
        notes: templateInfo.notes,
      }));

      // Determine template type based on templateId
      const templateId = templateInfo.templateId || "";
      if (templateId.includes("resume")) {
        setTemplateType("resume");
      } else if (templateId.includes("presentation")) {
        setTemplateType("presentation");
      } else {
        setTemplateType("other");
      }
    }

    // Restore files from previous state if available
    if (previousFiles.length > 0) {
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
  }, [templateInfo, previousFiles]);

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

  // Calculate price based on specifications and number of files
  const calculatePrice = () => {
    if (
      selectedFiles.length === 0 ||
      (templateType === "resume" &&
        (specifications.paperSize === "" ||
          specifications.printOption === "")) ||
      (templateType === "presentation" && specifications.paymentMethod === "")
    ) {
      return "00.00";
    }

    // Base printing price per file
    let basePrice = 0;

    if (templateType === "resume") {
      basePrice =
        PRICES.PRINTING[specifications.printOption]?.[
          specifications.paperSize
        ] || 0;
    } else if (templateType === "presentation") {
      // For presentations, use a fixed price
      basePrice = 50; // Example fixed price for presentations
    } else {
      // For other template types
      basePrice =
        PRICES.PRINTING[specifications.printOption]?.[
          specifications.paperSize
        ] || 0;
    }

    // Multiply by number of files
    let totalPrice = basePrice * selectedFiles.length;

    // Add rush fee if applicable
    if (specifications.turnaroundTime === "Rush") {
      totalPrice += PRICES.RUSH_FEE;
    }

    return totalPrice.toFixed(2);
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

    // Add unique IDs to each file for tracking progress
    const filesWithIds = validFiles.map((file) => {
      const fileId = `${file.name}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      return { file, id: fileId };
    });

    setSelectedFiles((prev) => [...prev, ...filesWithIds]);

    // Start upload simulation for each file
    filesWithIds.forEach((fileObj) => {
      simulateUpload(fileObj.id);
    });

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

  const removeFile = (fileId) => {
    setSelectedFiles((prev) => prev.filter((fileObj) => fileObj.id !== fileId));

    // Also remove from progress tracking
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };

  const handleConfirmClick = () => {
    if (selectedFiles.length === 0) {
      alert("Please upload at least one file before proceeding.");
      return;
    }

    // Check required fields based on template type
    if (templateType === "resume") {
      if (
        !specifications.paperSize ||
        !specifications.printOption ||
        !specifications.paymentMethod
      ) {
        alert(
          "Please complete all required specification fields before proceeding."
        );
        return;
      }
    } else if (templateType === "presentation") {
      if (
        !specifications.emailAddress ||
        !specifications.phoneNumber ||
        !specifications.paymentMethod
      ) {
        alert(
          "Please provide email, phone number, and payment method before proceeding."
        );
        return;
      }
    } else {
      // Default check for other template types
      const allSpecsSelected = Object.values(specifications).every(
        (value, index, array) => {
          // Skip notes field and other optional fields when checking
          const key = Object.keys(specifications)[index];
          if (
            key === "notes" ||
            key === "emailAddress" ||
            key === "phoneNumber"
          )
            return true;
          return value.trim() !== "";
        }
      );

      if (!allSpecsSelected) {
        alert(
          "Please complete all required specification fields before proceeding."
        );
        return;
      }
    }

    if (isProcessingFiles) {
      alert("Please wait until all files are processed.");
      return;
    }

    // Extract files for passing to the next page
    const files = selectedFiles.map((fileObj) => ({
      id: fileObj.id,
      name: fileObj.file.name,
      type: fileObj.file.type,
      size: fileObj.file.size,
      lastModified: fileObj.file.lastModified,
      pageCount: 1, // Default to 1 page per file
    }));

    // Include template information if it exists
    const templateData = templateInfo
      ? {
          templateId: templateInfo.templateId,
          notes: specifications.notes,
          hasTemplate: true,
          templateType: templateType,
        }
      : null;

    navigate("/basket", {
      state: {
        files,
        specifications,
        templateData,
      },
    });
  };

  // Get the appropriate specification fields based on template type
  const getSpecFields = () => {
    if (templateType === "resume") {
      return [
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
          label: "Payment method:",
          options: ["Cash on Delivery", "Gcash"],
          stateKey: "paymentMethod",
        },
      ];
    } else if (templateType === "presentation") {
      return [
        {
          label: "Email address:",
          type: "text",
          stateKey: "emailAddress",
          placeholder: "Enter your email address",
        },
        {
          label: "Phone number:",
          type: "text",
          stateKey: "phoneNumber",
          placeholder: "Enter your phone number",
        },
        {
          label: "Payment method:",
          options: ["Cash on Delivery", "Gcash"],
          stateKey: "paymentMethod",
        },
      ];
    } else {
      // Default fields for other template types
      return [
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
        {
          label: "Payment method:",
          options: ["Cash on Delivery", "Gcash"],
          stateKey: "paymentMethod",
        },
      ];
    }
  };

  // Get the current specification fields based on template type
  const specs = getSpecFields();

  return (
    <div className="uf-container">
      <main className="uf-main">
        <div className="uf-back-button-container">
          <button className="uf-back-btn" onClick={handleBack}>
            Back
          </button>
        </div>

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
                            {fileObj.file.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="uf-btn-add-more" onClick={handleBrowseClick}>
                  + Add More Files
                </button>

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
            <div className="uf-card-content">
              <h2 className="uf-card-title">SPECIFICATION</h2>

              {hasTemplate && (
                <div className="uf-template-info">
                  <h3>Selected Template</h3>
                  <p>Template ID: {templateInfo.templateId}</p>
                  {specifications.notes && (
                    <div className="uf-template-notes">
                      <h4>Notes:</h4>
                      <p>{specifications.notes}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="uf-specs">
                {specs.map((spec, index) => (
                  <div key={index} className="uf-spec-item">
                    <p className="uf-spec-label">{spec.label}</p>
                    {spec.type === "text" ? (
                      <input
                        type="text"
                        className="uf-spec-input"
                        placeholder={spec.placeholder}
                        value={specifications[spec.stateKey] || ""}
                        onChange={(e) =>
                          handleSpecChange(spec.stateKey, e.target.value)
                        }
                      />
                    ) : (
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
                    )}
                    {specifications[spec.stateKey] && (
                      <div className="uf-selected-value"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="uf-payment-section">
                <div className="uf-payment-info">
                  <p className="uf-payment-label">PAYMENT:</p>
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
                  >
                    {isProcessingFiles ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadFiles;
