import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../../api/courseApi';
import Loader from '../../components/Loader';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(id);
        if (response.data.success) {
          setCourse(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch course details');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!course) return <p className="text-white p-6">Course not found</p>;

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 min-h-screen flex justify-center">
      <div className="w-full max-w-3xl p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg">
        <h1 className="text-3xl text-white font-bold mb-4">{course.title}</h1>
        <p className="text-gray-200 mb-4">{course.description}</p>
        <p className="text-sm text-gray-300 mb-2">Instructor: {course.instructorName}</p>
        <p className="text-sm text-gray-300 mb-2">Category: {course.category}</p>
        <p className="text-sm text-gray-300 mb-2">Duration: {course.duration} hours</p>

        <div className="mt-4">
          <h2 className="text-white text-xl font-semibold mb-2">Syllabus</h2>
          <ul className="list-disc list-inside text-gray-200">
            {course.syllabus?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
