import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CustomerInfo, MeetGreetInfo } from '../../types/customer';
import { TripCosts } from '../../types';
import { sendInvoiceEmail } from '../../utils/email';
import toast from 'react-hot-toast';

interface TripData {
  customer: CustomerInfo;
  meetAndGreet: MeetGreetInfo;
  tripCosts: TripCosts;
  calculations: any;
}

export function TripDataTab() {
  const [searchName, setSearchName] = useState('');
  const [tripData, setTripData] = useState<TripData | null>(null);

  const handleSearch = async () => {
    try {
      // Search for customer and related data
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select(`
          *,
          meet_greet_details(*),
          trip_costs(*)
        `)
        .ilike('fullname', `%${searchName}%`)
        .single();

      if (customerError) throw customerError;

      if (!customerData) {
        toast.error('No customer found with that name');
        return;
      }

      // Transform the data to match our interfaces
      const customer: CustomerInfo = {
        fullName: customerData.fullname,
        email: customerData.email,
        address: customerData.address,
        phone: customerData.phone,
        pickupAddress: customerData.pickupaddress,
        dropoffAddress: customerData.dropoffaddress,
        notes: customerData.notes
      };

      const meetAndGreet: MeetGreetInfo = customerData.meet_greet_details?.[0] ? {
        airlineAndFlight: customerData.meet_greet_details[0].airline_flight,
        arrivalTime: customerData.meet_greet_details[0].arrival_time,
        passengerCount: customerData.meet_greet_details[0].passenger_count,
        luggageCount: customerData.meet_greet_details[0].luggage_count,
        specialNotes: customerData.meet_greet_details[0].special_notes
      } : {
        airlineAndFlight: '',
        arrivalTime: '',
        passengerCount: 1,
        luggageCount: 0,
        specialNotes: ''
      };

      const tripCosts = customerData.trip_costs?.[0]?.cost_data || {};

      setTripData({
        customer,
        meetAndGreet,
        tripCosts,
        calculations: {} // You might want to recalculate this based on the trip costs
      });

      toast.success('Customer data retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching trip data:', error);
      toast.error(error.message || 'Failed to fetch trip data');
    }
  };

  const handleSendEmail = async () => {
    if (!tripData) {
      toast.error('No trip data available');
      return;
    }

    try {
      await sendInvoiceEmail(
        tripData.tripCosts,
        tripData.calculations,
        tripData.customer
      );
      toast.success('Trip details sent successfully');
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error(error.message || 'Failed to send email');
    }
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
      </div>

      {tripData && (
        <div className="space-y-8">
          {/* Customer Information */}
          <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Full Name</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.customer.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Email</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Phone</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Address</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.customer.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Pickup Address</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.customer.pickupAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Dropoff Address</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.customer.dropoffAddress}</p>
              </div>
            </div>
          </div>

          {/* Meet & Greet Information */}
          <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">
              Meet & Greet Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Airline & Flight</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.meetAndGreet.airlineAndFlight}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Arrival Time</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.meetAndGreet.arrivalTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Passengers</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.meetAndGreet.passengerCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Luggage Items</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.meetAndGreet.luggageCount}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Special Notes</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.meetAndGreet.specialNotes}</p>
              </div>
            </div>
          </div>

          {/* Trip Costs */}
          <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">
              Trip Costs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Base Rate per Hour</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.tripCosts.perHourBaseRate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Hours</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.tripCosts.perHourHours}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Rate per Mile</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.tripCosts.perMileRate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Miles</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.tripCosts.perMileMiles}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Gratuity</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.tripCosts.stdGrat}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Currency</p>
                <p className="font-medium dark:text-dark-text-primary">{tripData.tripCosts.currency}</p>
              </div>
            </div>
          </div>

          {/* Email Button */}
          <div className="flex justify-end pt-4 border-t dark:border-dark-border-default">
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md
                hover:bg-blue-700 dark:bg-dark-brand-blue dark:hover:bg-blue-700"
            >
              <Send size={16} />
              Email Trip Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}