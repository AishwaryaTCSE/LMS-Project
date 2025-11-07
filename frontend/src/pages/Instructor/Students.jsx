// src/pages/Instructor/Students.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiMail, 
  FiUser, 
  FiBook, 
  FiAward, 
  FiUsers, 
  FiTrendingUp, 
  FiClock,
  FiFilter,
  FiChevronDown,
  FiMessageSquare,
  FiPlus,
  FiDownload
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { listStudents, exportStudents, addStudent } from '../../api/studentApi';

const InstructorStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const load = async () => {
    try {
      setLoading(true);
      const data = await listStudents({ q: searchTerm, status: activeFilter, page, limit });
      setStudents(data.items || []);
      setTotal(data.pagination?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); // eslint-disable-next-line
  }, [activeFilter, page, limit]);
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      load();
    }, 300);
    return () => clearTimeout(id);
  // eslint-disable-next-line
  }, [searchTerm]);

  const stats = [
    { title: 'Total Students', value: total, icon: <FiUsers className="h-5 w-5" />, change: '', color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Now', value: students.filter(s => s.isActive).length, icon: <FiTrendingUp className="h-5 w-5" />, change: '', color: 'bg-green-100 text-green-600' },
    { title: 'Avg. Progress', value: '—', icon: <FiAward className="h-5 w-5" />, change: '', color: 'bg-purple-100 text-purple-600' },
    { title: 'Completion Rate', value: '—', icon: <FiClock className="h-5 w-5" />, change: '', color: 'bg-yellow-100 text-yellow-600' },
  ];

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and monitor your students' progress and activities</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button onClick={async()=>{
            const blob = await exportStudents({ q: searchTerm, status: activeFilter });
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
            const a = document.createElement('a');
            a.href = url; a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); a.remove();
          }} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <FiDownload className="-ml-1 mr-2 h-4 w-4" />
            Export
          </button>
          <button onClick={()=> setShowAddModal(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <FiPlus className="-ml-1 mr-2 h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <span className={stat.change.includes('+') ? 'text-green-600' : 'text-gray-500'}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64 mb-3 sm:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button 
              type="button" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter className="mr-2 h-4 w-4" />
              {activeFilter === 'all' ? 'All Students' : activeFilter === 'active' ? 'Active' : 'Inactive'}
              <FiChevronDown className="ml-2 h-4 w-4" />
            </button>
            
            {isFilterOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => {
                      setActiveFilter('all');
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeFilter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    All Students
                  </button>
                  <button
                    onClick={() => {
                      setActiveFilter('active');
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeFilter === 'active' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      setActiveFilter('inactive');
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${activeFilter === 'inactive' ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Inactive
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Student Directory</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {loading ? (
            <div className="px-4 py-12 text-center text-gray-500">Loading...</div>
          ) : students.length > 0 ? (
            students.map((student) => (
              <li key={student.id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FiUser className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</h4>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.isActive ? 'active' : 'inactive'}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <FiMail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="truncate">{student.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FiMessageSquare className="-ml-1 mr-1.5 h-4 w-4" />
                        Message
                      </button>
                    </div>
                  </div>
                  {/* Optional progress UI can be wired later */}
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Joined</span>
                      <span>{new Date(student.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="px-4 py-12 text-center">
              <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search or filter to find what you\'re looking for.' : 'No students match the current filters.'}
              </p>
            </div>
          )}
        </ul>
        
        {/* Pagination */}
        {total > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">Page {page} of {totalPages}</p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button disabled={page===1} onClick={()=> setPage(p => Math.max(1, p-1))} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button disabled={page>=totalPages} onClick={()=> setPage(p => p+1)} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Student</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="First name" 
                  value={newStudent.firstName} 
                  onChange={e=> setNewStudent({ ...newStudent, firstName: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Last name" 
                  value={newStudent.lastName} 
                  onChange={e=> setNewStudent({ ...newStudent, lastName: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Email" 
                  value={newStudent.email} 
                  onChange={e=> setNewStudent({ ...newStudent, email: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Password (min 8 characters)" 
                  value={newStudent.password} 
                  onChange={e=> setNewStudent({ ...newStudent, password: e.target.value })} 
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" 
                onClick={()=> setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50" 
                onClick={async()=>{
                  try {
                    if (!newStudent.firstName || !newStudent.lastName || !newStudent.email || !newStudent.password) {
                      toast.error('Please fill all required fields');
                      return;
                    }
                    if (newStudent.password.length < 8) {
                      toast.error('Password must be at least 8 characters');
                      return;
                    }
                    await addStudent(newStudent);
                    toast.success('Student added successfully!');
                    setShowAddModal(false);
                    setNewStudent({ firstName: '', lastName: '', email: '', password: '' });
                    load();
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to add student');
                  }
                }}
                disabled={!newStudent.firstName || !newStudent.lastName || !newStudent.email || !newStudent.password}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorStudents;