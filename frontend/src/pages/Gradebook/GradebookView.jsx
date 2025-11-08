import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseGrades } from '../../api/gradebookApi';
import Loader from '../../components/Loader';
import { Table, Button } from 'flowbite-react';
import { FaEdit, FaFileExport } from 'react-icons/fa';

const GradebookView = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await getCourseGrades(courseId);
        setGrades(data.grades);
        setStudents(data.students);
        setAssignments(data.assignments);
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [courseId]);

  const calculateAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return '-';
    const sum = studentGrades.reduce((acc, g) => acc + (parseFloat(g.score) || 0), 0);
    return (sum / studentGrades.length).toFixed(2);
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gradebook</h1>
        <div className="space-x-2">
          <Button color="gray">
            <FaFileExport className="mr-2" />
            Export Grades
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Student</Table.HeadCell>
            {assignments.map(assignment => (
              <Table.HeadCell key={assignment.id}>
                {assignment.title}
              </Table.HeadCell>
            ))}
            <Table.HeadCell>Average</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {students.map(student => (
              <Table.Row key={student.id}>
                <Table.Cell className="whitespace-nowrap">
                  {student.name}
                </Table.Cell>
                {assignments.map(assignment => {
                  const grade = grades.find(
                    g => g.studentId === student.id && g.assignmentId === assignment.id
                  );
                  return (
                    <Table.Cell key={`${student.id}-${assignment.id}`}>
                      {grade ? `${grade.score}/${assignment.maxScore}` : '-'}
                    </Table.Cell>
                  );
                })}
                <Table.Cell className="font-medium">
                  {calculateAverage(student.id)}%
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default GradebookView;