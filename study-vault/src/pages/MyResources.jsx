import { useState, useEffect, useCallback } from "react";
import axios from "../services/api";
import { FaTrash, FaLock, FaLockOpen, FaEye, FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFile } from "react-icons/fa";
import { getUser } from "../services/authService";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Track errors
  const [viewingResource, setViewingResource] = useState(null);
  const user = getUser();

  useEffect(() => {
    
    if (!user) {
      setError("User not found. Please log in again.");
      return;
    }

    setLoading(true);
    axios
      .post("/api/resources/myresources", { userid: user._id })
      .then((response) => {
        setResources(response.data);
        setError(""); // Clear errors if successful
      })
      .catch((err) => {
        console.error("Error fetching created resources:", err);
        setError("Failed to load resources. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = useCallback((resourceId) => {
    setLoading(true);
    

    axios
      .post(`/api/auth/delete`, { RID: resourceId })
      .then(() => {
        setResources((prev) => prev.filter((resource) => resource._id !== resourceId));
      })
      .catch((err) => {
        console.error("Error deleting resource:", err);
        setError("Failed to delete resource.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleTogglePrivacy = useCallback((resourceId, currentStatus) => {
    setLoading(true);
    axios
      .post(`/api/resources/togglePrivacy`, { RID: resourceId, isPrivate: !currentStatus })
      .then((response) => {
        setResources((prev) =>
          prev.map((resource) =>
            resource._id === resourceId ? { ...resource, private: !currentStatus } : resource
          )
        );
        setError("");
      })
      .catch((err) => {
        console.error("Error updating privacy status:", err);
        setError("This file has not been approved by a teacher, therefore can not be made public ");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleViewResource = (resource) => {
    console.log("Viewing resource:", resource);
    setViewingResource(resource);
  };

  const closeResourceModal = () => {
    setViewingResource(null);
  };

  // Function to determine file icon based on file type
  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return <FaFile />;
    
    const extension = fileUrl.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;

      default:
        return <FaFile className="text-gray-500" />;
    }
  };

  // Function to handle file download with proper extension
  const handleDownload = (fileUrl, fileType) => {
    if (!fileUrl) return;
    
    // Get a suitable filename with extension
    let filename = fileUrl.split('/').pop() || 'download';
    
    // Add appropriate extension based on fileType if missing
    if (fileType && !filename.includes('.')) {
      switch (fileType) {
        case 'application/pdf':
          filename += '.pdf';
          break;
        default:
          // Try to extract extension from MIME type
          const ext = fileType.split('/')[1];
          if (ext && ext !== 'octet-stream') {
            filename += '.' + ext;
          }
      }
    }
    
    // Create a temporary anchor element to trigger the download
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Download started successfully!");
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        toast.error('Error downloading file. Please try again.');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white p-6">
      <motion.h2
        className="text-4xl font-extrabold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📂 My Resources
      </motion.h2>

      {error && <p className="text-center text-red-500">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : resources.length === 0 ? (
        <p className="text-center text-gray-500">You haven't created any resources yet.</p>
      ) : (
        <motion.div
          className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-300 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Privacy</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{resource?.title}</td>
                  <td className="p-4 text-gray-600">{resource?.subject?.name}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        resource?.private ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                      }`}
                    >
                      {resource?.private ? "Private" : "Public"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    {/* Download Resource Button */}
                    <button
                      onClick={() => handleDownload(resource.fileUrl, resource.fileType)}
                      className="px-3 py-1 text-sm rounded bg-blue-500 text-white flex items-center gap-1 hover:bg-green-600 transition"
                      aria-label={`Download ${resource.title}`}
                    >
                      <FaDownload /> Download
                    </button>
                   
                    {/* Privacy Toggle Button */}
                    <button
                      onClick={() => handleTogglePrivacy(resource._id, resource.private)}
                      className="px-3 py-1 text-sm rounded bg-indigo-900 text-white flex items-center gap-1 hover:bg-indigo-600 transition disabled:opacity-50"
                      disabled={loading}
                      aria-label={`Toggle privacy for ${resource.title}`}
                    >
                      {resource.private ? (
                        <>
                          <FaLockOpen /> Make Public
                        </>
                      ) : (
                        <>
                          <FaLock /> Make Private
                        </>
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(resource._id)}
                      className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                      disabled={loading}
                      aria-label={`Delete ${resource.title}`}
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

      <ToastContainer />
    </div>
  );
};

export default MyResources;
