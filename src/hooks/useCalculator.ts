import { useState } from 'react';
import { TripCosts } from '../types';
import { calculateTotals } from '../utils/calculations';
import { sendInvoiceEmail } from '../utils/email';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const initialCosts: TripCosts = {
  flatRate: 0,
  perHourRate: 0,
  perHourHours: 0,
  perHourBaseRate: 0,
  perMileRate: 0,
  perMileMiles: 0,
  stdGrat: 0,
  parking: 0,
  meetAndGreet: 0,
  otWaitTime: 0,
  extraStopsCount: 0,
  extraStopsRate: 0,
  fuelSurcharge: 0,
  discount: 0,
  gstTax: 0,
  currency: 'CAD'
};

export function useCalculator() {
  const [costs, setCosts] = useState<TripCosts>(initialCosts);
  const calculations = calculateTotals(costs);

  const handleInputChange = (field: keyof TripCosts, value: string) => {
    setCosts(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const calculateAll = () => {
    return calculateTotals(costs);
  };

  const resetCalculator = () => {
    setCosts(initialCosts);
  };

  const handleEmailInvoice = async () => {
    try {
      await sendInvoiceEmail(costs, calculations);
      toast.success('Invoice sent successfully');
    } catch (error) {
      toast.error('Failed to send invoice');
    }
  };

  const saveCalculations = async () => {
    try {
      const { error } = await supabase
        .from('trip_costs')
        .insert([{ cost_data: costs }]);

      if (error) throw error;
      toast.success('Calculations saved successfully');
    } catch (error) {
      toast.error('Failed to save calculations');
      console.error('Error saving calculations:', error);
    }
  };

  return {
    costs,
    calculations,
    handleInputChange,
    calculateAll,
    resetCalculator,
    handleEmailInvoice,
    saveCalculations
  };
}