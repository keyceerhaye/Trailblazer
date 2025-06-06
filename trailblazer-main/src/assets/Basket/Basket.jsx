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
import {
  getStepConfig,
  getStepsWithActiveStates,
} from "../../utils/stepsConfig";

const Basket = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle both single file (legacy) and multiple files (new)
  const uploadedFiles =
    location.state?.files ||
    (location.state?.file ? [location.state.file] : null);
  const passedBasketItems = location.state?.basketItems || null;
  const passedDetails =
    location.state?.specifications || location.state?.orderDetails || null;
  const templateData = location.state?.templateData || null;

  // Debug logs
  console.log("Template Data:", templateData);
  console.log("Template Type:", templateData?.templateType);
  console.log("Passed Details:", passedDetails);

  // Dynamically determine step configuration based on service type
  const stepConfig = getStepConfig(templateData, location);
  const steps = getStepsWithActiveStates(stepConfig, "basket");

  const [basketItems, setBasketItems] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  // Check if user is coming from layoutspecification page
  const isFromLayoutSpecification = templateData && templateData.hasTemplate;

  const [orderDetails, setOrderDetails] = useState({
    paperSize: passedDetails?.paperSize || "A4",
    printOption: passedDetails?.printOption || "Black&White",
    turnaroundTime: passedDetails?.turnaroundTime || "Standard",
    paymentMethod: passedDetails?.paymentMethod || "Cash",
    emailAddress: passedDetails?.emailAddress || "",
    phoneNumber: passedDetails?.phoneNumber || "",
    price:
      templateData?.templateType === "layout"
        ? PRICES.LAYOUT_BASE_PRICE.toFixed(2)
        : "00.00",
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
    LAYOUT_BASE_PRICE: 50,
    DELIVERY_FEE: 20,
  };

  useEffect(() => {
    // First priority: If we have existing basket items (coming from delivery/payment pages)
    if (passedBasketItems && passedBasketItems.length > 0) {
      console.log(
        "BASKET: Restoring existing basket items.",
        passedBasketItems
      );
      setBasketItems(passedBasketItems);

      // Calculate total pages
      const totalPageCount = passedBasketItems.reduce((total, item) => {
        return total + (item.pageCount || 1);
      }, 0);
      setTotalPages(totalPageCount);

      // Restore order details if they exist
      if (passedDetails) {
        setOrderDetails((prevDetails) => {
          const updatedDetails = {
            ...prevDetails,
            ...passedDetails,
          };
          return {
            ...updatedDetails,
            price:
              passedDetails.price ||
              calculatePrice(
                passedBasketItems,
                updatedDetails,
                templateData?.templateType
              ),
          };
        });
      }

      showFeedback(`Basket restored with ${passedBasketItems.length} item(s)`);
      console.log(
        "BASKET: Successfully restored basketItems:",
        passedBasketItems
      );
    }
    // Second priority: If coming from layout specification page, prioritize template data
    else if (templateData && templateData.hasTemplate) {
      console.log("BASKET: Initializing from template data.", templateData);
      const templateItem = {
        id: `template-${templateData.templateId}-${Date.now()}`,
        name: templateData.title || `Template ${templateData.templateId}`,
        status: "Template Selected",
        icon: PDF, // Default icon, can be refined based on templateType if needed
        file: null, // No actual file for a template item
        pageCount: 1, // Templates can be considered as 1 page for simplicity
        isTemplate: true,
        templateId: templateData.templateId,
        templateType: templateData.templateType,
      };

      setBasketItems([templateItem]);
      setTotalPages(1);
      showFeedback(`Template ${templateItem.name} added to basket`);

      setOrderDetails((prevDetails) => {
        const updatedDetails = {
          ...prevDetails,
          ...passedDetails,
          turnaroundTime:
            templateData.turnaroundTime || prevDetails.turnaroundTime, // Ensure turnaround time is passed
          customization:
            passedDetails?.customization || prevDetails.customization, // Ensure customization is passed
        };
        const calculatedPrice = calculatePrice(
          [templateItem],
          updatedDetails,
          templateData?.templateType
        );
        console.log(
          "BASKET: Calculated price during initialization:",
          calculatedPrice
        );
        return {
          ...updatedDetails,
          price: calculatedPrice,
        };
      });
    } else if (uploadedFiles && uploadedFiles.length > 0) {
      console.log("BASKET: Initializing from uploaded files.", uploadedFiles);
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
          isTemplate: file.isTemplate || false,
          templateType: file.templateType || null, // Add templateType from file if available
        };
      });

      setBasketItems(fileItems);
      setTotalPages(totalPageCount);
      showFeedback(`${fileItems.length} file(s) added to basket`);

      // Calculate price after adding items
      if (passedDetails || templateData) {
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
  }, [passedBasketItems, uploadedFiles, passedDetails, templateData]);

  // Calculate price based on specifications and file page counts
  const calculatePrice = (items, details, templateType) => {
    // Debug logs
    console.log("CALCULATE PRICE CALLED - Template Type:", templateType);
    console.log("CALCULATE PRICE CALLED - Details:", details);
    console.log("CALCULATE PRICE CALLED - Items:", items);

    // Prioritize layout service pricing if templateType is 'layout'
    if (templateType === "layout") {
      console.log(
        "CALCULATE PRICE: Layout service detected. Calculating price based on layout rules."
      );
      let totalPrice = PRICES.LAYOUT_BASE_PRICE;

      if (details.turnaroundTime === "Rush") {
        totalPrice += PRICES.RUSH_FEE;
        console.log(
          "CALCULATE PRICE: Added rush fee. Current total:",
          totalPrice
        );
      }
      if (details.customization && details.customization !== "None") {
        totalPrice += PRICES.CUSTOMIZATION[details.customization];
        console.log(
          "CALCULATE PRICE: Added customization fee. Current total:",
          totalPrice
        );
      }
      console.log(
        "CALCULATE PRICE: Final calculated layout price:",
        totalPrice.toFixed(2)
      );
      return totalPrice.toFixed(2);
    }

    // If no items in basket and it's not a layout service, return "00.00"
    if (!items || items.length === 0) {
      console.log(
        "CALCULATE PRICE: No items and not layout service. Returning 00.00."
      );
      return "00.00";
    }

    let totalPrice = 0;

    // Existing logic for other template types and regular files
    const normalizedPrintOption =
      details.printOption === "Full color" ? "Colored" : details.printOption;

    const hasTemplateItems = items.some((item) => item.isTemplate);

    if (templateType === "presentation" || templateType === "poster") {
      if (hasTemplateItems) {
        totalPrice = 50;
      }
      items.forEach((item) => {
        if (!item.isTemplate) {
          const basePrice =
            PRICES.PRINTING[normalizedPrintOption]?.[details.paperSize] || 0;
          totalPrice += basePrice * (item.pageCount || 1);
        }
      });
    } else if (templateType === "resume") {
      let basePrice =
        PRICES.PRINTING[normalizedPrintOption]?.[details.paperSize] || 0;
      if (hasTemplateItems) {
        totalPrice += 30; // Resume template base fee
      }
      items.forEach((item) => {
        if (!item.isTemplate) {
          totalPrice += basePrice * (item.pageCount || 1);
        }
      });
    } else {
      // Default calculation for other template types and regular files
      let basePrice =
        PRICES.PRINTING[normalizedPrintOption]?.[details.paperSize] || 0;

      items.forEach((item) => {
        if (item.isTemplate) {
          totalPrice += 25; // Default template fee
        } else {
          totalPrice += basePrice * (item.pageCount || 1);
        }
      });

      if (details.customization && details.customization !== "None") {
        totalPrice += PRICES.CUSTOMIZATION[details.customization];
      }
    }

    // Add rush fee if turnaround time is Rush (for all non-layout services)
    if (details.turnaroundTime === "Rush") {
      totalPrice += PRICES.RUSH_FEE;
    }

    return totalPrice.toFixed(2);
  };

  useEffect(() => {
    // Recalculate price whenever order details or basket items change
    // This useEffect is primarily for when orderDetails (e.g., paperSize, printOption) change AFTER initial load
    if (basketItems.length > 0 || templateData?.templateType === "layout") {
      setOrderDetails((prev) => ({
        ...prev,
        price: calculatePrice(basketItems, prev, templateData?.templateType),
      }));
    } else {
      setOrderDetails((prev) => ({
        ...prev,
        price: "00.00", // Reset price if basket is empty and not a layout service
      }));
    }
  }, [
    basketItems,
    orderDetails.paperSize,
    orderDetails.printOption,
    orderDetails.turnaroundTime,
    orderDetails.customization,
    templateData, // Added templateData to dependencies
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
    // Check if we already have a template in the basket
    const hasTemplate = basketItems.some((item) => item.isTemplate);

    if (hasTemplate) {
      // Show a message that we're adding files to the template
      showFeedback("Adding files to your template order");
    }

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
          isTemplate: file.isTemplate || false,
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
    // Ensure printOption is consistent ("Full color" from upload should be "Colored" in basket)
    const normalizedOrderDetails = {
      ...orderDetails,
      printOption:
        orderDetails.printOption === "Full color"
          ? "Colored"
          : orderDetails.printOption,
      // Ensure price is calculated and included
      price:
        orderDetails.price ||
        calculatePrice(basketItems, orderDetails, templateData?.templateType),
    };

    navigate("/delivery", {
      state: {
        basketItems,
        orderDetails: normalizedOrderDetails,
        specifications: normalizedOrderDetails, // Include as specifications for backward compatibility
        templateData,
      },
    });
  };

  // Function to render appropriate order details based on template type
  const renderOrderDetails = () => {
    // Common specifications for all template types
    return (
      <div className="bs-order-details">
        {/* Show Paper Size for all except pure layout service */}
        {(templateData?.templateType !== "layout" || !templateData) && (
          <div>{orderDetails.paperSize}</div>
        )}

        {/* Show Printing Option for all except pure layout service */}
        {(templateData?.templateType !== "layout" || !templateData) && (
          <div>{orderDetails.printOption}</div>
        )}

        {/* Show Service Type for layout */}
        {templateData?.templateType === "layout" && <div>Layout Design</div>}

        {/* Turnaround Time for all types */}
        <div>
          {templateData?.turnaroundTime ||
            orderDetails.turnaroundTime ||
            "Standard"}
        </div>

        {/* Payment Method for all types */}
        <div>{orderDetails.paymentMethod}</div>

        {/* Customization Level only for layout */}
        {templateData?.templateType === "layout" &&
          orderDetails.customization &&
          orderDetails.customization !== "None" && (
            <div>{orderDetails.customization}</div>
          )}
      </div>
    );
  };

  // Handle back navigation to upload page or specification page
  const handleBack = () => {
    // Check if user came from template specification page
    if (templateData && templateData.hasTemplate) {
      const hasOnlyTemplate =
        basketItems.length === 1 && basketItems[0].isTemplate;

      // Navigate back to specification page with current state
      navigate(`/template/${templateData.templateId}/specification`, {
        state: {
          templateInfo: {
            ...templateData,
            templateId: templateData.templateId,
            notes: templateData.notes,
            turnaroundTime:
              templateData.turnaroundTime || orderDetails.turnaroundTime,
            templateType: templateData.templateType,
            title: templateData.title,
            description: templateData.description,
            imageSrc: templateData.imageSrc,
          },
          specifications: orderDetails,
        },
      });
    } else {
      // Navigate back to upload page with current state
      navigate("/upload", {
        state: {
          files: basketItems.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.file?.type,
            size: item.file?.size,
            lastModified: item.file?.lastModified,
            pageCount: item.pageCount || 1,
            isTemplate: item.isTemplate || false,
          })),
          specifications: orderDetails,
          templateInfo: templateData
            ? {
                templateId: templateData.templateId,
                notes: templateData.notes,
                turnaroundTime:
                  templateData.turnaroundTime || orderDetails.turnaroundTime,
                title: templateData.title,
                description: templateData.description,
                templateType: templateData.templateType,
              }
            : null,
          templateData,
        },
      });
    }
  };

  // Empty basket content
  const renderEmptyBasket = () => (
    <div className="bs-empty-basket bs-card">
      <div className="bs-empty-content">
        <h3>Your basket is empty</h3>
        <p>Add files or select a template to get started with your order</p>
        {!isFromLayoutSpecification && (
          <button
            className="bs-add-btn bs-empty-add-btn"
            onClick={handleAddFiles}
          >
            Add Files
          </button>
        )}
      </div>
    </div>
  );

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
                    <p className="bs-file-name">
                      {item.name}
                      {item.isTemplate && (
                        <span style={{ color: "#1C7ED6", marginLeft: "6px" }}>
                          (Template)
                        </span>
                      )}
                    </p>
                    <p className="bs-file-status">
                      {item.status}
                      {!item.isTemplate &&
                        item.pageCount > 1 &&
                        ` • ${item.pageCount} pages`}
                      {item.isTemplate &&
                        ` • ${templateData?.templateType || "Template"}`}
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
                {totalPages > basketItems.length && (
                  <div className="bs-page-info">
                    <p>Total pages: {totalPages}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          renderEmptyBasket()
        )}
      </div>

      {basketItems.length > 0 && (
        <div className="bs-footer">
          <div className="bs-footer-left">
            {!isFromLayoutSpecification && (
              <button className="bs-add-btn" onClick={handleAddFiles}>
                Add files
              </button>
            )}
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
