import React, { useState } from 'react';
import Header from './components/Header';
import PatternList from './components/PatternList';
import PatternConfig from './components/PatternConfig';
import CommonConfig from './components/CommonConfig';
import CandlestickChart from './components/CandlestickChart';
import { candlestickPatterns } from './data/candlestickPatterns';
import { defaultCommonConfig } from './data/commonConfig';
import { CandlestickPattern, Candle, CommonConfig as CommonConfigType } from './types';

// Sample data for demonstration
const sampleCandles: Candle[] = Array.from({ length: 20 }).map((_, i) => {
  const basePrice = 30000 + Math.random() * 2000;
  const volatility = 200;
  return {
    timestamp: Date.now() - (19 - i) * 15 * 60 * 1000, // 15-minute candles
    open: basePrice + (Math.random() - 0.5) * volatility,
    high: basePrice + Math.random() * volatility,
    low: basePrice - Math.random() * volatility,
    close: basePrice + (Math.random() - 0.5) * volatility,
    volume: Math.random() * 100
  };
});

function App() {
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [patternParameters, setPatternParameters] = useState<Record<string, Record<string, any>>>({});
  const [commonConfig, setCommonConfig] = useState<CommonConfigType>(defaultCommonConfig);
  const [activeTab, setActiveTab] = useState<'patterns' | 'common'>('patterns');

  const handleSelectPattern = (pattern: CandlestickPattern) => {
    setSelectedPatternId(pattern.id);
    
    // Initialize parameters if not already set
    if (!patternParameters[pattern.id]) {
      const initialParams: Record<string, any> = {};
      pattern.parameters.forEach(param => {
        initialParams[param.id] = param.defaultValue;
      });
      setPatternParameters(prev => ({
        ...prev,
        [pattern.id]: initialParams
      }));
    }
  };

  const handleParameterChange = (patternId: string, parameterId: string, value: any) => {
    setPatternParameters(prev => ({
      ...prev,
      [patternId]: {
        ...prev[patternId],
        [parameterId]: value
      }
    }));
  };

  const handleCommonConfigChange = (config: CommonConfigType) => {
    setCommonConfig(config);
  };

  const selectedPattern = selectedPatternId 
    ? candlestickPatterns.find(p => p.id === selectedPatternId) 
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crypto Trading Automation</h1>
          <p className="text-gray-600">Configure candlestick patterns to automate your crypto trading strategy</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Market Overview</h2>
          <div className="h-80">
            <CandlestickChart data={sampleCandles} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PatternList 
              patterns={candlestickPatterns} 
              onSelectPattern={handleSelectPattern}
              selectedPatternId={selectedPatternId}
            />
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'patterns' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('patterns')}
                >
                  Pattern Config
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-center font-medium ${
                    activeTab === 'common' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('common')}
                >
                  Common Settings
                </button>
              </div>
            </div>

            {activeTab === 'patterns' && selectedPattern && (
              <PatternConfig 
                pattern={selectedPattern}
                onParameterChange={handleParameterChange}
                values={patternParameters[selectedPattern.id] || {}}
              />
            )}
            
            {activeTab === 'patterns' && !selectedPattern && (
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
                <div className="text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Pattern Selected</h3>
                <p className="text-gray-500 text-center">
                  Select a candlestick pattern from the list to configure its parameters
                </p>
              </div>
            )}

            {activeTab === 'common' && (
              <CommonConfig 
                config={commonConfig}
                onConfigChange={handleCommonConfigChange}
              />
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">CryptoPatternTrader</h3>
              <p className="text-gray-400">Automate your crypto trading with candlestick patterns</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CryptoPatternTrader. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
