import React from 'react';
import { CandlestickPattern, PatternParameter } from '../types';

interface PatternConfigProps {
  pattern: CandlestickPattern;
  onParameterChange: (patternId: string, parameterId: string, value: any) => void;
  values: Record<string, any>;
}

const PatternConfig: React.FC<PatternConfigProps> = ({ 
  pattern, 
  onParameterChange,
  values
}) => {
  const handleChange = (parameter: PatternParameter, value: any) => {
    onParameterChange(pattern.id, parameter.id, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img src={pattern.image} alt={pattern.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{pattern.name}</h2>
          <div className="flex space-x-2 mt-1">
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
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">{pattern.description}</p>
      
      <div className="space-y-6">
        {pattern.parameters.map((parameter) => (
          <div key={parameter.id} className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium text-gray-700">{parameter.name}</label>
              <span className="text-sm text-gray-500 italic">
                {parameter.type === 'percentage' ? '%' : ''}
              </span>
            </div>
            <p className="text-sm text-gray-500">{parameter.description}</p>
            
            {parameter.type === 'boolean' ? (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`${pattern.id}-${parameter.id}`}
                  checked={values[parameter.id] ?? parameter.defaultValue}
                  onChange={(e) => handleChange(parameter, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor={`${pattern.id}-${parameter.id}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {values[parameter.id] ?? parameter.defaultValue ? 'Enabled' : 'Disabled'}
                </label>
              </div>
            ) : parameter.type === 'select' && parameter.options ? (
              <select
                value={values[parameter.id] ?? parameter.defaultValue}
                onChange={(e) => handleChange(parameter, e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {parameter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min={parameter.min}
                  max={parameter.max}
                  step={parameter.step}
                  value={values[parameter.id] ?? parameter.defaultValue}
                  onChange={(e) => handleChange(parameter, parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 text-center font-medium">
                  {values[parameter.id] ?? parameter.defaultValue}
                  {parameter.type === 'percentage' ? '%' : ''}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternConfig;
