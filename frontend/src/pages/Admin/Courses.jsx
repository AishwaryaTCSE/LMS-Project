// frontend/src/pages/Admin/Courses.jsx
import React, { useState } from 'react';
import { FiSearch, FiFilter, FiDownload, FiPlus, FiEdit2, FiTrash2, FiBook } from 'react-icons/fi';
import BaseAdminPage from './BaseAdminPage';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with API call
  const courses = Array(8).fill().map((_, i) => ({
    id: `CRS${100 + i}`,
    title: `Course Title ${i + 1}`,
    code: `CS-${Math.floor(Math.random() * 1000) + 1000}`,
    instructor: `Instructor ${i + 1}`,
    students: Math.floor(Math.random() * 100) + 10,
    status: ['Active', 'Draft', 'Archived'][Math.floor(Math.random() * 3)],
    created: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000)
  }));

  // ... (similar filtering and pagination logic as above)

  return (
    <BaseAdminPage
      title="Courses"
      subtitle="Manage and view all courses"
      headerAction={
        <Link
          to="/admin/courses/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Course
        </Link>
      }
    >
      {/* Similar structure to Students/Instructors */}
    </BaseAdminPage>
  );
};

export default Courses;