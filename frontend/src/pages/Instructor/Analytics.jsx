// src/pages/Instructor/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiBarChart2, 
  FiDollarSign, 
  FiBookOpen, 
  FiDownload,
  FiCalendar,
  FiFilter,
  FiChevronDown,
  FiActivity
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { getInstructorAnalytics } from '../../api/instructorApi';
import Loader from '../../components/Loader';

const InstructorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getInstructorAnalytics();
      const data = response.data || response;
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
      // Set mock data as fallback
      setAnalyticsData({
        totalCourses: 0,
        totalStudents: 0,
        averageStudentsPerCourse: 0,
        courses: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewActivity = (studentId) => {
    setSelectedStudent(studentId);
    // Fetch activity data for selected student
    toast.info('Fetching activity data...');
  };

  if (loading) {
    return <Loader />;
  }

  // Transform data for charts
  const studentEngagementData = analyticsData?.courses?.map((course, idx) => ({
    name: course.title?.substring(0, 10) || `Course ${idx + 1}`,
    students: course.studentCount || 0
  })) || [];

  const stats = [
    { 
      title: 'Total Students', 
      value: analyticsData?.totalStudents || 0, 
      change: '+12.5%', 
      changeType: 'increase', 
      icon: <FiUsers className="h-6 w-6" />, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      title: 'Active Courses', 
      value: analyticsData?.totalCourses || 0, 
      change: `+${analyticsData?.totalCourses || 0}`, 
      changeType: 'increase', 
      icon: <FiBookOpen className="h-6 w-6" />, 
      color: 'bg-green-100 text-green-600' 
    },
    { 
      title: 'Avg Students/Course', 
      value: Math.round(analyticsData?.averageStudentsPerCourse || 0), 
      change: '+8.2%', 
      changeType: 'increase', 
      icon: <FiDollarSign className="h-6 w-6" />, 
      color: 'bg-purple-100 text-purple-600' 
    },
    { 
      title: 'Completion Rate', 
      value: '78%', 
      change: '+5.3%', 
      changeType: 'increase', 
      icon: <FiBarChart2 className="h-6 w-6" />, 
      color: 'bg-yellow-100 text-yellow-600' 
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const pieData = [
    { name: 'Completed', value: 65 },
    { name: 'In Progress', value: 25 },
    { name: 'Not Started', value: 10 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Track and analyze your course performance and student engagement</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-10 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="last-30-days"
            >
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="this-year">This Year</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiDownload className="-ml-1 mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Student Engagement */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Student Engagement</h2>
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Active
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Dropped
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={studentEngagementData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#3B82F6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="dropped" stroke="#F59E0B" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Completion */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Course Completion</h2>
          <div className="h-80 flex flex-col items-center justify-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {pieData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs text-gray-500 mt-1">{entry.name}</span>
                  <span className="text-sm font-medium">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Performance */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Course Performance</h2>
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              defaultValue="all-courses"
            >
              <option value="all-courses">All Courses</option>
              <option value="active">Active Courses</option>
              <option value="completed">Completed Courses</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={coursePerformanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="students" fill="#3B82F6" name="Students" radius={[0, 4, 4, 0]} />
              <Bar dataKey="completion" fill="#10B981" name="Completion %" radius={[0, 4, 4, 0]} />
              <Bar dataKey="revenue" fill="#8B5CF6" name="Revenue ($)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Student Activity</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">View activity data for selected students</p>
        </div>
        <div className="bg-white overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {analyticsData?.courses?.slice(0, 5).map((course, idx) => (
              <li key={course.id || idx} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                      <FiBookOpen className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-500">{course.studentCount || 0} students enrolled</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewActivity(course.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    <FiActivity className="mr-1 h-4 w-4" />
                    View Activity
                  </button>
                </div>
              </li>
            ))}
            {(!analyticsData?.courses || analyticsData.courses.length === 0) && (
              <li className="px-6 py-4 text-center text-gray-500">
                No courses available
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;