import React from 'react';
import { Link } from 'react-router-dom';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'text-gray-600',
  to = '#',
  className = ''
}) => {
  // Extract the color name from the color class (e.g., 'text-blue-500' -> 'blue')
  const colorName = color.split('-')[1] || 'gray';
  const bgColor = `bg-${colorName}-50`;
  
  return (
    <Link 
      to={to}
      className={`bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${bgColor} bg-opacity-50`}>
          {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Link>
  );
};

export default StatsCard;


