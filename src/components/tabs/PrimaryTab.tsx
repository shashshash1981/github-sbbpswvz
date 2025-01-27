import React, { useState, useEffect } from 'react';
import { CostInputField } from '../CostInputField';
import { TotalSection } from '../TotalSection';
import { CalculationDisplay } from '../CalculationDisplay';
import { TripCosts } from '../../types';
import { Save, RefreshCw, Calculator } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface PrimaryTabProps {
  costs: TripCosts;
  calculations: any;
  onInputChange: (field: keyof TripCosts, value: string) => void;
  onCurrencyChange: (value: string) => void;
  onSave: () => Promise<void>;
  onReset: () => void;
  onCalculate: () => void;
}

export function PrimaryTab({
  costs,
  calculations,
  onInputChange,
  onCurrencyChange,
  onSave,
  onReset,
  onCalculate
}: PrimaryTabProps) {
  const [customers, setCustomers] = useState<Array<{ id: string, fullname: string }>>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, fullname')
        .order('fullname');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch customers');
    }
  };

  const handleSave = async () => {
    if (!selectedCustomerId) {
      toast.error('Please select a customer first');
      return;
    }

    try {
      const { error } = await supabase
        .from('trip_costs')
        .insert([{
          customer_id: selectedCustomerId,
          cost_data: costs
        }]);

      if (error) throw error;
      toast.success('Trip costs saved successfully');
      onSave();
    } catch (error: any) {
      toast.error('Failed to save trip costs');
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
          Select Customer
        </label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500
            dark:bg-dark-bg-tertiary dark:border-dark-border-default dark:text-dark-text-primary"
        >
          <option value="">Select a customer...</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.fullname}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCalculate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md 
            hover:bg-blue-700 dark:bg-dark-brand-blue dark:hover:bg-blue-700"
        >
          <Calculator size={16} />
          Calculate
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md 
            hover:bg-gray-300 dark:bg-dark-bg-tertiary dark:text-dark-text-primary 
            dark:hover:bg-dark-interactive-hover"
        >
          <RefreshCw size={16} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hourly Rate Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">
            Hourly Rate
          </h3>
          <CostInputField
            label="Base Rate per Hour"
            value={costs.perHourBaseRate}
            onChange={(value) => onInputChange('perHourBaseRate', value)}
          />
          <CostInputField
            label="Hours"
            value={costs.perHourHours}
            onChange={(value) => onInputChange('perHourHours', value)}
            calculation={calculations.perHourTotal}
          />
        </div>

        {/* Mileage Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">
            Mileage
          </h3>
          <CostInputField
            label="Rate per Mile"
            value={costs.perMileRate}
            onChange={(value) => onInputChange('perMileRate', value)}
          />
          <CostInputField
            label="Miles"
            value={costs.perMileMiles}
            onChange={(value) => onInputChange('perMileMiles', value)}
            calculation={calculations.perMileTotal}
          />
        </div>

        {/* Additional Costs */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">
            Additional Costs
          </h3>
          <CostInputField
            label="Standard Gratuity"
            value={costs.stdGrat}
            onChange={(value) => onInputChange('stdGrat', value)}
            suffix="%"
            calculation={calculations.gratTotal}
          />
          <CostInputField
            label="Parking"
            value={costs.parking}
            onChange={(value) => onInputChange('parking', value)}
          />
          <CostInputField
            label="Meet & Greet"
            value={costs.meetAndGreet}
            onChange={(value) => onInputChange('meetAndGreet', value)}
          />
        </div>

        {/* Extra Charges */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">
            Extra Charges
          </h3>
          <CostInputField
            label="Overtime Wait Time"
            value={costs.otWaitTime}
            onChange={(value) => onInputChange('otWaitTime', value)}
          />
          <CostInputField
            label="Extra Stops"
            value={costs.extraStopsCount}
            onChange={(value) => onInputChange('extraStopsCount', value)}
          />
          <CostInputField
            label="Rate per Stop"
            value={costs.extraStopsRate}
            onChange={(value) => onInputChange('extraStopsRate', value)}
            calculation={calculations.extraStopsTotal}
          />
        </div>
      </div>

      {/* Adjustments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">
            Adjustments
          </h3>
          <CostInputField
            label="Fuel Surcharge"
            value={costs.fuelSurcharge}
            onChange={(value) => onInputChange('fuelSurcharge', value)}
            suffix="%"
            calculation={calculations.fuelSurchargeTotal}
          />
          <CostInputField
            label="Discount"
            value={costs.discount}
            onChange={(value) => onInputChange('discount', value)}
            suffix="%"
            calculation={calculations.discountTotal}
            textColor="text-red-600 dark:text-dark-brand-red"
          />
          <CostInputField
            label="GST"
            value={costs.gstTax}
            onChange={(value) => onInputChange('gstTax', value)}
            suffix="%"
            calculation={calculations.gstTotal}
          />
        </div>
      </div>

      {/* Totals */}
      <TotalSection
        costs={costs}
        calculations={calculations}
        onCurrencyChange={onCurrencyChange}
      />

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t dark:border-dark-border-default">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md 
            hover:bg-blue-700 dark:bg-dark-brand-blue dark:hover:bg-blue-700"
        >
          <Save size={16} />
          Save Calculations
        </button>
      </div>
    </div>
  );
}