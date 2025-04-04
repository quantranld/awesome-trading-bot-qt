import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CommonConfig from "./components/CommonConfig";
import CryptoPairList from "./components/CryptoPairList";
import { useConfig } from "./hooks/useConfig";
import { useAuth } from "./hooks/useAuth";
import LoginForm from "./components/Auth/LoginForm";
import ResetPasswordForm from "./components/Auth/ResetPasswordForm";
import SignupForm from "./components/Auth/SignupForm";
import { defaultAppConfig } from "./data/defaultConfig";
import { ToastProvider } from "./components/Toast";
import "./index.css";
import AutoSaveStatus from "./components/AutoSaveStatus";
import GlobalSpinner from "./components/GlobalSpinner";
import { SpinnerProvider, useSpinner } from "./contexts/SpinnerContext";
import { useEffect } from "react";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { config, setConfig: setAppConfig } = useConfig();
  const appConfig = config || defaultAppConfig; // Ensure valid config

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastProvider />
      <Header />
      <Routes>
        <Route
          path="/"
          element={ (
            <div className="container mx-auto px-4 py-8">
              {!isAuthenticated ? (
                <LoginForm />
              ) : (
                <>
                  <CommonConfig
                    config={appConfig}
                    onConfigChange={setAppConfig}
                  />
                  <CryptoPairList
                    appConfig={appConfig}
                    onAppConfigChange={setAppConfig}
                  />
                </>
              )}
            </div>
           )}
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
      </Routes>
      <AutoSaveStatus />
    </div>
  );
}

function App() {
  const { loading: authLoading } = useAuth();
  const { loading: configLoading } = useConfig();
  const { showSpinner, hideSpinner } = useSpinner();

  useEffect(() => {
    if (authLoading || configLoading) {
      showSpinner();
    } else {
      hideSpinner();
    }
  }, [authLoading, configLoading, showSpinner, hideSpinner]);

  return (
    <>
      <GlobalSpinner /> 
      <AppContent />
    </>
  );
}

// Wrap the main App component with the provider
function RootApp() {
  return (
    <SpinnerProvider>
      <App />
    </SpinnerProvider>
  );
}

// export default App;
export default RootApp;
