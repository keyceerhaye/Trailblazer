import React, { useEffect, useState } from "react";
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
import BackButton from "../../components/BackButton/BackButton";
import {
  orderManager,
  getFileIcon,
  formatPrice,
} from "../../utils/dataManager";

const Basket = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current order from data manager or handle legacy data
  const currentOrderFromState = location.state?.currentOrder;
  const currentOrderFromManager = orderManager.getCurrentOrder();
  const currentOrder = currentOrderFromState || currentOrderFromManager;
  const templateData = location.state?.templateData || null;
  const isFromUpload = location.state?.fromUpload || false;

  // Debug logs
  console.log("BASKET: Current Order:", currentOrder);
  console.log("Template Data:", templateData);
  console.log("Is From Upload:", isFromUpload);

  // Dynamically determine step configuration based on service type
  const stepConfig = getStepConfig(templateData, location);
  const steps = getStepsWithActiveStates(stepConfig, "basket");

  const [basketItems, setBasketItems] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [orderDetails, setOrderDetails] = useState({});
  const [totalPages, setTotalPages] = useState(0);

  // Check if user is coming from layoutspecification page
  const isFromLayoutSpecification = templateData && templateData.hasTemplate;

  // Price constants (must match UploadFiles.jsx)
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
    LAYOUT_BASE_PRICE: 50,
    DELIVERY_FEE: 20,
  };

  useEffect(() => {
    console.log("BASKET: Initializing with currentOrder:", currentOrder);
    console.log("BASKET: Template data:", templateData);
    console.log("BASKET: Is from upload:", isFromUpload);
    console.log("BASKET: Location state:", location.state);

    // Add error handling wrapper
    try {
      // Check if we have basketItems in location state (from back navigation)
      // This takes priority over orderManager data to preserve deletions
      if (
        location.state?.basketItems &&
        location.state.basketItems.length > 0
      ) {
        console.log(
          "BASKET: Using basketItems from location state (back navigation)"
        );
        setBasketItems(location.state.basketItems);

        if (location.state.orderDetails) {
          setOrderDetails(location.state.orderDetails);
        }

        showFeedback(
          `Basket restored with ${location.state.basketItems.length} item(s)`
        );
      }
      // Otherwise, use currentOrder data for fresh initialization
      else if (
        currentOrder &&
        currentOrder.files &&
        currentOrder.files.length > 0
      ) {
        // Convert order files to basket items
        const basketItemsFromOrder = currentOrder.files.map((file) => ({
          id: file.id,
          name: file.fileName,
          status: "Uploaded Successfully",
          icon: getFileIconImage(file.fileType),
          file: {
            name: file.fileName,
            type: file.fileType,
            size: file.fileSize,
          },
          pageCount: file.pageCount,
          isTemplate: false,
          specifications: file.specifications,
          pricing: file.pricing,
        }));

        setBasketItems(basketItemsFromOrder);

        // Set order details from current order
        setOrderDetails({
          paperSize: "", // Individual files have their own paper sizes
          printOption: "", // Individual files have their own print options
          turnaroundTime: currentOrder.turnaroundTime,
          paymentMethod: currentOrder.paymentMethod,
          emailAddress: currentOrder.customerEmail,
          phoneNumber: currentOrder.customerPhone,
          price: currentOrder.totalAmount.toFixed(2),
          customization: "None",
          deliveryMethod: currentOrder.deliveryMethod,
          notes: currentOrder.notes,
        });

        showFeedback(
          `Basket loaded with ${basketItemsFromOrder.length} file(s)`
        );
      }
      // Handle template-based orders
      else if (templateData && templateData.hasTemplate) {
        console.log("BASKET: Initializing from template data.", templateData);
        const templateItem = {
          id: `template-${templateData.templateId}-${Date.now()}`,
          name: templateData.title || `Template ${templateData.templateId}`,
          status: "Template Selected",
          icon: PDF,
          file: null,
          pageCount: 1,
          isTemplate: true,
          templateId: templateData.templateId,
          templateType: templateData.templateType,
          specifications: templateData.specifications || null,
          turnaroundTime: templateData.turnaroundTime || null,
        };

        setBasketItems([templateItem]);

        setOrderDetails({
          paperSize: templateData.specifications?.paperSize || "",
          printOption: templateData.specifications?.printOption || "",
          turnaroundTime: templateData.turnaroundTime || "Standard",
          paymentMethod: "cash",
          emailAddress: "",
          phoneNumber: "",
          price: PRICES.LAYOUT_BASE_PRICE.toFixed(2),
          customization: templateData.specifications?.customization || "None",
          templateType: templateData.templateType,
          hasTemplate: true,
        });

        showFeedback(`Template ${templateItem.name} added to basket`);
      } else {
        // Check if we're coming back from delivery/payment with an empty basket
        if (
          location.state?.basketItems &&
          location.state.basketItems.length === 0
        ) {
          console.log("BASKET: Restored empty basket from back navigation");
          setBasketItems([]);
          setOrderDetails(
            location.state.orderDetails || {
              paperSize: "",
              printOption: "",
              turnaroundTime: "Standard",
              paymentMethod: "cash",
              emailAddress: "",
              phoneNumber: "",
              price: "0.00",
              customization: "None",
            }
          );
        } else {
          // Empty basket or no current order
          console.log(
            "BASKET: No current order or files, showing empty basket"
          );
          setBasketItems([]);
          setOrderDetails({
            paperSize: "",
            printOption: "",
            turnaroundTime: "Standard",
            paymentMethod: "cash",
            emailAddress: "",
            phoneNumber: "",
            price: "0.00",
            customization: "None",
          });
        }
      }
    } catch (error) {
      console.error("BASKET: Error during initialization:", error);

      // If there's an error but we have location state, try to use it
      if (location.state?.basketItems) {
        console.log("BASKET: Error recovery using location state");
        setBasketItems(location.state.basketItems);
        setOrderDetails(
          location.state.orderDetails || {
            paperSize: "",
            printOption: "",
            turnaroundTime: "Standard",
            paymentMethod: "cash",
            emailAddress: "",
            phoneNumber: "",
            price: "0.00",
            customization: "None",
          }
        );
      } else {
        // Fallback to empty basket
        setBasketItems([]);
        setOrderDetails({
          paperSize: "",
          printOption: "",
          turnaroundTime: "Standard",
          paymentMethod: "cash",
          emailAddress: "",
          phoneNumber: "",
          price: "0.00",
          customization: "None",
        });
      }
    }
  }, [currentOrder, templateData]);

  // Calculate total pages whenever basketItems change
  useEffect(() => {
    const newTotalPages = basketItems.reduce(
      (total, item) => total + (item.pageCount || 1),
      0
    );
    setTotalPages(newTotalPages);
  }, [basketItems]);

  // Calculate price based on specifications and file page counts
  const calculatePrice = (items, details, templateType) => {
    // Debug logs
    console.log("CALCULATE PRICE CALLED - Template Type:", templateType);
    console.log("CALCULATE PRICE CALLED - Details:", details);
    console.log("CALCULATE PRICE CALLED - Items:", items);

    // If no items in basket, return "00.00"
    if (!items || items.length === 0) {
      console.log("CALCULATE PRICE: No items. Returning 00.00.");
      return "00.00";
    }

    let totalPrice = 0;

    // Calculate price for each item individually based on its specifications
    items.forEach((item) => {
      const itemSpecs = item.specifications || details;

      // Layout service pricing
      if (
        item.isTemplate &&
        (templateType === "layout" || item.templateType === "layout")
      ) {
        totalPrice += PRICES.LAYOUT_BASE_PRICE;

        if (itemSpecs.turnaroundTime === "Rush") {
          totalPrice += PRICES.RUSH_FEE;
        }
        if (itemSpecs.customization && itemSpecs.customization !== "None") {
          totalPrice += PRICES.CUSTOMIZATION[itemSpecs.customization];
        }
      }
      // Template pricing for other types
      else if (item.isTemplate) {
        if (
          item.templateType === "presentation" ||
          item.templateType === "poster"
        ) {
          totalPrice += 50;
        } else if (item.templateType === "resume") {
          totalPrice += 30;
        } else {
          totalPrice += 25; // Default template fee
        }

        // Add rush fee for templates if applicable
        if (itemSpecs.turnaroundTime === "Rush") {
          totalPrice += PRICES.RUSH_FEE;
        }
      }
      // Regular file pricing
      else {
        const normalizedPrintOption = itemSpecs.printOption;

        if (itemSpecs.paperSize && normalizedPrintOption) {
          const basePrice =
            PRICES.PRINTING[normalizedPrintOption]?.[itemSpecs.paperSize] || 0;
          totalPrice += basePrice * (item.pageCount || 1);

          // Add rush fee for individual files if applicable (flat fee, not per page)
          if (itemSpecs.turnaroundTime === "Rush") {
            totalPrice += PRICES.RUSH_FEE;
          }
        }
      }
    });

    console.log(
      "CALCULATE PRICE: Final calculated total price:",
      totalPrice.toFixed(2)
    );
    return totalPrice.toFixed(2);
  };

  useEffect(() => {
    // Recalculate price whenever specific order details change (not basket items to avoid loops)
    // basketItems changes are handled in handleDeleteItem and other item manipulation functions
    if (basketItems.length > 0 || templateData?.templateType === "layout") {
      setOrderDetails((prev) => ({
        ...prev,
        price: calculatePrice(basketItems, prev, templateData?.templateType),
      }));
    } else {
      setOrderDetails((prev) => ({
        ...prev,
        price: "0.00", // Reset price if basket is empty and not a layout service
      }));
    }
  }, [
    // Removed basketItems from dependencies to avoid loops since item changes are handled elsewhere
    orderDetails.paperSize,
    orderDetails.printOption,
    orderDetails.turnaroundTime,
    orderDetails.customization,
    templateData?.templateType, // Only track templateType to avoid full templateData dependency
  ]);

  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setTimeout(() => {
      setFeedbackMessage("");
    }, 3000);
  };

  // Function to update specifications for individual items
  const updateItemSpecifications = (itemId, newSpecifications) => {
    setBasketItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              specifications: {
                ...item.specifications,
                ...newSpecifications,
              },
            }
          : item
      )
    );

    // Recalculate total price after specification change
    const updatedItems = basketItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            specifications: {
              ...item.specifications,
              ...newSpecifications,
            },
          }
        : item
    );

    setOrderDetails((prevDetails) => ({
      ...prevDetails,
      price: calculatePrice(
        updatedItems,
        prevDetails,
        templateData?.templateType
      ),
    }));

    showFeedback("Item specifications updated");
  };

  const handleDeleteItem = (itemId) => {
    // Find the item being deleted to determine if it's a file in orderManager
    const itemToDelete = basketItems.find((item) => item.id === itemId);

    setBasketItems((prev) => {
      const newItems = prev.filter((item) => item.id !== itemId);

      // Recalculate price with the updated items
      const newPrice = calculatePrice(
        newItems,
        orderDetails,
        templateData?.templateType
      );

      // If basket is now empty, reset order details and clear orderManager
      if (newItems.length === 0) {
        setOrderDetails({
          paperSize: "",
          printOption: "",
          turnaroundTime: "Standard",
          paymentMethod: "",
          customization: "None",
          price: "0.00",
        });

        // Clear the entire current order since basket is empty
        orderManager.clearCurrentOrder();
      } else {
        // Update order details with new price
        setOrderDetails((prevDetails) => ({
          ...prevDetails,
          price: newPrice,
        }));

        // Update orderManager to reflect the updated total amount
        orderManager.updateOrderDetails({
          totalAmount: parseFloat(newPrice),
        });
      }

      return newItems;
    });

    // Remove the file from orderManager if it's a regular file (not template)
    if (itemToDelete && !itemToDelete.isTemplate) {
      const success = orderManager.removeFileFromOrder(itemId);
      console.log(`BASKET: Removed file ${itemId} from orderManager:`, success);
    }

    showFeedback("Item removed from basket");
  };

  const handleAddFiles = () => {
    // Update orderManager with current basket state before navigating
    orderManager.updateOrderDetails({
      totalAmount: parseFloat(orderDetails.price || "0.00"),
      turnaroundTime: orderDetails.turnaroundTime,
      paymentMethod: orderDetails.paymentMethod,
      deliveryMethod: orderDetails.deliveryMethod,
      notes: orderDetails.notes || "",
    });

    // Create comprehensive specifications object for upload page
    const comprehensiveSpecifications = {
      ...orderDetails,
      // Include template-specific information
      templateType: orderDetails.templateType || templateData?.templateType,
      hasTemplate:
        orderDetails.hasTemplate || templateData?.hasTemplate || false,
      // Include any template-specific notes
      templateNotes: templateData?.notes || orderDetails.templateNotes,
      templateTurnaroundTime:
        templateData?.turnaroundTime || orderDetails.templateTurnaroundTime,
      // Ensure all current specification values are preserved
      totalFiles: basketItems.filter((item) => !item.isTemplate).length,
      totalPrice: orderDetails.price,
    };

    console.log(
      "BASKET: Navigating back to upload with comprehensive specifications:",
      comprehensiveSpecifications
    );
    console.log("BASKET: Updated orderManager before navigating to upload");

    // Navigate back to upload page while preserving current basket state
    // This allows users to add more files through the full upload interface
    navigate("/upload", {
      state: {
        // Convert current basket items back to files format for upload page
        files: basketItems
          .filter((item) => !item.isTemplate) // Exclude template items
          .map((item) => ({
            id: item.id,
            name: item.name,
            type: item.file?.type,
            size: item.file?.size,
            lastModified: item.file?.lastModified,
            pageCount: item.pageCount || 1,
            isTemplate: item.isTemplate || false,
            specifications: item.specifications || comprehensiveSpecifications,
            templateType: item.templateType || orderDetails.templateType,
          })),
        specifications: comprehensiveSpecifications, // Enhanced specifications
        basketItems: basketItems, // Pass current basket items
        orderDetails: orderDetails, // Pass current order details
        templateInfo: templateData
          ? {
              templateId: templateData.templateId,
              notes: templateData.notes || orderDetails.notes,
              turnaroundTime:
                templateData.turnaroundTime || orderDetails.turnaroundTime,
              title: templateData.title,
              description: templateData.description,
              templateType:
                templateData.templateType || orderDetails.templateType,
              imageSrc: templateData.imageSrc,
            }
          : null,
        templateData: templateData
          ? {
              ...templateData,
              templateType:
                templateData.templateType || orderDetails.templateType,
              hasTemplate: templateData.hasTemplate || orderDetails.hasTemplate,
            }
          : null,
        fromBasket: true, // Flag to indicate we're coming from basket
        // Additional metadata for better state management
        uploadMetadata: {
          timestamp: Date.now(),
          fromBasket: true,
          basketItemCount: basketItems.length,
          templateType: orderDetails.templateType || templateData?.templateType,
          hasTemplate:
            orderDetails.hasTemplate || templateData?.hasTemplate || false,
        },
      },
    });
  };

  // Use the imported getFileIcon function from dataManager
  const getFileIconImage = (fileType) => {
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return PDF;
    if (type.includes("doc")) return DOC;
    if (type.includes("ppt")) return PPT;
    if (type.includes("png")) return PNG;
    if (type.includes("jpg") || type.includes("jpeg")) return JPG;
    return PDF;
  };

  const handleNextClick = () => {
    // Ensure price is calculated and included
    const normalizedOrderDetails = {
      ...orderDetails,
      // Keep printOption as is since we now use "Full color" consistently
      price:
        orderDetails.price ||
        calculatePrice(basketItems, orderDetails, templateData?.templateType),
    };

    // Update orderManager with current basket state before navigating
    orderManager.updateOrderDetails({
      totalAmount: parseFloat(normalizedOrderDetails.price),
      turnaroundTime: normalizedOrderDetails.turnaroundTime,
      paymentMethod: normalizedOrderDetails.paymentMethod,
      deliveryMethod: normalizedOrderDetails.deliveryMethod,
      notes: normalizedOrderDetails.notes || "",
    });

    console.log("BASKET: Updated orderManager before navigation");

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

  const renderItemDetails = (item) => {
    // Use item-specific specifications if available, otherwise fall back to global orderDetails
    const itemSpecs = item.specifications || orderDetails;

    // Calculate individual item price based on page count and its specific specifications (includes rush fee, excludes delivery fee)
    const itemPrice = (item) => {
      const specs = item.specifications || orderDetails;
      let totalItemPrice = 0;
      let rushFee = 0;

      console.log(`BASKET: Calculating price for item ${item.name}:`, {
        specs,
        pageCount: item.pageCount,
        turnaroundTime: specs.turnaroundTime,
      });

      // Handle templates
      if (item.isTemplate) {
        if (
          templateData?.templateType === "layout" ||
          item.templateType === "layout"
        ) {
          // Layout service pricing
          totalItemPrice = PRICES.LAYOUT_BASE_PRICE;
        } else if (
          item.templateType === "presentation" ||
          item.templateType === "poster"
        ) {
          // Presentation and poster templates
          totalItemPrice = 50;
        } else if (item.templateType === "resume") {
          // Resume template
          totalItemPrice = 30;
        } else {
          // Default template fee
          totalItemPrice = 25;
        }

        // Add rush fee for templates if applicable
        if (specs.turnaroundTime === "Rush") {
          rushFee = PRICES.RUSH_FEE;
          totalItemPrice += rushFee;
        }

        console.log(
          `BASKET: Template ${item.name} - Base: ₱${
            totalItemPrice - rushFee
          }, Rush: ₱${rushFee}, Total: ₱${totalItemPrice}`
        );
        return totalItemPrice.toFixed(2);
      }

      // Handle regular files
      if (!item.isTemplate && specs.paperSize && specs.printOption) {
        const basePrice =
          PRICES.PRINTING[specs.printOption]?.[specs.paperSize] || 0;
        const baseTotalPrice = basePrice * (item.pageCount || 1);
        totalItemPrice = baseTotalPrice;

        // Add rush fee if applicable (flat fee, not per page)
        if (specs.turnaroundTime === "Rush") {
          rushFee = PRICES.RUSH_FEE;
          totalItemPrice += rushFee;
        }

        console.log(
          `BASKET: File ${item.name} - Base: ₱${baseTotalPrice}, Rush: ₱${rushFee}, Total: ₱${totalItemPrice}`
        );
        return totalItemPrice.toFixed(2);
      }

      return "0.00";
    };

    return (
      <div className="bs-order-details">
        {/* Show Paper Size for all except pure layout service */}
        {((templateData?.templateType !== "layout" &&
          item.templateType !== "layout") ||
          (!templateData && !item.templateType)) && (
          <div>{itemSpecs.paperSize}</div>
        )}

        {/* Show Printing Option for all except pure layout service */}
        {((templateData?.templateType !== "layout" &&
          item.templateType !== "layout") ||
          (!templateData && !item.templateType)) && (
          <div>{itemSpecs.printOption}</div>
        )}

        {/* Show Service Type for layout */}
        {(templateData?.templateType === "layout" ||
          item.templateType === "layout") && <div>Layout Design</div>}

        {/* Turnaround Time for all types */}
        <div>
          {item.turnaroundTime ||
            templateData?.turnaroundTime ||
            itemSpecs.turnaroundTime ||
            "Standard"}
        </div>

        {/* Payment Method for all types */}
        <div>{itemSpecs.paymentMethod}</div>

        {/* Customization Level only for layout */}
        {(templateData?.templateType === "layout" ||
          item.templateType === "layout") &&
          itemSpecs.customization &&
          itemSpecs.customization !== "None" && (
            <div>{itemSpecs.customization}</div>
          )}

        {/* Item-specific details */}
        {!item.isTemplate && item.pageCount > 1 && (
          <div className="bs-page-info">
            <p>Pages: {item.pageCount}</p>
          </div>
        )}

        {/* Item price */}
        <div className="bs-summary-price">
          <span> ₱{itemPrice(item)}</span>
        </div>
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
        <button
          className="bs-add-btn bs-empty-add-btn"
          onClick={() => navigate("/upload")}
          style={{ marginLeft: "10px" }}
        >
          Go to Upload
        </button>
      </div>
    </div>
  );

  try {
    return (
      <div className="bs-wrapper">
        {feedbackMessage && (
          <div className="bs-feedback-message">{feedbackMessage}</div>
        )}

        <BackButton onClick={handleBack} />

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
                <div
                  className={`bs-step-circle ${step.active ? "active" : ""}`}
                >
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
              {basketItems.map((item) => (
                <div key={item.id} className="bs-item-card-group">
                  {/* Basket Component Container */}
                  <div className="bs-basket-component-container">
                    <div className="bs-basket-item-wrapper">
                      <div className="bs-basket-card bs-card">
                        <div className="bs-basket-item-container">
                          <div className="bs-basket-item">
                            <img
                              src={item.icon}
                              alt="File icon"
                              className="bs-file-icon"
                            />
                            <div className="bs-file-info">
                              <p className="bs-file-name">
                                {item.name}
                                {item.isTemplate && (
                                  <span
                                    style={{
                                      color: "#1C7ED6",
                                      marginLeft: "6px",
                                    }}
                                  >
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
                                  ` • ${
                                    templateData?.templateType || "Template"
                                  }`}
                              </p>
                            </div>
                            <img
                              src={uploadCheck}
                              alt="Done"
                              className="bs-status-icon"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="bs-delete-btn bs-delete-btn-external"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label="Delete item"
                      title="Remove item"
                    >
                      <img src={uploadDelete} alt="Delete" />
                    </button>
                  </div>

                  {/* Individual Summary Card */}
                  <div className="bs-summary-card bs-card">
                    <div className="bs-summary-info">
                      {renderItemDetails(item)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Footer inside bs-main */}
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
            </>
          ) : (
            renderEmptyBasket()
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("BASKET: Render error:", error);
    return (
      <div className="bs-wrapper">
        <div
          className="bs-error-message"
          style={{ padding: "20px", textAlign: "center" }}
        >
          <h3>Something went wrong</h3>
          <p>Please try refreshing the page or go back to upload files.</p>
          <button
            onClick={() => navigate("/upload")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1C7ED6",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }
};

export default Basket;
