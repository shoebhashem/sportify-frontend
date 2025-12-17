import React from 'react';

export const Card = ({ children, className, onClick, ...props }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg p-4 ${className}`} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="text-gray-700">{children}</div>;
};
