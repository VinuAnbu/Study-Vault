import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa"; // Import icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      const user = localStorage.getItem("user"); // Ensure user data is properly parsed
      if (user?.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("❌ Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 relative">
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 bg-opacity-40 backdrop-blur-md"></div>

      {/* Login Card */}
      <motion.div
        className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-lg w-96 border border-gray-300 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Title */}
        <h2 className="text-3xl font-semibold text-white text-center mb-6">🚀 Welcome Back!</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md text-center">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex justify-center items-center"
            whileHover={{ scale: 1.02 }}
          >
            🔐 Login
          </motion.button>
        </form>

        {/* Signup Link */}
        <div className="mt-4 text-center text-white">
          <p className="opacity-80">Don't have an account?</p>
          <button onClick={() => navigate("/signup")} className="text-black font-medium hover:underline">
            Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
