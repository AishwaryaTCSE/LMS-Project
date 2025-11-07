// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ role = 'student' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Try to use useLocation if available, otherwise fall back to window.location
  let location;
  try {
    // This will throw if not inside a Router
    // eslint-disable-next-line react-hooks/rules-of-hooks
    location = useLocation();
  } catch (e) {
    // Fallback for when not in a Router context
    location = { pathname: currentPath };
  }

  // Update current path when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  // Define navigation items with their paths
  const navItems = {
    student: [
      { name: 'Dashboard', path: '/student/dashboard' },
      { name: 'Courses', path: '/student/courses' },
      { name: 'Assessments', path: '/student/assessments/quiz' },
      { name: 'Discussions', path: '/discussion' },
      { name: 'Profile', path: '/student/profile' }
    ],
    instructor: [
      { name: 'Dashboard', path: '/instructor/dashboard' },
      { name: 'Courses', path: '/instructor/courses' },
      { name: 'Students', path: '/instructor/students' },
      { name: 'Messages', path: '/instructor/messages' },
      { name: 'Analytics', path: '/instructor/analytics' },
      { name: 'Settings', path: '/instructor/settings' }
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Users', path: '/admin/users' },
      { name: 'Courses', path: '/admin/courses' },
      { name: 'Reports', path: '/admin/analytics/reports' },
      { name: 'Analytics', path: '/admin/analytics' },
      { name: 'Profile', path: '/admin/profile' }
    ]
  };

  // Ensure the role is valid, default to 'student' if not
  const userRole = navItems[role] ? role : 'student';

  // Helper function to check if a link is active
  const isActive = (path) => {
    return currentPath.startsWith(path);
  };
  
  // Handle navigation for non-router context
  const handleNavigation = (e, path) => {
    if (window.location.pathname !== path) {
      window.location.href = path;
    } else {
      e.preventDefault();
    }
  };

  return (
    <aside className={`flex flex-col p-4 ${collapsed ? 'w-20' : 'w-64'} bg-white/10 backdrop-blur-lg rounded-r-xl shadow-lg transition-all duration-300`}>
      <button 
        onClick={() => setCollapsed(!collapsed)} 
        className="mb-6 text-gray-800 font-bold hover:bg-white/20 p-2 rounded-lg"
      >
        {collapsed ? '>' : '<'}
      </button>
      <nav className="flex flex-col space-y-2">
        {navItems[userRole].map((item) => (
          <div key={item.path}>
            {window.ReactRouterDOM ? (
              <Link
                to={item.path}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 font-medium block ${
                  isActive(item.path)
                    ? 'bg-white/30 text-white font-semibold'
                    : 'text-gray-900 hover:bg-white/20'
                }`}
              >
                {collapsed ? item.name.charAt(0) : item.name}
              </Link>
            ) : (
              <a
                href={item.path}
                onClick={(e) => handleNavigation(e, item.path)}
                className={`px-3 py-2 rounded-lg transition-colors duration-200 font-medium block ${
                  isActive(item.path)
                    ? 'bg-white/30 text-white font-semibold'
                    : 'text-gray-900 hover:bg-white/20'
                }`}
              >
                {collapsed ? item.name.charAt(0) : item.name}
              </a>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
