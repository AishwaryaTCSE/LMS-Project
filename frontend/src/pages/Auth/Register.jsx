import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login as loginApi } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiCalendar, FiBook, FiBriefcase } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState(() => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    role: 'student' // student, teacher, admin
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const roles = [
    { value: 'student', label: 'Student', icon: <FiBook /> },
    { value: 'teacher', label: 'Teacher', icon: <FiBriefcase /> },
    { value: 'admin', label: 'Admin', icon: <FiUser /> }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to:`, value);
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic form validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Ensure required fields are filled
    const requiredFields = ['firstName', 'lastName', 'email', 'password', 'role'];
    const missingFields = requiredFields.filter(field => !form[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting registration form:', form);
      
      // Create a clean user object with only necessary fields
      // Filter out empty strings for optional fields to avoid validation issues
      const userData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword, // Include confirmPassword as backend expects it
        role: form.role
      };
      
      // Only include optional fields if they have values
      if (form.phone && form.phone.trim()) {
        userData.phone = form.phone.trim();
      }
      if (form.dateOfBirth && form.dateOfBirth.trim()) {
        userData.dateOfBirth = form.dateOfBirth.trim();
      }
      
      console.log('Sending registration data:', userData);
      
      // Register the user
      const registerResponse = await register(userData);
      console.log('Registration response:', registerResponse);
      
      if (registerResponse.success) {
        // Auto-login after successful registration
        try {
          const { token, user } = registerResponse.data;
          
          if (!token) {
            throw new Error('No token received after registration');
          }
          
          // Store the token and update auth state
          localStorage.setItem('token', token);
          
          // Set success message
          setSuccess('Registration successful! Logging you in...');
          
          // Redirect to appropriate dashboard based on role
          const role = user.role || 'student';
          const dashboardPath = role === 'admin'
            ? '/admin/dashboard'
            : (role === 'instructor' || role === 'teacher')
              ? '/instructor/dashboard'
              : '/student/dashboard';

          // Update auth state and then navigate
          try {
            await login({ email: form.email, password: form.password });
            navigate(dashboardPath, { replace: true });
          } catch (loginError) {
            console.error('Auto-login error, redirecting to login page:', loginError);
            navigate('/login', { 
              state: { 
                registeredEmail: form.email,
                message: 'Registration successful! Please log in.' 
              },
              replace: true
            });
          }
          
        } catch (loginError) {
          console.error('Error in registration success flow:', loginError);
          // If auto-login fails, redirect to login page
          setSuccess('Registration successful! Please log in.');
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                registeredEmail: form.email,
                message: 'Registration successful! Please log in.' 
              },
              replace: true
            });
          }, 1500);
        }
      } else {
        const errorMessage = registerResponse.message || 'Registration failed. Please try again.';
        console.error('Registration failed:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Handle validation errors from backend
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (err.response?.data) {
        const responseData = err.response.data;
        
        // Check if there are validation errors array
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const errorMessages = responseData.errors.map(err => err.message || `${err.field}: ${err.msg || err.message}`).join(', ');
          errorMessage = errorMessages;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear success message when component unmounts or form is submitted again
  React.useEffect(() => {
    return () => setSuccess('');
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Left Side - Form */}
          <div className="w-full md:w-2/3 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join our community and start your learning journey today</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      required
                      autoComplete="given-name"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Last Name */}
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      required
                      autoComplete="family-name"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="email-register" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email-register"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Date of Birth */}
                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      required
                      autoComplete="bday"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password-register" className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password-register"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      placeholder="Create a password"
                      required
                      autoComplete="new-password"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      required
                      autoComplete="new-password"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                {/* Role Selection */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
                  <div className="grid grid-cols-3 gap-3">
                    {roles.map((role) => (
                      <label 
                        key={role.value} 
                        className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          form.role === role.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={form.role === role.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col items-center">
                          <span className={`text-2xl mb-1 ${
                            form.role === role.value ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {role.icon}
                          </span>
                          <span className="text-sm font-medium text-gray-700">{role.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
              
              {/* Login Link */}
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
          
          {/* Right Side - Image/Illustration */}
          <div className="hidden md:flex md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-700 p-8 flex-col items-center justify-center text-white">
            <div className="max-w-xs mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to Our Platform</h2>
              <p className="text-blue-100 mb-8">
                Join thousands of learners and start your journey to success today.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <FiBook className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-blue-100">Access to 1000+ courses</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <FiBriefcase className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-blue-100">Learn from industry experts</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <FiUser className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-blue-100">Join a growing community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
