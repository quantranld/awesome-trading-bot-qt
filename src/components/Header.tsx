import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp size={28} className="text-white" />
            <h1 className="text-2xl font-bold">CryptoPatternTrader</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-blue-200 transition">Dashboard</Link>
            <Link to="/patterns" className="text-white hover:text-blue-200 transition">Patterns</Link>
            <Link to="/automation" className="text-white hover:text-blue-200 transition">Automation</Link>
            <Link to="/settings" className="text-white hover:text-blue-200 transition">Settings</Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user?.email}</span>
                <button
                  onClick={signOut}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
