import { AppConfig, CryptoPairConfig, CryptoPairCommonConfig, PatternParameterValues } from '../types';
import { availableCryptoPairs } from './commonConfig';
import { candlestickPatterns } from './candlestickPatterns';

// Default common config for each crypto pair
const defaultCryptoPairCommonConfig: CryptoPairCommonConfig = {
  maxAmountPerTrade: 100,
  timeframes: ['15m', '1h', '4h'],
  stopLoss: 2,
  takeProfit: 5,
  trailingStop: false,
  trailingStopDistance: 1
};

// Generate default pattern parameter values for each pattern
const generateDefaultPatternValues = (): Record<string, PatternParameterValues> => {
  const defaultValues: Record<string, PatternParameterValues> = {};
  
  candlestickPatterns.forEach(pattern => {
    const patternValues: PatternParameterValues = {};
    
    pattern.parameters.forEach(param => {
      patternValues[param.id] = param.defaultValue;
    });
    
    defaultValues[pattern.id] = patternValues;
  });
  
  return defaultValues;
};

// Generate default config for each crypto pair
const generateDefaultCryptoPairConfigs = (): Record<string, CryptoPairConfig> => {
  const pairConfigs: Record<string, CryptoPairConfig> = {};
  const defaultPatternValues = generateDefaultPatternValues();
  
  availableCryptoPairs.forEach(pair => {
    pairConfigs[pair.value] = {
      pairId: pair.value,
      enabled: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].includes(pair.value), // Enable only the main pairs by default
      commonConfig: { ...defaultCryptoPairCommonConfig },
      patternConfigs: { ...defaultPatternValues }
    };
  });
  
  return pairConfigs;
};

// Default global app configuration
export const defaultAppConfig: AppConfig = {
  globalCommonConfig: {
    dailyTradeLimit: 5,
    maxAmountPerTrade: 100,
    cryptoPairs: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
    timeframes: ['15m', '1h', '4h']
  },
  cryptoPairConfigs: generateDefaultCryptoPairConfigs()
};
