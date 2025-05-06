import React, { useEffect, useState } from "react";
import axios from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { motion } from "framer-motion"; // Import animations
import { FaCheckCircle, FaTimesCircle, FaEye, FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFile } from "react-icons/fa"; // Icons

const TeacherDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [viewingResource, setViewingResource] = useState(null);

  useEffect(() => {
    axios
      .get("/api/teacher/requests")
      .then((res) => {
        console.log("Resource requests:", res.data);
        setRequests(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleApprove = (id) => {
    axios
      .post(`/api/teacher/approve/${id}`)
      .then((res) => {
        toast.success("✅ " + res.data.message, { autoClose: 3000 });
        setRequests((prev) => prev.filter((r) => r._id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleReject = (id) => {
    axios
      .post(`/api/teacher/reject/${id}`)
      .then((res) => {
        toast.error("❌ " + res.data.message, { autoClose: 3000 });
        setRequests((prev) => prev.filter((r) => r._id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleViewResource = (resource) => {
    console.log("Viewing resource:", resource);
    console.log("Author data:", resource.author);
    console.log("Subject data:", resource.subject);
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

  // Function to handle file viewing based on file type
  const handleViewFile = (fileUrl, fileType) => {
    if (!fileUrl) return;
    
    // For Cloudinary URLs, we need to modify them for proper viewing
    if (fileUrl.includes('cloudinary.com')) {
      // For PDF files, use a more direct approach
      if (fileType === 'application/pdf') {
        // Simply add the fl_attachment parameter to the existing URL
        // This preserves the exact URL structure that Cloudinary expects
        const viewerUrl = fileUrl.includes('?') 
          ? `${fileUrl}&fl_attachment=false` 
          : `${fileUrl}?fl_attachment=false`;
        
        window.open(viewerUrl, '_blank');
      } else if (fileType && fileType.startsWith('image/')) {
        // For images, use direct URL
        window.open(fileUrl, '_blank');
      } else {
        // For other file types, use our download function but open in a new tab
        fetch(fileUrl)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
          })
          .catch(error => {
            console.error('Error viewing file:', error);
            toast.error('Error viewing file. Please try downloading instead.');
            // Fall back to direct URL
            window.open(fileUrl, '_blank');
          });
      }
    } else {
      // For non-Cloudinary URLs, try to open directly
      window.open(fileUrl, '_blank');
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
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        toast.error('Error downloading file. Please try again.');
      });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-white p-6">

      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👨‍🏫 Recieved Requests
      </motion.h1>

      <motion.div
        className="max-w-5xl mx-auto bg-white p-6 rounded shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          📋 Pending Resource Requests
        </h2>

        {requests.length === 0 ? (
          <p className="text-2xl font-semibold text-gray-700 mb-4">
            🎉 No pending requests!
          </p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request) => (
              <motion.li
                key={request._id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition"
                whileHover={{ scale: 1.02 }}
              >
                {/* Request Title */}
                <span className="font-semibold text-gray-800">{request.title}</span>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewResource(request)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaEye /> View
                  </button>
                  
                  <button
                    onClick={() => handleApprove(request._id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <FaCheckCircle /> Approve
                  </button>

                  <button
                    onClick={() => handleReject(request._id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <FaTimesCircle /> Reject
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Resource Preview Modal */}
      {viewingResource && (
        <div className="fixed inset-0 bg-blue bg-opacity-40 z-50 flex justify-center items-start pt-20 items-start pt-[220px] px-4">
          <motion.div 
            className="bg-white rounded-lg shadow-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Resource Preview</h2>
              <button 
                onClick={closeResourceModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{viewingResource.title}</h3>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600">Comment:</p>
                  <p className="text-gray-800">
                    {viewingResource.comment || 'No comment provided'}
                  </p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600">Subject:</p>
                  <p className="text-gray-800">
                    {viewingResource.subject && viewingResource.subject.name 
                      ? viewingResource.subject.name 
                      : 'Not specified'}
                  </p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600">File Type:</p>
                  <p className="text-gray-800">
                    {viewingResource.fileType || 'Unknown'}
                  </p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Resource File:</p>
                  {viewingResource.fileUrl ? (
                    <div className="flex items-center space-x-2">
                      {getFileIcon(viewingResource.fileUrl)}
                      <span className="text-gray-700">
                        {viewingResource.fileUrl.split('/').pop() || 'File'}
                      </span>
                      <button 
                        onClick={() => handleDownload(viewingResource.fileUrl, viewingResource.fileType)}
                        className="px-3 py-1 text-sm rounded bg-blue-500 text-white flex items-center gap-1 hover:bg-green-600 transition"
                      >
                        <FaDownload /> Download
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No file attached</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={closeResourceModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TeacherDashboard;
