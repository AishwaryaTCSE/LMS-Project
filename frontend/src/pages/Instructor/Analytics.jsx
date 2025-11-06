// src/pages/Instructor/Analytics.jsx
import React from 'react';
import { 
  FiUsers, 
  FiBarChart2, 
  FiDollarSign, 
  FiBookOpen, 
  FiDownload,
  FiCalendar,
  FiFilter,
  FiChevronDown
} from 'react-icons/fi';
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

const InstructorAnalytics = () => {
  // Mock data - replace with actual data from your API
  const studentEngagementData = [
    { name: 'Jan', active: 4000, completed: 2400, dropped: 2400 },
    { name: 'Feb', active: 3000, completed: 1398, dropped: 2210 },
    { name: 'Mar', active: 2000, completed: 9800, dropped: 2290 },
    { name: 'Apr', active: 2780, completed: 3908, dropped: 2000 },
    { name: 'May', active: 1890, completed: 4800, dropped: 2181 },
    { name: 'Jun', active: 2390, completed: 3800, dropped: 2500 },
    { name: 'Jul', active: 3490, completed: 4300, dropped: 2100 },
  ];

  const coursePerformanceData = [
    { name: 'React Basics', students: 4000, completion: 65, revenue: 2400 },
    { name: 'Advanced JS', students: 3000, completion: 82, revenue: 1398 },
    { name: 'UI/UX Design', students: 2000, completion: 45, revenue: 9800 },
    { name: 'Node.js', students: 2780, completion: 78, revenue: 3908 },
    { name: 'Python', students: 1890, completion: 91, revenue: 4800 },
  ];

  const stats = [
    { title: 'Total Students', value: '12,845', change: '+12.5%', changeType: 'increase', icon: <FiUsers className="h-6 w-6" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Courses', value: '24', change: '+2', changeType: 'increase', icon: <FiBookOpen className="h-6 w-6" />, color: 'bg-green-100 text-green-600' },
    { title: 'Total Revenue', value: '$48,240', change: '+8.2%', changeType: 'increase', icon: <FiDollarSign className="h-6 w-6" />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Completion Rate', value: '78%', change: '+5.3%', changeType: 'increase', icon: <FiBarChart2 className="h-6 w-6" />, color: 'bg-yellow-100 text-yellow-600' },
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
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
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
          </div>
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
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest student activities and course updates</p>
        </div>
        <div className="bg-white overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {`U${item}`}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">User {item} completed "React Basics"</p>
                    <p className="text-sm text-gray-500">2 hours ago • 92% score</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;