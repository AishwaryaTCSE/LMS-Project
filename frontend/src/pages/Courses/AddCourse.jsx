import React, { useState } from 'react';
import { createCourse } from '../../api/courseApi';

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructorName: '',
    category: '',
    duration: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await createCourse({
        title: formData.title,
        description: formData.description,
        syllabus: undefined
      });
      if (response && response.success) {
        setMessage('Course added successfully!');
        setFormData({ title: '', description: '', instructorName: '', category: '', duration: '' });
      } else {
        setError(response?.message || 'Failed to add course');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 min-h-screen flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl text-white font-bold text-center mb-4">Add New Course</h2>
        {message && <p className="text-green-400 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {['title', 'description', 'instructorName', 'category', 'duration'].map((field) => (
          <input
            key={field}
            type={field === 'duration' ? 'number' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            className="px-3 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ))}

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-lg hover:scale-105 transition-transform"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
