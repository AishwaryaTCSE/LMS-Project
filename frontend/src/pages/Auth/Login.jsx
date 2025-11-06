import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Wait for login to complete and get the user data
      const { user } = await login({ email, password });
      
      // Get the redirect URL from query params
      const redirectTo = searchParams.get('redirect');
      
      // If there's a redirect URL, use it, otherwise go to role-based dashboard
      if (redirectTo) {
        // Ensure the redirect URL is properly formatted
        const decodedRedirect = decodeURIComponent(redirectTo);
        const safeRedirect = decodedRedirect.startsWith('/') ? decodedRedirect : `/${decodedRedirect}`;
        navigate(safeRedirect, { replace: true });
      } else {
        // Default to role-based dashboard
        const rolePath = user.role === 'admin' ? '/admin/dashboard' : 
                        user.role === 'instructor' ? '/instructor/dashboard' : 
                        '/student/dashboard';
        navigate(rolePath, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <form
        onSubmit={handleLogin}
        className="w-96 p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg flex flex-col gap-4 transition-all duration-300"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-4">Login to LMS</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:scale-105 transition-transform"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-white text-sm text-center mt-2">
          Forgot Password?{' '}
          <a href="/forgot-password" className="underline text-purple-200">
            Click here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
