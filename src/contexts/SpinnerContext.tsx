import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface SpinnerContextType {
  isLoading: boolean;
  showSpinner: () => void;
  hideSpinner: () => void;
}

const SpinnerContext = createContext<SpinnerContextType | undefined>(undefined);

interface SpinnerProviderProps {
  children: ReactNode;
}

export const SpinnerProvider: React.FC<SpinnerProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Using useCallback for stable function references if passed down
  const showSpinner = React.useCallback(() => setIsLoading(true), []);
  const hideSpinner = React.useCallback(() => setIsLoading(false), []);

  // Memoizing the context value
  const value = useMemo(() => ({ isLoading, showSpinner, hideSpinner }), [isLoading, showSpinner, hideSpinner]);

  return (
    <SpinnerContext.Provider value={value}>
      {children}
    </SpinnerContext.Provider>
  );
};

export const useSpinner = (): SpinnerContextType => {
  const context = useContext(SpinnerContext);
  if (context === undefined) {
    throw new Error('useSpinner must be used within a SpinnerProvider');
  }
  return context;
}; 