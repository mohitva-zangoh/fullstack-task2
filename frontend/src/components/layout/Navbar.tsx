import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

export const Navbar: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-black/40 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
                T2
              </span>
              <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Task2
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname === '/dashboard'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/items"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname === '/items'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Item Manager
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-xs text-gray-400 dark:text-gray-500">Signed in as</span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
                {user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
