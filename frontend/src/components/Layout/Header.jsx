import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  
  // Check if user has dark mode preference saved
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === null) {
      // If no saved preference, check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return savedMode === 'true';
  });

  // Apply dark mode when component loads and when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Toggle function
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/75 border-b border-gray-200/60 dark:border-gray-700/60">
      <div className="container mx-auto px-4 h-20 sm:h-24 flex items-center">
        <div className="flex justify-between items-center w-full">
          {/* Title */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Weather Analytics
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Modern Dark Mode Toggle Switch */}
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium hidden md:inline">
                {isDarkMode ? 'Dark' : 'Light'}
              </span>
              <button
                onClick={toggleDarkMode}
                className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                style={{ backgroundColor: isDarkMode ? '#4f46e5' : '#cbd5e1' }}
                role="switch"
                aria-checked={isDarkMode}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {/* Toggle circle */}
                <span
                  className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                  style={{ 
                    transform: isDarkMode ? 'translateX(24px)' : 'translateX(4px)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </button>
              
            </div>

            {isAuthenticated ? (
              <>
                <div className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm hidden sm:block">
                  <span className="font-medium truncate max-w-[160px] inline-block">{user?.email}</span>
                </div>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition duration-200 whitespace-nowrap shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition duration-200 whitespace-nowrap shadow-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-gray-900/35 dark:bg-black/50" />
    </header>
  );
};

export default Header;
