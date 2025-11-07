import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AssignmentCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    maxMarks: 100
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/assignments', formData);
      navigate('/teacher/assignments');
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Assignment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Assignment Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-4 py-2 border rounded h-32"
        />
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Max Marks"
          value={formData.maxMarks}
          onChange={(e) => setFormData({...formData, maxMarks: e.target.value})}
          className="w-full px-4 py-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Create Assignment
        </button>
      </form>
    </div>
  );
};

export default AssignmentCreate;