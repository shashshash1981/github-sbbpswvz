import React from 'react';

interface FormFieldProps {
  label: string;
  type: 'text' | 'tel' | 'time' | 'number' | 'textarea';
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  pattern?: string;
  placeholder?: string;
  min?: string;
}

export function FormField({
  label,
  type,
  value,
  onChange,
  required,
  pattern,
  placeholder,
  min,
}: FormFieldProps) {
  const baseClassName = "w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 dark:bg-dark-bg-tertiary dark:border-dark-border-default dark:text-dark-text-primary dark:focus:ring-dark-brand-blue";

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseClassName} h-24 resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          pattern={pattern}
          placeholder={placeholder}
          min={min}
          className={baseClassName}
        />
      )}
    </div>
  );
}