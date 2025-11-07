import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ 
  message = 'An error occurred', 
  className = '',
  onRetry
}) => {
  return (
    <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
      <div className="flex items-center">
        <FiAlertCircle className="h-5 w-5 text-red-500 mr-3" />
        <div className="flex-1">
          <p className="text-sm text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none focus:underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;