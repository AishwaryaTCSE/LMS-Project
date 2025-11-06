// src/components/InstructorSidebar.jsx
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBookOpen, 
  FiUsers, 
  FiMessageSquare, 
  FiBarChart2,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

import useAuth from '../hooks/useAuth';
import { useNotifications } from '../context/NotificationContext';

const InstructorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { unreadMessageCount } = useNotifications();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      icon: FiHome, 
      path: '/instructor/dashboard' 
    },
    { 
      name: 'Courses', 
      icon: FiBookOpen, 
      path: '/instructor/courses' 
    },
    { 
      name: 'Students', 
      icon: FiUsers, 
      path: '/instructor/students' 
    },
    { 
      name: 'Messages', 
      icon: FiMessageSquare, 
      path: '/instructor/messages'
    },
    { 
      name: 'Analytics', 
      icon: FiBarChart2, 
      path: '/instructor/analytics' 
    },
    { 
      name: 'Settings', 
      icon: FiSettings, 
      path: '/instructor/settings' 
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 w-64">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Instructor Panel</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/instructor/dashboard'}
            className={({ isActive }) => {
              // Special handling for dashboard to match exact path
              const isDashboard = item.path === '/instructor/dashboard';
              const isActiveState = isDashboard 
                ? location.pathname === '/instructor/dashboard' || location.pathname === '/instructor/'
                : location.pathname.startsWith(item.path);
              
              return `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActiveState 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`;
            }}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
            {item.name === 'Messages' && unreadMessageCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <FiLogOut className="mr-3 h-5 w-5 text-gray-500" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default InstructorSidebar;