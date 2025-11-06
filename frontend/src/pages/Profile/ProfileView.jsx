import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../../api/authApi';
import Loader from '../../components/Loader';

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getUserProfile();
        if (res.data.success) {
          setProfile(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!profile) return <p className="text-gray-500 p-6">No profile data found.</p>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20">
        <h2 className="text-2xl font-semibold mb-4">{`${profile.firstName} ${profile.lastName}`}</h2>
        <p className="text-gray-300 mb-2">Email: {profile.email}</p>
        <p className="text-gray-300 mb-2">Role: {profile.role}</p>
        <p className="text-gray-300 mb-2">Enrolled Courses: {profile.courses?.length || 0}</p>

        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Courses:</h3>
          <ul>
            {profile.courses?.map((course) => (
              <li key={course.id} className="text-gray-300 mb-1">
                {course.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
