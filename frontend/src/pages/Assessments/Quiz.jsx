// Quiz.jsx
import React, { useState, useEffect } from 'react';
import { getQuizzes } from '../../api/courseApi';
import Loader from '../../components/Loader';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const res = await getQuizzes();
        if (res.success) {
          setQuizzes(res.data);
        } else {
          setError(res.message || 'Failed to fetch quizzes');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitQuiz = () => {
    alert('Quiz submission feature coming soon!');
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50">
      <h1 className="text-3xl font-bold mb-6">Quizzes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 transition hover:shadow-2xl cursor-pointer"
            onClick={() => setActiveQuiz(quiz)}
          >
            <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
            <p className="text-gray-300 mb-2">Questions: {quiz.questions.length}</p>
            <p className="text-gray-300 mb-2">Time Limit: {quiz.timeLimit} mins</p>
          </div>
        ))}
      </div>

      {activeQuiz && (
        <div className="mt-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">{activeQuiz.title}</h2>
          {activeQuiz.questions.map((q, index) => (
            <div key={q.id} className="mb-4">
              <p className="text-gray-300 mb-2">
                {index + 1}. {q.question}
              </p>
              {q.options.map((opt) => (
                <label key={opt} className="block text-gray-200 ml-2">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswerChange(q.id, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            onClick={submitQuiz}
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
