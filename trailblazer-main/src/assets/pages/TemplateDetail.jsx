import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TemplateDetail.css';

function TemplateDetail() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/payment');
  };

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>

      <h2 className="template-title">Minimal Aesthetic Presentation</h2>

      <div className="template-detail-content">
        <img
          src={`/images/${templateId}`}
          alt="Selected Template"
          className="detail-image"
        />

        <div className="template-form">
          <h3>NOTES:</h3>
          <textarea placeholder="Specify what you need. e.g. font: arial" />

          <label>Turnaround time:</label>
          <select>
            <option>Select</option>
            <option>1 day</option>
            <option>3 days</option>
            <option>1 week</option>
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
