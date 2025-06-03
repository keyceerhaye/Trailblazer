import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./AppHeader.css";
import {
  LogOut,
  Phone,
  Info,
  Settings,
  Home,
  User as UserIcon,
} from "lucide-react"; // Added UserIcon for profile
import defaultProfilePic from "../../assets/pages/profile.png"; // Default profile picture

const AppHeader = ({
  user,
  profilePic: propProfilePic,
  handleLogout: propHandleLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const effectiveUserProfilePic = propProfilePic || defaultProfilePic;
  const currentUser = user || JSON.parse(localStorage.getItem("user")); // Ensure user is available

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    if (propHandleLogout) {
      propHandleLogout();
    } else {
      localStorage.clear();
      navigate("/");
    }
    setIsDropdownOpen(false);
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/orderhistory":
        return "Order History";
      case "/profile":
        return "User Profile";
      // Add other routes here
      default:
        return "Trailblazer"; // Fallback title
    }
  };

  return (
    <header className="app-header">
      <div className="app-header-title-section">
        <h2 className="app-header-title">{getPageTitle()}</h2>
        {location.pathname === "/dashboard" && (
          <p className="app-header-date">{formattedDate}</p>
        )}
      </div>

      {currentUser && (
        <div
          className={`app-user-profile-box ${isDropdownOpen ? "active" : ""}`}
          onClick={toggleDropdown}
          ref={dropdownRef} // Attach ref here to handle click outside for the whole box + dropdown
        >
          <img
            src={effectiveUserProfilePic}
            alt="Profile"
            className="app-profile-img-main"
          />
          <div className="app-user-details">
            <div className="app-user-name-header">{currentUser?.firstName}</div>
            <div className="app-user-name-header">{currentUser?.lastName}</div>
          </div>
          <div
            className={`app-dropdown-icon-header ${
              isDropdownOpen ? "rotate" : ""
            }`}
          >
            ⌄
          </div>
          {isDropdownOpen && (
            <div className="app-profile-dropdown">
              {" "}
              {/* Removed ref from here, already on parent */}
              <div
                className="app-dropdown-header-section"
                onClick={(e) => {
                  e.stopPropagation();
                  // Optional: navigate to profile on header click, then close dropdown
                  // navigate('/profile');
                  // setIsDropdownOpen(false);
                }}
              >
                <img
                  src={effectiveUserProfilePic}
                  alt="Avatar"
                  className="app-dropdown-avatar-img"
                />
                <div className="app-dropdown-user-details">
                  <div className="app-dropdown-user-name">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </div>
                  {/* <div className="app-dropdown-user-email">{currentUser?.email}</div> */}
                </div>
              </div>
              <hr className="app-dropdown-divider" />
              <Link
                to="/dashboard"
                className="app-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Home className="app-dropdown-lucide-icon" />
                Dashboard
              </Link>
              {location.pathname !== "/profile" && (
                <Link
                  to="/profile"
                  className="app-dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserIcon className="app-dropdown-lucide-icon" />
                  Profile
                </Link>
              )}
              <Link
                to="/#service"
                className="app-dropdown-item"
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    const serviceSection = document.getElementById("service");
                    serviceSection?.scrollIntoView({ behavior: "smooth" });
                  }, 0);
                  setIsDropdownOpen(false);
                }}
              >
                <Settings className="app-dropdown-lucide-icon" />
                Services
              </Link>
              <Link
                to="/contact"
                className="app-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Phone className="app-dropdown-lucide-icon" />
                Contact Us
              </Link>
              <Link
                to="/aboutus"
                className="app-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Info className="app-dropdown-lucide-icon" />
                About Us
              </Link>
              <hr className="app-dropdown-divider" />
              <div
                className="app-dropdown-item logout-item"
                onClick={handleLogout}
              >
                <LogOut className="app-dropdown-lucide-icon" />
                Log Out
              </div>
              <div className="app-dropdown-footer">
                <Link
                  className="app-footer-link"
                  to="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Terms & Conditions
                </Link>
                <Link
                  className="app-footer-link"
                  to="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default AppHeader;
