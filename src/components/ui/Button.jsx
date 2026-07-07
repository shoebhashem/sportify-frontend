import React from 'react';

const VARIANT_CLASSES = {
  default: 'bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600',
  outline: 'border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50',
  destructive: 'bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700',
};

export const Button = ({ children, onClick, className = '', variant, size, ...rest }) => {
  const variantClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default;
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
};
