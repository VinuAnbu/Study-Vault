const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question:      { type: String, required: true },
  options:       [{ type: String, required: true }], // 3 options expected
  correctAnswer: { type: Number, required: true } // index (0,1,2)
});

const QuizSchema = new mongoose.Schema({
  questions: [QuestionSchema],
  resource:  { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true }
});

module.exports = mongoose.model('Quiz', QuizSchema);
