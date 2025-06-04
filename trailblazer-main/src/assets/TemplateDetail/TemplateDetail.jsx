import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./TemplateDetail.css";

function TemplateDetail() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for previous state when coming back from upload page
  const previousTemplateInfo = location.state?.templateInfo || {};

  const [notes, setNotes] = useState(previousTemplateInfo.notes || "");
  const [turnaroundTime, setTurnaroundTime] = useState(
    previousTemplateInfo.turnaroundTime || ""
  );

  const handleContinue = () => {
    // Validate fields
    if (!turnaroundTime) {
      alert("Please select a turnaround time before proceeding.");
      return;
    }

    // Get template title and description based on templateId
    let templateTitle = "Selected Template";
    let templateDescription = "";

    // Find the template details from the template collections
    const allTemplates = [
      ...resumeTemplates,
      ...posterTemplates,
      ...pptTemplates,
      ...layoutTemplates,
    ];
    const template = allTemplates.find((t) => t.id === templateId);

    if (template) {
      templateTitle = template.title;
      templateDescription = template.description;
    }

    // Create template info object with more details
    const templateInfo = {
      templateId,
      notes,
      turnaroundTime,
      title: templateTitle,
      description: templateDescription,
      imageSrc: `/images/${templateId}`,
    };

    console.log(
      "Template info being passed to specification page:",
      templateInfo
    );

    // Navigate to template-specific specifications page with template info
    navigate(`/template/${templateId}/specification`, {
      state: {
        templateInfo,
      },
    });
  };

  const handleBack = () => {
    // Pass the current state back when navigating
    navigate(-1, {
      state: {
        templateInfo: {
          templateId,
          notes,
          turnaroundTime,
        },
      },
    });
  };

  // Template collections for reference
  const resumeTemplates = [
    {
      id: "resume1",
      title: "Professional Resume",
      description: "2024 • A4",
    },
    {
      id: "resume2",
      title: "Modern Resume",
      description: "2024 • A4",
    },
    {
      id: "resume3",
      title: "Simple Resume",
      description: "2024 • A4",
    },
    {
      id: "resume4",
      title: "Creative Resume",
      description: "2024 • A4",
    },
  ];

  const posterTemplates = [
    {
      id: "poster1",
      title: "Back to School Poster",
      description: "2024 • A4",
    },
    {
      id: "poster2",
      title: "Engineer Poster",
      description: "2024 • A4",
    },
    {
      id: "poster3",
      title: "Class Schedule Poster",
      description: "2024 • A4",
    },
    {
      id: "poster4",
      title: "Nature Theme Poster",
      description: "2024 • A4",
    },
  ];

  const pptTemplates = [
    {
      id: "ppt1",
      title: "Minimal Aesthetic Presentation",
      description: "2024 • 16:9",
    },
    {
      id: "ppt2",
      title: "Construction Labor Presentation",
      description: "2024 • 16:9",
    },
    {
      id: "ppt3",
      title: "Notebook Style Slides",
      description: "2024 • 16:9",
    },
  ];

  const layoutTemplates = [
    {
      id: "layout1",
      title: "Basic Layout Design",
      description: "Simple layout design service",
    },
    {
      id: "layout2",
      title: "Advanced Layout Design",
      description: "Complex layout design service",
    },
    {
      id: "layout3",
      title: "Custom Layout Design",
      description: "Fully customized layout design",
    },
  ];

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={handleBack}>
        Back
      </button>

      <h2 className="template-title">Minimal Aesthetic Presentation</h2>

      <div className="template-detail-content">
        <img
          src={`/images/${templateId}`}
          alt="Selected Template"
          className="detail-image"
        />

        <div className="template-form-container">
          <div className="template-form">
            <h3>NOTES & TURNAROUND TIME:</h3>
            <textarea
              placeholder="Specify what you need. e.g. font: arial"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="specification-fields">
              <div className="spec-field turnaround-container">
                <label>Turnaround time:</label>
                <select
                  value={turnaroundTime}
                  onChange={(e) => setTurnaroundTime(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Standard">Standard (3-5 days)</option>
                  <option value="Rush">Rush (1-2 days)</option>
                </select>
              </div>
            </div>
          </div>

          <button className="continue-btn" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateDetail;
