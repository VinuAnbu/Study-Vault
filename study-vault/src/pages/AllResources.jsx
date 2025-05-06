import React, { useState, useEffect } from "react";
import axios from "../services/api";
import QuizModal from "../components/QuizModal";
import { useLocation } from "react-router-dom";
import {FaHeart, FaFileDownload, FaSearch, FaRegHeart } from "react-icons/fa"; // Import icons
import { getUser } from "../services/authService"; // Fetch user data
import { motion } from "framer-motion"; // Import Framer Motion for animations

const AllResources = () => {
  const { state } = useLocation();
  const subjectName = state?.subjectname || "";
  

  const user = getUser();
  const [groupedResources, setGroupedResources] = useState([]);
  const [quizResource, setQuizResource] = useState(null);
  const [search, setSearch] = useState("");
  const [userdata, setUserData] = useState();

  useEffect(() => {
    axios.get(`/api/auth/user/${user._id}`)
      .then((res) => setUserData(res.data.user))
      .catch((err) => console.error(err));
  }, [user]);

  useEffect(() => {
    // Fetch grouped resources
    axios
      .get("/api/resources/grouped")
      .then((res) => {
       console.log(res.data)
        setGroupedResources(res.data)})
      .catch((err) => console.error("Error fetching grouped resources:", err));
  }, []);

  // Function to toggle liked subject
  const toggleLikeSubject = (resource) => {
    axios.post(`/api/auth/addtofav`, { userid: user._id, RId: resource._id })
      .then((res) => {
        // Update the userdata with the updated user from the response
        if (res.data.user) {
          setUserData(res.data.user);
        } else {
          // If user is not returned, fetch the updated user data
          axios.get(`/api/auth/user/${user._id}`)
            .then((userRes) => setUserData(userRes.data.user))
            .catch((err) => console.error("Error fetching updated user data:", err));
        }
        
        // Update the resource likes count in the UI
        setGroupedResources(prevResources => 
          prevResources.map(item => 
            item._id === resource._id 
              ? { ...item, likes: res.data.likes } 
              : item
          )
        );
      })
      .catch((err) => console.error("Error updating liked subjects:", err));
  };

  // Filter resources based on subject name ansd search input
  const filteredResources = groupedResources.filter(
    (resource) =>
      String(resource.subject?.name || "").toLowerCase() === subjectName.toLowerCase() &&
      resource.title.toLowerCase().includes(search.toLowerCase())&&
      resource.private===false

  );

  const handleDownload = (url, filename = 'resource') => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  


  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-4xl font-extrabold text-center text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📚 {subjectName} Resources
        </motion.h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none pl-10"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <motion.div
                key={resource._id}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Like Subject Button (Heart Icon) */}
                <button
                  className="absolute top-3 right-3 text-red-500 mr-2 text-2xl focus:outline-none transition-transform transform hover:scale-110 flex items-center"
                  onClick={() => toggleLikeSubject(resource)}
                >
                  {userdata?.liked?.some((item) => item._id === resource._id) ? <FaHeart /> : <FaRegHeart />}
                  <span className="ml-1 text-sm font-medium">{resource.likes || 0}</span>
                </button>

                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-3">{resource.comment}</p>

                {resource.author && (
                  <p className="text-sm text-gray-500 mb-2">
                    ✍️ Author: {resource?.author.username}
                  </p>
                )}

                <button
                    onClick={() => handleDownload(resource.fileUrl, resource.title)}
                    className="px-3 py-1 text-sm rounded bg-blue-500 text-white flex items-center gap-2 hover:bg-green-600 transition mt-3"
                    aria-label={`Download ${resource.title}`}
                >
                  <FaFileDownload /> Download
                </button>

                {resource.quiz && (
                  <motion.button
                    className="mt-3 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all flex justify-center items-center"
                    onClick={() => setQuizResource(resource)}
                    whileHover={{ scale: 1.02 }}
                  >
                    🧠 Quiz Available
                  </motion.button>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              No resources available for this subject. 📭
            </p>
          )}
        </div>

        {/* Quiz Modal */}
        {quizResource && (
          <QuizModal
            id={quizResource._id}
            resource={quizResource.quiz}
            onClose={() => setQuizResource(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AllResources;
