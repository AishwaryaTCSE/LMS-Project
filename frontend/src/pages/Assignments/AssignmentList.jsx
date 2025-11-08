import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssignments } from '../../api/assignmentApi';
import Loader from '../../components/Loader';

const AssignmentList = ({ studentView = false }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {!studentView && (
          <Link
            to="/instructor/assignments/create"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Assignment
          </Link>
        )}
      </div>
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{assignment.title}</h2>
            <p className="text-gray-600">{assignment.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
              <Link
                to={`/assignments/${assignment._id}${studentView ? '' : '/edit'}`}
                className="text-blue-600 hover:underline"
              >
                {studentView ? 'View Assignment' : 'Edit'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;