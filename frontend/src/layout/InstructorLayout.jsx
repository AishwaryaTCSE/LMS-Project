// src/layout/InstructorLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InstructorSidebar from '../components/InstructorSidebar';
import { FiMenu, FiX, FiBell, FiUser, FiCheck } from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';
import useAuth from '../hooks/useAuth';
import ErrorBoundary from '../components/ErrorBoundary';

// Helper function to get page title from URL
const getPageTitle = (pathname) => {
  const path = pathname.split('/').pop();
  switch(path) {
    case 'dashboard':
      return 'Dashboard';
    case 'courses':
      return 'My Courses';
    case 'students':
      return 'Students';
    case 'analytics':
      return 'Analytics';
    default:
      return 'Instructor Portal';
  }
};

const InstructorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { items: notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const navigate = useNavigate();

  const handleMarkAllRead = async () => { try { await markAllAsRead(); } catch (_) {} };
  const handleClickNotification = async (n) => {
    try { await markAsRead(n._id); } catch (_) {}
    if (n?.metadata?.route) {
      navigate(n.metadata.route);
    } else if (n?.type === 'message') {
      navigate('/instructor/messages');
    } else if (n?.type === 'course' && n?.metadata?.courseId) {
      navigate(`/courses/${n.metadata.courseId}`);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  // Redirect if not authenticated or not an instructor
  if (!user || (user.role !== 'instructor' && user.role !== 'teacher')) {
    console.log('User not authenticated or not an instructor, redirecting to login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (error) {
    console.error('Authentication error:', error);
    return (
      <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500">
        <p>Authentication error. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
      <Navbar role="instructor" />
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-200 ease-in-out z-30`}
        >
          <InstructorSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          {/* Top navigation */}
          <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <button
                  className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
                <h1 className="ml-2 text-xl font-semibold text-gray-800">{pageTitle}</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative"
                    aria-label="Notifications"
                    onClick={() => setNotifOpen((v) => !v)}
                  >
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-h-[18px] min-w-[18px] px-1.5 py-0.5 bg-red-500 text-white text-[10px] leading-none font-semibold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-40">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">Notifications</p>
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">No notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <button
                              key={n._id}
                              onClick={() => handleClickNotification(n)}
                              className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 ${n.isRead ? 'opacity-70' : ''}`}
                            >
                              <span className={`mt-1 h-2 w-2 rounded-full ${n.isRead ? 'bg-gray-300' : 'bg-indigo-500'}`}></span>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{n.title || 'Update'}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                              </div>
                              {!n.isRead && <FiCheck className="text-gray-400 mt-1" />}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FiUser className="text-indigo-600" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-8rem)]">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InstructorLayout;