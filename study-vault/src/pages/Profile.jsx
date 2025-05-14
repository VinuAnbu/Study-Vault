import React, { useState, useEffect } from "react";
import { getUser, logout } from "../services/authService";
import axios from "../services/api";
import { motion } from "framer-motion";
import { FaUserCircle, FaDownload, FaHeart, FaTrashAlt, FaEdit, FaSignOutAlt, FaBook, FaQuestionCircle, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    xp: 0,
    liked: [],
  });
  const [stats, setStats] = useState({
    resourcesShared: 0,
    quizzesCompleted: 0,
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Fetch user profile
    axios
      .get(`/api/auth/user/${user._id}`)
      .then((res) => {
        setProfile(res.data.user);
        setNewUsername(res.data.user.username);
      })
      .catch((err) => console.error("Error fetching profile:", err));

    // Fetch user stats
    axios
      .get(`/api/auth/user-stats/${user._id}`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching user stats:", err));
  }, [user._id]);

  // Remove from favourites Function
  const removeFromfavourites = (resourceId) => {
    axios
      .post(`/api/auth/removefromfav`, {
        userid: user._id,
        RId: resourceId,
      })
      .then(() => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          liked: prevProfile.liked.filter((resource) => resource._id !== resourceId),
        }));
        toast.success("Removed from favourites!");
      })
      .catch((err) => {
        console.error("Error removing from favourites:", err);
        toast.error("Failed to remove resource.");
      });
  };

  // Update username
  const handleUpdateUsername = () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    axios
      .put("/api/auth/update-profile", {
        userId: user._id,
        username: newUsername,
      })
      .then((res) => {
        setProfile((prev) => ({ ...prev, username: newUsername }));
        toast.success("Username updated successfully!");
        setIsEditingUsername(false);
      })
      .catch((err) => {
        console.error("Error updating username:", err);
        toast.error(err.response?.data?.message || "Failed to update username");
      });
  };

  // Update password
  const handleUpdatePassword = () => {
    // Validate password
    if (passwordData.newPassword.length < 5 || !/\d/.test(passwordData.newPassword)) {
      toast.error("New password must be at least 5 characters and include a number");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    axios
      .put("/api/auth/update-password", {
        userId: user._id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      .then((res) => {
        toast.success("Password updated successfully!");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((err) => {
        console.error("Error updating password:", err);
        toast.error(err.response?.data?.message || "Failed to update password");
      });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="bg-white shadow-xl rounded-lg overflow-hidden mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <FaUserCircle className="text-white text-8xl" />
              </div>
              <div className="md:ml-6 text-center md:text-left">
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                <p className="text-blue-100">{profile.email}</p>
                <p className="mt-2 text-blue-100">Role: {profile.role && profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</p>
              </div>
              <div className="md:ml-auto mt-4 md:mt-0">
                <div className="bg-white text-blue-700 px-4 py-2 rounded-lg font-bold shadow-md">
                  ⭐ XP: {profile.xp}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Profile Management Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Management</h2>
              
              {/* Username Update */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Username</h3>
                    {!isEditingUsername && <p className="text-gray-600">{profile.username}</p>}
                  </div>
                  {!isEditingUsername ? (
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  ) : (
                    <div className="flex">
                      <button
                        onClick={() => setIsEditingUsername(false)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateUsername}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
                {isEditingUsername && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter new username"
                    />
                  </div>
                )}
              </div>

              {/* Password Update */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Password</h3>
                    <p className="text-gray-600">••••••••</p>
                  </div>
                  {!isChangingPassword ? (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition flex items-center"
                    >
                      <FaLock className="mr-1" /> Change
                    </button>
                  ) : (
                    <div className="flex">
                      <button
                        onClick={() => setIsChangingPassword(false)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdatePassword}
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
                {isChangingPassword && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      placeholder="Current password"
                    />
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      placeholder="New password (min 5 chars with a number)"
                    />
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                      placeholder="Confirm new password"
                    />
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition flex items-center justify-center"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>

            {/* Activity and Stats */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity & Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm border border-blue-100">
                  <div className="flex items-center">
                    <div className="bg-blue-500 p-3 rounded-full text-white mr-4">
                      <FaUserCircle className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Total XP</h3>
                      <p className="text-2xl font-bold text-blue-600">{profile.xp}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="flex items-center">
                    <div className="bg-green-500 p-3 rounded-full text-white mr-4">
                      <FaBook className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Resources Shared</h3>
                      <p className="text-2xl font-bold text-green-600">{stats.resourcesShared}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg shadow-sm border border-purple-100">
                  <div className="flex items-center">
                    <div className="bg-purple-500 p-3 rounded-full text-white mr-4">
                      <FaQuestionCircle className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Quizzes Completed</h3>
                      <p className="text-2xl font-bold text-purple-600">{stats.quizzesCompleted}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Liked Resources Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FaHeart className="text-red-500 mr-2" /> Favourite Resources
              </h2>
              {profile?.liked?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.liked.map((resource) => (
                    <motion.div
                      key={resource._id}
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform border border-gray-200 relative"
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Remove from favourites Button */}
                      <button
                        onClick={() => removeFromfavourites(resource._id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                        title="Remove from favourites"
                      >
                        <FaTrashAlt />
                      </button>

                      <h3 className="text-lg font-semibold text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{resource.comment}</p>



                      <a
                        href={resource.fileUrl}
                        download
                        className="mt-3 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <FaDownload className="mr-2" /> Download Resource
                      </a>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
                  No favourited resources yet. Browse resources and star the ones you like!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
