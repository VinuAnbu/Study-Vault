import axios from "../services/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch subjects from API
    axios
      .get("/api/subjects/getallsub")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white">

      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📚 Explore Subjects
      </motion.h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search subjects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded mb-8 w-full max-w-2xl mx-auto block"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filteredSubjects.map((subject, index) => (
          <motion.div
            key={subject._id}
            onClick={() =>
              navigate("/subjects", {
                state: {
                  subjectname: subject.name,
                },
              })
            }
            className="relative bg-white bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Dynamic Background Image */}
            <div
              className="h-48 bg-cover bg-center"
              style={{
                backgroundImage: `url(https://source.unsplash.com/400x300/?${subject.name})`,
              }}
            ></div>

            {/* Subject Info */}
            <div className="p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-900">{subject.name}</h2>
            </div>

            {/* Teacher Info */}
            <div className="p-2 text-left bg-gray-100 rounded-b-lg">
              <h2 className="text-sm font-semibold text-gray-700">
                👨‍🏫 Created by {subject.teacher?.username || "Unknown"}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Subjects;
