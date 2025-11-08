import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignmentSubmissions, updateGrade } from '../../api/gradebookApi';
import Loader from '../../components/Loader';
import { Button, Table, TextInput, Label } from 'flowbite-react';

const GradeEntry = () => {
  const { assignmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getAssignmentSubmissions(assignmentId);
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  const handleGradeChange = (submissionId, value) => {
    setSubmissions(subs => 
      subs.map(s => 
        s.id === submissionId ? { ...s, score: value } : s
      )
    );
  };

  const saveGrade = async (submissionId) => {
    try {
      setSaving(prev => ({ ...prev, [submissionId]: true }));
      const submission = submissions.find(s => s.id === submissionId);
      await updateGrade(submissionId, { score: submission.score });
      // Show success message
    } catch (error) {
      console.error('Error saving grade:', error);
    } finally {
      setSaving(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Grade Submissions</h1>
      
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Student</Table.HeadCell>
          <Table.HeadCell>Submission</Table.HeadCell>
          <Table.HeadCell>Score</Table.HeadCell>
          <Table.HeadCell>Max Score</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {submissions.map(submission => (
            <Table.Row key={submission.id}>
              <Table.Cell>{submission.studentName}</Table.Cell>
              <Table.Cell>
                <a 
                  href={submission.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Submission
                </a>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center">
                  <TextInput
                    type="number"
                    value={submission.score || ''}
                    onChange={(e) => handleGradeChange(submission.id, e.target.value)}
                    className="w-24"
                  />
                </div>
              </Table.Cell>
              <Table.Cell>{submission.maxScore}</Table.Cell>
              <Table.Cell>
                <Button
                  size="xs"
                  onClick={() => saveGrade(submission.id)}
                  disabled={saving[submission.id]}
                >
                  {saving[submission.id] ? 'Saving...' : 'Save'}
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default GradeEntry;