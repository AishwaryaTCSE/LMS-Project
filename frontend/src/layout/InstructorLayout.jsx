// InstructorLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const InstructorLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-teal-100 to-blue-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="instructor" />
        <main className="flex-1 p-6 backdrop-blur-lg bg-white/10 rounded-xl shadow-lg transition-all duration-300">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default InstructorLayout;
