import React, { useState, useEffect } from 'react';
import CourseProgressChart from '../../components/Charts/CourseProgressChart';
import { getAnalyticsReport } from '../../api/analyticsApi';
import Loader from '../../components/Loader';

const InstructorDashboard = () => {
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
      <h1 className="text-white text-3xl font-bold mb-6">Instructor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Courses Managed', value: dashboardData.coursesManaged },
          { title: 'Assignments to Review', value: dashboardData.assignmentsToReview },
          { title: 'Quizzes Published', value: dashboardData.quizzesPublished },
          { title: 'Students Enrolled', value: dashboardData.studentsEnrolled }
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
          <h2 className="text-xl text-white font-semibold mb-4">Course Progress Chart</h2>
          <CourseProgressChart data={dashboardData.courseProgress} />
        </div>

        <div className="p-5 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg flex flex-col">
          <h2 className="text-xl text-white font-semibold mb-4">Recent Submissions</h2>
          <ul className="space-y-2">
            {dashboardData.recentSubmissions.map((submission) => (
              <li
                key={submission.id}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-lg flex justify-between items-center text-gray-200"
              >
                <span>{submission.studentName}</span>
                <span className="text-sm text-gray-300">{submission.assignmentTitle}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 p-5 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg">
        <h2 className="text-xl text-white font-semibold mb-4">Notifications</h2>
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

export default InstructorDashboard;
