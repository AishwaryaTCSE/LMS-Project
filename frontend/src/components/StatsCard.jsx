import React from 'react';

const StatsCard = ({ title, value, change, icon, colorClass = 'bg-gray-100 text-gray-600' }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
            {change ? <p className="mt-1 text-xs text-gray-500">{change}</p> : null}
          </div>
          <div className={`p-2 rounded-lg ${colorClass}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;


