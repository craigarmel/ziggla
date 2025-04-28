import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  loading = false,
  icon = null,
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`
      inline-flex items-center justify-center
      px-5 py-2.5
      bg-white bg-opacity-70 text-black font-semibold rounded-lg
      shadow-sm
      hover:bg-black hover:bg-opacity-80 hover:text-white
      focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
      transition-colors duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <svg
        className="animate-spin mr-2 h-5 w-5 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    ) : icon ? (
      <span className="mr-2">{icon}</span>
    ) : null}
    {children}
  </button>
);

export default Button;
