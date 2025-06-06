import React, { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import "./AdminProfile.css";
import Profile from "../pages/profile.png"; // Using the same profile image
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const [adminData, setAdminData] = useState({
    firstName: "Raisy",
    lastName: "Cadia",
    email: "RaisyGadia@Gmail.Com",
    countryCode: "+63",
    phoneNumber: "9900112233",
    location: "Lawesbra, Lapasan CDO",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Get admin data from localStorage if available
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (storedAdmin) {
      setAdminData({
        firstName: storedAdmin.firstName || "Raisy",
        lastName: storedAdmin.lastName || "Cadia",
        email: storedAdmin.email || "RaisyGadia@Gmail.Com",
        countryCode: storedAdmin.countryCode || "+63",
        phoneNumber: storedAdmin.phoneNumber || "9900112233",
        location: storedAdmin.location || "Lawesbra, Lapasan CDO",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update admin data in localStorage
    localStorage.setItem("admin", JSON.stringify(adminData));
    alert("Admin profile updated successfully!");
  };

  const handleEditClick = () => {
    document.getElementById("upload-admin-profile").click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected admin profile image:", file);
      // Here you would typically upload the image to a server
      // For now, just log it
    }
  };

  return (
    <div className="admin-profile-content-wrapper">
      <h2 className="ad-title">Admin Profile</h2>

      <header className="admin-profile-header">
        <div className="admin-avatar-container">
          <div className="admin-avatar">
            <img
              src={Profile}
              alt="Admin Profile"
              className="admin-avatar-img"
            />
          </div>
          <button className="admin-edit-badge" onClick={handleEditClick}>
            <PencilIcon className="admin-edit-icon" />
          </button>
          <input
            type="file"
            id="upload-admin-profile"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <div className="admin-user-info">
          <h2>
            {adminData.firstName} {adminData.lastName}
          </h2>
          <p className="admin-username">
            @{adminData.firstName.toLowerCase()}_
            {adminData.lastName.toLowerCase()}
          </p>
          <p className="admin-role">Administrator</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="admin-profile-form">
        <div className="admin-form-grid">
          <div className="admin-form-row admin-form-double">
            <div className="admin-form-field">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={adminData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-field">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={adminData.email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="admin-form-row admin-form-double">
            <div className="admin-form-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={adminData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-field">
              <label htmlFor="phone">Phone Number</label>
              <div className="admin-phone-input">
                <input
                  type="text"
                  name="countryCode"
                  value={adminData.countryCode}
                  onChange={handleChange}
                  className="admin-country-code"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={adminData.phoneNumber}
                  onChange={handleChange}
                  className="admin-phone-number"
                />
              </div>
            </div>
          </div>
          <div className="admin-form-row admin-form-single">
            <div className="admin-form-field">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={adminData.location}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="admin-form-actions">
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
