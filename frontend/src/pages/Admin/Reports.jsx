// frontend/src/pages/Admin/Reports.jsx
import React, { useState } from 'react';
import { FiDownload, FiFilter, FiBarChart2, FiUsers, FiBook, FiDollarSign } from 'react-icons/fi';
import BaseAdminPage from './BaseAdminPage';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
  const userData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Students',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'New Instructors',
        data: [2, 3, 4, 1, 5, 2],
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.5)',
      },
    ],
  };

  const courseData = {
    labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'],
    datasets: [
      {
        label: 'Enrollments',
        data: [120, 190, 30, 50, 20],
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  return (
    <BaseAdminPage
      title="Reports"
      subtitle="View and analyze system reports"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'users', 'courses', 'revenue'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <FiUsers className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <p className="text-2xl font-semibold text-gray-900">1,234</p>
                  </div>
                </div>
              </div>
              {/* More stat cards... */}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
              <div className="h-80">
                <Line data={userData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Courses</h3>
              <div className="h-80">
                <Bar data={courseData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          )}

          {/* More tabs content... */}
        </div>
      </div>
    </BaseAdminPage>
  );
};

export default Reports;