import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./LayoutSpecification.css";
import {
  getStepConfig,
  getStepsWithActiveStates,
} from "../../utils/stepsConfig";
import uploadPeso from "../pages/img/peso.png";
import PDF from "../pages/img/PDF.png";
import DOC from "../pages/img/DOC.png";
import PPT from "../pages/img/PPT.png";
import PNG from "../pages/img/PNG.png";
import JPG from "../pages/img/JPG.png";
import BackButton from "../../components/BackButton/BackButton";

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
      } else if (templateId.includes("layout")) {
        return "layout";
      }
    }

    // Default
    return "other";
  };

  const templateType = determineTemplateType();

  // Debug log
  console.log("Layout Specification - Template Type:", templateType);

  const [specifications, setSpecifications] = useState({
    paperSize: previousSpecifications.paperSize || "",
    printOption: previousSpecifications.printOption || "",
    turnaroundTime:
      templateInfo.turnaroundTime ||
      previousSpecifications.turnaroundTime ||
      "Standard",
    paymentMethod: previousSpecifications.paymentMethod || "",
    notes: templateInfo.notes || previousSpecifications.notes || "",
    emailAddress: previousSpecifications.emailAddress || "",
    phoneNumber: previousSpecifications.phoneNumber || "",
    customization: previousSpecifications.customization || "None",
  });

  // Dynamically determine step configuration based on service type
  const stepConfig = getStepConfig(templateInfo, location);
  const steps = getStepsWithActiveStates(stepConfig, "specifications");

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
    LAYOUT_BASE_PRICE: 50,
  };

  // Calculate price based on specifications
  const calculatePrice = () => {
    // For layout service, we have a fixed base price
    if (templateType === "layout") {
      let totalPrice = PRICES.LAYOUT_BASE_PRICE;

      // Debug log
      console.log(
        "Layout Service Price Calculation - Base Price:",
        PRICES.LAYOUT_BASE_PRICE
      );

      // Add customization fee if applicable
      if (
        specifications.customization &&
        specifications.customization !== "None"
      ) {
        totalPrice += PRICES.CUSTOMIZATION[specifications.customization];
        // Debug log
        console.log(
          "Layout Service Price Calculation - With Customization:",
          totalPrice
        );
      }

      // Add rush fee if applicable
      if (specifications.turnaroundTime === "Rush") {
        totalPrice += PRICES.RUSH_FEE;
        // Debug log
        console.log(
          "Layout Service Price Calculation - With Rush Fee:",
          totalPrice
        );
      }

      // Debug log
      console.log(
        "Layout Service Price Calculation - Final Price:",
        totalPrice.toFixed(2)
      );
      return totalPrice.toFixed(2);
    }

    // For other template types, check required fields
    if (specifications.paperSize === "" || specifications.printOption === "") {
      return "00.00";
    }

    // Normalize print option to match PRICES structure used in Basket component
    const normalizedPrintOption =
      specifications.printOption === "Full color"
        ? "Full color"
        : specifications.printOption;

    // Base printing price
    let basePrice = 0;

    if (templateType === "resume") {
      basePrice =
        PRICES.PRINTING[normalizedPrintOption]?.[specifications.paperSize] || 0;
    } else if (templateType === "presentation" || templateType === "poster") {
      // For presentations and posters, use a fixed price
      basePrice = 50;
    } else {
      // For other template types
      basePrice =
        PRICES.PRINTING[normalizedPrintOption]?.[specifications.paperSize] || 0;
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
    // Check required fields based on template type
    if (templateType === "layout") {
      if (!specifications.turnaroundTime || !specifications.paymentMethod) {
        alert(
          "Please complete all required specification fields before proceeding."
        );
        return;
      }
    } else {
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
    }

    // Calculate the final price
    const finalPrice = calculatePrice();

    // Debug log
    console.log("Final Price before creating orderDetails:", finalPrice);

    // Create orderDetails with the same structure expected by Basket and Delivery
    const orderDetails = {
      ...specifications,
      price: finalPrice,
    };

    // Debug log
    console.log("Order Details:", orderDetails);

    // Prepare template data with all necessary information
    const templateData = {
      templateId: templateInfo.templateId,
      notes: specifications.notes,
      hasTemplate: true,
      templateType,
      title: templateInfo.title || `Template ${templateInfo.templateId}`,
      description: templateInfo.description || "",
      imageSrc: templateInfo.imageSrc || `/images/${templateInfo.templateId}`,
      turnaroundTime: templateInfo.turnaroundTime || "Standard",
    };

    // Debug log
    console.log("Template Data being passed to Basket:", templateData);

    // Create a virtual file item to represent the template in the basket
    const templateItem = {
      id: `template-${templateInfo.templateId}-${Date.now()}`,
      name: templateData.title,
      type: "template",
      size: 0,
      lastModified: Date.now(),
      pageCount: 1,
      status: "Template Selected",
      templateId: templateInfo.templateId,
      templateType: templateType,
    };

    // Debug log
    console.log("Template Item being passed to Basket:", templateItem);

    // Navigate to basket with all information
    navigate("/basket", {
      state: {
        specifications, // Original specifications
        orderDetails, // Standardized format for downstream components
        basketItems: [
          {
            id: templateItem.id,
            name: templateItem.name,
            file: {
              type: templateItem.type,
              size: templateItem.size,
              lastModified: templateItem.lastModified,
            },
            pageCount: templateItem.pageCount,
            status: templateItem.status,
            icon: getTemplateIcon(),
            isTemplate: true,
            templateId: templateItem.templateId,
            templateType: templateItem.templateType,
          },
        ],
        templateData,
        files: [templateItem], // Include template as a file for the basket
      },
    });
  };

  // Helper function to get template icon based on template type
  const getTemplateIcon = () => {
    switch (templateType) {
      case "resume":
        return DOC;
      case "presentation":
        return PPT;
      case "poster":
        return PNG;
      default:
        return PDF;
    }
  };

  // Helper function to get file icon (needed for compatibility with basket)
  const getFileIcon = (file) => {
    const extension = file.name?.split(".").pop().toLowerCase() || "";
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

  // Get the appropriate specification fields based on template type
  const getSpecFields = () => {
    if (templateType === "layout") {
      return [
        {
          label: "Turnaround time:",
          options: ["Standard", "Rush"],
          stateKey: "turnaroundTime",
        },
        {
          label: "Payment method:",
          options: ["Cash on Delivery", "Gcash"],
          stateKey: "paymentMethod",
        },
        {
          label: "Customization level:",
          options: ["None", "Basic", "High"],
          stateKey: "customization",
        },
      ];
    } else if (templateType === "resume") {
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
    } else if (templateType === "presentation" || templateType === "poster") {
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

        <div className="uf-content" style={{ justifyContent: "center" }}>
          <div className="uf-card" style={{ maxWidth: "600px", width: "100%" }}>
            <div className="uf-card-content" style={{ padding: "2rem" }}>
              <h2
                className="uf-card-title"
                style={{
                  color: "#372B7E",
                  textAlign: "center",
                  marginBottom: "2rem",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                SPECIFICATION
              </h2>

              <div className="uf-specs" style={{ marginBottom: "2rem" }}>
                {specs.map((spec, index) => (
                  <div
                    key={index}
                    className="uf-spec-item"
                    style={{ marginBottom: "1.2rem" }}
                  >
                    <p
                      className="uf-spec-label"
                      style={{
                        color: "#372B7E",
                        fontWeight: "500",
                        marginBottom: "0.5rem",
                        textAlign: "center",
                      }}
                    >
                      {spec.label}
                    </p>
                    {spec.type === "text" ? (
                      <input
                        type="text"
                        className="uf-spec-input"
                        placeholder={spec.placeholder}
                        value={specifications[spec.stateKey] || ""}
                        onChange={(e) =>
                          handleSpecChange(spec.stateKey, e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.7rem",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    ) : (
                      <select
                        className="uf-spec-trigger"
                        value={specifications[spec.stateKey]}
                        onChange={(e) =>
                          handleSpecChange(spec.stateKey, e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.7rem",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          appearance: "auto",
                        }}
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
                  </div>
                ))}
              </div>

              <div
                className="uf-payment-section"
                style={{
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  className="uf-payment-info"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p
                    className="uf-payment-label"
                    style={{
                      color: "#372B7E",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      marginRight: "0.5rem",
                      marginBottom: 0,
                    }}
                  >
                    PAYMENT:
                  </p>
                  <div
                    className="uf-payment-amount"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span
                      className="uf-payment-currency"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                        color: "#372B7E",
                        marginRight: "0.2rem",
                      }}
                    >
                      ₱
                    </span>
                    <span
                      className="uf-payment-value"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                        color: "#372B7E",
                      }}
                    >
                      {calculatePrice()}
                    </span>
                  </div>
                </div>

                <div
                  className="uf-confirm-btn-wrapper"
                  style={{ textAlign: "center" }}
                >
                  <button
                    className="uf-btn-primary"
                    onClick={handleConfirmClick}
                    style={{
                      backgroundColor: "#1C7ED6",
                      color: "white",
                      borderRadius: "2rem",
                      padding: "0.8rem 3rem",
                      border: "none",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
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

export default LayoutSpecification;
