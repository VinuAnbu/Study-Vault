// backend/routes/leaderboard.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/leaderboard
// Returns top users sorted by XP descending
router.get('/', async (req, res) => {
  try {
    //Limit to top 10
    const topUsers = await User.find({role:'student'}).sort({ xp: -1 }).limit(10);
    res.json(topUsers);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard', error });
  }
});

module.exports = router;
