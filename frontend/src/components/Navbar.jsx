import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMenu, FiX, FiBell, FiUser, FiLogOut, FiSettings,
  FiHome, FiUsers, FiBook, FiBarChart2, FiFileText, FiMessageSquare
} from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const Navbar = ({ role = 'admin' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = {
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
      { name: 'Users', path: '/admin/users', icon: FiUsers },
      { name: 'Courses', path: '/admin/courses', icon: FiBook },
      { name: 'Reports', path: '/admin/reports', icon: FiFileText },
      { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
    ],
    instructor: [
      { name: 'Dashboard', path: '/instructor/dashboard', icon: FiHome },
      { name: 'Courses', path: '/instructor/courses', icon: FiBook },
      { name: 'Students', path: '/instructor/students', icon: FiUsers },
      { name: 'Messages', path: '/instructor/messages', icon: FiMessageSquare },
      { name: 'Analytics', path: '/instructor/analytics', icon: FiBarChart2 },
    ],
    student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: FiHome },
      { name: 'Courses', path: '/student/courses', icon: FiBook },
      { name: 'Messages', path: '/student/messages', icon: FiMessageSquare },
      { name: 'Profile', path: '/student/profile', icon: FiUser },
    ]
  };

  const items = navItems[role] || navItems.admin;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={`/${role}/dashboard`} className="text-xl font-bold text-indigo-600">
                LMS System
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <FiBell className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <Link
                to={`/${role}/settings`}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <FiSettings className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500"
                title="Logout"
              >
                <FiLogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-indigo-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <FiUser className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to={`/${role}/settings`}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
