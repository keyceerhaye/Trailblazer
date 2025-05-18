import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import image from './printer.png';

function Hero() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleUploadClick = () => {
    setShowModal(true);
  };

  const handleServiceClick = (service) => {
    navigate(`/upload/${service}`);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className="hero">
        <div className="content">
          <div className="line1">
            <span className="hero1">ONLY IN</span>
            <span className="hero2"> UTSP</span>
            <div className="line2">
              <span className="hero3">CDO</span>
              <span className="hero4"> CAMPUS!</span>
              <div className="line3">
                <span className="hero5">We produce High-Quality For Printing</span>
                <div className="line4">
                  <span className="hero6">And Layout Services.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Button from second JSX */}
          <div className="btn-container">
            <button className="upload-btn" onClick={handleUploadClick}>
              UPLOAD NOW!
            </button>
          </div>
        </div>

        <div className="image">
          <img src={image} alt="Printer image with circles" />
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-btn" onClick={closeModal}>×</button>
            <h3>CHOOSE A SERVICE</h3>
            <button className="service-btn" onClick={() => handleServiceClick('print')}>PRINT</button>
            <button className="service-btn" onClick={() => handleServiceClick('layout')} navigate>LAYOUT</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Hero;
