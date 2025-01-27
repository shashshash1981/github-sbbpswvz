import React from 'react';

interface CalculationDisplayProps {
  label: string;
  value: number;
  currency: string;
}

export function CalculationDisplay({ label, value, currency }: CalculationDisplayProps) {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md
      dark:bg-dark-bg-tertiary">
      <span className="text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
        {label}:
      </span>
      <span className="text-sm font-semibold text-blue-600 dark:text-dark-brand-blue">
        {currency} {value.toFixed(2)}
      </span>
    </div>
  );
}