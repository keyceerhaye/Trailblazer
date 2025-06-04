import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TemplateDetail.css";

function TemplateDetail() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [turnaroundTime, setTurnaroundTime] = useState("");

  const handleContinue = () => {
    if (!turnaroundTime) {
      alert("Please select a turnaround time");
      return;
    }

    // Navigate to the upload/print route with template information
    navigate("/upload/print", {
      state: {
        templateInfo: {
          templateId,
          notes,
          turnaroundTime,
        },
      },
    });
  };

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        Back
      </button>

      <h2 className="template-title">Minimal Aesthetic Presentation</h2>

      <div className="template-detail-content">
        <img
          src={`/images/${templateId}`}
          alt="Selected Template"
          className="detail-image"
        />

        <div className="template-form">
          <h3>NOTES:</h3>
          <textarea
            placeholder="Specify what you need. e.g. font: arial"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <label>Turnaround time:</label>
          <select
            value={turnaroundTime}
            onChange={(e) => setTurnaroundTime(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Standard">Standard (3-5 days)</option>
            <option value="Rush">Rush (1-2 days)</option>
          </select>

          <button className="continue-btn" onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateDetail;
