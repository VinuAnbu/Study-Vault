import React, { useEffect, useState } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import socket from '../services/socketService';
import axios from '../services/api';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  // Fetch notifications from API on component mount
  useEffect(() => {
    axios
      .get("/api/notifications")
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Listen for real-time notifications via WebSocket
  useEffect(() => {
    socket.on('notification', (data) => {
      const newNotification = { id: Date.now(), message: data.message };
      setNotifications(prev => [...prev, newNotification]);

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  // Dismiss notification manually
  const dismissNotification = (id) => {
    // console.log(id)
    setNotifications(prev => prev.filter(n => n._id !== id));
    axios
    .post("/api/notifications/delete",{Nid:id})
    .then((res) => setNotifications(res.data))
    .catch((err) => console.error(err));

  };

  return (
    <div className=" z-50">
      {/* Notification Bell Icon */}
      <button
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition flex items-center"
        onClick={() => setShowPanel(!showPanel)}
      >
        <FaBell className="text-xl" />
        {notifications.length > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="bg-white shadow-lg rounded-lg w-80 p-4 absolute right-0 mt-2 animate-slide-in">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button
              className="text-gray-500 hover:text-red-500 transition"
              onClick={() => setShowPanel(false)}
            >
              <FaTimes />
            </button>
          </div>

          {/* Notification List */}
          <div className="mt-2 max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-sm text-center">No new notifications</p>
            ) : (
              notifications.map(({ _id, message }) => (
                <div
                  key={_id}
                  className="flex items-center bg-gray-100 text-gray-800 p-3 mb-2 rounded-lg shadow-sm transition-all animate-fade-in"
                >
                  <FaBell className="mr-2 text-blue-600" />
                  <span className="flex-1">{message}</span>
                  <button
                    onClick={() => dismissNotification(_id)}
                    className="ml-2 text-gray-500 hover:text-red-500 transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
