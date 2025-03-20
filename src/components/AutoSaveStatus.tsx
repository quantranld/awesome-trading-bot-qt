import React from 'react';
import { useAutoSave } from '../hooks/useAutoSave';

const AutoSaveStatus: React.FC = () => {
  const { isSaving, lastSaved, saveError } = useAutoSave();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
        {isSaving ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-700">Saving...</span>
          </div>
        ) : saveError ? (
          <div className="flex items-center space-x-2 text-red-600">
            <span className="text-sm">✗ Save failed</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-green-600">
            <span className="text-sm">✓ Saved</span>
            {lastSaved && (
              <span className="text-xs text-gray-500">
                {new Date(lastSaved).toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoSaveStatus;
