import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubmission, updateGrade } from '../../api/submissionApi';
import Loader from '../../components/Loader';
import { Button, Textarea, TextInput, Label, Card, Alert } from 'flowbite-react';

const GradingInterface = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submission, setSubmission] = useState(null);
  const [grade, setGrade] = useState({
    score: '',
    maxScore: 100,
    feedback: ''
  });

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await getSubmission(submissionId);
        setSubmission(data);
        if (data.grade) {
          setGrade({
            score: data.grade.score,
            maxScore: data.grade.maxScore,
            feedback: data.grade.feedback || ''
          });
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
        setError('Failed to load submission details');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!grade.score || isNaN(grade.score) || parseFloat(grade.score) < 0) {
      setError('Please enter a valid score');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await updateGrade(submissionId, {
        score: parseFloat(grade.score),
        maxScore: parseFloat(grade.maxScore),
        feedback: grade.feedback
      });

      setSuccess('Grade saved successfully');
      // Optionally refresh submission data
      const data = await getSubmission(submissionId);
      setSubmission(data);
    } catch (err) {
      console.error('Error saving grade:', err);
      setError('Failed to save grade. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!submission) return <div>Submission not found</div>;

  return (
    <div className="container mx-auto p-4">
      <Button color="gray" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        &larr; Back to Submissions
      </Button>

      <h1 className="text-2xl font-bold mb-6">Grade Submission</h1>
      
      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert color="success" className="mb-4">
          {success}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Submission Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-medium">{submission.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted</p>
                <p>{new Date(submission.submittedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">File</p>
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {submission.fileName || 'Download submission'}
                </a>
              </div>
              {submission.comments && (
                <div>
                  <p className="text-sm text-gray-500">Student Comments</p>
                  <p className="whitespace-pre-line">{submission.comments}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4">Grade Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="score" value="Score" />
                <div className="flex items-center">
                  <TextInput
                    id="score"
                    type="number"
                    min="0"
                    max={grade.maxScore}
                    value={grade.score}
                    onChange={(e) => setGrade({ ...grade, score: e.target.value })}
                    className="w-24 mr-2"
                  />
                  <span className="text-gray-500">/ {grade.maxScore}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="feedback" value="Feedback (optional)" />
                <Textarea
                  id="feedback"
                  rows={6}
                  value={grade.feedback}
                  onChange={(e) => setGrade({ ...grade, feedback: e.target.value })}
                  placeholder="Add your feedback here..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  color="gray"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="blue"
                  disabled={saving}
                  isProcessing={saving}
                >
                  {saving ? 'Saving...' : 'Save Grade'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GradingInterface;