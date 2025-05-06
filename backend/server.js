require('dotenv').config();
const subject = require('./routes/subject');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const leaderboardRoutes = require('./routes/leaderboard');
const notificationRoutes = require('./routes/notification');

const app = express();
connectDB();

// Middleware
app.use(express.json());

// Updated CORS setup
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resource'));
app.use('/api/subjects', subject);
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Create HTTP server and Socket.io instance
const server = http.createServer(app);

// Updated Socket.IO CORS setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io connection for real-time notifications
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// Example function to send a notification
const sendNotification = (userId, message) => {
  io.to(userId).emit('notification', { message });
};

// Export the app for testing
module.exports = app;

// Start the server, but only if running server.js directly
if (require.main === module) {
  server.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000');
  });
}
