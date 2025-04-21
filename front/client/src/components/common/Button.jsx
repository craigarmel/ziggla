import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  className = '',
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'px-6 py-2 font-medium rounded-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-ocean-blue-600 text-white hover:bg-ocean-blue-700 focus:ring-ocean-blue-500',
    secondary: 'border border-ocean-blue-600 text-ocean-blue-600 hover:bg-ocean-blue-50 focus:ring-ocean-blue-500',
    gold: 'bg-gold-600 text-white hover:bg-gold-700 focus:ring-gold-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : '';
  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;