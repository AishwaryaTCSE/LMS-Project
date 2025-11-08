import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSimilarityReport } from '../../api/plagiarismApi';
import Loader from '../../components/Loader';
import { Button, Card, Badge, Tabs, Text } from 'flowbite-react';
import { FaArrowLeft, FaExternalLinkAlt, FaFileAlt } from 'react-icons/fa';

const SimilarityReport = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getSimilarityReport(submissionId);
        setReport(data);
      } catch (err) {
        console.error('Error fetching similarity report:', err);
        setError('Failed to load similarity report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [submissionId]);

  if (loading) return <Loader />;
  if (!report) return <div>Report not found</div>;

  const getRiskLevel = (score) => {
    if (score < 20) return { text: 'Low Risk', color: 'success' };
    if (score < 50) return { text: 'Medium Risk', color: 'warning' };
    return { text: 'High Risk', color: 'failure' };
  };

  const riskLevel = getRiskLevel(report.similarityScore);

  return (
    <div className="container mx-auto p-4">
      <Button
        color="light"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2" /> Back to Results
      </Button>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Similarity Report</h1>
          <p className="text-gray-600">
            {report.studentName} • {report.assignmentName}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ color: `var(--color-${riskLevel.color}-500)` }}>
            {report.similarityScore}%
          </div>
          <Badge color={riskLevel.color} className="mt-1">
            {riskLevel.text}
          </Badge>
        </div>
      </div>

      <Tabs.Group
        aria-label="Report tabs"
        style="underline"
        className="mb-6"
        onActiveTabChange={(tab) => setActiveTab(tab === 0 ? 'overview' : 'sources')}
      >
        <Tabs.Item active title="Overview" />
        <Tabs.Item title="Matched Sources" />
      </Tabs.Group>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Document Overview</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Similarity Score</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className={`h-2.5 rounded-full bg-${riskLevel.color}-500`}
                      style={{ width: `${report.similarityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {report.similarityScore}% of the content matches other sources
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Matched Sources</p>
                    <p className="text-2xl font-bold">{report.matchedSources?.length || 0}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">Original Content</p>
                    <p className="text-2xl font-bold">{100 - report.similarityScore}%</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">Document Text</h2>
              <div className="border rounded-lg p-4 bg-gray-50">
                {report.documentText ? (
                  <div className="whitespace-pre-wrap font-mono text-sm">
                    {report.documentText.split('\n').map((paragraph, i) => {
                      // This is a simplified example - in a real app, you'd want to highlight
                      // the specific text that was matched
                      const hasMatch = paragraph.toLowerCase().includes('match');
                      return (
                        <p
                          key={i}
                          className={`mb-2 ${
                            hasMatch ? 'bg-yellow-100 px-1' : ''
                          }`}
                        >
                          {paragraph || <br />}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">No document text available</p>
                )}
              </div>
            </Card>
          </div>

          <div>
            <Card>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  fullSized
                  color="light"
                  as="a"
                  href={report.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFileAlt className="mr-2" /> View Original Document
                </Button>
                <Button fullSized color="light">
                  Download Full Report (PDF)
                </Button>
                <Button fullSized color="light">
                  Send to Instructor
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Document Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">File Name</dt>
                    <dd className="font-medium">{report.fileName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">File Size</dt>
                    <dd>{report.fileSize}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Submitted</dt>
                    <dd>{new Date(report.submittedAt).toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Last Checked</dt>
                    <dd>{new Date(report.checkedAt).toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Matched Sources</h2>
          {report.matchedSources?.length > 0 ? (
            <div className="space-y-4">
              {report.matchedSources.map((source, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-blue-600 truncate">
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center"
                          >
                            {source.title || 'Untitled Document'}
                            <FaExternalLinkAlt className="ml-1 text-xs opacity-70" />
                          </a>
                        ) : (
                          source.title || 'Untitled Document'
                        )}
                      </h3>
                      {source.url && (
                        <p className="text-sm text-gray-500 truncate">{source.url}</p>
                      )}
                      <div className="mt-2">
                        <Badge color={riskLevel.color} className="mr-2">
                          {source.similarity}% match
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {source.matchedWords} words matched
                        </span>
                      </div>
                    </div>
                    <Button
                      size="xs"
                      color="light"
                      as="a"
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </Button>
                  </div>
                  {source.matchedText && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded text-sm">
                      <p className="font-medium text-yellow-800">Matched Text:</p>
                      <p className="text-yellow-700 mt-1 italic">
                        "{source.matchedText}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No matched sources found
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SimilarityReport;