import React from 'react';

const CourseFormInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text', 
  required = false,
  placeholder = ''
}) => {
  const handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(e);
  };

  return (
    <div className="mb-6" style={{ position: 'relative', zIndex: 1 }}>
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
        style={{
          position: 'relative',
          zIndex: 2,
          pointerEvents: 'auto'
        }}
        required={required}
        autoComplete="off"
      />
    </div>
  );
};

export default CourseFormInput;