import React from "react";
import "./ContactForm.css";
import { MapPin, Mail, Phone } from "lucide-react";

const ContactForm = () => {
  return (
    <div className="contact-section">
      <h1 className="contact-heading">CONTACT US</h1>

      <div className="contact-container">
        <div className="contact-form">
          <h2>Send us a message</h2>
          <form>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="email">Name</label>
                <input
                  type="email"
                  id="email"
                  className="input-email"
                />
              </div>
              <div className="form-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  className="input-phone"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="name">Email</label>
              <input
                type="text"
                id="name"
                className="input-name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                className="input-message"
                rows="4"
              />
            </div>

            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>

        <div className="contact-info-box">
          <div className="info-header">
            <h3>Get In Touch</h3>
            <p className="contact-subtext">
              Hi! We are always here to <br /> help you.
            </p>
          </div>

          <div className="info-card">
            <MapPin className="pin-icon" size={90} />
            <div>
              <p className="info-label">Address:</p>
              <p>
                USTP - CDO Campus: Claro M. Recto Avenue, Lapasan, Cagayan de Oro City 9000
              </p>
            </div>
          </div>

          <div className="phone-card">
            <Phone className="info-icon" />
            <div>
              <p className="info-label">Call Us:</p>
              <p>+639483757069</p>
            </div>
          </div>

          <div className="mail-card">
            <Mail className="info-icon" />
            <div>
              <p className="info-label">Email Us:</p>
              <p>supporttpl@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
