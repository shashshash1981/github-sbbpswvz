import React, { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { CustomerInfo, TripDetails, MeetGreetInfo } from '../../types/customer';
import { TripCosts } from '../../types';

interface CompleteCustomerData {
  customer: CustomerInfo;
  tripDetails: TripDetails;
  meetAndGreet: MeetGreetInfo;
  tripCosts: TripCosts;
}

export function TripInfoTab() {
  const [searchName, setSearchName] = useState('');
  const [customerData, setCustomerData] = useState<CompleteCustomerData | null>(null);

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          trip_details(*),
          meet_greet_details(*),
          trip_costs(*)
        `)
        .or(`first_name.ilike.%${searchName}%,last_name.ilike.%${searchName}%`)
        .single();

      if (error) throw error;

      if (data) {
        const formattedData: CompleteCustomerData = {
          customer: {
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            addressLine1: data.address_line1,
            addressLine2: data.address_line2,
            city: data.city,
            province: data.province,
            country: data.country,
            postalCode: data.postal_code
          },
          tripDetails: data.trip_details?.[0] ? {
            pickupDate: data.trip_details[0].pickup_date,
            pickupTime: data.trip_details[0].pickup_time,
            pickupLocation: data.trip_details[0].pickup_location,
            dropoffLocation: data.trip_details[0].dropoff_location,
            passengerCount: data.trip_details[0].passenger_count,
            specialNotes: data.trip_details[0].special_notes
          } : null,
          meetAndGreet: data.meet_greet_details?.[0] ? {
            airlineAndFlight: data.meet_greet_details[0].airline_flight,
            arrivalTime: data.meet_greet_details[0].arrival_time,
            passengerCount: data.meet_greet_details[0].passenger_count,
            luggageCount: data.meet_greet_details[0].luggage_count,
            specialNotes: data.meet_greet_details[0].special_notes
          } : null,
          tripCosts: data.trip_costs?.[0]?.cost_data || null
        };

        setCustomerData(formattedData);
        toast.success('Customer data retrieved successfully');
      } else {
        toast.error('No customer found with that name');
      }
    } catch (error: any) {
      console.error('Error fetching customer data:', error);
      toast.error(error.message || 'Failed to fetch customer data');
    }
  };

  const resetData = () => {
    setCustomerData(null);
    setSearchName('');
    toast.success('Data reset successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
            Search by Customer Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full p-2 pr-10 border rounded focus:ring-1 focus:ring-blue-500
                dark:bg-dark-bg-tertiary dark:border-dark-border-default dark:text-dark-text-primary"
              placeholder="Enter customer name..."
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600
                dark:hover:text-dark-text-primary"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
        <button
          onClick={resetData}
          className="self-end px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300
            dark:bg-dark-bg-tertiary dark:text-dark-text-primary dark:hover:bg-dark-interactive-hover"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {customerData && (
        <div className="space-y-8">
          {/* Customer Information */}
          <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Name</p>
                <p className="font-medium dark:text-dark-text-primary">
                  {customerData.customer.firstName} {customerData.customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Email</p>
                <p className="font-medium dark:text-dark-text-primary">{customerData.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Phone</p>
                <p className="font-medium dark:text-dark-text-primary">{customerData.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Address</p>
                <p className="font-medium dark:text-dark-text-primary">
                  {customerData.customer.addressLine1}
                  {customerData.customer.addressLine2 && <>, {customerData.customer.addressLine2}</>}
                  <br />
                  {customerData.customer.city}, {customerData.customer.province}
                  <br />
                  {customerData.customer.country} {customerData.customer.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          {customerData.tripDetails && (
            <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
              <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">
                Trip Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Pickup Date & Time</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripDetails.pickupDate} at {customerData.tripDetails.pickupTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Pickup Location</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripDetails.pickupLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Dropoff Location</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripDetails.dropoffLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Passengers</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripDetails.passengerCount}
                  </p>
                </div>
                {customerData.tripDetails.specialNotes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Special Notes</p>
                    <p className="font-medium dark:text-dark-text-primary">
                      {customerData.tripDetails.specialNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Meet & Greet Details */}
          {customerData.meetAndGreet && (
            <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
              <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">
                Meet & Greet Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Flight</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.meetAndGreet.airlineAndFlight}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Arrival Time</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.meetAndGreet.arrivalTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Passengers</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.meetAndGreet.passengerCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Luggage Items</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.meetAndGreet.luggageCount}
                  </p>
                </div>
                {customerData.meetAndGreet.specialNotes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Special Notes</p>
                    <p className="font-medium dark:text-dark-text-primary">
                      {customerData.meetAndGreet.specialNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Trip Costs */}
          {customerData.tripCosts && (
            <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
              <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">
                Trip Costs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Base Rate per Hour</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripCosts.perHourBaseRate} {customerData.tripCosts.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Hours</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripCosts.perHourHours}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Rate per Mile</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripCosts.perMileRate} {customerData.tripCosts.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Miles</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripCosts.perMileMiles}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Gratuity</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripCosts.stdGrat}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Currency</p>
                  <p className="font-medium dark:text-dark-text-primary">
                    {customerData.tripCosts.currency}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}