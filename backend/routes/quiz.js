const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt'); // Import the QuizAttempt model
const { protect } = require('../middleware/authMiddleware');

// POST /api/quiz/:resourceId/submit
// Expects { answers: [ ... ] } in the request body (an array of selected option indexes).
router.post('/:resourceId/submit', protect, async (req, res) => {
  const { answers } = req.body;

  try {
    // Find the resource and populate its quiz
    const resource = await Resource.findById(req.params.resourceId).populate('quiz');
    if (!resource || !resource.quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quiz = resource.quiz;
    let score = 0;
    // Array to hold correctness info for each question
    const correctness = [];

    console.log('Quiz questions:', JSON.stringify(quiz.questions, null, 2));
    console.log('User answers:', JSON.stringify(answers, null, 2));

    quiz.questions.forEach((q, index) => {
      // Compare user's selected answer with the correct answer
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correctAnswer;

      console.log(`Question ${index}: User answer=${userAnswer}, Correct answer=${q.correctAnswer}, isCorrect=${isCorrect}`);

      if (isCorrect) score++;

      correctness.push({
        questionIndex: index,
        correct: isCorrect,
        correctAnswerIndex: q.correctAnswer,
        selectedAnswerIndex: userAnswer
      });
    });


    // Award 3 XP points to the user upon quiz completion
    const xpAward = score > (quiz.questions.length / 2) ? 3 : 0;
    req.user.xp += xpAward;
    await req.user.save();

    // Save quiz attempt to the database
    const quizAttempt = new QuizAttempt({
      user: req.user._id,
      quiz: quiz._id,
      score,
    });
    await quizAttempt.save();

    res.json({
      message: 'Quiz submitted',
      score,
      correctness,
      xpAward, // Send the awarded XP back in the response
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Error submitting quiz', error });
  }
});

// POST /api/quiz/:resourceId/create
// Create quiz for a specific resource
router.post('/:resourceId/create', protect, async (req, res) => {
  const { questions } = req.body; // Expected to be an array of questions

  try {
    // Find the resource and create a quiz
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    // Create a new quiz and link it to the resource
    const quiz = await Quiz.create({ questions, resource: resource._id });
    resource.quiz = quiz._id;
    await resource.save();

    res.json({ message: 'Quiz created', quiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Error creating quiz', error });
  }
});

module.exports = router;
