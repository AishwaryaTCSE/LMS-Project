import React, { useState, useEffect } from 'react';
import { getCourses } from '../../api/courseApi';
import Loader from '../../components/Loader';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 min-h-screen">
      <h1 className="text-white text-3xl font-bold mb-6">All Courses</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course._id}
            className="p-5 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg flex flex-col justify-between transition-transform hover:scale-105"
          >
            <h2 className="text-xl text-white font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-200 mb-4">{course.description}</p>
            <p className="text-sm text-gray-300">Instructor: {course.instructorName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
