// frontend/src/pages/Courses/CourseList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse } from '../../api/courseApi';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaEye } from 'react-icons/fa';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCourses();
        // Ensure we're working with an array
        const coursesData = Array.isArray(response) ? response : [];
        setCourses(coursesData);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again later.');
        setCourses([]); // Ensure courses is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter(course => course._id !== id));
        toast.success('Course deleted successfully');
      } catch (err) {
        toast.error(err.message || 'Failed to delete course');
      }
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => {
    const title = course.title?.toLowerCase() || '';
    const instructor = course.instructorName?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return title.includes(search) || instructor.includes(search);
  });

  if (loading) return <Loader />;
  
  // Show error message if there's an error and no courses
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Courses</h1>
        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/courses/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center whitespace-nowrap"
          >
            <FaPlus className="mr-2" /> Add Course
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {course.title}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => navigate(`/courses/edit/${course._id}`)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Instructor: {course.instructorName || 'N/A'}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {course.students?.length || 0} Students
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {course.category || 'General'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No courses found. Create your first course to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;