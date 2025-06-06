// Centralized step configuration for all pages
export const STEP_LABELS = {
  UPLOAD: "Upload",
  BASKET: "Basket",
  DELIVERY: "Delivery",
  PAYMENT: "Payment",
};

// Define step configurations for different flows
export const STEP_CONFIGS = {
  // Standard printing service flow (Upload -> Basket -> Delivery -> Payment)
  PRINTING: [
    { number: "1", label: STEP_LABELS.UPLOAD, key: "upload" },
    { number: "2", label: STEP_LABELS.BASKET, key: "basket" },
    { number: "3", label: STEP_LABELS.DELIVERY, key: "delivery" },
    { number: "4", label: STEP_LABELS.PAYMENT, key: "payment" },
  ],

  // Layout service flow (Template -> Specifications -> Basket -> Delivery -> Payment)
  LAYOUT: [
    { number: "1", label: "Template", key: "template" },
    { number: "2", label: "Specifications", key: "specifications" },
    { number: "3", label: STEP_LABELS.BASKET, key: "basket" },
    { number: "4", label: STEP_LABELS.DELIVERY, key: "delivery" },
    { number: "5", label: STEP_LABELS.PAYMENT, key: "payment" },
  ],
};

// Function to get steps with active states based on current page
export const getStepsWithActiveStates = (stepConfig, currentStep) => {
  return stepConfig.map((step, index) => {
    const stepIndex = stepConfig.findIndex((s) => s.key === currentStep);
    return {
      ...step,
      active: index <= stepIndex,
    };
  });
};

// Function to determine which step config to use based on context
export const getStepConfig = (templateData, location) => {
  // If we have template data indicating this is a layout service
  if (templateData?.templateType) {
    return STEP_CONFIGS.LAYOUT;
  }

  // If coming from layout page
  if (
    location?.pathname?.includes("/layout") ||
    location?.state?.templateData?.templateType
  ) {
    return STEP_CONFIGS.LAYOUT;
  }

  // Default to printing service
  return STEP_CONFIGS.PRINTING;
};
