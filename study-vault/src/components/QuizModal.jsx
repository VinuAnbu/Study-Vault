import React, { useState } from 'react';
import axios from '../services/api';
import { ToastContainer, toast } from 'react-toastify';

const QuizModal = ({ id, resource, onClose }) => {
  const quiz = resource; // The quiz object with "questions" array
  const [answers, setAnswers] = useState(
    Array(quiz?.questions?.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctness, setCorrectness] = useState([]);

  // Handle user selecting an answer for a question (without immediate feedback)
  const handleAnswerChange = (qIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  // Submit the quiz answers to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {  
      const res = await axios.post(`/api/quiz/${id}/submit`, { answers });
      setScore(res.data.score);
      setCorrectness(res.data.correctness); 
      setSubmitted(true);
      
      // Provide feedback on submission
      toast.success(`Quiz submitted successfully!`, {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Error submitting quiz.');
    }
  };

  return (
    <div className="fixed inset-0 bg-blue bg-opacity-40 z-500 flex justify-center items-start pt-20 items-start pt-[180px] px-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-5xl w-full h-[500px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Quiz: {resource.title}
        </h2>

        {submitted ? (
          <div className="text-center">
            <p className="mb-4 text-xl">
              You scored {score} out of {quiz?.questions?.length}.
            </p>
            {score > (quiz?.questions?.length / 2) ? (
              <p className="mb-4 text-green-600">You have been awarded 3 XP points!</p>
            ) : (
              <p className="mb-4 text-red-600">Sorry, your score is below {(quiz?.questions?.length / 2)}. Better luck next time!</p>
            )}

            {/* Show correctness details for each question */}
            {correctness.map((item, idx) => {
              const questionObj = quiz.questions[item.questionIndex];
              return (
                <div key={idx} className="mb-4 border-b pb-2">
                  <p className="font-semibold">{item.questionIndex + 1}. {questionObj.question}</p>
                  {questionObj.options.map((option, optionIndex) => {
                    const isCorrectAnswer = Number(optionIndex) === Number(item.correctAnswerIndex);
                    const isUserAnswer = Number(optionIndex) === Number(item.selectedAnswerIndex);
                    let colorClass = '';

                    if (isCorrectAnswer) {
                      colorClass = 'text-green-600 font-semibold';
                    } else if (isUserAnswer && !item.correct) {
                      colorClass = 'text-red-600 font-semibold';
                    }

                    return (
                      <p key={optionIndex} className={colorClass}>
                        {optionIndex + 1}. {option}
                        {isUserAnswer ? ' (Your choice)' : ''}
                        {isCorrectAnswer ? ' (Correct)' : ''}
                      </p>
                    );
                  })}
                  {!item.correct && (
                    <p className="text-red-600 mt-1">Your answer was incorrect.</p>
                  )}
                </div>
              );
            })}

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700 transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {quiz?.questions?.map((q, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{index + 1}. {q.question}</p>
                {q.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="block text-gray-800">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={optionIndex}
                      checked={answers[index] === optionIndex}
                      onChange={() => handleAnswerChange(index, optionIndex)}
                      className="mr-2"
                      required
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Submit Quiz
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
