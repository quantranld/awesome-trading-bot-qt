import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp size={28} className="text-white" />
            <h1 className="text-2xl font-bold">CryptoPatternTrader</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-blue-200 transition">Dashboard</a>
            <a href="#" className="text-white hover:text-blue-200 transition">Patterns</a>
            <a href="#" className="text-white hover:text-blue-200 transition">Automation</a>
            <a href="#" className="text-white hover:text-blue-200 transition">Settings</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
