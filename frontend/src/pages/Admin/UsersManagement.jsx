// import React, { useState, useEffect } from 'react';
// import { 
//   FiUsers, FiPlus, FiEdit2, FiTrash2, FiEye, FiDownload, 
//   FiSearch, FiChevronDown, FiChevronUp, FiX, FiCheck
// } from 'react-icons/fi';
// import { 
//   getAllUsers, createUser, updateUser, deleteUser, 
//   bulkUpdateUsers, exportUsers, downloadFile 
// } from '../../api/crudApi';
// import Modal from '../../components/Modal';
// import ConfirmDialog from '../../components/ConfirmDialog';
// import UserForm from '../../components/UserForm';
// import Loader from '../../components/Loader';

// const UsersManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState({ role: 'all', status: 'all' });
//   const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  
//   // Modals
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     fetchUsers();
//   }, [pagination.page, filters, sortConfig, searchQuery]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const params = {
//         page: pagination.page,
//         limit: pagination.limit,
//         q: searchQuery,
//         role: filters.role,
//         status: filters.status,
//         sortBy: sortConfig.key,
//         sortOrder: sortConfig.direction
//       };
//       const response = await getAllUsers(params);
//       setUsers(response.data?.items || response.items || []);
//       setPagination(prev => ({
//         ...prev,
//         total: response.data?.pagination?.total || response.pagination?.total || 0
//       }));
//       setError('');
//     } catch (err) {
//       setError(err.message || 'Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreate = async (userData) => {
//     try {
//       await createUser(userData);
//       setShowAddModal(false);
//       fetchUsers();
//     } catch (err) {
//       alert(err.message || 'Failed to create user');
//     }
//   };

//   const handleUpdate = async (userData) => {
//     try {
//       await updateUser(currentUser._id, userData);
//       setShowEditModal(false);
//       setCurrentUser(null);
//       fetchUsers();
//     } catch (err) {
//       alert(err.message || 'Failed to update user');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteUser(currentUser._id);
//       setShowDeleteDialog(false);
//       setCurrentUser(null);
//       fetchUsers();
//     } catch (err) {
//       alert(err.message || 'Failed to delete user');
//     }
//   };

//   const handleBulkAction = async (action) => {
//     if (selectedUsers.length === 0) {
//       alert('Please select at least one user');
//       return;
//     }
//     try {
//       await bulkUpdateUsers(selectedUsers, action);
//       setSelectedUsers([]);
//       fetchUsers();
//     } catch (err) {
//       alert(err.message || 'Failed to perform bulk action');
//     }
//   };

//   const handleExport = async () => {
//     try {
//       const blob = await exportUsers({ q: searchQuery, ...filters });
//       downloadFile(blob, `users_${Date.now()}.csv`);
//     } catch (err) {
//       alert(err.message || 'Failed to export users');
//     }
//   };

//   const handleSort = (key) => {
//     setSortConfig(prev => ({
//       key,
//       direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const toggleSelectUser = (userId) => {
//     setSelectedUsers(prev => 
//       prev.includes(userId) 
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedUsers.length === users.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(users.map(u => u._id));
//     }
//   };

//   const SortIcon = ({ column }) => {
//     if (sortConfig.key !== column) return null;
//     return sortConfig.direction === 'asc' ? <FiChevronUp className="inline" /> : <FiChevronDown className="inline" />;
//   };

//   if (loading && users.length === 0) return <Loader />;

//   const navigation = [
//     { name: 'Dashboard', href: '/admin/dashboard', icon: FiHome, current: location.pathname === '/admin/dashboard' },
//     { name: 'Users', href: '/admin/users', icon: FiUsers, current: location.pathname.startsWith('/admin/users') },
//     { name: 'Courses', href: '/admin/courses', icon: FiBookOpen, current: location.pathname.startsWith('/admin/courses') },
//     { name: 'Assignments', href: '/admin/assignments', icon: FiUsers, current: location.pathname.startsWith('/admin/assignments') },
//     { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2, current: location.pathname.startsWith('/admin/analytics') },
//     { name: 'System', href: '/admin/system', icon: FiServer, current: location.pathname.startsWith('/admin/system') },
//     { name: 'Settings', href: '/admin/settings', icon: FiSettings, current: location.pathname.startsWith('/admin/settings') },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 flex">
//       {/* Purple Sidebar */}
//       <div className="w-64 bg-purple-600 text-white flex flex-col">
//         <div className="p-6 border-b border-purple-700">
//           <h1 className="text-2xl font-bold">Akademi</h1>
//         </div>
        
