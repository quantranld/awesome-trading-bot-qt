import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CommonConfig from './components/CommonConfig';
import CryptoPairList from './components/CryptoPairList';
import { useConfig } from './hooks/useConfig';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/Auth/LoginForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import SignupForm from './components/Auth/SignupForm';
import { defaultAppConfig } from './data/defaultConfig';
import './index.css';

function App() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { 
    config, 
    setConfig: setAppConfig, 
    loading: isLoading, 
    // error, 
    // isDirty,
    // lastSaved,
    // saveConfig
  } = useConfig();

  // Ensure we always have a valid config by falling back to defaultAppConfig
  const appConfig = config || defaultAppConfig;

  if (authLoading || isLoading) {
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
                  config={appConfig.globalCommonConfig}
                  onConfigChange={(updatedCommonConfig) => 
                    setAppConfig({
                      ...appConfig,
                      globalCommonConfig: updatedCommonConfig
                    })
                  }
                />
                <CryptoPairList
                  appConfig={appConfig}
                  onAppConfigChange={setAppConfig}
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
