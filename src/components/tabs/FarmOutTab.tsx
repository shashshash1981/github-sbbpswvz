import React, { useState, useEffect } from 'react';
import { Search, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { FormField } from '../ui/FormField';
import { CustomerInfo, MeetGreetInfo } from '../../types/customer';
import { sendInvoiceEmail } from '../../utils/email';
import toast from 'react-hot-toast';

interface AffiliateInfo {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

interface FarmOutData {
  affiliate: AffiliateInfo | null;
  customer: {
    info: CustomerInfo;
    meetAndGreet: MeetGreetInfo;
  } | null;
  farmOutAmount: number;
}

export function FarmOutTab() {
  const [affiliateFormData, setAffiliateFormData] = useState<AffiliateInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [searchAffiliateName, setSearchAffiliateName] = useState('');
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [farmOutData, setFarmOutData] = useState<FarmOutData>({
    affiliate: null,
    customer: null,
    farmOutAmount: 0
  });

  const handleAffiliateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('affiliates')
        .insert([affiliateFormData]);

      if (error) throw error;
      
      toast.success('Affiliate saved successfully');
      setAffiliateFormData({ name: '', email: '', phone: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save affiliate');
    }
  };

  const searchAffiliate = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .ilike('name', `%${searchAffiliateName}%`)
        .single();

      if (error) throw error;

      if (data) {
        setFarmOutData(prev => ({
          ...prev,
          affiliate: data
        }));
        toast.success('Affiliate found');
      } else {
        toast.error('No affiliate found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to search affiliate');
    }
  };

  const searchCustomer = async () => {
    try {
      // Search for customer and meet & greet details
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select(`
          *,
          meet_greet_details(*)
        `)
        .ilike('fullname', `%${searchCustomerName}%`)
        .single();

      if (customerError) throw customerError;

      if (customerData) {
        const customerInfo: CustomerInfo = {
          fullName: customerData.fullname,
          email: customerData.email,
          address: customerData.address,
          phone: customerData.phone,
          pickupAddress: customerData.pickupaddress,
          dropoffAddress: customerData.dropoffaddress,
          notes: customerData.notes
        };

        const meetGreetInfo: MeetGreetInfo = customerData.meet_greet_details?.[0] ? {
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

        setFarmOutData(prev => ({
          ...prev,
          customer: {
            info: customerInfo,
            meetAndGreet: meetGreetInfo
          }
        }));
        toast.success('Customer found');
      } else {
        toast.error('No customer found');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to search customer');
    }
  };

  const handleSendEmail = async () => {
    if (!farmOutData.affiliate || !farmOutData.customer) {
      toast.error('Please search for both affiliate and customer first');
      return;
    }

    try {
      // Create a simplified version of the customer data for the farm-out email
      const emailData = {
        to_email: farmOutData.affiliate.email,
        affiliate_name: farmOutData.affiliate.name,
        customer_name: farmOutData.customer.info.fullName,
        pickup_address: farmOutData.customer.info.pickupAddress,
        dropoff_address: farmOutData.customer.info.dropoffAddress,
        airline_flight: farmOutData.customer.meetAndGreet.airlineAndFlight,
        arrival_time: farmOutData.customer.meetAndGreet.arrivalTime,
        passenger_count: farmOutData.customer.meetAndGreet.passengerCount,
        luggage_count: farmOutData.customer.meetAndGreet.luggageCount,
        special_notes: farmOutData.customer.meetAndGreet.specialNotes,
        farm_out_amount: farmOutData.farmOutAmount
      };

      await sendInvoiceEmail(
        { farmOutAmount: farmOutData.farmOutAmount } as any,
        { grandTotal: farmOutData.farmOutAmount } as any,
        farmOutData.customer.info,
        farmOutData.affiliate.email
      );
      
      toast.success('Farm-out details sent successfully');
    } catch (error: any) {
      console.error('Error sending farm-out email:', error);
      toast.error(error.message || 'Failed to send farm-out email');
    }
  };

  return (
    <div className="space-y-8">
      {/* Affiliate Form */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">
          Add New Affiliate
        </h2>
        <form onSubmit={handleAffiliateSubmit} className="space-y-4">
          <FormField
            label="Affiliate Name/Company"
            type="text"
            value={affiliateFormData.name}
            onChange={(value) => setAffiliateFormData(prev => ({ ...prev, name: value }))}
            required
          />
          <FormField
            label="Email"
            type="email"
            value={affiliateFormData.email}
            onChange={(value) => setAffiliateFormData(prev => ({ ...prev, email: value }))}
            required
          />
          <FormField
            label="Phone Number"
            type="tel"
            value={affiliateFormData.phone}
            onChange={(value) => setAffiliateFormData(prev => ({ ...prev, phone: value }))}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
              dark:bg-dark-brand-blue dark:hover:bg-blue-700"
          >
            Save Affiliate
          </button>
        </form>
      </div>

      {/* Search Section */}
      <div className="space-y-6 pt-6 border-t dark:border-dark-border-default">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">
          Farm-Out Details
        </h2>
        
        {/* Affiliate Search */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
                Search Affiliate
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchAffiliateName}
                  onChange={(e) => setSearchAffiliateName(e.target.value)}
                  className="w-full p-2 pr-10 border rounded focus:ring-1 focus:ring-blue-500
                    dark:bg-dark-bg-tertiary dark:border-dark-border-default dark:text-dark-text-primary"
                  placeholder="Enter affiliate name..."
                />
                <button
                  onClick={searchAffiliate}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600
                    dark:hover:text-dark-text-primary"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>

          {farmOutData.affiliate && (
            <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
              <h3 className="font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                Affiliate Details
              </h3>
              <div className="space-y-2 text-sm">
                <p>Name: {farmOutData.affiliate.name}</p>
                <p>Email: {farmOutData.affiliate.email}</p>
                <p>Phone: {farmOutData.affiliate.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Customer Search */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
                Search Customer
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchCustomerName}
                  onChange={(e) => setSearchCustomerName(e.target.value)}
                  className="w-full p-2 pr-10 border rounded focus:ring-1 focus:ring-blue-500
                    dark:bg-dark-bg-tertiary dark:border-dark-border-default dark:text-dark-text-primary"
                  placeholder="Enter customer name..."
                />
                <button
                  onClick={searchCustomer}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600
                    dark:hover:text-dark-text-primary"
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>

          {farmOutData.customer && (
            <div className="p-4 bg-gray-50 rounded-md dark:bg-dark-bg-tertiary">
              <h3 className="font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <p>Name: {farmOutData.customer.info.fullName}</p>
                <p>Pickup: {farmOutData.customer.info.pickupAddress}</p>
                <p>Dropoff: {farmOutData.customer.info.dropoffAddress}</p>
                {farmOutData.customer.meetAndGreet.airlineAndFlight && (
                  <>
                    <p>Flight: {farmOutData.customer.meetAndGreet.airlineAndFlight}</p>
                    <p>Arrival: {farmOutData.customer.meetAndGreet.arrivalTime}</p>
                    <p>Passengers: {farmOutData.customer.meetAndGreet.passengerCount}</p>
                    <p>Luggage: {farmOutData.customer.meetAndGreet.luggageCount}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Farm-Out Amount */}
        <div className="space-y-4">
          <FormField
            label="Farm-Out Amount"
            type="number"
            value={farmOutData.farmOutAmount}
            onChange={(value) => setFarmOutData(prev => ({ ...prev, farmOutAmount: Number(value) }))}
          />
        </div>

        {/* Email Button */}
        {farmOutData.affiliate && farmOutData.customer && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md
                hover:bg-blue-700 dark:bg-dark-brand-blue dark:hover:bg-blue-700"
            >
              <Send size={16} />
              Email Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}