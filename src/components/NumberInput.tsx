import React from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: string) => void;
  step?: string;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  step = "0.01",
  className = "w-full p-2 border rounded dark:bg-dark-bg-tertiary dark:border-dark-border-default dark:text-dark-text-primary focus:ring-1 focus:ring-blue-500 dark:focus:ring-dark-brand-blue"
}: NumberInputProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      step={step}
      className={className}
    />
  );
}