// frontend/src/pages/Admin/Instructors.jsx
import React, { useState } from 'react';
import { FiSearch, FiFilter, FiDownload, FiPlus, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import BaseAdminPage from './BaseAdminPage';
import { Link } from 'react-router-dom';

const Instructors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with API call
  const instructors = Array(12).fill().map((_, i) => ({
    id: `INST${100 + i}`,
    name: `Instructor ${i + 1}`,
    email: `instructor${i + 1}@example.com`,
    courses: Math.floor(Math.random() * 10) + 1,
    students: Math.floor(Math.random() * 100) + 10,
    status: ['Active', 'Inactive', 'On Leave'][Math.floor(Math.random() * 3)],
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)
  }));

  const filteredInstructors = instructors.filter(instructor => 
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedInstructors = filteredInstructors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const getStatusBadge = (status) => {
    const statusClasses = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-gray-100 text-gray-800',
      'On Leave': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <BaseAdminPage
      title="Instructors"
      subtitle="Manage and view all instructor accounts"
      headerAction={
        <Link
          to="/admin/instructors/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          Add Instructor
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search and Filter Bar - Same as Students */}
        {/* ... */}

        {/* Instructors Table */}
        <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInstructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <FiUser className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                        <div className="text-sm text-gray-500">{instructor.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instructor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instructor.courses} courses
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instructor.students} students
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(instructor.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {instructor.joinDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View"
                      >
                        <FiUser className="h-5 w-5" />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - Same as Students */}
        {/* ... */}
      </div>
    </BaseAdminPage>
  );
};

export default Instructors;