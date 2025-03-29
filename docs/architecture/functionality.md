---
description: 
globs: 
alwaysApply: false
---
 # Awesome Trading Bot QT - Current Functionality

## Global Settings
The application maintains a set of global settings that apply across all trading operations:

### Global Common Settings
- **Daily Trade Limit**: Maximum number of trades allowed per day
- **Max Amount Per Trade**: Maximum amount that can be traded in a single transaction
- **Monitored Crypto Pairs**: List of cryptocurrency pairs being monitored for trading opportunities
- **Timeframes**: Available time intervals for price analysis and trading

## Crypto Pair Specific Settings
Each monitored cryptocurrency pair has its own configuration settings:

### Common Settings
- **Timeframes**: Specific time intervals for this pair's analysis
- **Stop Loss**: Price level at which to automatically sell to limit losses
- **Take Profit**: Price level at which to automatically sell to secure profits
- **Trailing Stop**: Dynamic stop loss that follows price movement to protect profits

### Pattern Settings
- Individual configuration for each candlestick pattern
- Customizable parameters for pattern detection
- Override global pattern settings when needed

## Configuration Hierarchy
The application follows a hierarchical configuration structure:
1. **Global Defaults**: Base settings applied when no other configuration exists
2. **Global User Settings**: User-defined settings that apply to all pairs unless overridden
3. **Pair-Specific Common Settings**: Settings that override global settings for a specific pair
4. **Pair-Specific Pattern Settings**: Most granular control for pattern parameters per pair

## State Management
- Primary state managed through `useConfig` hook
- Configuration stored in `AppConfig` type with two main sections:
  - `globalCommonConfig`: Global settings
  - `cryptoPairConfigs`: Pair-specific configurations
- State updates follow immutable patterns
- Data persistence handled through `databaseProvider` service

## Authentication
- User authentication managed through `useAuth` hook
- Different user roles supported (e.g., Admin)