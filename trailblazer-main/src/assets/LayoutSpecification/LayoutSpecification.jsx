import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./LayoutSpecification.css";
import uploadPeso from "../pages/img/peso.png";
import PDF from "../pages/img/PDF.png";
import DOC from "../pages/img/DOC.png";
import PPT from "../pages/img/PPT.png";
import PNG from "../pages/img/PNG.png";
import JPG from "../pages/img/JPG.png";

const LayoutSpecification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Get template info from location state or URL params
  const templateInfo = location.state?.templateInfo || {
    templateId: params.templateId,
  };
  const previousSpecifications = location.state?.specifications || {};

  // Determine template type from templateInfo
  const determineTemplateType = () => {
    if (templateInfo?.templateType) {
      return templateInfo.templateType;
    }

    // Try to determine from templateId
    if (templateInfo?.templateId) {
      const templateId = templateInfo.templateId;
      if (templateId.includes("resume")) {
        return "resume";
      } else if (
        templateId.includes("presentation") ||
        templateId.includes("ppt")
      ) {
        return "presentation";
      } else if (templateId.includes("poster")) {
        return "poster";
      }
    }

    // Default
    return "other";
  };

  const templateType = determineTemplateType();

  const [specifications, setSpecifications] = useState({
    paperSize: previousSpecifications.paperSize || "A4",
    printOption: previousSpecifications.printOption || "Full color",
    turnaroundTime:
      templateInfo.turnaroundTime ||
      previousSpecifications.turnaroundTime ||
      "",
    paymentMethod: previousSpecifications.paymentMethod || "",
    notes: templateInfo.notes || previousSpecifications.notes || "",
  });

  const steps = [
    { number: "1", label: "Template", active: true },
    { number: "2", label: "Specifications", active: true },
    { number: "3", label: "Basket", active: false },
    { number: "4", label: "Delivery", active: false },
    { number: "5", label: "Payment", active: false },
  ];

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

  // Calculate price based on specifications
  const calculatePrice = () => {
    // Check required fields based on template type
    if (specifications.paperSize === "" || specifications.printOption === "") {
      return "00.00";
    }

    // Base printing price
    let basePrice = 0;

    if (templateType === "resume") {
      basePrice =
        PRICES.PRINTING[specifications.printOption]?.[
          specifications.paperSize
        ] || 0;
    } else if (templateType === "presentation" || templateType === "poster") {
      // For presentations and posters, use a fixed price
      basePrice = 50;
    } else {
      // For other template types
      basePrice =
        PRICES.PRINTING[specifications.printOption]?.[
          specifications.paperSize
        ] || 0;
    }

    // Calculate total price without turnaround fee
    let totalPrice = basePrice;

    // Return formatted price
    return totalPrice.toFixed(2);
  };

  const handleSpecChange = (label, value) => {
    setSpecifications((prevSpecs) => ({
      ...prevSpecs,
      [label]: value,
    }));
  };

  const handleBack = () => {
    // Navigate back to template detail page with current state
    navigate(`/template/${templateInfo.templateId}`, {
      state: {
        templateInfo: {
          ...templateInfo,
          templateId: templateInfo.templateId,
          notes: specifications.notes,
          turnaroundTime: specifications.turnaroundTime,
          templateType: templateType,
        },
      },
    });
  };

  const handleConfirmClick = () => {
    // Check required fields
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

    // Calculate the final price
    const finalPrice = calculatePrice();

    // Navigate to basket with all information
    navigate("/basket", {
      state: {
        specifications,
        basketItems: [], // No files in this flow, but we need the basket items structure
        orderDetails: {
          ...specifications,
          price: finalPrice,
        },
        templateData: {
          templateId: templateInfo.templateId,
          notes: specifications.notes,
          hasTemplate: true,
          templateType,
        },
        files: [], // No files are uploaded in this flow
      },
    });
  };

  // Standard specification fields for all template types
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
      label: "Payment method:",
      options: ["Cash on Delivery", "Gcash"],
      stateKey: "paymentMethod",
    },
  ];

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

        <h2 className="uf-title">Specifications</h2>
        <p className="uf-subtitle">Provide specifications for your template</p>

        <div className="uf-content" style={{ justifyContent: "center" }}>
          <div className="uf-card" style={{ maxWidth: "600px", width: "100%" }}>
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
                    <span className="uf-payment-value">{calculatePrice()}</span>
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

              <div className="uf-proceed-btn-wrapper">
                <button className="uf-btn-proceed" onClick={handleConfirmClick}>
                  PROCEED TO BASKET
                </button>
              </div>

              <div
                className="uf-file-icons"
                style={{ justifyContent: "center", marginTop: "20px" }}
              >
                <img src={PDF} alt="PDF" />
                <img src={DOC} alt="DOC" />
                <img src={PPT} alt="PPT" />
                <img src={JPG} alt="JPG" />
                <img src={PNG} alt="PNG" />
              </div>
              <p
                className="uf-payment-note"
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                Note: Additional fees for turnaround time and delivery will be
                calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LayoutSpecification;
