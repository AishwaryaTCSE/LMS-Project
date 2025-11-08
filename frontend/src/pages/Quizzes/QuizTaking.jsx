import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, startQuizAttempt, submitQuizAttempt } from '../../api/quizApi';
import Loader from '../../components/Loader';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const QuizTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        // Start the quiz attempt
        const attempt = await startQuizAttempt(id);
        setAttemptId(attempt.id);
        
        // Get the quiz details
        const quizData = await getQuizById(id);
        setQuiz(quizData);
        
        // Initialize timer
        const endTime = new Date(attempt.endTime).getTime();
        const updateTimer = () => {
          const now = new Date().getTime();
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
          setTimeLeft(remaining);
          
          if (remaining <= 0) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
          }
        };
        
        // Update timer every second
        updateTimer();
        timerRef.current = setInterval(updateTimer, 1000);
        
        // Initialize answers from the attempt if any
        if (attempt.answers) {
          setAnswers(attempt.answers);
        }
      } catch (error) {
        console.error('Error initializing quiz:', error);
        // Redirect if there's an error (e.g., quiz not found, already attempted, etc.)
        navigate('/student/quizzes');
      } finally {
        setLoading(false);
      }
    };

    initializeQuiz();
    
    // Cleanup interval on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id, navigate]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleOptionChange = (questionId, optionIndex, isChecked) => {
    setAnswers(prev => {
      const currentAnswers = Array.isArray(prev[questionId]) ? [...prev[questionId]] : [];
      
      if (isChecked) {
        // Add the option if it's not already in the array
        if (!currentAnswers.includes(optionIndex)) {
          return {
            ...prev,
            [questionId]: [...currentAnswers, optionIndex]
          };
        }
      } else {
        // Remove the option if it's in the array
        return {
          ...prev,
          [questionId]: currentAnswers.filter(opt => opt !== optionIndex)
        };
      }
      
      return prev;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    
    try {
      await submitQuizAttempt(attemptId, { answers });
      navigate(`/student/quizzes/results/${attemptId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('There was an error submitting your quiz. Please try again.');
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    // Only auto-submit if we haven't already submitted
    if (!submitting && attemptId) {
      setSubmitting(true);
      try {
        await submitQuizAttempt(attemptId, { answers, autoSubmitted: true });
        navigate(`/student/quizzes/results/${attemptId}`);
      } catch (error) {
        console.error('Error auto-submitting quiz:', error);
        // Even if there's an error, we should still navigate away
        navigate('/student/quizzes');
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <Loader />;
  }

  if (!quiz) {
    return <div className="container mx-auto p-4">Quiz not found or you don't have access to it.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Quiz Header */}
        <div className="bg-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <div className="text-xl font-mono bg-black bg-opacity-40 px-3 py-1 rounded">
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-300">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentQuestionIndex === index
                    ? 'bg-blue-600 text-white'
                    : answers[quiz.questions[index]._id] !== undefined
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Current Question */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">
              {currentQuestionIndex + 1}. {currentQuestion.question}
              <span className="ml-2 text-sm text-gray-500">
                ({currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''})
              </span>
            </h2>

            {currentQuestion.type === 'multiple-choice' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center">
                    <input
                      type="radio"
                      id={`option-${optIndex}`}
                      name={`question-${currentQuestion._id}`}
                      checked={answers[currentQuestion._id] === optIndex}
                      onChange={() => handleAnswerChange(currentQuestion._id, optIndex)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={`option-${optIndex}`}
                      className="ml-3 block text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="space-y-3">
                {[true, false].map((value, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      id={`tf-${index}`}
                      name={`question-${currentQuestion._id}`}
                      checked={answers[currentQuestion._id] === value}
                      onChange={() => handleAnswerChange(currentQuestion._id, value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={`tf-${index}`}
                      className="ml-3 block text-gray-700"
                    >
                      {value ? 'True' : 'False'}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.type === 'short-answer' && (
              <div>
                <input
                  type="text"
                  value={answers[currentQuestion._id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Type your answer here..."
                />
              </div>
            )}

            {currentQuestion.type === 'essay' && (
              <div>
                <textarea
                  value={answers[currentQuestion._id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Type your essay here..."
                />
              </div>
            )}

            {currentQuestion.type === 'multiple-answer' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, optIndex) => {
                  const isChecked = Array.isArray(answers[currentQuestion._id]) 
                    ? answers[currentQuestion._id].includes(optIndex)
                    : false;
                  
                  return (
                    <div key={optIndex} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`ma-${optIndex}`}
                        checked={isChecked}
                        onChange={(e) => 
                          handleOptionChange(
                            currentQuestion._id, 
                            optIndex, 
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`ma-${optIndex}`}
                        className="ml-3 block text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {!isFirstQuestion && (
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Previous Question
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {!isLastQuestion ? (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
        title="Submit Quiz"
        message="Are you sure you want to submit your quiz? You won't be able to make changes after submission."
        confirmText={submitting ? 'Submitting...' : 'Submit Quiz'}
        cancelText="Cancel"
        confirmColor="green"
      />
    </div>
  );
};

export default QuizTaking;