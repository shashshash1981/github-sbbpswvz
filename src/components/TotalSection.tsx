import React from 'react';
import { TripCosts, Calculations } from '../types';
import { CalculationField } from './CalculationField';

interface TotalSectionProps {
  costs: TripCosts;
  calculations: Calculations;
  onCurrencyChange: (value: string) => void;
}

export function TotalSection({
  costs,
  calculations,
  onCurrencyChange
}: TotalSectionProps) {
  return (
    <div className="mt-8 space-y-4 border-t pt-4 dark:border-dark-border-default">
      <div className="flex justify-between items-center">
        <span className="font-medium dark:text-dark-text-primary">Grand Total</span>
        <div className="flex items-center gap-2">
          <select
            value={costs.currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="p-2 border rounded dark:bg-dark-bg-tertiary dark:border-dark-border-default 
              dark:text-dark-text-primary"
          >
            <option value="CAD">CAD $</option>
            <option value="USD">USD $</option>
          </select>
          <CalculationField value={calculations.grandTotal} />
        </div>
      </div>

      <div className="flex justify-between items-center text-blue-600 dark:text-dark-brand-blue">
        <span>Payments/Deposits</span>
        <CalculationField value={calculations.paymentsDeposits} />
      </div>

      <div className="flex justify-between items-center text-red-600 dark:text-dark-brand-red font-bold">
        <span>Total Due</span>
        <CalculationField value={calculations.totalDue} />
      </div>
    </div>
  );
}