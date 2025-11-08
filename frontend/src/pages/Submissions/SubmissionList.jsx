import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignmentSubmissions } from '../../api/submissionApi';
import Loader from '../../components/Loader';
import { Table, Badge, Button } from 'flowbite-react';
import { FaDownload, FaSearch } from 'react-icons/fa';

const SubmissionList = () => {
  const { assignmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredSubmissions = submissions.filter(submission =>
    submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.comments?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Assignment Submissions</h1>
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Student</Table.HeadCell>
            <Table.HeadCell>Submitted</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Grade</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredSubmissions.map((submission) => (
              <Table.Row key={submission.id}>
                <Table.Cell className="whitespace-nowrap">
                  {submission.studentName}
                </Table.Cell>
                <Table.Cell>
                  {new Date(submission.submittedAt).toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  <Badge color={submission.graded ? 'success' : 'warning'}>
                    {submission.graded ? 'Graded' : 'Pending'}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {submission.grade !== null ? (
                    <span className="font-medium">
                      {submission.grade.score}/{submission.grade.maxScore}
                    </span>
                  ) : (
                    '-'
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Button
                      size="xs"
                      color="light"
                      as="a"
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaDownload className="mr-1" /> Download
                    </Button>
                    <Button
                      size="xs"
                      color="blue"
                      href={`/assignments/${assignmentId}/submissions/${submission.id}/grade`}
                    >
                      {submission.graded ? 'View Grade' : 'Grade'}
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default SubmissionList;