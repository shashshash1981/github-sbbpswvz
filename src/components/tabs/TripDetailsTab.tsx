import React from 'react';
import { FormField } from '../ui/FormField';
import { Save, RefreshCw } from 'lucide-react';
import { useTripDetails } from '../../hooks/useTripDetails';

export function TripDetailsTab() {
  const {
    customers,
    selectedCustomerId,
    selectedCustomer,
    tripDetails,
    meetAndGreet,
    isFormEnabled,
    savedTripId,
    handleCustomerSelect,
    updateTripDetails,
    updateMeetGreetInfo,
    saveTripDetails,
    saveMeetAndGreet,
    resetForm
  } = useTripDetails();

  return (
    <div className="space-y-8">
      {/* Customer Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
          Select Customer
        </label>
        <select
          value={selectedCustomerId}
          onChange={(e) => handleCustomerSelect(e.target.value)}
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

      {/* Selected Customer Info */}
      {selectedCustomer && (
        <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
          <h3 className="font-medium text-gray-700 dark:text-dark-text-primary mb-2">
            Selected Customer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-dark-text-secondary">Email:</span>
              <span className="ml-2 dark:text-dark-text-primary">{selectedCustomer.email}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-dark-text-secondary">Phone:</span>
              <span className="ml-2 dark:text-dark-text-primary">{selectedCustomer.phone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Trip Information Section */}
      <div className={`space-y-6 ${!isFormEnabled && 'opacity-50 pointer-events-none'}`}>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">
          Trip Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Pickup Date"
            type="date"
            value={tripDetails.pickupDate}
            onChange={(value) => updateTripDetails({ pickupDate: value })}
            required
          />
          
          <FormField
            label="Pickup Time"
            type="time"
            value={tripDetails.pickupTime}
            onChange={(value) => updateTripDetails({ pickupTime: value })}
            required
          />
        </div>

        <FormField
          label="Pickup Location"
          type="text"
          value={tripDetails.pickupLocation}
          onChange={(value) => updateTripDetails({ pickupLocation: value })}
          required
        />

        <FormField
          label="Dropoff Location"
          type="text"
          value={tripDetails.dropoffLocation}
          onChange={(value) => updateTripDetails({ dropoffLocation: value })}
          required
        />

        <FormField
          label="Number of Passengers"
          type="number"
          value={tripDetails.passengerCount}
          onChange={(value) => updateTripDetails({ passengerCount: parseInt(value) })}
          min="1"
          required
        />

        <FormField
          label="Special Notes"
          type="textarea"
          value={tripDetails.specialNotes}
          onChange={(value) => updateTripDetails({ specialNotes: value })}
        />

        <div className="flex gap-4">
          <button
            onClick={saveTripDetails}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-dark-brand-blue dark:hover:bg-blue-700"
            disabled={!isFormEnabled}
          >
            <Save size={16} />
            Save Trip Details
          </button>
          <button
            onClick={() => resetForm('trip')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-dark-bg-tertiary dark:text-dark-text-primary dark:hover:bg-dark-interactive-hover"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Meet and Greet Section */}
      <div className={`space-y-6 pt-8 border-t dark:border-dark-border-default ${!isFormEnabled && 'opacity-50 pointer-events-none'}`}>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">
          Meet & Greet Details (Optional)
        </h2>

        <FormField
          label="Airline & Flight Number"
          type="text"
          placeholder="e.g., AC - AC123"
          value={meetAndGreet.airlineAndFlight}
          onChange={(value) => updateMeetGreetInfo({ airlineAndFlight: value })}
        />

        <FormField
          label="Arrival Time"
          type="time"
          value={meetAndGreet.arrivalTime}
          onChange={(value) => updateMeetGreetInfo({ arrivalTime: value })}
        />

        <FormField
          label="Number of Passengers"
          type="number"
          min="1"
          value={meetAndGreet.passengerCount}
          onChange={(value) => updateMeetGreetInfo({ passengerCount: parseInt(value) })}
        />

        <FormField
          label="Number of Luggage Items"
          type="number"
          min="0"
          value={meetAndGreet.luggageCount}
          onChange={(value) => updateMeetGreetInfo({ luggageCount: parseInt(value) })}
        />

        <FormField
          label="Special Notes"
          type="textarea"
          value={meetAndGreet.specialNotes}
          onChange={(value) => updateMeetGreetInfo({ specialNotes: value })}
        />

        <div className="flex gap-4">
          <button
            onClick={saveMeetAndGreet}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-dark-brand-blue dark:hover:bg-blue-700"
            disabled={!savedTripId}
          >
            <Save size={16} />
            Save Meet & Greet
          </button>
          <button
            onClick={() => resetForm('meetGreet')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-dark-bg-tertiary dark:text-dark-text-primary dark:hover:bg-dark-interactive-hover"
          >
            <RefreshCw size={16} />
            Reset Meet & Greet
          </button>
        </div>
      </div>
    </div>
  );
}