// Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-purple-400 border-b-pink-400 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
