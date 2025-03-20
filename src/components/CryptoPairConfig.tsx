import React, { useState } from 'react';
import { CryptoPairConfig as CryptoPairConfigType, CryptoPair, PatternParameterValues } from '../types';
import { candlestickPatterns } from '../data/candlestickPatterns';
import PatternConfig from './PatternConfig';
import { defaultCryptoPairCommonConfig } from '../data/defaultConfig';

interface CryptoPairConfigProps {
  cryptoPair: CryptoPair;
  config: CryptoPairConfigType;
  onConfigChange: (pairId: string, updatedConfig: CryptoPairConfigType) => void;
}

const CryptoPairConfig: React.FC<CryptoPairConfigProps> = ({ 
  cryptoPair, 
  config, 
  onConfigChange 
}) => {
  const [activeTab, setActiveTab] = useState<'common' | 'patterns'>('common');
  
  // Ensure commonConfig exists and has all required properties
  const safeCommonConfig = config.commonConfig || { ...defaultCryptoPairCommonConfig };

  const handleCommonConfigChange = (field: keyof CryptoPairConfigType['commonConfig'], value: any) => {
    onConfigChange(config.pairId, {
      ...config,
      commonConfig: {
        ...safeCommonConfig,
        [field]: value
      }
    });
  };

  const handlePatternParameterChange = (patternId: string, parameterId: string, value: any) => {
    onConfigChange(config.pairId, {
      ...config,
      patternConfigs: {
        ...config.patternConfigs,
        [patternId]: {
          ...config.patternConfigs[patternId],
          [parameterId]: value
        }
      }
    });
  };

  const handleEnableToggle = () => {
    onConfigChange(config.pairId, {
      ...config,
      enabled: !config.enabled
    });
  };

  const handleTimeframeToggle = (timeframe: string) => {
    const newTimeframes = safeCommonConfig.timeframes?.includes(timeframe)
      ? safeCommonConfig.timeframes.filter(t => t !== timeframe)
      : [...(safeCommonConfig.timeframes || []), timeframe];
    
    handleCommonConfigChange('timeframes', newTimeframes);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-blue-600 font-bold">{cryptoPair.label.split('/')[0]}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold">{cryptoPair.label}</h3>
          </div>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Enabled</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={config.enabled}
              onChange={handleEnableToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'common'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('common')}
          >
            Pair Settings
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'patterns'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('patterns')}
          >
            Pattern Settings
          </button>
        </nav>
      </div>

      <div className="p-4">
        {activeTab === 'common' ? (
          <div className="space-y-4">
            {/* Max Amount Per Trade */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Max Amount Per Trade (USDT)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={safeCommonConfig.maxAmountPerTrade || defaultCryptoPairCommonConfig.maxAmountPerTrade}
                  onChange={(e) => handleCommonConfigChange('maxAmountPerTrade', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-16 text-center font-medium">{safeCommonConfig.maxAmountPerTrade || defaultCryptoPairCommonConfig.maxAmountPerTrade}</span>
              </div>
            </div>

            {/* Timeframes */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Timeframes</label>
              <div className="flex flex-wrap gap-2">
                {['1m', '5m', '15m', '30m', '1h', '4h', '1d'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => handleTimeframeToggle(timeframe)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      safeCommonConfig.timeframes?.includes(timeframe)
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-800 border-gray-300'
                    } border`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>

            {/* Stop Loss */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Stop Loss (%)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={safeCommonConfig.stopLoss || defaultCryptoPairCommonConfig.stopLoss}
                  onChange={(e) => handleCommonConfigChange('stopLoss', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-16 text-center font-medium">{safeCommonConfig.stopLoss || defaultCryptoPairCommonConfig.stopLoss}%</span>
              </div>
            </div>

            {/* Take Profit */}
            <div className="space-y-2">
              <label className="font-medium text-gray-700">Take Profit (%)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={safeCommonConfig.takeProfit || defaultCryptoPairCommonConfig.takeProfit}
                  onChange={(e) => handleCommonConfigChange('takeProfit', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-16 text-center font-medium">{safeCommonConfig.takeProfit || defaultCryptoPairCommonConfig.takeProfit}%</span>
              </div>
            </div>

            {/* Trailing Stop */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-700">Trailing Stop</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={safeCommonConfig.trailingStop || false}
                    onChange={() => handleCommonConfigChange('trailingStop', !safeCommonConfig.trailingStop)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {safeCommonConfig.trailingStop && (
                <div className="space-y-2 mt-2">
                  <label className="text-sm text-gray-700">Trailing Stop Distance (%)</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={safeCommonConfig.trailingStopDistance || defaultCryptoPairCommonConfig.trailingStopDistance}
                      onChange={(e) => handleCommonConfigChange('trailingStopDistance', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="w-16 text-center font-medium">{safeCommonConfig.trailingStopDistance || defaultCryptoPairCommonConfig.trailingStopDistance}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {candlestickPatterns.map(pattern => (
              <div key={pattern.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <PatternConfig
                  pattern={pattern}
                  onParameterChange={handlePatternParameterChange}
                  values={(config.patternConfigs && config.patternConfigs[pattern.id]) || {}}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoPairConfig;
