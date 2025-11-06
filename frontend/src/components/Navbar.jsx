// Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="w-full p-4 backdrop-blur-lg bg-white/10 shadow-lg rounded-b-xl flex justify-between items-center transition-all duration-300">
      <div className="text-xl font-bold text-gray-800">LMS Portal</div>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg hover:scale-105 transition-transform">
          Profile
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-400 to-green-400 text-white rounded-lg hover:scale-105 transition-transform">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
