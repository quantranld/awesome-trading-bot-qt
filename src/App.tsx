import { useState } from 'react';
import { AppConfig } from './types';
import { defaultAppConfig } from './data/defaultConfig';
import Header from './components/Header';
import CommonConfig from './components/CommonConfig';
import CryptoPairList from './components/CryptoPairList';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'global' | 'pairs'>('global');
  const [appConfig, setAppConfig] = useState<AppConfig>(defaultAppConfig);

  const handleGlobalCommonConfigChange = (updatedCommonConfig: AppConfig['globalCommonConfig']) => {
    setAppConfig({
      ...appConfig,
      globalCommonConfig: updatedCommonConfig
    });
  };

  const handleAppConfigChange = (updatedAppConfig: AppConfig) => {
    setAppConfig(updatedAppConfig);
  };

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
            <nav className="flex space-x-4 border-b border-gray-200" aria-label="Tabs">
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
