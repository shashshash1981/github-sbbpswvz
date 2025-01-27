import React from 'react';
import { CustomerInfo } from '../../types/customer';
import { FormField } from '../ui/FormField';
import toast from 'react-hot-toast';

interface CustomerFormProps {
  data: CustomerInfo;
  onChange: (data: Partial<CustomerInfo>) => void;
  hideButtons?: boolean;
}

export function CustomerForm({ data, onChange, hideButtons = false }: CustomerFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">
        Main Customer Information
      </h2>
      
      <FormField
        label="Full Name"
        required
        type="text"
        value={data.fullName}
        onChange={(value) => onChange({ fullName: value })}
      />

      <FormField
        label="Email"
        required
        type="email"
        value={data.email}
        onChange={(value) => onChange({ email: value })}
      />

      <FormField
        label="Primary Contact Address"
        type="text"
        value={data.address}
        onChange={(value) => onChange({ address: value })}
      />

      <FormField
        label="Phone Number"
        required
        type="tel"
        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        placeholder="XXX-XXX-XXXX"
        value={data.phone}
        onChange={(value) => onChange({ phone: value })}
      />

      <FormField
        label="Pick-up Location"
        required
        type="text"
        value={data.pickupAddress}
        onChange={(value) => onChange({ pickupAddress: value })}
      />

      <FormField
        label="Drop-off Location"
        required
        type="text"
        value={data.dropoffAddress}
        onChange={(value) => onChange({ dropoffAddress: value })}
      />

      <FormField
        label="General Notes"
        type="textarea"
        value={data.notes}
        onChange={(value) => onChange({ notes: value })}
      />
    </div>
  );
}