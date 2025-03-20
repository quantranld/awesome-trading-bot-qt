import { useEffect, useState } from 'react';
import { useConfig } from './useConfig';
import { AppConfig } from '../types';
import databaseProvider from '../services/database';

export const useAutoSave = () => {
  const { config, setConfig, saveConfig } = useConfig();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Auto-save effect
  useEffect(() => {
    let isMounted = true;
    const saveTimeout = setTimeout(async () => {
      if (isMounted) {
        try {
          setIsSaving(true);
          setSaveError(null);
          
          // Verify config integrity before saving
          if (!validateConfigIntegrity(config)) {
            throw new Error('Configuration integrity check failed');
          }

          // Save config to database
          await saveConfig();
          
          // Log save operation
          const saveTimestamp = new Date();
          console.log(`Config saved at ${saveTimestamp.toISOString()}`);
          setLastSaved(saveTimestamp);
          
          // Play success sound
          playSaveSound('success');
        } catch (error) {
          console.error('Auto-save failed:', error);
          setSaveError(error instanceof Error ? error.message : 'Save failed');
          playSaveSound('error');
        } finally {
          if (isMounted) {
            setIsSaving(false);
          }
        }
      }
    }, 1000); // 1 second debounce

    return () => {
      isMounted = false;
      clearTimeout(saveTimeout);
    };
  }, [config, saveConfig]);

  // Config integrity validation
  const validateConfigIntegrity = (config: AppConfig): boolean => {
    try {
      // Basic validation checks
      if (!config || typeof config !== 'object') return false;
      if (!config.globalCommonConfig || typeof config.globalCommonConfig !== 'object') return false;
      if (!config.cryptoPairConfigs || typeof config.cryptoPairConfigs !== 'object') return false;
      
      // Additional validation logic as needed
      return true;
    } catch {
      return false;
    }
  };

  // Audio feedback for save operations
  const playSaveSound = (type: 'success' | 'error') => {
    const audio = new Audio(type === 'success' ? '/sounds/save-success.mp3' : '/sounds/save-error.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Fallback to visual feedback if audio fails
      console.log(type === 'success' ? '✓ Saved' : '✗ Save failed');
    });
  };

  return {
    isSaving,
    lastSaved,
    saveError,
    validateConfigIntegrity
  };
};
