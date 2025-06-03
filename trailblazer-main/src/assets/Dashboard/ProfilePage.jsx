import React, { useState, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import "./ProfilePage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import AppHeader from "../../components/AppHeader/AppHeader"; // Import AppHeader
import Profile from "../pages/profile.png"; // Assuming this is the desired profile picture
import { useNavigate } from "react-router-dom"; // Import useNavigate for logout

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+63",
    phoneNumber: "",
    location: "",
  });
  const [currentDate, setCurrentDate] = useState(""); // For header date
  const navigate = useNavigate(); // For logout
  const user = JSON.parse(localStorage.getItem("user")); // Get user for AppHeader

  useEffect(() => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    setCurrentDate(today.toLocaleDateString("en-US", options));

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUserData({
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        email: storedUser.emailUsername || "",
        phoneNumber: storedUser.phoneNumber || "",
        location: storedUser.location || "",
        countryCode: storedUser.countryCode || "+63",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare user object for update (note: key is emailUsername)
    const updatedUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      emailUsername: userData.email,
      phoneNumber: userData.phoneNumber,
      location: userData.location,
      countryCode: userData.countryCode,
    };

    // Get all users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the existing user in users array by emailUsername
    const userIndex = users.findIndex(
      (u) => u.emailUsername === updatedUser.emailUsername
    );

    if (userIndex !== -1) {
      // Preserve password from existing user
      const existingPassword = users[userIndex].password;

      // Replace the old user data with updatedUser + password
      users[userIndex] = {
        ...updatedUser,
        password: existingPassword,
      };

      // Save back to localStorage
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("user", JSON.stringify(users[userIndex]));
      alert("Profile updated successfully!");
    } else {
      alert("User not found!");
    }
  };

  const handleEditClick = () => {
    document.getElementById("upload-profile").click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected profile image:", file);
    }
  };

  const handleProfileLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="main-content-wrapper">
        <div className="page-header">
          <div className="page-header-title">
            <h2 className="Pp-title">User Profile</h2>
            <p className="date">{currentDate}</p>
          </div>
          <AppHeader
            user={user}
            profilePic={Profile}
            handleLogout={handleProfileLogout}
          />
        </div>

        <main className="main-content">
          <section className="content-wrapper">
            <div className="profile-card">
              <header className="profile-header">
                <div className="avatar-container">
                  <div className="avatar">
                    <img src={Profile} alt="Profile" className="avatar-img" />
                  </div>
                  <button className="edit-badge" onClick={handleEditClick}>
                    <PencilIcon className="edit-icon" />
                  </button>
                  <input
                    type="file"
                    id="upload-profile"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
                <div className="user-info">
                  <h2>
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <p className="username">
                    @{userData.firstName.toLowerCase()}_
                    {userData.lastName.toLowerCase()}
                  </p>
                  <p className="gender">Female</p>
                </div>
              </header>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-grid">
                  <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone">Phone Number</label>
                    <div className="phone-input">
                      <input
                        type="text"
                        name="countryCode"
                        value={userData.countryCode}
                        onChange={handleChange}
                        className="country-code"
                      />
                      <input
                        type="text"
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={handleChange}
                        className="phone-number"
                      />
                    </div>
                  </div>
                  <div className="loc">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={userData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
