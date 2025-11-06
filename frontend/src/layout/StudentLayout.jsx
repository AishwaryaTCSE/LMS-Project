// StudentLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="student" />
        <main className="flex-1 p-6 backdrop-blur-lg bg-white/10 rounded-xl shadow-lg transition-all duration-300">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default StudentLayout;
