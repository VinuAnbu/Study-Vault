import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TestPage = () => {
  const { resourceId } = useParams();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`http://localhost:5000/api/resources/resource/${resourceId}`);
      const data = await res.json();
      if (data.resource && data.resource.quizAvailable) {
        setQuizQuestions(data.resource.quizQuestions);
      } else {
        setMessage('No quiz available for this resource.');
      }
    };
    fetchQuiz();
  }, [resourceId]);

  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: parseInt(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== quizQuestions.length) {
      setMessage('Please answer all questions.');
      return;
    }
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/quizzes/submit', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ resourceId, answers: Object.values(answers) })
    });
    const result = await res.json();
    setScore(result.score);
    if (result.score === 3) {
      setMessage('Congratulations! You cleared the test and earned 3 XP points.');
    } else {
      setMessage('Some answers were incorrect. Try again!');
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Quiz Test</h1>
      {message && <div className="mb-4 text-lg text-blue-600">{message}</div>}
      {quizQuestions.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {quizQuestions.map((q, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{index + 1}. {q.question}</p>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input type="radio" name={`q${index}`} value="1" onChange={(e) => handleAnswerChange(index, e.target.value)} required className="mr-2" />
                  {q.option1}
                </label>
                <label className="flex items-center">
                  <input type="radio" name={`q${index}`} value="2" onChange={(e) => handleAnswerChange(index, e.target.value)} className="mr-2" />
                  {q.option2}
                </label>
                <label className="flex items-center">
                  <input type="radio" name={`q${index}`} value="3" onChange={(e) => handleAnswerChange(index, e.target.value)} className="mr-2" />
                  {q.option3}
                </label>
              </div>
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Quiz</button>
        </form>
      ) : (
        !message && <p>Loading quiz...</p>
      )}
      {score !== null && (
        <div className="mt-4">
          <p className="text-xl font-bold">Your Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default TestPage;
