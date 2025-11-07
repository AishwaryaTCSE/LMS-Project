import React from 'react';

const LoadingSpinner = ({ className = '', size = 'h-8 w-8' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${size} animate-spin rounded-full border-4 border-solid border-indigo-500 border-t-transparent`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;