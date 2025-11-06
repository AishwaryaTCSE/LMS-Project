// CourseProgressChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const CourseProgressChart = ({ data }) => {
  const chartData = {
    labels: data?.map(d => d.course) || [],
    datasets: [
      {
        label: 'Progress',
        data: data?.map(d => d.progress) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
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
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CourseProgressChart;
