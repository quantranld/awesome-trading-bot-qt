import React from 'react';
import { CandlestickPattern } from '../types';

interface PatternCardProps {
  pattern: CandlestickPattern;
  onClick: (pattern: CandlestickPattern) => void;
  isSelected: boolean;
}

const PatternCard: React.FC<PatternCardProps> = ({ pattern, onClick, isSelected }) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden shadow-md transition-all cursor-pointer hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
      }`}
      onClick={() => onClick(pattern)}
    >
      <div className="h-32 overflow-hidden">
        <img 
          src={pattern.image} 
          alt={pattern.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{pattern.name}</h3>
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span 
                key={i} 
                className={`w-2 h-2 rounded-full ${
                  i < pattern.reliability ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex space-x-2 mb-2">
          {pattern.bullish && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Bullish
            </span>
          )}
          {pattern.bearish && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Bearish
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{pattern.description}</p>
      </div>
    </div>
  );
};

export default PatternCard;
