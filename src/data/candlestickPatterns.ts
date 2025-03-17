import { CandlestickPattern } from '../types';

export const candlestickPatterns: CandlestickPattern[] = [
  {
    id: 'hammer',
    name: 'Hammer',
    description: 'A bullish reversal pattern that forms during a downtrend. It has a small body with a long lower shadow and little or no upper shadow.',
    bullish: true,
    bearish: false,
    reliability: 4,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1470',
    parameters: [
      {
        id: 'bodyToShadowRatio',
        name: 'Body to Shadow Ratio',
        description: 'The ratio of the body size to the lower shadow size',
        type: 'number',
        defaultValue: 0.3,
        min: 0.1,
        max: 0.5,
        step: 0.05
      },
      {
        id: 'minLowerShadow',
        name: 'Minimum Lower Shadow',
        description: 'Minimum size of lower shadow as percentage of total candle',
        type: 'percentage',
        defaultValue: 60,
        min: 50,
        max: 80,
        step: 5
      }
    ]
  },
  {
    id: 'engulfing',
    name: 'Bullish Engulfing',
    description: 'A two-candle reversal pattern consisting of a small bearish candle followed by a larger bullish candle that completely engulfs the previous one.',
    bullish: true,
    bearish: false,
    reliability: 5,
    image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e5?auto=format&fit=crop&q=80&w=1470',
    parameters: [
      {
        id: 'engulfingFactor',
        name: 'Engulfing Factor',
        description: 'How much the second candle must engulf the first candle',
        type: 'percentage',
        defaultValue: 100,
        min: 90,
        max: 120,
        step: 5
      },
      {
        id: 'priorTrendLength',
        name: 'Prior Trend Length',
        description: 'Minimum number of candles in prior trend',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 10,
        step: 1
      }
    ]
  },
  {
    id: 'doji',
    name: 'Doji',
    description: 'A candle with a very small body, indicating indecision in the market. Can signal potential reversal when appearing after a strong trend.',
    bullish: true,
    bearish: true,
    reliability: 3,
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=1471',
    parameters: [
      {
        id: 'bodySize',
        name: 'Maximum Body Size',
        description: 'Maximum size of body as percentage of total candle',
        type: 'percentage',
        defaultValue: 5,
        min: 1,
        max: 10,
        step: 1
      },
      {
        id: 'shadowLength',
        name: 'Shadow Length Ratio',
        description: 'Ratio of upper to lower shadow length',
        type: 'number',
        defaultValue: 1,
        min: 0.5,
        max: 2,
        step: 0.1
      }
    ]
  },
  {
    id: 'morningstar',
    name: 'Morning Star',
    description: 'A three-candle bullish reversal pattern consisting of a large bearish candle, a small-bodied candle, and a large bullish candle.',
    bullish: true,
    bearish: false,
    reliability: 5,
    image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?auto=format&fit=crop&q=80&w=1364',
    parameters: [
      {
        id: 'middleCandleGap',
        name: 'Middle Candle Gap',
        description: 'Maximum gap between middle candle and others',
        type: 'percentage',
        defaultValue: 10,
        min: 0,
        max: 20,
        step: 1
      },
      {
        id: 'thirdCandleRetracement',
        name: 'Third Candle Retracement',
        description: 'Minimum retracement of third candle into first candle',
        type: 'percentage',
        defaultValue: 50,
        min: 30,
        max: 70,
        step: 5
      }
    ]
  },
  {
    id: 'eveningstar',
    name: 'Evening Star',
    description: 'A three-candle bearish reversal pattern consisting of a large bullish candle, a small-bodied candle, and a large bearish candle.',
    bullish: false,
    bearish: true,
    reliability: 5,
    image: 'https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?auto=format&fit=crop&q=80&w=1470',
    parameters: [
      {
        id: 'middleCandleGap',
        name: 'Middle Candle Gap',
        description: 'Maximum gap between middle candle and others',
        type: 'percentage',
        defaultValue: 10,
        min: 0,
        max: 20,
        step: 1
      },
      {
        id: 'thirdCandleRetracement',
        name: 'Third Candle Retracement',
        description: 'Minimum retracement of third candle into first candle',
        type: 'percentage',
        defaultValue: 50,
        min: 30,
        max: 70,
        step: 5
      }
    ]
  },
  {
    id: 'shootingstar',
    name: 'Shooting Star',
    description: 'A bearish reversal pattern with a small body, little or no lower shadow, and a long upper shadow.',
    bullish: false,
    bearish: true,
    reliability: 4,
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&q=80&w=1332',
    parameters: [
      {
        id: 'bodyToShadowRatio',
        name: 'Body to Shadow Ratio',
        description: 'The ratio of the body size to the upper shadow size',
        type: 'number',
        defaultValue: 0.3,
        min: 0.1,
        max: 0.5,
        step: 0.05
      },
      {
        id: 'minUpperShadow',
        name: 'Minimum Upper Shadow',
        description: 'Minimum size of upper shadow as percentage of total candle',
        type: 'percentage',
        defaultValue: 60,
        min: 50,
        max: 80,
        step: 5
      }
    ]
  },
  {
    id: 'harami',
    name: 'Harami',
    description: 'A two-candle pattern where the second candle is completely contained within the body of the first candle, signaling a potential reversal.',
    bullish: true,
    bearish: true,
    reliability: 3,
    image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&q=80&w=1471',
    parameters: [
      {
        id: 'containmentFactor',
        name: 'Containment Factor',
        description: 'How much the second candle must be contained within the first',
        type: 'percentage',
        defaultValue: 100,
        min: 80,
        max: 100,
        step: 5
      },
      {
        id: 'firstCandleSize',
        name: 'First Candle Size',
        description: 'Minimum size of first candle relative to average',
        type: 'percentage',
        defaultValue: 120,
        min: 100,
        max: 150,
        step: 5
      }
    ]
  },
  {
    id: 'threewhitesoldiers',
    name: 'Three White Soldiers',
    description: 'A bullish reversal pattern consisting of three consecutive bullish candles, each closing higher than the previous.',
    bullish: true,
    bearish: false,
    reliability: 4,
    image: 'https://images.unsplash.com/photo-1642790551043-842065045f92?auto=format&fit=crop&q=80&w=1470',
    parameters: [
      {
        id: 'minimumBodySize',
        name: 'Minimum Body Size',
        description: 'Minimum body size as percentage of candle',
        type: 'percentage',
        defaultValue: 60,
        min: 50,
        max: 80,
        step: 5
      },
      {
        id: 'closingPosition',
        name: 'Closing Position',
        description: 'Each close should be in upper X% of candle',
        type: 'percentage',
        defaultValue: 25,
        min: 10,
        max: 40,
        step: 5
      }
    ]
  },
  {
    id: 'threeblackcrows',
    name: 'Three Black Crows',
    description: 'A bearish reversal pattern consisting of three consecutive bearish candles, each closing lower than the previous.',
    bullish: false,
    bearish: true,
    reliability: 4,
    image: 'https://images.unsplash.com/photo-1618044733378-7d3b13bb438b?auto=format&fit=crop&q=80&w=1471',
    parameters: [
      {
        id: 'minimumBodySize',
        name: 'Minimum Body Size',
        description: 'Minimum body size as percentage of candle',
        type: 'percentage',
        defaultValue: 60,
        min: 50,
        max: 80,
        step: 5
      },
      {
        id: 'closingPosition',
        name: 'Closing Position',
        description: 'Each close should be in lower X% of candle',
        type: 'percentage',
        defaultValue: 25,
        min: 10,
        max: 40,
        step: 5
      }
    ]
  },
  {
    id: 'piercing',
    name: 'Piercing Pattern',
    description: 'A two-candle bullish reversal pattern where a bearish candle is followed by a bullish candle that closes above the midpoint of the previous candle.',
    bullish: true,
    bearish: false,
    reliability: 4,
    image: 'https://images.unsplash.com/photo-1642790551189-42e9e797c5fc?auto=format&fit=crop&q=80&w=1470',
    parameters: [
      {
        id: 'piercingFactor',
        name: 'Piercing Factor',
        description: 'Minimum percentage the second candle pierces into the first',
        type: 'percentage',
        defaultValue: 50,
        min: 40,
        max: 70,
        step: 5
      },
      {
        id: 'gapDown',
        name: 'Gap Down Required',
        description: 'Whether the second candle must open below the first candle\'s close',
        type: 'boolean',
        defaultValue: true
      }
    ]
  }
];
