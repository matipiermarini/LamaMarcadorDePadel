
import React from 'react';

interface ControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'special';
  className?: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'w-full text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';
  
  const variantClasses = {
    primary: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 py-3 text-2xl',
    secondary: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500 p-2 text-sm',
    special: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 py-3 text-xl animate-pulse',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default ControlButton;
