import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  const resumeTemplates = [
    { id: 'resume1', src: 'resume1.png', title: 'Professional Resume', description: '2024 • A4' },
    { id: 'resume2', src: 'resume2.png', title: 'Modern Resume', description: '2024 • A4' },
    { id: 'resume3', src: 'resume3.png', title: 'Simple Resume', description: '2024 • A4' },
    { id: 'resume4', src: 'resume4.png', title: 'Creative Resume', description: '2024 • A4' },
  ];

  const posterTemplates = [
    { id: 'poster1', src: 'poster1.png', title: 'Back to School Poster', description: '2024 • A4' },
    { id: 'poster2', src: 'poster2.png', title: 'Engineer Poster', description: '2024 • A4' },
    { id: 'poster3', src: 'poster3.png', title: 'Class Schedule Poster', description: '2024 • A4' },
    { id: 'poster4', src: 'poster4.png', title: 'Nature Theme Poster', description: '2024 • A4' },
  ];

  const pptTemplates = [
    { id: 'ppt1', src: 'ppt1.png', title: 'Minimal Aesthetic Presentation', description: '2024 • 16:9' },
    { id: 'ppt2', src: 'ppt2.png', title: 'Construction Labor Presentation', description: '2024 • 16:9' },
    { id: 'ppt3', src: 'ppt3.png', title: 'Notebook Style Slides', description: '2024 • 16:9' },
  ];

  const renderTemplates = (templates) =>
    templates.map((template, index) => (
      <div
        className="template-box"
        key={index}
        onClick={() => setSelectedTemplate(template)}
      >
        <img src={`/images/${template.src}`} alt={template.title} />
      </div>
    ));

  return (
    <div className="templates-page">
      <h1 className="section-title">TEMPLATES</h1>

      <div className="template-section">
        <h2 className="template-heading">RESUME</h2>
        <div className="template-row">
          {renderTemplates(resumeTemplates)}
        </div>
      </div>

      <div className="template-section">
        <h2 className="template-heading">POSTERS</h2>
        <div className="template-row">
          {renderTemplates(posterTemplates)}
        </div>
      </div>

      <div className="template-section">
        <h2 className="template-heading">POWERPOINT PRESENTATIONS</h2>
        <div className="template-row">
          {renderTemplates(pptTemplates)}
        </div>
      </div>

      {selectedTemplate && (
        <div
          className="template-modal-overlay"
          onClick={() => setSelectedTemplate(null)}
        >
          <div
            className="template-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="template-close-btn"
              onClick={() => setSelectedTemplate(null)}
            >
              ×
            </button>
            <div className="template-modal-content">
              <img
                src={`/images/${selectedTemplate.src}`}
                alt={selectedTemplate.title}
              />
              <div className="template-info">
                <h3>{selectedTemplate.title}</h3>
                <p>{selectedTemplate.description}</p>
                <button
                  className="choose-template-btn"
                  onClick={() => navigate(`/template/${selectedTemplate.id}`)}
                >
                  Choose this template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Templates;
