import { CryptoPair, Timeframe } from '../types';

export const availableCryptoPairs: CryptoPair[] = [
  { value: 'BTC-USDT', label: 'Bitcoin (BTC/USDT)' },
  { value: 'ETH-USDT', label: 'Ethereum (ETH/USDT)' },
  { value: 'BNB-USDT', label: 'Binance Coin (BNB/USDT)' },
  { value: 'SOL-USDT', label: 'Solana (SOL/USDT)' },
  { value: 'ADA-USDT', label: 'Cardano (ADA/USDT)' },
  { value: 'XRP-USDT', label: 'Ripple (XRP/USDT)' },
  { value: 'DOT-USDT', label: 'Polkadot (DOT/USDT)' },
  { value: 'DOGE-USDT', label: 'Dogecoin (DOGE/USDT)' },
  { value: 'AVAX-USDT', label: 'Avalanche (AVAX/USDT)' },
  { value: 'MATIC-USDT', label: 'Polygon (MATIC/USDT)' },
  { value: 'LINK-USDT', label: 'Chainlink (LINK/USDT)' },
  { value: 'UNI-USDT', label: 'Uniswap (UNI/USDT)' }
];

export const availableTimeframes: Timeframe[] = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '30m', label: '30 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '2h', label: '2 Hours' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' }
];

export const defaultCommonConfig = {
  dailyTradeLimit: 5,
  maxAmountPerTrade: 100,
  cryptoPairs: ['BTC-USDT', 'ETH-USDT', 'BNB-USDT'],
  timeframes: ['15m', '1h', '4h']
};
