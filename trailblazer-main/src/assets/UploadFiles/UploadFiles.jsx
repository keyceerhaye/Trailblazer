import React, { useRef, useState } from "react";
import "./UploadFiles.css";
import uploadImage from "../pages/img/upload.png";
import uploadPeso from "../pages/img/peso.png";
import PDF from "../pages/img/PDF.png";
import DOC from "../pages/img/DOC.png";
import PPT from "../pages/img/PPT.png";
import PNG from "../pages/img/PNG.png";
import JPG from "../pages/img/JPG.png";
import { useNavigate } from "react-router-dom";

export const UploadFiles = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const steps = [
    { number: "1", label: "Upload files", active: true },
    { number: "2", label: "Basket", active: false },
    { number: "3", label: "Delivery", active: false },
    { number: "4", label: "Payment", active: false },
  ];

  const [specifications, setSpecifications] = useState({
    paperSize: "",
    printOption: "",
    turnaroundTime: "",
    paymentMethod: "",
  });

  const navigate = useNavigate();

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => fileInputRef.current.click();

  const simulateUpload = () => {
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleFileSelection = (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "image/png",
      "image/jpeg", // .jpg, .jpeg
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, DOC, DOCX, PPT, PPTX, PNG, and JPG files are allowed.");
      return;
    }

    setSelectedFile(file);
    simulateUpload();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleSpecChange = (label, value) => {
    setSpecifications((prevSpecs) => ({
      ...prevSpecs,
      [label]: value,
    }));
  };

  const handleConfirmClick = () => {
    if (!selectedFile) {
      alert("Please upload a file before proceeding.");
      return;
    }

    const allSpecsSelected = Object.values(specifications).every(
      (value) => value.trim() !== ""
    );
    if (!allSpecsSelected) {
      alert("Please complete all specification fields before proceeding.");
      return;
    }

    navigate("/basket", { state: { file: selectedFile, specifications } });
  };

  const specs = [
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

  return (
    <div className="uf-container">
      <main className="uf-main">
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
            className={`uf-upload-box ${selectedFile ? "transparent" : ""}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="uf-file-preview">
                <span
                  className="uf-close-preview"
                  onClick={() => setSelectedFile(null)}
                >
                  &times;
                </span>
                <h3 className="uf-preview-title">
                  Uploading Files
                </h3>

                <div className="uf-progress-bar-wrapper">
                  <div
                    className="uf-progress-bar"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  >
                    {selectedFile.name}
                  </div>
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
            />
          </div>

          <div className="uf-card">
            <div className="uf-card-content">
              <h2 className="uf-card-title">SPECIFICATION</h2>
              <div className="uf-specs">
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
                    <span className="uf-payment-value">00.00</span>
                  </div>
                </div>
                <div className="uf-confirm-btn-wrapper">
                  <button
                    className="uf-btn-primary"
                    onClick={handleConfirmClick}
                  >
                    Confirm
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
