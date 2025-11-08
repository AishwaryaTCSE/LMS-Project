import React, { useState } from 'react';
import { createCourse } from '../../api/courseApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const AddCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'beginner',
    price: 0,
    isPublished: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fixed text color visibility
  const inputBaseClass =
    "focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 sm:text-sm border border-gray-300 rounded-md bg-white text-gray-900";

  const selectBaseClass =
    "mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900";

  // Handle all input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price) || 0,
      };

      const response = await createCourse(dataToSubmit);

      if (response && (response._id || response.data?._id)) {
        toast.success('Course created successfully!');
        navigate('/instructor/dashboard');
      } else {
        throw new Error(response?.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create course';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Create New Course</h1>
            <p className="text-blue-100 mt-1">
              Fill in the details below to create a new course
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Course Title */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Course Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={inputBaseClass}
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={inputBaseClass}
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={selectBaseClass}
                  disabled={submitting}
                >
                  <option>Web Development</option>
                  <option>Mobile Development</option>
                  <option>Data Science</option>
                  <option>Business</option>
                  <option>Design</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="level"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Difficulty Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className={selectBaseClass}
                  disabled={submitting}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Price ($) */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Price ($)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md bg-white text-gray-900"
                    placeholder="0.00"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Publish Checkbox */}
              <div className="sm:col-span-3 flex items-end">
                <div className="flex items-center h-5">
                  <input
                    id="isPublished"
                    name="isPublished"
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-offset-2"
                    disabled={submitting}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="isPublished"
                    className="font-medium text-gray-700"
                  >
                    Publish this course
                  </label>
                  <p className="text-gray-500">
                    Make this course visible to students
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
