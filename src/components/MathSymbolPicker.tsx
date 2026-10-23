/**
 * MathLover CCC - Math Symbol Picker Helper
 * Enables math students to quickly click and insert common mathematical symbols
 * into questions, study group agendas, or community solutions.
 */

import React from 'react';

interface MathSymbolPickerProps {
  onInsert: (symbol: string) => void;
}

const COMMON_SYMBOLS = [
  { symbol: '∫', label: 'Integral' },
  { symbol: '∑', label: 'Summation' },
  { symbol: '√', label: 'Square root' },
  { symbol: 'lim', label: 'Limit' },
  { symbol: 'd/dx', label: 'Derivative' },
  { symbol: '∂', label: 'Partial' },
  { symbol: '∞', label: 'Infinity' },
  { symbol: 'π', label: 'Pi' },
  { symbol: 'θ', label: 'Theta' },
  { symbol: 'λ', label: 'Lambda' },
  { symbol: 'μ', label: 'Mu' },
  { symbol: 'σ', label: 'Sigma' },
  { symbol: 'Δ', label: 'Delta' },
  { symbol: '±', label: 'Plus-minus' },
  { symbol: '≠', label: 'Not equal' },
  { symbol: '≤', label: 'Less equal' },
  { symbol: '≥', label: 'Greater equal' },
  { symbol: '≈', label: 'Approx' },
  { symbol: '∈', label: 'Element of' },
  { symbol: '⊂', label: 'Subset' },
  { symbol: '∪', label: 'Union' },
  { symbol: '∩', label: 'Intersection' },
  { symbol: 'x²', label: 'Square' },
  { symbol: 'Rⁿ', label: 'Real space' },
];

export const MathSymbolPicker: React.FC<MathSymbolPickerProps> = ({ onInsert }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Quick Math Symbols Toolbar:
        </span>
        <span className="text-[11px] text-slate-400">Click symbol to insert</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {COMMON_SYMBOLS.map((item) => (
          <button
            key={item.symbol}
            type="button"
            onClick={() => onInsert(item.symbol)}
            title={item.label}
            className="px-2 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded text-xs font-mono font-medium text-slate-700 shadow-2xs transition-colors"
          >
            {item.symbol}
          </button>
        ))}
      </div>
    </div>
  );
};
