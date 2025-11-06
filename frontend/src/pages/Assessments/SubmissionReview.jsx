import React, { useState, useEffect } from 'react';
import { getSubmissions, gradeSubmission } from '../../api/courseApi';
import Loader from '../../components/Loader';

const SubmissionReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await getSubmissions();
        if (res.data.success) {
          setSubmissions(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch submissions');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleGradeSubmit = async () => {
    if (!selectedSubmission) return;
    try {
      await gradeSubmission(selectedSubmission.id, { grade, feedback });
      alert('Graded successfully!');
      // Update local state after grading
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission.id ? { ...sub, grade, feedback } : sub
        )
      );
      setSelectedSubmission({ ...selectedSubmission, grade, feedback });
      setGrade('');
      setFeedback('');
    } catch (err) {
      alert(err.message || 'Failed to submit grade');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50">
      <h1 className="text-3xl font-bold mb-6">Submission Review</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 cursor-pointer"
            onClick={() => setSelectedSubmission(submission)}
          >
            <h2 className="text-xl font-semibold mb-2">{submission.studentName}</h2>
            <p className="text-gray-300 mb-2">Assignment: {submission.assignmentTitle}</p>
            <p className="text-gray-300 mb-2">
              Status: {submission.submitted ? 'Submitted' : 'Pending'}
            </p>
            {submission.grade && (
              <p className="text-green-500 mb-2">Grade: {submission.grade}</p>
            )}
          </div>
        ))}
      </div>

      {selectedSubmission && (
        <div className="mt-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">{selectedSubmission.studentName}</h2>
          <p className="text-gray-300 mb-2">Assignment: {selectedSubmission.assignmentTitle}</p>
          <p className="text-gray-300 mb-2">
            Submitted At: {new Date(selectedSubmission.submittedAt).toLocaleString()}
          </p>

          <textarea
            placeholder="Feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 mb-2"
          />
          <input
            type="text"
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 mb-2"
          />
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            onClick={handleGradeSubmit}
          >
            Submit Grade
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionReview;
