import React from 'react';
import { CandlestickPattern } from '../types';
import PatternCard from './PatternCard';

interface PatternListProps {
  patterns: CandlestickPattern[];
  onSelectPattern: (pattern: CandlestickPattern) => void;
  selectedPatternId: string | null;
}

const PatternList: React.FC<PatternListProps> = ({ 
  patterns, 
  onSelectPattern,
  selectedPatternId
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Candlestick Patterns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patterns.map((pattern) => (
          <PatternCard 
            key={pattern.id} 
            pattern={pattern} 
            onClick={onSelectPattern}
            isSelected={selectedPatternId === pattern.id}
          />
        ))}
      </div>
    </div>
  );
};

export default PatternList;
