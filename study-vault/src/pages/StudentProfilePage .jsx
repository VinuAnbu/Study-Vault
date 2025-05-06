import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";
import { FaArrowLeft } from "react-icons/fa"; // Back button icon
import { motion } from "framer-motion"; // Animation

const StudentProfilePage = () => {
  const { studentId } = useParams(); // Get student ID from URL
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Fetch Student Data
    axios
      .get(`/api/auth/getStudent/${studentId}`)
      .then((res) => {
        setStudent(res.data);
      })
      .catch((err) => console.error("Error fetching student:", err));

    // Fetch Student's Created Resources
    axios
      .post("/api/auth/getByUser", { userId: studentId })
      .then((res) => {
        // console.log(res.data)
        setResources(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching resources:", err);
        setLoading(false);
      });
  }, [studentId]);

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <motion.div
        className="bg-white shadow-lg rounded-lg p-6 border "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/teacher-dashboard")}
          className="text-blue-600 flex items-center mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>

        {/* Student Info */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          👨‍🎓 {student?.username}'s Profile
        </h1>
        <p className="text-lg text-gray-700">
          📧 Email: <span className="font-semibold">{student?.email}</span>
        </p>
        <p className="text-lg text-gray-700">
          🎓 Role: <span className="font-semibold">{student?.role}</span>
        </p>
        <p className="text-lg text-blue-600 font-bold">
          ⭐ XP: {student?.xp}
        </p>

        {/* Resources Section */}
        <h2 className="text-2xl font-bold text-gray-900 mt-6">📂 Created Resources</h2>

        {loading ? (
          <p className="text-gray-600">Loading resources...</p>
        ) : resources?.length === 0 ? (
          <p className="text-gray-500">No resources created yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {resources?.map((resource) => (
              <li
                key={resource?._id}
                className="bg-gray-100 p-4 rounded-md shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold">{resource?.title}</h3>
                <p className="text-gray-600">Subject: {resource.subject?.name || ""}</p>
                <a
                  href={resource?.fileUrl}
                  download
                  target="blank"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  📥 Download Resource
                </a>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default StudentProfilePage;
