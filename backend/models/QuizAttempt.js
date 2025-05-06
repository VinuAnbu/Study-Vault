const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  dateAttempted: { type: Date, default: Date.now },
  score: { type: Number, required: true },  // Store score for the attempt if needed
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
