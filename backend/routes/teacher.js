const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const Notification = require('../models/Notification');
const { protect, teacherOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get pending resource requests for teacher review
router.get('/requests', protect, teacherOnly, async (req, res) => {
  try {
    const pendingResources = await Resource.find({ approved: false })
      .populate('author', 'username email')
      .populate('subject', 'name');
    res.json(pendingResources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
});

// Approve resource, award 5 XP to author, send notification
router.post('/approve/:resourceId', protect, teacherOnly, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if(!resource) return res.status(404).json({ message: 'Resource not found' });
    resource.approved = true;
    await resource.save();
    const user = await User.findById(resource.author);
    user.xp += 5;
    await user.save();
    await Notification.create({
      user: user._id,
      message: `Your resource "${resource.title}" has been approved. You earned 5 XP points!`
    });
    res.json({ message: 'Resource Approved' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving resource', error });
  }
});

// Reject resource and notify student
router.post('/reject/:resourceId', protect, teacherOnly, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);

    
    if(!resource) return res.status(404).json({ message: 'Resource not found' });
    const result=await resource.deleteOne()
    await Notification.create({
      user: resource.author,
      message: `Your resource "${resource.title}" has been rejected.`
    });
    

    res.json({ message: 'Resource rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting resource', error });
  }
});

module.exports = router;
