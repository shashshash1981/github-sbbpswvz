import React from 'react';
import { CalculationField } from './CalculationField';
import { NumberInput } from './NumberInput';

interface CostInputFieldProps {
  label: string;
  value: number;
  onChange: (value: string) => void;
  suffix?: string;
  calculation?: number;
  textColor?: string;
}

export function CostInputField({
  label,
  value,
  onChange,
  suffix,
  calculation,
  textColor = 'text-gray-700 dark:text-dark-text-primary'
}: CostInputFieldProps) {
  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${textColor}`}>
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <NumberInput value={value} onChange={onChange} />
        {suffix && <span className="dark:text-dark-text-primary">{suffix}</span>}
        {calculation !== undefined && (
          <>
            <span className="dark:text-dark-text-primary">=</span>
            <CalculationField value={calculation} />
          </>
        )}
      </div>
    </div>
  );
}