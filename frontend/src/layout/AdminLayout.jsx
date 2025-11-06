// AdminLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role="admin" />
        <main className="flex-1 p-6 backdrop-blur-lg bg-white/10 rounded-xl shadow-lg transition-all duration-300">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