//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//           {navigation.map((item) => (
//             <Link
//               key={item.name}
//               to={item.href}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                 item.current 
//                   ? 'bg-purple-700 text-white' 
//                   : 'text-purple-100 hover:bg-purple-700'
//               }`}
//             >
//               <item.icon className="w-5 h-5 flex-shrink-0" />
//               <span className="flex-1">{item.name}</span>
//               {item.current && <FiChevronRight className="w-4 h-4" />}
//             </Link>
//           ))}
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Header */}
//         <header className="bg-white shadow-sm border-b border-gray-200">
//           <div className="px-6 py-4 flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-gray-900">Users Management</h2>
//             <div className="flex items-center gap-4">
//               <button className="p-2 hover:bg-gray-100 rounded-full">
//                 <FiSearch className="w-5 h-5 text-gray-600" />
//               </button>
//               <button className="p-2 hover:bg-gray-100 rounded-full">
//                 <FiBell className="w-5 h-5 text-gray-600" />
//               </button>
//               <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
//                 <span className="text-white text-sm font-medium">
//                   {user?.firstName?.[0] || 'A'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="flex-1 overflow-y-auto p-6">
//       <div className="mb-6 flex items-center justify-between">
//         <div className="flex gap-2">
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
//           >
//             <FiPlus /> Add User
//           </button>
//           <button
//             onClick={handleExport}
//             className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             <FiDownload /> Export
//           </button>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="mb-4 flex flex-wrap gap-4 items-center">
//         <div className="flex-1 min-w-[300px]">
//           <div className="relative">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setPagination(prev => ({ ...prev, page: 1 }));
//               }}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>
//         </div>
//         <select
//           value={filters.role}
//           onChange={(e) => {
//             setFilters(prev => ({ ...prev, role: e.target.value }));
//             setPagination(prev => ({ ...prev, page: 1 }));
//           }}
//           className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//         >
//           <option value="all">All Roles</option>
//           <option value="student">Student</option>
//           <option value="teacher">Teacher</option>
//           <option value="admin">Admin</option>
//         </select>
//         <select
//           value={filters.status}
//           onChange={(e) => {
//             setFilters(prev => ({ ...prev, status: e.target.value }));
//             setPagination(prev => ({ ...prev, page: 1 }));
//           }}
//           className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//         >
//           <option value="all">All Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>
//         {selectedUsers.length > 0 && (
//           <div className="flex gap-2">
//             <button
//               onClick={() => handleBulkAction('activate')}
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//             >
//               Activate ({selectedUsers.length})
//             </button>
//             <button
//               onClick={() => handleBulkAction('deactivate')}
//               className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
//             >
//               Deactivate ({selectedUsers.length})
//             </button>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
//       )}

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left">
//                 <input
//                   type="checkbox"
//                   checked={selectedUsers.length === users.length && users.length > 0}
//                   onChange={toggleSelectAll}
//                   className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
//                 />
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort('firstName')}
//               >
//                 Name <SortIcon column="firstName" />
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort('email')}
//               >
//                 Email <SortIcon column="email" />
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort('role')}
//               >
//                 Role <SortIcon column="role" />
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort('isActive')}
//               >
//                 Status <SortIcon column="isActive" />
//               </th>
//               <th 
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
//                 onClick={() => handleSort('createdAt')}
//               >
//                 Created <SortIcon column="createdAt" />
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user) => (
//               <tr key={user._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedUsers.includes(user._id)}
//                     onChange={() => toggleSelectUser(user._id)}
//                     className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
//                   />
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">
//                     {user.firstName} {user.lastName}
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-500">{user.email}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 capitalize">
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {user.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(user.createdAt).toLocaleDateString()}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => {
//                         setCurrentUser(user);
//                         setShowViewModal(true);
//                       }}
//                       className="text-blue-600 hover:text-blue-900"
//                       title="View"
//                     >
//                       <FiEye />
//                     </button>
//                     <button
//                       onClick={() => {
//                         setCurrentUser(user);
//                         setShowEditModal(true);
//                       }}
//                       className="text-indigo-600 hover:text-indigo-900"
//                       title="Edit"
//                     >
//                       <FiEdit2 />
//                     </button>
//                     <button
//                       onClick={() => {
//                         setCurrentUser(user);
//                         setShowDeleteDialog(true);
//                       }}
//                       className="text-red-600 hover:text-red-900"
//                       title="Delete"
//                     >
//                       <FiTrash2 />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
//             <div className="text-sm text-gray-700">
//               Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//                 disabled={pagination.page === 1}
//                 className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//                 disabled={pagination.page >= pagination.totalPages}
//                 className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New User">
//         <UserForm onSubmit={handleCreate} onCancel={() => setShowAddModal(false)} />
//       </Modal>

//       <Modal isOpen={showEditModal} onClose={() => {
//         setShowEditModal(false);
//         setCurrentUser(null);
//       }} title="Edit User">
//         {currentUser && (
//           <UserForm 
//             user={currentUser} 
//             onSubmit={handleUpdate} 
//             onCancel={() => {
//               setShowEditModal(false);
//               setCurrentUser(null);
//             }} 
//           />
//         )}
//       </Modal>

//       <Modal isOpen={showViewModal} onClose={() => {
//         setShowViewModal(false);
//         setCurrentUser(null);
//       }} title="User Details">
//         {currentUser && (
//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium text-gray-700">Name</label>
//               <p className="mt-1 text-gray-900">{currentUser.firstName} {currentUser.lastName}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">Email</label>
//               <p className="mt-1 text-gray-900">{currentUser.email}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">Role</label>
//               <p className="mt-1 text-gray-900 capitalize">{currentUser.role}</p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">Status</label>
//               <p className="mt-1">
//                 <span className={`px-2 py-1 rounded-full text-xs ${
//                   currentUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                 }`}>
//                   {currentUser.isActive ? 'Active' : 'Inactive'}
//                 </span>
//               </p>
//             </div>
//             <div>
//               <label className="text-sm font-medium text-gray-700">Created</label>
//               <p className="mt-1 text-gray-900">{new Date(currentUser.createdAt).toLocaleString()}</p>
//             </div>
//           </div>
//         )}
//       </Modal>

//       <ConfirmDialog
//         isOpen={showDeleteDialog}
//         onClose={() => {
//           setShowDeleteDialog(false);
//           setCurrentUser(null);
//         }}
//         onConfirm={handleDelete}
//         title="Delete User"
//         message={`Are you sure you want to delete ${currentUser?.firstName} ${currentUser?.lastName}? This action cannot be undone.`}
//         confirmText="Delete"
//       />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UsersManagement;

// frontend/src/pages/Admin/UsersManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiUserPlus, 
  FiEdit2, 
  FiTrash2, 
  FiUser,
  FiCheck,
  FiX
} from 'react-icons/fi';
import BaseAdminPage from './BaseAdminPage';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const itemsPerPage = 10;

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockUsers = Array(25).fill().map((_, i) => {
          const roles = ['admin', 'instructor', 'student'];
          const statuses = ['active', 'inactive', 'suspended'];
          const role = roles[i % 3];
          return {
            id: `USR${1000 + i}`,
            firstName: `User${i + 1}`,
            lastName: `Last${i + 1}`,
            email: `${role}${i + 1}@example.com`,
            role,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
            joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)
          };
        });

        setUsers(mockUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!currentUser) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUsers(users.filter(user => user.id !== currentUser.id));
      setShowDeleteDialog(false);
      setCurrentUser(null);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: 'bg-purple-100 text-purple-800',
      instructor: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleClasses[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <BaseAdminPage title="Users Management" subtitle="Loading users...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </BaseAdminPage>
    );
  }

  if (error) {
    return (
      <BaseAdminPage title="Users Management" subtitle="Error loading users">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiX className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </BaseAdminPage>
    );
  }

  return (
    <BaseAdminPage
      title="Users Management"
      subtitle="Manage all user accounts and permissions"
      headerAction={
        <Link
          to="/admin/users/add"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <FiUserPlus className="mr-2 h-4 w-4" />
          Add User
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FiFilter className="mr-2 h-4 w-4" />
              Filter
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FiDownload className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <motion.tr 
                  key={user.id} 
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <FiUser className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View"
                      >
                        <FiUser className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/admin/users/${user.id}/edit`}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => {
                          setCurrentUser(user);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredUsers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setCurrentUser(null);
        }}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${currentUser?.firstName} ${currentUser?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </BaseAdminPage>
  );
};

export default UsersManagement;