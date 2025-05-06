import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserGraduate } from "react-icons/fa"; // Import icons

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup({ username, email, password, role });
      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("❌ Sign up failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gradient-to-r from-blue-100 to-indigo-100 relative">
      
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-lg"></div>

      {/* Signup Card */}
      <motion.div
        className="bg-white bg-opacity-30 backdrop-blur-xl p-8 rounded-lg shadow-lg w-96 border border-gray-300 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Title */}
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          🚀 Create an Account
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-center">{error}</p>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              required
            />
          </div>

          <div className="text-sm text-gray-500 mt-2">
            <p> - Minimum 5 characters</p>
            <p> - Must include a number</p>
          </div>

          <div className="relative">
            <FaUserGraduate className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-600" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-teal-600 text-white p-3 rounded-lg font-semibold hover:bg-teal-700 transition-all flex justify-center items-center"
            whileHover={{ scale: 1.02 }}
          >
            ✨ Sign Up
          </motion.button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center text-white">
          <p className="opacity-80">Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            className="text-black cursor-pointer font-medium hover:underline"
          >
            Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
