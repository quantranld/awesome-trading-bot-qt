import React, { useState } from 'react';
import { CryptoPair, AppConfig, CryptoPairConfig as CryptoPairConfigType } from '../types';
import CryptoPairConfig from './CryptoPairConfig';
import { availableCryptoPairs } from '../data/commonConfig';

interface CryptoPairListProps {
  appConfig: AppConfig;
  onAppConfigChange: (updatedConfig: AppConfig) => void;
}

const CryptoPairList: React.FC<CryptoPairListProps> = ({ appConfig, onAppConfigChange }) => {
  const [selectedPairId, setSelectedPairId] = useState<string>(
    // Default to the first enabled pair, or just the first pair if none are enabled
    Object.values(appConfig.cryptoPairConfigs).find(config => config.enabled)?.pairId || 
    availableCryptoPairs[0].value
  );

  const handleCryptoPairConfigChange = (pairId: string, updatedConfig: CryptoPairConfigType) => {
    onAppConfigChange({
      ...appConfig,
      cryptoPairConfigs: {
        ...appConfig.cryptoPairConfigs,
        [pairId]: updatedConfig
      }
    });
  };

  // Filter to show only enabled pairs first, then sort alphabetically
  const sortedPairs = [...availableCryptoPairs].sort((a, b) => {
    const aEnabled = appConfig.cryptoPairConfigs[a.value]?.enabled || false;
    const bEnabled = appConfig.cryptoPairConfigs[b.value]?.enabled || false;
    
    if (aEnabled && !bEnabled) return -1;
    if (!aEnabled && bEnabled) return 1;
    return a.label.localeCompare(b.label);
  });

  const selectedPair = availableCryptoPairs.find(pair => pair.value === selectedPairId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Crypto Pair Configurations</h2>
        <div className="text-sm text-gray-500">
          {Object.values(appConfig.cryptoPairConfigs).filter(config => config.enabled).length} of {availableCryptoPairs.length} pairs enabled
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <label htmlFor="pair-selector" className="block text-sm font-medium text-gray-700 mb-2">
          Select Crypto Pair to Configure
        </label>
        <select
          id="pair-selector"
          value={selectedPairId}
          onChange={(e) => setSelectedPairId(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          {sortedPairs.map(pair => (
            <option key={pair.value} value={pair.value}>
              {pair.label} {appConfig.cryptoPairConfigs[pair.value]?.enabled ? '(Enabled)' : '(Disabled)'}
            </option>
          ))}
        </select>
      </div>
      
      {selectedPair && (
        <CryptoPairConfig
          cryptoPair={selectedPair}
          config={appConfig.cryptoPairConfigs[selectedPairId]}
          onConfigChange={handleCryptoPairConfigChange}
        />
      )}
    </div>
  );
};

export default CryptoPairList;
