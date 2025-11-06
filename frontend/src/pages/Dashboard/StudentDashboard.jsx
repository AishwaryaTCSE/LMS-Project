import React, { useState, useEffect } from 'react';
import { 
  FiHome,
  FiBookOpen,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiClock,
  FiAward,
  FiCheckCircle,
  FiBarChart2,
  FiBookmark,
  FiUser,
  FiPlus,
  FiChevronRight
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StudentPerformanceChart from '../../components/Charts/StudentPerformanceChart';
import { getAnalyticsReport } from '../../api/analyticsApi';
import Loader from '../../components/Loader';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New assignment posted for Mathematics', time: '2 hours ago', read: false },
    { id: 2, message: 'Your submission for Science Project was graded', time: '1 day ago', read: false },
  ]);
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setDashboardData({
            coursesEnrolled: 5,
            assignmentsPending: 3,
            quizzesCompleted: 8,
            overallGrade: 87,
            courses: [
              { id: 1, name: 'Mathematics', progress: 75, color: 'bg-blue-500' },
              { id: 2, name: 'Science', progress: 60, color: 'bg-green-500' },
              { id: 3, name: 'English', progress: 45, color: 'bg-purple-500' },
              { id: 4, name: 'History', progress: 30, color: 'bg-yellow-500' },
              { id: 5, name: 'Computer Science', progress: 20, color: 'bg-red-500' },
            ],
            upcomingAssignments: [
              { id: 1, title: 'Math Assignment 4', dueDate: '2025-11-15', course: 'Mathematics', type: 'assignment' },
              { id: 2, title: 'Science Project', dueDate: '2025-11-20', course: 'Science', type: 'project' },
              { id: 3, title: 'Literature Essay', dueDate: '2025-11-25', course: 'English', type: 'essay' },
            ],
            recentActivities: [
              { id: 1, title: 'Submitted Math homework', time: '2 hours ago', type: 'submission' },
              { id: 2, title: 'Graded Science quiz: 95%', time: '1 day ago', type: 'grade' },
              { id: 3, title: 'New message from instructor', time: '2 days ago', type: 'message' },
            ],
            notifications: [
              { id: 1, message: 'New grade received for Math Quiz 3', time: '2 hours ago', read: false },
              { id: 2, message: 'Science Project deadline extended', time: '1 day ago', read: true },
              { id: 3, message: 'New announcement from your instructor', time: '2 days ago', read: true }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  const stats = [
    { 
      title: 'Courses Enrolled', 
      value: dashboardData.coursesEnrolled, 
      icon: <FiBookOpen className="w-8 h-8" />,
      change: '+2 from last month',
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: 'Assignments Due', 
      value: dashboardData.assignmentsPending, 
      icon: <FiClock className="w-8 h-8" />,
      change: '3 pending',
      color: 'bg-amber-100 text-amber-600'
    },
    { 
      title: 'Quizzes Completed', 
      value: dashboardData.quizzesCompleted, 
      icon: <FiCheckCircle className="w-8 h-8" />,
      change: '80% success rate',
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: 'Overall Grade', 
      value: `${dashboardData.overallGrade}%`, 
      icon: <FiAward className="w-8 h-8" />,
      change: '2% increase',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: FiHome, current: location.pathname === '/student/dashboard' },
    { name: 'My Courses', href: '/student/courses', icon: FiBook, current: location.pathname.startsWith('/student/courses') },
    { name: 'Assignments', href: '/student/assignments', icon: FiFileText, current: location.pathname.startsWith('/student/assignments') },
    { name: 'Grades', href: '/student/grades', icon: FiBarChart2, current: location.pathname.startsWith('/student/grades') },
    { name: 'Resources', href: '/student/resources', icon: FiBookmark, current: location.pathname.startsWith('/student/resources') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-indigo-600">LMS</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${item.current 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon 
                    className={`${item.current 
                      ? 'text-indigo-500' 
                      : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-6 w-6`} 
                    aria-hidden="true" 
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">JS</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">John Smith</p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center md:items-stretch md:justify-between">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900 md:hidden">Dashboard</h1>
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <FiBell className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <div className="ml-3 relative">
                    <div>
                      <button
                        type="button"
                        className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        id="user-menu"
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">JS</span>
                        </div>
                        <FiChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    {isProfileMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Settings
                        </Link>
                        <Link
                          to="/logout"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Sign out
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${item.current
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">JS</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">John Smith</div>
                    <div className="text-sm font-medium text-gray-500">Student</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign out
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>

      <main className="flex-1 overflow-y-auto focus:outline-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
            <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your courses.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-md p-3 ${stat.color.split(' ')[0]} ${stat.color.includes('bg-blue') ? 'bg-blue-50' : stat.color.includes('bg-green') ? 'bg-green-50' : stat.color.includes('bg-amber') ? 'bg-amber-50' : 'bg-purple-50'}`}>
                      {stat.icon}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.title}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Chart */}
            <div className="lg:col-span-2 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Performance Overview</h3>
                  <div className="mt-2 sm:mt-0">
                    <select 
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option>Last 6 Months</option>
                      <option>This Year</option>
                      <option>All Time</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="h-64">
                  <StudentPerformanceChart data={dashboardData.performanceData} />
                </div>
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Deadlines</h3>
              </div>
              <div className="bg-white shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {dashboardData.upcomingAssignments.map((assignment) => (
                    <li key={assignment.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                            <FiCalendar className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{assignment.title}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <Link 
                                to={`/assignments/${assignment.id}`}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{assignment.course}</p>
                          <div className="mt-1 flex items-center text-sm text-amber-600">
                            <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4" />
                            <p>Due {assignment.dueDate}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Link 
                    to="/assignments"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all assignments
                  </Link>
                </div>
              </div>
            </div>
        </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentActivities.map((activity) => (
                <li 
                  key={notification.id} 
                  className={`px-4 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!notification.read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <FiBell className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                        {!notification.read && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <Link 
                to="/notifications"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all notifications
              </Link>
            </div>
          </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
