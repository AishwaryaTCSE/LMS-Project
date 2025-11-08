import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitAssignment } from '../../api/submissionApi';
import { Button, Label, FileInput, Textarea, Alert } from 'flowbite-react';
import { HiOutlineUpload } from 'react-icons/hi';

const SubmissionForm = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('comments', comments);

    try {
      setLoading(true);
      setError('');
      await submitAssignment(assignmentId, formData);
      navigate(-1); // Go back to previous page
    } catch (err) {
      setError('Failed to submit assignment. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Submit Assignment</h1>
      
      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="file" value="Upload your work" />
          </div>
          <FileInput
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            helperText="PDF, DOC, DOCX, or ZIP files (max 10MB)"
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="comments" value="Comments (optional)" />
          </div>
          <Textarea
            id="comments"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments about your submission..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            color="gray"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="blue"
            disabled={!file || loading}
            isProcessing={loading}
          >
            <HiOutlineUpload className="mr-2 h-5 w-5" />
            {loading ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;