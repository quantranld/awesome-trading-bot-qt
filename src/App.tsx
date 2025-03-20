import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppConfig } from './types';
import Header from './components/Header';
import CommonConfig from './components/CommonConfig';
import CryptoPairList from './components/CryptoPairList';
import { useConfig } from './hooks/useConfig';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/Auth/LoginForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import SignupForm from './components/Auth/SignupForm';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'global' | 'pairs'>('global');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { 
    config: appConfig, 
    updateConfig: setAppConfig, 
    isLoading, 
    error, 
    isDirty,
    lastSaved,
    saveConfig
  } = useConfig();

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

  if (authLoading || (isLoading && !isOfflineMode)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={
          <div className="container mx-auto px-4 py-8">
            {!isAuthenticated ? (
              <LoginForm />
            ) : (
              <>
                <CommonConfig
                  commonConfig={appConfig.globalCommonConfig}
                  onChange={handleGlobalCommonConfigChange}
                />
                <CryptoPairList
                  cryptoPairs={appConfig.cryptoPairs}
                  onChange={handleAppConfigChange}
                />
              </>
            )}
          </div>
        } />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
      </Routes>
    </div>
  );
}

export default App;
