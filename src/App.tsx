import { useState, useEffect } from 'react';
import { AppConfig } from './types';
import Header from './components/Header';
import CommonConfig from './components/CommonConfig';
import CryptoPairList from './components/CryptoPairList';
import { useConfig } from './hooks/useConfig';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'global' | 'pairs'>('global');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Use our custom hook for config management with database persistence
  const { 
    config: appConfig, 
    updateConfig: setAppConfig, 
    isLoading, 
    error, 
    isDirty,
    lastSaved,
    saveConfig
  } = useConfig();

  // Handle offline mode toggle
  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
  };

  const handleGlobalCommonConfigChange = (updatedCommonConfig: AppConfig['globalCommonConfig']) => {
    setAppConfig({
      ...appConfig,
      globalCommonConfig: updatedCommonConfig
    });
  };

  const handleAppConfigChange = (updatedAppConfig: AppConfig) => {
    setAppConfig(updatedAppConfig);
  };

  // Show loading state
  if (isLoading && !isOfflineMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading configuration...</p>
          <button
            onClick={() => setIsOfflineMode(true)}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Continue in Offline Mode
          </button>
        </div>
      </div>
    );
  }

  // Show error state with option to continue in offline mode
  if (error && !isOfflineMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Configuration</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => setIsOfflineMode(true)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Continue in Offline Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'global' | 'pairs')}
            >
              <option value="global">Global Settings</option>
              <option value="pairs">Pair-Specific Settings</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="flex justify-between items-center border-b border-gray-200">
              <nav className="flex space-x-4" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('global')}
                  className={`${
                    activeTab === 'global'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Global Settings
                </button>
                <button
                  onClick={() => setActiveTab('pairs')}
                  className={`${
                    activeTab === 'pairs'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Pair-Specific Settings
                </button>
              </nav>
              
              {/* Connection status and offline mode toggle */}
              <div className="flex items-center">
                {isOfflineMode ? (
                  <div className="flex items-center text-sm text-yellow-600 mr-4">
                    <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>
                    Offline Mode
                  </div>
                ) : error ? (
                  <div className="flex items-center text-sm text-red-600 mr-4">
                    <span className="h-2 w-2 bg-red-400 rounded-full mr-2"></span>
                    Connection Error
                  </div>
                ) : (
                  <div className="flex items-center text-sm text-green-600 mr-4">
                    <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                    Connected
                  </div>
                )}
                
                <button
                  onClick={toggleOfflineMode}
                  className={`text-xs px-2 py-1 rounded ${
                    isOfflineMode 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isOfflineMode ? 'Try Connect' : 'Work Offline'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator for save state */}
        <div className="mb-4 flex justify-between">
          <div>
            {isOfflineMode && (
              <div className="text-sm bg-yellow-50 text-yellow-700 px-3 py-1 rounded-md">
                Changes made in offline mode will not be saved to the database
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            {isDirty ? (
              <span className="flex items-center">
                <span className="h-2 w-2 bg-yellow-400 rounded-full mr-2"></span>
                Unsaved changes
                {!isOfflineMode && (
                  <button
                    onClick={saveConfig}
                    className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Save Now
                  </button>
                )}
              </span>
            ) : lastSaved && !isOfflineMode ? (
              <span className="flex items-center">
                <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            ) : null}
          </div>
        </div>

        {activeTab === 'global' ? (
          <div className="max-w-3xl mx-auto">
            <CommonConfig 
              config={appConfig.globalCommonConfig} 
              onConfigChange={handleGlobalCommonConfigChange} 
            />
          </div>
        ) : (
          <CryptoPairList 
            appConfig={appConfig}
            onAppConfigChange={handleAppConfigChange}
          />
        )}
      </main>
    </div>
  );
}

export default App;
