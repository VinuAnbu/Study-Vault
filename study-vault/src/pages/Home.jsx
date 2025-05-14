import React, { useEffect, useState } from "react";
import axios from "../services/api"; 
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Notification from "../components/Notification";
import { FaTrophy, FaDownload, FaHeart, FaTrashAlt, FaBell } from "react-icons/fa"; // Icons
import { getUser } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Home = () => {
  const user = getUser();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    xp: 0,
    liked: [],
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [favouriteSubjects, setfavouriteSubjects] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data
    axios
      .get("/api/leaderboard")
      .then((res) => setLeaderboard(res.data))
      .catch((err) => console.error(err));

    // Fetch subjects for favourites 
    axios
      .get("/api/subjects/getallsub")
      .then((res) => setfavouriteSubjects(res.data))
      .catch((err) => console.error(err));

    // Fetch notifications
    axios
      .get("/api/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get(`/api/auth/user/${user._id}`)
      .then((res) => setProfile(res.data.user))
      .catch((err) => console.error(err));
  }, [user._id]);

  const removeFromfavourites = (resourceId) => {
    axios
      .post(`/api/auth/removefromfav`, {
        userid: user._id,
        RId: resourceId,
      })
      .then(() => {
        // Correctly update the state by filtering out the removed resource
        setProfile((prevProfile) => ({
          ...prevProfile,
          liked: prevProfile.liked.filter((resource) => resource._id !== resourceId),
        }));
        toast.success("Removed from favourites!", { autoClose: 3000 });
      })
      .catch((err) => {
        console.error("Error removing from favourites:", err);
        toast.error("Failed to remove resource.");
      });
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white">

      {/* Dashboard Title */}
      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🚀 Welcome to Your Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Leaderboard Section */}
        <motion.section
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
            <FaTrophy className="text-yellow-500" /> <span>Leaderboard</span>
          </h2>
          <ul>
            {leaderboard.slice(0, 3).map((user, index) => (
              <li
                key={user._id}
                className="flex justify-between items-center border-b py-3 px-4 rounded-md hover:bg-gray-100 transition"
              >
                <span className="font-semibold flex items-center space-x-3">
                  <span className="text-gray-600">{index + 1}.</span>
                  {user.username}
                </span>
                <span className="text-blue-500 font-bold">{user.xp} XP</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* favourite Resources Section */}
        <motion.section
          className="bg-white rounded-lg shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-semibold mb-4"> 📚 Favourite Resources</h2>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <FaHeart className="text-red-500 mr-2" /> Liked Resources
            </h2>
            {profile?.liked?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.liked.map((resource) => (
                  <motion.div
                    key={resource._id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 border border-gray-200 relative"
                    whileHover={{ scale: 1.05 }}
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
              <p className="text-gray-500 text-sm">No liked resources yet.</p>
            )}
          </div>
        </motion.section>
      </div>

      {/* Notifications Section */}
      {<motion.section
        className="bg-white rounded-lg shadow-lg p-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
          <FaBell className="text-green-500" /> <span>Your Notifications</span>
        </h2>
        <ul>
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <li
                key={note._id}
                className="border-b py-3 px-4 rounded-md hover:bg-gray-100 transition"
              >
                {note.message}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No new notifications 🎉</p>
          )}
        </ul>
      </motion.section>}
    </div>
  );
};

export default Home;
