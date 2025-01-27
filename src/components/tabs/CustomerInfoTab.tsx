import React from 'react';
import { FormField } from '../ui/FormField';
import { Save, RefreshCw } from 'lucide-react';
import { useCustomerInfo } from '../../hooks/useCustomerInfo';

export function CustomerInfoTab() {
  const { 
    formData, 
    updateCustomerInfo,
    saveCustomerInfo,
    resetForm 
  } = useCustomerInfo();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">
        Customer Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="First Name"
          type="text"
          value={formData.customer.firstName}
          onChange={(value) => updateCustomerInfo({ firstName: value })}
          required
        />

        <FormField
          label="Last Name"
          type="text"
          value={formData.customer.lastName}
          onChange={(value) => updateCustomerInfo({ lastName: value })}
          required
        />
      </div>

      <FormField
        label="Email"
        type="email"
        value={formData.customer.email}
        onChange={(value) => updateCustomerInfo({ email: value })}
        required
      />

      <FormField
        label="Phone Number"
        type="tel"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        placeholder="XXX-XXX-XXXX"
        value={formData.customer.phone}
        onChange={(value) => updateCustomerInfo({ phone: value })}
        required
      />

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">
          Address
        </h3>

        <FormField
          label="Address Line 1"
          type="text"
          value={formData.customer.addressLine1}
          onChange={(value) => updateCustomerInfo({ addressLine1: value })}
          required
        />

        <FormField
          label="Address Line 2"
          type="text"
          value={formData.customer.addressLine2}
          onChange={(value) => updateCustomerInfo({ addressLine2: value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="City"
            type="text"
            value={formData.customer.city}
            onChange={(value) => updateCustomerInfo({ city: value })}
            required
          />

          <FormField
            label="Province/State"
            type="text"
            value={formData.customer.province}
            onChange={(value) => updateCustomerInfo({ province: value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Country"
            type="text"
            value={formData.customer.country}
            onChange={(value) => updateCustomerInfo({ country: value })}
            required
          />

          <FormField
            label="Postal/ZIP Code"
            type="text"
            value={formData.customer.postalCode}
            onChange={(value) => updateCustomerInfo({ postalCode: value })}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">
          Trip Addresses
        </h3>

        <FormField
          label="Pickup Address"
          type="text"
          value={formData.customer.pickupAddress}
          onChange={(value) => updateCustomerInfo({ pickupAddress: value })}
          required
        />

        <FormField
          label="Dropoff Address"
          type="text"
          value={formData.customer.dropoffAddress}
          onChange={(value) => updateCustomerInfo({ dropoffAddress: value })}
          required
        />
      </div>

      <div className="flex gap-4 pt-6 border-t dark:border-dark-border-default">
        <button
          onClick={saveCustomerInfo}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-dark-brand-blue dark:hover:bg-blue-700"
        >
          <Save size={16} />
          Save Customer Info
        </button>
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-dark-bg-tertiary dark:text-dark-text-primary dark:hover:bg-dark-interactive-hover"
        >
          <RefreshCw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}