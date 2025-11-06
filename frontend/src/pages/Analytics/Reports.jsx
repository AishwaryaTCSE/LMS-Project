// Reports.jsx
import React, { useState, useEffect } from 'react';
import { getAnalyticsReport } from '../../api/analyticsApi';
import Loader from '../../components/Loader';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await getAnalyticsReport();
        if (res.success) {
          setReports(res.data);
        } else {
          setError(res.message || 'Failed to load reports');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleFilterChange = (e) => setFilterType(e.target.value);

  const filteredReports = reports.filter((r) => {
    let passFilter = filterType === 'all' || r.type === filterType;
    let passDate = true;
    if (startDate) passDate = new Date(r.date) >= new Date(startDate);
    if (endDate) passDate = passDate && new Date(r.date) <= new Date(endDate);
    return passFilter && passDate;
  });

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100">
      <h1 className="text-3xl font-bold mb-6">Analytics Reports</h1>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <select
          value={filterType}
          onChange={handleFilterChange}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="course">Course</option>
          <option value="student">Student</option>
          <option value="assignment">Assignment</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 transition hover:shadow-2xl"
          >
            <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
            <p className="text-gray-200 mb-2">Type: {report.type}</p>
            <p className="text-gray-300 text-sm mb-2">Date: {new Date(report.date).toLocaleDateString()}</p>
            <p className="text-gray-300 mb-2">{report.summary}</p>
            <button
              onClick={() => alert('Download report feature coming soon!')}
              className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
