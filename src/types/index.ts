// Candlestick Pattern Types
export interface CandlestickPattern {
  id: string;
  name: string;
  description: string;
  image: string;
  bullish: boolean;
  bearish: boolean;
  parameters: PatternParameter[];
}

export interface PatternParameter {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'number' | 'boolean' | 'select';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

// Candlestick Data Types
export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Common Configuration Types
export interface CommonConfig {
  dailyTradeLimit: number;
  maxAmountPerTrade: number;
  cryptoPairs: string[];
  timeframes: string[];
}

export interface CryptoPair {
  value: string;
  label: string;
}

export interface Timeframe {
  value: string;
  label: string;
}

// Per-Crypto Pair Configuration Types
export interface CryptoPairConfig {
  pairId: string;
  enabled: boolean;
  commonConfig: CryptoPairCommonConfig;
  patternConfigs: Record<string, PatternParameterValues>;
}

export interface CryptoPairCommonConfig {
  maxAmountPerTrade: number;
  timeframes: string[];
  stopLoss: number;
  takeProfit: number;
  trailingStop: boolean;
  trailingStopDistance: number;
}

export type PatternParameterValues = Record<string, any>;

export interface AppConfig {
  globalCommonConfig: CommonConfig;
  cryptoPairConfigs: Record<string, CryptoPairConfig>;
}
