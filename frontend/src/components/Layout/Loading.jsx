import React from 'react';

// Simple loading spinner component
const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        {/* Spinning circle */}
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-indigo-600 dark:border-gray-600 dark:border-t-indigo-400"></div>
        
        {/* Loading text */}
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
