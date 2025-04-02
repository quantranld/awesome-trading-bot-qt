import { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { defaultAppConfig, defaultCryptoPairCommonConfig } from '../data/defaultConfig';
import databaseProvider from '../services/database';
import { useAuth } from './useAuth';
import { showToast } from '../components/Toast';

export const useConfig = () => {
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Auto-save effect
  useEffect(() => {
    let saveTimeout: NodeJS.Timeout;

    if (isDirty) {
      saveTimeout = setTimeout(async () => {
        try {
          setLoading(true);
          
          if (isAuthenticated && user?.id) {
            await databaseProvider.saveUserConfig(user.id, config);
          } else {
            await databaseProvider.saveDefaultConfig(config);
          }
          
          setLastSaved(new Date());
          setIsDirty(false);
          showToast.success('Configuration saved successfully');
        } catch (err) {
          console.error('Error saving configuration:', err);
          setError(err instanceof Error ? err : new Error('Failed to save configuration'));
          showToast.error('Failed to save configuration');
        } finally {
          setLoading(false);
        }
      }, 1000); // Debounce for 1 second
    }

    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [config, isDirty, isAuthenticated, user]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        
        // First try to load user config if authenticated
        if (isAuthenticated && user?.id) {
          const userConfig = await databaseProvider.getUserConfig(user.id);
          if (userConfig) {
            // Ensure all crypto pairs have the required common config properties
            ensureValidConfig(userConfig);
            setConfig(userConfig);
            setLoading(false);
            return;
          }
        }
        
        // Fall back to default config from database
        const dbDefaultConfig = await databaseProvider.getDefaultConfig();
        if (dbDefaultConfig) {
          // Ensure all crypto pairs have the required common config properties
          ensureValidConfig(dbDefaultConfig);
          setConfig(dbDefaultConfig);
        } else {
          // Use local default config if nothing in database
          setConfig(defaultAppConfig);
        }
      } catch (err) {
        console.error('Error loading configuration:', err);
        setError(err instanceof Error ? err : new Error('Failed to load configuration'));
        // Still use default config on error
        setConfig(defaultAppConfig);
      } finally {
        setLoading(false);
      }
    };

    // Helper function to ensure all crypto pairs have valid common config
    const ensureValidConfig = (config: AppConfig) => {
      Object.keys(config.cryptoPairConfigs).forEach(pairId => {
        const pairConfig = config.cryptoPairConfigs[pairId];
        
        // If commonConfig is missing or incomplete, apply defaults
        if (!pairConfig.commonConfig) {
          pairConfig.commonConfig = { ...defaultCryptoPairCommonConfig };
        } else {
          // Ensure all required properties exist
          pairConfig.commonConfig = {
            ...defaultCryptoPairCommonConfig,
            ...pairConfig.commonConfig
          };
        }
      });
    };

    loadConfig();
  }, [isAuthenticated, user]);

  const saveConfig = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated && user?.id) {
        await databaseProvider.saveUserConfig(user.id, config);
      } else {
        await databaseProvider.saveDefaultConfig(config);
      }
      
      setLastSaved(new Date());
      setIsDirty(false);
      showToast.success('Configuration saved successfully');
    } catch (err) {
      console.error('Error saving configuration:', err);
      setError(err instanceof Error ? err : new Error('Failed to save configuration'));
      showToast.error('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    setIsDirty(true);
  };

  return {
    config,
    setConfig: updateConfig,
    loading,
    error,
    isDirty,
    lastSaved,
    saveConfig
  };
};
