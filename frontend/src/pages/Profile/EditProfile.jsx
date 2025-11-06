import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../../api/authApi';
import Loader from '../../components/Loader';

const EditProfile = () => {
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await updateUserProfile(profile);
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
      } else {
        setError(res.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20 max-w-lg mx-auto"
      >
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300"
          />
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
