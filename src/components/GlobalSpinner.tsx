import React from 'react';
import { useSpinner } from '../contexts/SpinnerContext';

const GlobalSpinner: React.FC = () => {
  const { isLoading } = useSpinner();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mx-auto"></div>
        <p className="mt-4 text-white">Loading...</p>
      </div>
    </div>
  );
};

export default GlobalSpinner; 