import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAssignmentById, deleteAssignment, getSubmissions } from '../../api/assignmentApi';
import Loader from '../../components/Loader';

const AssignmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentData, submissionsData] = await Promise.all([
          getAssignmentById(id),
          getSubmissions(id)
        ]);
        setAssignment(assignmentData);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
        navigate('/instructor/assignments');
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  if (loading) return <Loader />;
  if (!assignment) return <div>Assignment not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{assignment.title}</h1>
          <p className="text-gray-600">Due: {new Date(assignment.dueDate).toLocaleString()}</p>
        </div>
        <div className="space-x-2">
          <Link
            to={`/instructor/assignments/edit/${id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`${
              activeTab === 'submissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Submissions ({submissions.length})
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'details' ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Assignment Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the assignment</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                    {assignment.description || 'No description provided.'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(assignment.dueDate).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Max Score</dt>
                  <dd className="mt-1 text-sm text-gray-900">{assignment.maxScore}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      new Date(assignment.dueDate) > new Date()
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {new Date(assignment.dueDate) > new Date() ? 'Active' : 'Past Due'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Submissions</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {submissions.length} submission{submissions.length !== 1 ? 's' : ''} received
              </p>
            </div>
            {submissions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <li key={submission._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {submission.student?.name || 'Unknown Student'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                        {submission.grade !== undefined && (
                          <p className="text-sm text-gray-500">
                            Grade: {submission.grade} / {assignment.maxScore}
                          </p>
                        )}
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <Link
                          to={`/instructor/assignments/submissions/${submission._id}/grade`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          {submission.grade !== undefined ? 'View/Edit Grade' : 'Grade'}
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-12 text-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Students haven't submitted their work yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentDetail;