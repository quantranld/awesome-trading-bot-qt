export interface CandlestickPattern {
  id: string;
  name: string;
  description: string;
  bullish: boolean;
  bearish: boolean;
  reliability: number; // 1-5 scale
  image: string;
  parameters: PatternParameter[];
}

export interface PatternParameter {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'percentage' | 'boolean' | 'select';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  close: number;
  low: number;
  volume: number;
}

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
