import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentGrades } from '../../api/gradebookApi';
import Loader from '../../components/Loader';
import { Card, Table, Badge } from 'flowbite-react';

const StudentGradeView = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [courseAverage, setCourseAverage] = useState(0);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getStudentGrades(courseId);
        setGrades(data.grades);
        setCourseAverage(data.courseAverage);
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [courseId]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Grades</h1>
        <div className="flex items-center space-x-4">
          <span>Course Average:</span>
          <Badge color={courseAverage >= 70 ? 'success' : 'failure'} size="lg">
            {courseAverage}%
          </Badge>
        </div>
      </div>

      <Card>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Assignment</Table.HeadCell>
            <Table.HeadCell>Due Date</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Score</Table.HeadCell>
            <Table.HeadCell>Feedback</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {grades.map(grade => (
              <Table.Row key={grade.assignmentId}>
                <Table.Cell className="font-medium">
                  {grade.assignmentTitle}
                </Table.Cell>
                <Table.Cell>
                  {new Date(grade.dueDate).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Badge color={grade.status === 'Submitted' ? 'success' : 'warning'}>
                    {grade.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {grade.score !== null ? (
                    <span className="font-medium">
                      {grade.score}/{grade.maxScore} ({((grade.score / grade.maxScore) * 100).toFixed(1)}%)
                    </span>
                  ) : (
                    '-'
                  )}
                </Table.Cell>
                <Table.Cell>
                  {grade.feedback || 'No feedback yet'}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default StudentGradeView;