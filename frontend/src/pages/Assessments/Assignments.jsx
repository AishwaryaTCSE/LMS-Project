// Assignment.jsx
import React, { useState, useEffect } from 'react';
import { getAssignments } from '../../api/courseApi';
import Loader from '../../components/Loader';

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await getAssignments();
        if (res.success) {
          setAssignments(res.data);
        } else {
          setError(res.message || 'Failed to fetch assignments');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 transition hover:shadow-2xl cursor-pointer"
            onClick={() => setSelectedAssignment(assignment)}
          >
            <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
            <p className="text-gray-300 mb-2">
              Due Date: {new Date(assignment.dueDate).toLocaleDateString()}
            </p>
            <p className="text-gray-300 mb-2">Total Marks: {assignment.totalMarks}</p>
            <p className="text-gray-300 mb-2">
              Status: {assignment.submitted ? 'Submitted' : 'Pending'}
            </p>
          </div>
        ))}
      </div>

      {selectedAssignment && (
        <div className="mt-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">{selectedAssignment.title}</h2>
          <p className="text-gray-300 mb-2">{selectedAssignment.description}</p>
          <p className="text-gray-300 mb-2">
            Due Date: {new Date(selectedAssignment.dueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-300 mb-2">Total Marks: {selectedAssignment.totalMarks}</p>
          <button
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            onClick={() =>
              alert(
                selectedAssignment.submitted
                  ? 'View Submission feature coming soon!'
                  : 'Submission feature coming soon!'
              )
            }
          >
            {selectedAssignment.submitted ? 'View Submission' : 'Submit Assignment'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Assignment;
