import { useState, useEffect } from 'react';
import { AppConfig } from '../types';
import { defaultAppConfig } from '../data/defaultConfig';
import { 
  loadDefaultConfig, 
  saveDefaultConfig, 
  loadUserConfig, 
  saveUserConfig 
} from '../services/database';

interface UseConfigOptions {
  userId?: string;
  autoSave?: boolean;
  saveInterval?: number; // in milliseconds
}

export function useConfig(options: UseConfigOptions = {}) {
  const { userId, autoSave = true, saveInterval = 5000 } = options;
  
  const [config, setConfig] = useState<AppConfig>(defaultAppConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Load configuration on mount
  useEffect(() => {
    async function loadConfig() {
      setIsLoading(true);
      setError(null);
      
      try {
        let loadedConfig: AppConfig | null = null;
        
        // If userId is provided, try to load user-specific config
        if (userId) {
          try {
            loadedConfig = await loadUserConfig(userId);
          } catch (err) {
            console.warn(`Failed to load user config, falling back to default: ${err}`);
            // Continue to try loading default config
          }
        }
        
        // If no user config or no userId, try to load default config
        if (!loadedConfig) {
          try {
            loadedConfig = await loadDefaultConfig();
          } catch (err) {
            console.warn(`Failed to load default config, using in-memory default: ${err}`);
            // Continue to use the default from code
          }
        }
        
        // If no config found at all, use the default from code
        if (!loadedConfig) {
          loadedConfig = defaultAppConfig;
          
          // Try to save the default config to the database for future use
          try {
            await saveDefaultConfig(defaultAppConfig);
          } catch (saveErr) {
            console.warn(`Failed to save default config to database: ${saveErr}`);
            // Continue without saving, we'll use the in-memory default
          }
        }
        
        setConfig(loadedConfig);
        setLastSaved(new Date());
        setIsDirty(false);
      } catch (err) {
        console.error('Failed to load configuration:', err);
        setError(err instanceof Error ? err : new Error('Unknown error loading configuration'));
        // Fall back to default config from code
        setConfig(defaultAppConfig);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadConfig();
  }, [userId]);

  // Auto-save configuration when it changes
  useEffect(() => {
    if (!autoSave || !isDirty) return;
    
    const timer = setTimeout(async () => {
      try {
        if (userId) {
          await saveUserConfig(userId, config);
        } else {
          await saveDefaultConfig(config);
        }
        
        setLastSaved(new Date());
        setIsDirty(false);
      } catch (err) {
        console.error('Failed to auto-save configuration:', err);
        setError(err instanceof Error ? err : new Error('Unknown error saving configuration'));
      }
    }, saveInterval);
    
    return () => clearTimeout(timer);
  }, [config, userId, autoSave, saveInterval, isDirty]);

  // Update configuration
  const updateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    setIsDirty(true);
  };

  // Save configuration manually
  const saveConfig = async () => {
    try {
      if (userId) {
        await saveUserConfig(userId, config);
      } else {
        await saveDefaultConfig(config);
      }
      
      setLastSaved(new Date());
      setIsDirty(false);
    } catch (err) {
      console.error('Failed to save configuration:', err);
      setError(err instanceof Error ? err : new Error('Unknown error saving configuration'));
      throw err;
    }
  };

  return {
    config,
    updateConfig,
    saveConfig,
    isLoading,
    error,
    lastSaved,
    isDirty
  };
}
