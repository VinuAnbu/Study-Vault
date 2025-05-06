import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";
import { FaSignOutAlt, FaChalkboardTeacher, FaBell, FaHome, FaBook, FaUser } from "react-icons/fa";
import axios from "../services/api";
import Notification from "./Notification";
import Logo from "../assets/StudyVaultLogo.png";

const Navbar = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    axios
      .get("/api/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md w-full top-0 z-50">
      {/* Top Section (Logo, Title, Buttons) */}
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={Logo} alt="Study Vault Logo" className="w-10 h-10 " />
          </Link>
      

        {/* Centered Title */}
        <div className="text-white text-2xl font-bold tracking-wider">
          STUDY VAULT
        </div>

        {/* Right Side: Notification, Sign Up, Login */}
        <div className="flex items-center space-x-6">
          {/* Notification Icon */}
          {user && (
            <div className="relative cursor-pointer">
              <Notification />
            </div>
          )}

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Link
                to="/signup"
                className="bg-green-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-600 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="border border-white px-4 py-2 rounded-lg text-white font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-600 transition"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation Menu */}
      {user && (
        <div className="bg-white shadow-lg">
          <div className="container mx-auto flex justify-center space-x-8 py-3">
            <Link
              to="/"
              className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              to="/subject"
              className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              Subjects
            </Link>
            
            <Link
                  to="/create-resources"
                  className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition"
                >
                  Create Resources
                </Link>

                <Link to="/my-resources" className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition">
                  My Resources
                </Link> 

            {user.role === "teacher" && (
              <>
                {/* Teacher-Specific Links */}
                <Link to="/teacher-dashboard" className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition">
                  Student Profiles
                </Link>
                <Link to="/create-subject" className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition">
                  Create Subjects
                </Link>
                <Link to="/recived-request" className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition">
                  Received Requests
                </Link>                                


              </>
            )}

            {/* Profile Link */}
            <Link
              to="/profile"
              className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
