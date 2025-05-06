import { useState } from "react";
import axios from "../services/api";
import { getUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const CreateSubject = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const user = getUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("/api/subjects/createsubject", { name });
      toast.success("✅ Subject created successfully!");
      setSuccess("Subject created successfully!");
      setName("");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error creating subject");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white p-6">
      
      {/* Title */}
      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ✏️ Create a New Subject
      </motion.h1>      
      
      <motion.div
        className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >


        {/* Feedback Messages */}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        {success && <p className="text-green-500 bg-green-100 p-3 rounded-md">{success}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Subject Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Enter subject name..."
              required
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-green-600 transition disabled:opacity-50 justify-center items-center"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
          >
            {loading ? "🚀 Creating..." : "➕ Create Subject"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateSubject;
