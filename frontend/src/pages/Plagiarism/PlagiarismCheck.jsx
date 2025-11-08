import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { checkPlagiarism } from '../../api/plagiarismApi';
import Loader from '../../components/Loader';
import { Button, Table, Badge, Alert } from 'flowbite-react';
import { FaSearch, FaFileAlt } from 'react-icons/fa';

const PlagiarismCheck = () => {
  const { assignmentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckPlagiarism = async () => {
    try {
      setIsChecking(true);
      setError('');
      const data = await checkPlagiarism(assignmentId);
      setResults(data.results);
    } catch (err) {
      console.error('Error checking for plagiarism:', err);
      setError('Failed to check for plagiarism. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plagiarism Check</h1>
        <Button
          color="blue"
          onClick={handleCheckPlagiarism}
          disabled={isChecking}
          isProcessing={isChecking}
        >
          <FaSearch className="mr-2" />
          {isChecking ? 'Checking...' : 'Check for Plagiarism'}
        </Button>
      </div>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Document</Table.HeadCell>
              <Table.HeadCell>Similarity Score</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Matched Sources</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {results.map((result) => (
                <Table.Row key={result.submissionId}>
                  <Table.Cell className="whitespace-nowrap">
                    {result.studentName}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className={`h-2.5 rounded-full ${
                            result.similarityScore < 20
                              ? 'bg-green-500'
                              : result.similarityScore < 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${result.similarityScore}%` }}
                        ></div>
                      </div>
                      <span>{result.similarityScore}%</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={
                        result.similarityScore < 20
                          ? 'success'
                          : result.similarityScore < 50
                          ? 'warning'
                          : 'failure'
                      }
                    >
                      {result.similarityScore < 20
                        ? 'Low Risk'
                        : result.similarityScore < 50
                        ? 'Medium Risk'
                        : 'High Risk'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    {result.matchedSources?.length || 0} sources
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      size="xs"
                      color="light"
                      href={`/assignments/${assignmentId}/plagiarism/${result.submissionId}`}
                    >
                      <FaFileAlt className="mr-1" /> View Report
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No plagiarism check results
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Click the "Check for Plagiarism" button to analyze submissions.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlagiarismCheck;