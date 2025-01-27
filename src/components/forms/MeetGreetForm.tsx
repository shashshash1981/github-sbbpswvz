import React from 'react';
import { MeetGreetInfo } from '../../types/customer';
import { FormField } from '../ui/FormField';

interface MeetGreetFormProps {
  data: MeetGreetInfo;
  onChange: (data: Partial<MeetGreetInfo>) => void;
  hideButtons?: boolean;
}

export function MeetGreetForm({ data, onChange, hideButtons = false }: MeetGreetFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">
        Meet & Greet Details
      </h2>

      <FormField
        label="Airline & Flight Number"
        type="text"
        placeholder="e.g., AC - AC123"
        value={data.airlineAndFlight}
        onChange={(value) => onChange({ airlineAndFlight: value })}
      />

      <FormField
        label="Arrival Time"
        type="time"
        value={data.arrivalTime}
        onChange={(value) => onChange({ arrivalTime: value })}
      />

      <FormField
        label="Number of Passengers"
        type="number"
        min="1"
        value={data.passengerCount}
        onChange={(value) => onChange({ passengerCount: parseInt(value) })}
      />

      <FormField
        label="Number of Luggage Items"
        type="number"
        min="0"
        value={data.luggageCount}
        onChange={(value) => onChange({ luggageCount: parseInt(value) })}
      />

      <FormField
        label="Special Notes"
        type="textarea"
        value={data.specialNotes}
        onChange={(value) => onChange({ specialNotes: value })}
      />
    </div>
  );
}