const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// GET /api/notifications
// Returns notifications for the current user, newest first
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error });
  }
});
router.post('/delete', protect, async (req, res) => {
  const {Nid}=req.body
  console.log(Nid)
  try {
    const notifications = await Notification.findByIdAndDelete(Nid)
    
    
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error });
  }
});
module.exports = router;
