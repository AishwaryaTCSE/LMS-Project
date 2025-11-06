// Performance.jsx
import React, { useState, useEffect } from 'react';
import { getAnalyticsReport } from '../../api/analyticsApi';
import Loader from '../../components/Loader';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Performance = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7'); // last 7 days

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await getAnalyticsReport();
        if (res.success) {
          setAnalytics(res.data);
        } else {
          setError(res.message || 'Failed to load analytics');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  const filteredAnalytics = analytics.filter((a) => {
    const dateDiff = (new Date() - new Date(a.date)) / (1000 * 60 * 60 * 24);
    return dateDiff <= Number(timeRange);
  });

  const chartData = {
    labels: filteredAnalytics.map((a) => new Date(a.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Active Students',
        data: filteredAnalytics.map((a) => a.activeStudents),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.4
      },
      {
        label: 'Completed Assignments',
        data: filteredAnalytics.map((a) => a.completedAssignments),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4
      }
    ]
  };

  const barData = {
    labels: filteredAnalytics.map((a) => a.course),
    datasets: [
      {
        label: 'Average Score',
        data: filteredAnalytics.map((a) => a.averageScore),
        backgroundColor: '#f59e0b'
      }
    ]
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
      <h1 className="text-3xl font-bold mb-6">Performance Analytics</h1>
      <div className="mb-6 flex gap-4 items-center">
        <label className="font-semibold">Time Range:</label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 transition hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4">Student Activity</h2>
          <Line data={chartData} />
        </div>
        <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 transition hover:shadow-2xl">
          <h2 className="text-xl font-semibold mb-4">Course Performance</h2>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default Performance;
