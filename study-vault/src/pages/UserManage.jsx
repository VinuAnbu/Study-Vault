import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { FaTrash, FaEye } from "react-icons/fa"; // Icons
import { motion } from "framer-motion"; // Animation
import { useNavigate } from "react-router-dom";

const UserManage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentResources, setStudentResources] = useState([]);
  const [showResources, setShowResources] = useState(false);
  const navigate=useNavigate()

  // Fetch all students
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/auth/getStudents") // API to fetch students
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setLoading(false);
      });
  }, []);

  // Fetch a student's resources
  const fetchStudentResources = (studentId) => {
    axios
      .post("/api/auth/getByUser", { userId: studentId })
      .then((res) => {
        setStudentResources(res.data);
        setShowResources(true);
      })
      .catch((err) => console.error("Error fetching resources:", err));
  };

  // Delete a student
  const handleDeleteStudent = (studentId) => {
    
      axios
        .post("/api/auth/deleteuser", { userId: studentId }) // API for deleting a student
        .then(() => {
          setStudents(students.filter((student) => student._id !== studentId));
          setShowResources(false);
        })
        .catch((err) => console.error("Error deleting student:", err));
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white p-6">
      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👨‍🏫 Student Profiles
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-center text-gray-500">No students found.</p>
      ) : (
        <motion.div
          className="bg-white shadow-lg rounded-lg overflow-hidden  max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-4 text-left">Student Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">XP</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{student.username}</td>
                  <td className="p-4 text-gray-600">{student.email}</td>
                  <td className="p-4 font-bold text-blue-500">{student.xp}</td>
                  <td className="p-4 flex gap-3">
                  <button
                  onClick={() => navigate(`/student/${student._id}`)}
                  className="px-3 py-1 text-sm rounded bg-blue-500 text-white flex items-center gap-1 hover:bg-green-600 transition"
                >
                  <FaEye /> View Profile
                </button>

                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Student Resources Modal */}
      {showResources && (
        <motion.div
          className="mt-10 max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📚 {selectedStudent?.username}'s Created Resources
            </h2>
            <ul className="space-y-2">
              {studentResources.length > 0 ? (
                studentResources.map((resource) => (
                  <li
                    key={resource._id}
                    className="bg-gray-100 p-3 rounded-md shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-sm text-gray-600">{resource.subject}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No resources found.</p>
              )}
            </ul>
            <button
              onClick={() => setShowResources(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserManage;
