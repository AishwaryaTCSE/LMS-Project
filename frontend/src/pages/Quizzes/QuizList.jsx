import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes } from '../../api/quizApi';
import Loader from '../../components/Loader';

const QuizList = ({ studentView = false }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (err) {
        setError('Failed to load quizzes. Please try again later.');
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        {!studentView && (
          <Link
            to="/instructor/quizzes/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create Quiz
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {quizzes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No quizzes available.</p>
            {!studentView && (
              <Link
                to="/instructor/quizzes/create"
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Create Your First Quiz
              </Link>
            )}
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{quiz.title}</h2>
                  <p className="text-gray-600 mt-1">{quiz.description}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Duration: {quiz.duration} minutes</span>
                    <span>Questions: {quiz.questions?.length || 0}</span>
                    <span>Max Score: {quiz.maxScore || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {studentView ? (
                    <Link
                      to={`/student/quizzes/${quiz._id}/take`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Start Quiz
                    </Link>
                  ) : (
                    <>
                      <Link
                        to={`/instructor/quizzes/edit/${quiz._id}`}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/instructor/quizzes/results/${quiz._id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                      >
                        View Results
                      </Link>
                    </>
                  )}
                </div>
              </div>
              {!studentView && quiz.attemptsCount > 0 && (
                <div className="mt-3 pt-3 border-t text-sm text-gray-500">
                  <span>{quiz.attemptsCount} attempt(s)</span>
                  {quiz.averageScore !== undefined && (
                    <span className="ml-4">
                      Average Score: {quiz.averageScore.toFixed(1)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizList;