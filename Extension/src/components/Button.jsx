import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', loading = false, className = '', ...props }) => {
  const baseStyles = 'w-full px-5 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:-translate-y-0.5',
    secondary: 'bg-secondary border border-white/10 text-gray-200 hover:bg-card hover:border-accent-blue',
    google: 'bg-white text-gray-900 hover:bg-gray-50 shadow-md hover:shadow-lg hover:-translate-y-0.5',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
