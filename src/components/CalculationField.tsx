import React from 'react';

interface CalculationFieldProps {
  value: number;
}

export function CalculationField({ value }: CalculationFieldProps) {
  return (
    <input
      type="number"
      value={value}
      readOnly
      className="w-full p-2 border rounded bg-gray-50 dark:bg-dark-bg-tertiary 
        dark:border-dark-border-default dark:text-dark-text-primary"
    />
  );
}