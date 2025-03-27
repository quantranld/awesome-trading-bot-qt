import React from 'react';
import { CommonConfig as CommonConfigType, CryptoPair, Timeframe, AppConfig } from '../types';
import { availableCryptoPairs, availableTimeframes } from '../data/commonConfig';

interface CommonConfigProps {
  config: AppConfig;
  onConfigChange: (config: AppConfig) => void;
}

const CommonConfig: React.FC<CommonConfigProps> = ({ config, onConfigChange }) => {
  const handleDailyTradeLimitChange = (value: number) => {
    onConfigChange({
      ...config,
      globalCommonConfig: {
        ...config.globalCommonConfig,
        dailyTradeLimit: value
      }
    });
  };

  const handleMaxAmountChange = (value: number) => {
    onConfigChange({
      ...config,
      globalCommonConfig: {
        ...config.globalCommonConfig,
        maxAmountPerTrade: value
      }
    });
  };

  const handleCryptoPairToggle = (pair: string) => {
    const newPairs = config.globalCommonConfig.cryptoPairs.includes(pair)
      ? config.globalCommonConfig.cryptoPairs.filter(p => p !== pair)
      : [...config.globalCommonConfig.cryptoPairs, pair];
    
    onConfigChange({
      ...config,
      globalCommonConfig: {
        ...config.globalCommonConfig,
        cryptoPairs: newPairs
      },
      cryptoPairConfigs: {
        ...config.cryptoPairConfigs,
        [pair]: {
          ...config.cryptoPairConfigs[pair],
          enabled: !config.globalCommonConfig.cryptoPairs.includes(pair)
        }
      }
    });
  };

  const handleTimeframeToggle = (timeframe: string) => {
    const newTimeframes = config.globalCommonConfig.timeframes.includes(timeframe)
      ? config.globalCommonConfig.timeframes.filter(t => t !== timeframe)
      : [...config.globalCommonConfig.timeframes, timeframe];
    
    onConfigChange({
      ...config,
      globalCommonConfig: {
        ...config.globalCommonConfig,
        timeframes: newTimeframes
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold">Common Settings</h2>
          <p className="text-gray-600">Configure global trading parameters</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Daily Trade Limit */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Daily Trade Limit</label>
          <p className="text-sm text-gray-500">Maximum number of trades to execute per day</p>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={config.globalCommonConfig.dailyTradeLimit}
              onChange={(e) => handleDailyTradeLimitChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-12 text-center font-medium">{config.globalCommonConfig.dailyTradeLimit}</span>
          </div>
        </div>

        {/* Max Amount Per Trade */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Max Amount Per Trade (USDT)</label>
          <p className="text-sm text-gray-500">Maximum amount to invest in a single trade</p>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={config.globalCommonConfig.maxAmountPerTrade}
              onChange={(e) => handleMaxAmountChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="w-16 text-center font-medium">{config.globalCommonConfig.maxAmountPerTrade}</span>
          </div>
        </div>

        {/* Crypto Pairs */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Crypto Pairs to Monitor</label>
          <p className="text-sm text-gray-500">Select the cryptocurrency pairs to trade</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {availableCryptoPairs.map((pair) => (
              <div key={pair.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`pair-${pair.value}`}
                  checked={config.globalCommonConfig.cryptoPairs.includes(pair.value)}
                  onChange={() => handleCryptoPairToggle(pair.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`pair-${pair.value}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {pair.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Timeframes */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">Timeframes</label>
          <p className="text-sm text-gray-500">Select the chart timeframes to analyze</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTimeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => handleTimeframeToggle(timeframe.value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  config.globalCommonConfig.timeframes.includes(timeframe.value)
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border-gray-300'
                } border`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonConfig;
