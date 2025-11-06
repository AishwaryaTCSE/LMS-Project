import React, { useState, useEffect } from 'react';
import StudentPerformanceChart from '../../components/Charts/StudentPerformanceChart';
import { getAnalyticsReport } from '../../api/analyticsApi';
import Loader from '../../components/Loader';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnalyticsReport();
        setDashboardData(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-indigo-500 to-purple-500">
      <h1 className="text-white text-3xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Courses Enrolled', value: dashboardData.coursesEnrolled },
          { title: 'Assignments Pending', value: dashboardData.assignmentsPending },
          { title: 'Quizzes Completed', value: dashboardData.quizzesCompleted },
          { title: 'Overall Grade', value: `${dashboardData.overallGrade}%` }
        ].map((card, index) => (
          <div
            key={index}
            className="p-5 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg flex flex-col justify-center items-center transition-transform hover:scale-105"
          >
            <h2 className="text-xl text-white font-semibold mb-2">{card.title}</h2>
            <p className="text-gray-200 text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg">
          <h2 className="text-xl text-white font-semibold mb-4">Performance Chart</h2>
          <StudentPerformanceChart data={dashboardData.performanceData} />
        </div>

        <div className="p-5 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg flex flex-col">
          <h2 className="text-xl text-white font-semibold mb-4">Upcoming Assignments</h2>
          <ul className="space-y-2">
            {dashboardData.upcomingAssignments.map((assignment) => (
              <li
                key={assignment.id}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-lg flex justify-between items-center text-gray-200"
              >
                <span>{assignment.title}</span>
                <span className="text-sm text-gray-300">{assignment.dueDate}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 p-5 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg">
        <h2 className="text-xl text-white font-semibold mb-4">Recent Notifications</h2>
        <ul className="space-y-2">
          {dashboardData.notifications.map((note, index) => (
            <li
              key={index}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-lg text-gray-200"
            >
              {note.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
