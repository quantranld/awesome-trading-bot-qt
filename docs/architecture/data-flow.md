# Data Flow Diagrams

## Main Trading Flow

```mermaid
sequenceDiagram
    participant PriceSource
    participant TradingEngine
    participant PatternAnalyzer
    participant OrderManager
    participant PositionTracker
    participant PerformanceMonitor

    Note over PriceSource: Price data ingestion
    PriceSource->>TradingEngine: Stream price data
    Note over TradingEngine: Pattern analysis
    TradingEngine->>PatternAnalyzer: Analyze candlestick patterns
    PatternAnalyzer-->>TradingEngine: Pattern detection results
    
    alt Pattern detected
        Note over TradingEngine: Trading signal generation
        TradingEngine->>OrderManager: Generate trading signal
        OrderManager->>OrderManager: Validate against config
        OrderManager->>PositionTracker: Execute order
        PositionTracker-->>TradingEngine: Order status
        PositionTracker->>PerformanceMonitor: Update position
        PerformanceMonitor-->>TradingEngine: Performance metrics
    end
```

## Configuration Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant ConfigManager
    participant TradingEngine
    participant PatternAnalyzer

    User->>UI: Update configuration
    UI->>ConfigManager: Save config changes
    ConfigManager->>ConfigManager: Validate config
    ConfigManager->>TradingEngine: Update trading parameters
    ConfigManager->>PatternAnalyzer: Update pattern settings
    
    Note over ConfigManager: Auto-save
    ConfigManager->>ConfigManager: Persist to database
    
    alt Success
        ConfigManager-->>UI: Save success notification
    else Error
        ConfigManager-->>UI: Save error notification
    end
```

## Pattern Detection Flow

```mermaid
sequenceDiagram
    participant PriceData
    participant PatternAnalyzer
    participant ConfigManager
    participant PatternConfig

    PriceData->>PatternAnalyzer: New candlestick data
    PatternAnalyzer->>ConfigManager: Get pattern settings
    ConfigManager->>PatternConfig: Load pattern parameters
    
    loop For each pattern
        PatternAnalyzer->>PatternAnalyzer: Check pattern conditions
        alt Pattern matches
            PatternAnalyzer->>PatternAnalyzer: Generate signal
        end
    end
    
    PatternAnalyzer-->>TradingEngine: Pattern detection results
```

## Notes on the Diagrams

1. **Main Trading Flow**
   - Shows the primary flow from price data to order execution
   - Includes position tracking and performance monitoring
   - Demonstrates the decision-making process for trade execution

2. **Configuration Flow**
   - Illustrates how configuration changes propagate through the system
   - Shows the auto-save mechanism
   - Includes error handling and user feedback

3. **Pattern Detection Flow**
   - Details the pattern analysis process
   - Shows how pattern configurations are loaded and applied
   - Demonstrates the signal generation process

These diagrams represent the high-level flow of data and operations in the trading bot. Each component can be further detailed with specific implementation details as needed. 