import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const data = await forgotPassword(email);
      if (data.success) {
        setMessage('Password reset link sent to your email.');
        setEmail(''); // Clear the email field on success
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg flex flex-col gap-4 transition-all duration-300"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-4">Forgot Password</h2>
        {message && <p className="text-green-400 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Enter your registered email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className="text-white text-sm text-center mt-2">
          Remember your password?{' '}
          <Link to="/login" className="underline text-indigo-200 hover:text-indigo-300">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
