import { CommonConfig, CryptoPair, Timeframe } from '../types';

export const availableCryptoPairs: CryptoPair[] = [
  { value: 'BTCUSDT', label: 'BTC/USDT' },
  { value: 'ETHUSDT', label: 'ETH/USDT' },
  { value: 'BNBUSDT', label: 'BNB/USDT' },
  { value: 'ADAUSDT', label: 'ADA/USDT' },
  { value: 'SOLUSDT', label: 'SOL/USDT' },
  { value: 'XRPUSDT', label: 'XRP/USDT' },
  { value: 'DOGEUSDT', label: 'DOGE/USDT' },
  { value: 'DOTUSDT', label: 'DOT/USDT' }
];

export const availableTimeframes: Timeframe[] = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '1d', label: '1d' },
  { value: '1w', label: '1w' }
];

export const defaultCommonConfig: CommonConfig = {
  dailyTradeLimit: 5,
  maxAmountPerTrade: 100,
  cryptoPairs: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
  timeframes: ['15m', '1h', '4h']
};
