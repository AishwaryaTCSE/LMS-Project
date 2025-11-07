// frontend/src/pages/Admin/BaseAdminPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const BaseAdminPage = ({ title, subtitle, headerAction, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
            {headerAction && (
              <div className="flex items-center space-x-3">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default BaseAdminPage;