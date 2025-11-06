// StudentPerformanceChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const StudentPerformanceChart = ({ data }) => {
  const chartData = {
    labels: data?.map(d => d.date) || [],
    datasets: [
      {
        label: 'Performance',
        data: data?.map(d => d.score) || [],
        borderColor: 'rgba(139, 92, 246, 0.8)',
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };

  return (
    <div className="p-4 backdrop-blur-lg bg-white/10 rounded-xl shadow-lg transition-all duration-300">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StudentPerformanceChart;
