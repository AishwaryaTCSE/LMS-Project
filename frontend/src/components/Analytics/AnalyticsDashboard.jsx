import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    axios.get('/api/v1/analytics/enrollments').then(res => setAnalytics(res.data));
  }, []);

  if (!analytics) return <div>Loading...</div>;

  const chartData = {
    labels: analytics.map(a => a.courseName),
    datasets: [{
      label: 'Enrollments',
      data: analytics.map(a => a.enrollments),
      backgroundColor: 'rgba(59, 130, 246, 0.5)'
    }]
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;