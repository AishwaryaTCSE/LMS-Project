// frontend/src/pages/Admin/Analytics.jsx
import React, { useState } from 'react';
import { FiDownload, FiFilter, FiTrendingUp, FiUsers, FiActivity, FiCalendar } from 'react-icons/fi';
import BaseAdminPage from './BaseAdminPage';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for charts
  const engagementData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Active Users',
        data: [65, 59, 80, 81],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  const courseDistributionData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ['#10B981', '#3B82F6', '#9CA3AF'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <BaseAdminPage
      title="Analytics"
      subtitle="Track and analyze platform performance"
    >
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex justify-end">
          <div className="inline-flex rounded-md shadow-sm">
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`${
                  timeRange === range
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } px-4 py-2 text-sm font-medium border border-gray-300 ${
                  range === 'day' ? 'rounded-l-md' : 
                  range === 'year' ? 'rounded-r-md' : 'border-l-0'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat Cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiTrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">$24,780</p>
                <p className="text-sm text-green-600 flex items-center">
                  <FiTrendingUp className="mr-1" /> 12% from last month
                </p>
              </div>
            </div>
          </div>
          {/* More stat cards... */}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Engagement</h3>
            <div className="h-80">
              <Line data={engagementData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Course Distribution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Course Completion</h3>
            <div className="h-80 flex items-center justify-center">
              <div className="w-64 h-64">
                <Doughnut data={courseDistributionData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseAdminPage>
  );
};

export default Analytics;