import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const CreateResources = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    comment: "",
    subject: "",
    shareRequest: false,
    file: null,
    createQuiz: false,
    questions: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("/api/subjects/getallsub");
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to load subjects.");
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB.");
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index].question = value;
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].correctAnswer = parseInt(value, 10);
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { question: "", options: ["", "", "", ""], correctAnswer: "" }],
    }));
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      toast.error("Please select a PDF file.");
      return;
    }
    const data = new FormData();
    data.append("title", formData.title);
    data.append("comment", formData.comment);
    data.append("subject", formData.subject);
    data.append("shareRequest", formData.shareRequest);
    data.append("createQuiz", formData.createQuiz);
    data.append("file", formData.file);

    if (formData.createQuiz) {
      data.append("questions", JSON.stringify(formData.questions));
    }

    try {
      const res = await axios.post("/api/resources/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      if (formData.shareRequest) {
        toast.success("A request has been sent for approval.");
      } else {
        toast.success("Resouce Created.");
      }
      navigate("/");
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1
          className="text-4xl font-extrabold text-center text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📤 Create a Resource
        </motion.h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <input
            type="text"
            name="title"
            placeholder="Resource Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <textarea
            name="comment"
            placeholder="Comment"
            value={formData.comment}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <select
            name="subject"
            required
            className="w-full p-2 mb-4 border rounded"
            onChange={handleChange}
            value={formData.subject}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>

          <div className="mb-4 flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="shareRequest"
                checked={formData.shareRequest}
                onChange={handleChange}
              />
              Request to Share
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="createQuiz"
                checked={formData.createQuiz}
                onChange={handleChange}
              />
              Create Quiz
            </label>
          </div>

          {formData.createQuiz && (
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Add Quiz Questions</h3>
              {formData.questions.map((q, index) => (
                <div key={index} className="mb-4 border p-4 rounded">
                  <input
                    type="text"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  {q.options.map((opt, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                    />
                  ))}
                  <select
                    value={q.correctAnswer}
                    onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Correct Answer</option>
                    {q.options.map((opt, oIndex) => (
                      <option key={oIndex} value={oIndex}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    ✖ Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-500 text-white p-2 rounded"
              >
                + Add Question
              </button>
            </div>
          )}

          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="mb-4"
            required
            accept="application/pdf"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-green-600 transition disabled:opacity-50"
          >
            Create Resource
          </button>
        </form>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default CreateResources;
