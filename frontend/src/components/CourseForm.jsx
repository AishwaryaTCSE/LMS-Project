import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiFileText } from 'react-icons/fi';

const CourseForm = ({ course = null, onSubmit, onCancel, instructors = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    syllabus: '',
    instructor: ''
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        syllabus: course.syllabus || '',
        instructor: course.instructor?._id || course.instructor || ''
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <FiBookOpen className="inline w-4 h-4 mr-1" />
          Course Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <FiFileText className="inline w-4 h-4 mr-1" />
          Syllabus
        </label>
        <textarea
          name="syllabus"
          value={formData.syllabus}
          onChange={handleChange}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {instructors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructor
          </label>
          <select
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Instructor</option>
            {instructors.map(instructor => (
              <option key={instructor._id} value={instructor._id}>
                {instructor.firstName} {instructor.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          {course ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;

