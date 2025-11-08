import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizResults, getQuizById } from '../../api/quizApi';
import Loader from '../../components/Loader';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const QuizResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [resultsData, quizData] = await Promise.all([
          getQuizResults(attemptId),
          getQuizById(attemptId)
        ]);
        
        setResults(resultsData);
        setQuiz(quizData);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId]);

  const calculateScorePercentage = () => {
    if (!results || !quiz) return 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    return Math.round((results.score / totalPoints) * 100);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQuestionResult = (questionIndex) => {
    if (!results || !results.questionResults) return null;
    return results.questionResults.find(qr => qr.questionIndex === questionIndex);
  };

  const isAnswerCorrect = (questionIndex) => {
    const result = getQuestionResult(questionIndex);
    return result?.isCorrect;
  };

  const getAnswerFeedback = (questionIndex) => {
    const result = getQuestionResult(questionIndex);
    if (!result) return null;
    
    const question = quiz.questions[questionIndex];
    const userAnswer = result.userAnswer;
    const correctAnswer = result.correctAnswer;
    
    switch (question.type) {
      case 'multiple-choice':
        return {
          userAnswer: question.options[userAnswer],
          correctAnswer: question.options[correctAnswer],
          feedback: result.feedback
        };
      case 'true-false':
        return {
          userAnswer: userAnswer ? 'True' : 'False',
          correctAnswer: correctAnswer ? 'True' : 'False',
          feedback: result.feedback
        };
      case 'short-answer':
      case 'essay':
        return {
          userAnswer,
          correctAnswer,
          feedback: result.feedback
        };
      case 'multiple-answer':
        return {
          userAnswer: Array.isArray(userAnswer) 
            ? userAnswer.map(idx => question.options[idx]).join(', ')
            : 'No answer provided',
          correctAnswer: Array.isArray(correctAnswer)
            ? correctAnswer.map(idx => question.options[idx]).join(', ')
            : '',
          feedback: result.feedback
        };
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <Loader />;
  if (!results || !quiz) return <div className="container mx-auto p-4">Results not found.</div>;

  const scorePercentage = calculateScorePercentage();
  const passed = scorePercentage >= (quiz.passingScore || 0);
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const currentQuestion = quiz.questions[activeQuestionIndex];
  const feedback = getAnswerFeedback(activeQuestionIndex);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="bg-gray-800 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{quiz.title} - Results</h1>
              <p className="text-gray-300 mt-1">
                Completed on {formatDate(results.completedAt || new Date())}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className={`text-4xl font-bold ${getScoreColor(scorePercentage)}`}>
                {scorePercentage}%
              </div>
              <div className="text-sm text-gray-300 text-center mt-1">
                {results.score} / {totalPoints} points
              </div>
            </div>
          </div>
          
          <div className="mt-6 w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-gray-300">
            <span>0%</span>
            <span>{passed ? 'Passed' : 'Not Passed'}</span>
            <span>100%</span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Quiz Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium">{passed ? 'Passed' : 'Not Passed'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Score:</span>
                  <span className="font-medium">{results.score} / {totalPoints} ({scorePercentage}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Passing Score:</span>
                  <span className="font-medium">{quiz.passingScore || 50}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Taken:</span>
                  <span className="font-medium">
                    {Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Completed:</span>
                  <span className="font-medium">{formatDate(results.completedAt)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Performance Summary</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Correct Answers</span>
                    <span className="font-medium">
                      {results.correctAnswers} / {quiz.questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(results.correctAnswers / quiz.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Incorrect Answers</span>
                    <span className="font-medium">
                      {results.incorrectAnswers} / {quiz.questions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(results.incorrectAnswers / quiz.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Question Breakdown</h3>
              <div className="grid grid-cols-3 gap-2">
                {quiz.questions.map((_, index) => {
                  const isCorrect = isAnswerCorrect(index);
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveQuestionIndex(index);
                        setActiveTab('review');
                      }}
                      className={`w-full h-10 flex items-center justify-center rounded-md ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              type="button"
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button
              type="button"
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'review'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('review')}
            >
              Review Answers
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'summary' ? (
            <div>
              <h2 className="text-lg font-medium mb-4">Performance Summary</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Score Distribution</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="h-8 flex">
                      <div 
                        className="bg-green-500 flex items-center justify-end pr-2 text-white text-sm"
                        style={{ width: `${(results.correctAnswers / quiz.questions.length) * 100}%` }}
                      >
                        {results.correctAnswers} Correct
                      </div>
                      <div 
                        className="bg-red-500 flex items-center pl-2 text-white text-sm"
                        style={{ width: `${(results.incorrectAnswers / quiz.questions.length) * 100}%` }}
                      >
                        {results.incorrectAnswers} Incorrect
                      </div>
                    </div>
                  </div>
                </div>

                {results.incorrectAnswers > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Areas for Improvement</h3>
                    <div className="space-y-2">
                      {results.questionResults
                        .filter(r => !r.isCorrect)
                        .map((result, index) => {
                          const question = quiz.questions[result.questionIndex];
                          return (
                            <div key={index} className="bg-red-50 p-3 rounded-md">
                              <p className="font-medium text-red-800">
                                Question {result.questionIndex + 1}: {question.question}
                              </p>
                              <p className="text-sm text-red-700 mt-1">
                                Review this question to better understand the concept.
                              </p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Recommendations</h3>
                  <div className="space-y-3">
                    {scorePercentage < 70 && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <ClockIcon className="h-5 w-5 text-yellow-500" />
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Consider reviewing the course materials and retaking the quiz to improve your score.
                        </p>
                      </div>
                    )}
                    {results.incorrectAnswers > 0 && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Review the questions you got wrong to better understand the concepts.
                        </p>
                      </div>
                    )}
                    {passed && (
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Great job! You've passed this quiz. Consider moving on to the next module.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">
                  Question {activeQuestionIndex + 1} of {quiz.questions.length}
                </h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isAnswerCorrect(activeQuestionIndex) 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isAnswerCorrect(activeQuestionIndex) ? 'Correct' : 'Incorrect'} • 
                  {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-900 mb-3">{currentQuestion.question}</h3>
                
                {feedback && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Your Answer:</h4>
                      <div className="bg-white p-3 rounded border border-gray-200">
                        {feedback.userAnswer || 'No answer provided'}
                      </div>
                    </div>
                    
                    {!isAnswerCorrect(activeQuestionIndex) && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          {currentQuestion.type === 'essay' ? 'Sample Answer' : 'Correct Answer'}:
                        </h4>
                        <div className="bg-green-50 p-3 rounded border border-green-200 text-green-800">
                          {feedback.correctAnswer}
                        </div>
                      </div>
                    )}
                    
                    {feedback.feedback && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Instructor Feedback:</h4>
                        <div className="bg-blue-50 p-3 rounded border border-blue-200 text-blue-800">
                          {feedback.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                  disabled={activeQuestionIndex === 0}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                    activeQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous Question
                </button>
                
                <div className="flex space-x-2">
                  {activeQuestionIndex < quiz.questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Next Question
                    </button>
                  ) : null}
                  
                  <button
                    type="button"
                    onClick={() => setActiveTab('summary')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
                  >
                    Back to Summary
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => navigate(`/student/quizzes/${quiz._id}/take`)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Retake Quiz
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  );
};

export default QuizResult;