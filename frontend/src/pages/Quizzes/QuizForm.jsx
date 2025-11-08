import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  getQuizById, 
  createQuiz, 
  updateQuiz, 
  addQuizQuestion as addQuestion, 
  updateQuizQuestion as updateQuestion, 
  deleteQuizQuestion as deleteQuestion 
} from '../../api/quizApi';
import Loader from '../../components/Loader';

const QUESTION_TYPES = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True/False' },
  { value: 'short-answer', label: 'Short Answer' },
  { value: 'essay', label: 'Essay' },
];

const QuizForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    duration: 30,
    maxScore: 100,
    passingScore: 50,
    isPublished: false,
    questions: [],
  });

  const [newQuestion, setNewQuestion] = useState({
    id: '',
    type: 'multiple-choice',
    question: '',
    options: ['', ''],
    correctAnswer: '',
    points: 1,
    explanation: '',
  });

  useEffect(() => {
    if (id) {
      const fetchQuiz = async () => {
        try {
          const quiz = await getQuizById(id);
          setQuizData(quiz);
        } catch (error) {
          console.error('Error fetching quiz:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuiz();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleQuizChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    const newOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const resetQuestionForm = () => {
    setNewQuestion({
      id: '',
      type: 'multiple-choice',
      question: '',
      options: ['', ''],
      correctAnswer: '',
      points: 1,
      explanation: '',
    });
    setCurrentQuestionIndex(null);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    const questionToAdd = {
      ...newQuestion,
      id: newQuestion.id || uuidv4(),
    };

    const updatedQuestions = [...quizData.questions];
    if (currentQuestionIndex !== null) {
      updatedQuestions[currentQuestionIndex] = questionToAdd;
    } else {
      updatedQuestions.push(questionToAdd);
    }

    setQuizData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));

    resetQuestionForm();
    setActiveTab('questions');
  };

  const editQuestion = (index) => {
    setNewQuestion({
      ...quizData.questions[index],
      options: [...quizData.questions[index].options]
    });
    setCurrentQuestionIndex(index);
    setActiveTab('add-question');
  };

  const removeQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = [...quizData.questions];
      updatedQuestions.splice(index, 1);
      setQuizData(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (id) {
        await updateQuiz(id, quizData);
      } else {
        await createQuiz(quizData);
      }
      navigate('/instructor/quizzes');
    } catch (error) {
      console.error('Error saving quiz:', error);
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? 'Edit Quiz' : 'Create New Quiz'}
        </h1>
        <Link
          to="/instructor/quizzes"
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Quizzes
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              type="button"
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Quiz Details
            </button>
            <button
              type="button"
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('questions')}
              disabled={!quizData.title}
            >
              Questions ({quizData.questions.length})
            </button>
            <button
              type="button"
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'add-question'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('add-question')}
              disabled={!quizData.title}
            >
              {currentQuestionIndex !== null ? 'Edit Question' : 'Add Question'}
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <form onSubmit={(e) => { e.preventDefault(); setActiveTab('questions'); }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={quizData.title}
                    onChange={handleQuizChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={quizData.description}
                    onChange={handleQuizChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      min="1"
                      value={quizData.duration}
                      onChange={handleQuizChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Score *
                    </label>
                    <input
                      type="number"
                      name="maxScore"
                      min="1"
                      value={quizData.maxScore}
                      onChange={handleQuizChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      name="passingScore"
                      min="0"
                      max="100"
                      value={quizData.passingScore}
                      onChange={handleQuizChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="isPublished"
                    name="isPublished"
                    type="checkbox"
                    checked={quizData.isPublished}
                    onChange={handleQuizChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                    Publish this quiz
                  </label>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!quizData.title}
                  >
                    Continue to Questions
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'questions' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Quiz Questions</h2>
                <button
                  type="button"
                  onClick={() => {
                    resetQuestionForm();
                    setActiveTab('add-question');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Question
                </button>
              </div>

              {quizData.questions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No questions yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding your first question.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizData.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {index + 1}. {question.question.substring(0, 50)}
                            {question.question.length > 50 ? '...' : ''}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {question.type} • {question.points} point{question.points !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => editQuestion(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={quizData.questions.length === 0}
                  className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    quizData.questions.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  {saving ? 'Saving...' : 'Save Quiz'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'add-question' && (
            <form onSubmit={handleAddQuestion}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Type *
                  </label>
                  <select
                    name="type"
                    value={newQuestion.type}
                    onChange={handleQuestionChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {QUESTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text *
                  </label>
                  <textarea
                    name="question"
                    value={newQuestion.question}
                    onChange={handleQuestionChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {(newQuestion.type === 'multiple-choice' || newQuestion.type === 'true-false') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options *
                    </label>
                    <div className="space-y-2">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type={newQuestion.type === 'multiple-choice' ? 'radio' : 'checkbox'}
                            name="correctAnswer"
                            value={index}
                            checked={newQuestion.correctAnswer === index.toString()}
                            onChange={() => setNewQuestion(prev => ({
                              ...prev,
                              correctAnswer: index.toString()
                            }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                          {newQuestion.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addOption}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        disabled={newQuestion.options.length >= 6}
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                )}

                {(newQuestion.type === 'short-answer' || newQuestion.type === 'essay') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {newQuestion.type === 'short-answer' ? 'Expected Answer' : 'Sample Answer'}
                    </label>
                    <input
                      type="text"
                      name="correctAnswer"
                      value={newQuestion.correctAnswer}
                      onChange={handleQuestionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points *
                    </label>
                    <input
                      type="number"
                      name="points"
                      min="1"
                      value={newQuestion.points}
                      onChange={handleQuestionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explanation (optional)
                  </label>
                  <textarea
                    name="explanation"
                    value={newQuestion.explanation}
                    onChange={handleQuestionChange}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Provide an explanation or additional information about this question"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetQuestionForm();
                      setActiveTab('questions');
                    }}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <div className="space-x-3">
                    {currentQuestionIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          resetQuestionForm();
                          setActiveTab('questions');
                        }}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Discard Changes
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!newQuestion.question || (['multiple-choice', 'true-false'].includes(newQuestion.type) && newQuestion.correctAnswer === '')}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        !newQuestion.question || (['multiple-choice', 'true-false'].includes(newQuestion.type) && newQuestion.correctAnswer === '')
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      }`}
                    >
                      {currentQuestionIndex !== null ? 'Update Question' : 'Add Question'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizForm;