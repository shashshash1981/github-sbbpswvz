import { useState, useEffect } from 'react';
import { TripDetails, MeetGreetInfo, CustomerInfo } from '../types/customer';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const initialTripDetails: TripDetails = {
  pickupDate: '',
  pickupTime: '',
  pickupLocation: '',
  dropoffLocation: '',
  passengerCount: 1,
  specialNotes: '',
};

const initialMeetGreetInfo: MeetGreetInfo = {
  airlineAndFlight: '',
  arrivalTime: '',
  passengerCount: 1,
  luggageCount: 0,
  specialNotes: '',
};

export function useTripDetails() {
  const [customers, setCustomers] = useState<Array<{ id: string, fullname: string }>>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  const [tripDetails, setTripDetails] = useState<TripDetails>(initialTripDetails);
  const [meetAndGreet, setMeetAndGreet] = useState<MeetGreetInfo>(initialMeetGreetInfo);
  const [isFormEnabled, setIsFormEnabled] = useState(false);
  const [savedTripId, setSavedTripId] = useState<string | null>(null);

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

  const handleCustomerSelect = async (customerId: string) => {
    try {
      if (!customerId) {
        setSelectedCustomer(null);
        setIsFormEnabled(false);
        resetForm('all');
        return;
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error) throw error;

      if (data) {
        setSelectedCustomer(data);
        setSelectedCustomerId(customerId);
        setIsFormEnabled(true);
        setSavedTripId(null);

        // Pre-populate trip details with customer's addresses
        setTripDetails(prev => ({
          ...prev,
          pickupLocation: data.pickupaddress || '',
          dropoffLocation: data.dropoffaddress || ''
        }));
      }
    } catch (error: any) {
      toast.error('Failed to fetch customer details');
      console.error('Error fetching customer details:', error);
    }
  };

  const updateTripDetails = (updates: Partial<TripDetails>) => {
    if (!isFormEnabled) {
      toast.error('Please select a customer first');
      return;
    }
    setTripDetails(prev => ({ ...prev, ...updates }));
  };

  const updateMeetGreetInfo = (updates: Partial<MeetGreetInfo>) => {
    if (!isFormEnabled) {
      toast.error('Please select a customer first');
      return;
    }
    setMeetAndGreet(prev => ({ ...prev, ...updates }));
  };

  const validateTripDetails = (data: TripDetails): string | null => {
    if (!selectedCustomerId) return 'Please select a customer first';
    if (!data.pickupDate) return 'Pickup date is required';
    if (!data.pickupTime) return 'Pickup time is required';
    if (!data.pickupLocation) return 'Pickup location is required';
    if (!data.dropoffLocation) return 'Dropoff location is required';
    if (data.passengerCount < 1) return 'Number of passengers must be at least 1';
    return null;
  };

  const validateMeetGreetInfo = (data: MeetGreetInfo): string | null => {
    if (!data.airlineAndFlight && !data.arrivalTime && data.passengerCount === 1 && data.luggageCount === 0) {
      return null;
    }

    if (data.airlineAndFlight && !data.arrivalTime) return 'Arrival time is required when flight info is provided';
    if (data.arrivalTime && !data.airlineAndFlight) return 'Flight info is required when arrival time is provided';
    if (data.passengerCount < 1) return 'Number of passengers must be at least 1';
    if (data.luggageCount < 0) return 'Number of luggage items cannot be negative';
    return null;
  };

  const saveTripDetails = async () => {
    try {
      const tripValidationError = validateTripDetails(tripDetails);
      if (tripValidationError) {
        toast.error(tripValidationError);
        return;
      }

      const { data: savedTrip, error: tripError } = await supabase
        .from('trip_details')
        .insert([{
          customer_id: selectedCustomerId,
          pickup_date: tripDetails.pickupDate,
          pickup_time: tripDetails.pickupTime,
          pickup_location: tripDetails.pickupLocation,
          dropoff_location: tripDetails.dropoffLocation,
          passenger_count: tripDetails.passengerCount,
          special_notes: tripDetails.specialNotes
        }])
        .select()
        .single();

      if (tripError) throw tripError;

      setSavedTripId(savedTrip.id);
      toast.success('Trip details saved successfully');
    } catch (error: any) {
      console.error('Error saving trip details:', error);
      toast.error(error.message || 'Failed to save trip details');
    }
  };

  const saveMeetAndGreet = async () => {
    try {
      if (!savedTripId) {
        toast.error('Please save trip details first');
        return;
      }

      const meetGreetValidationError = validateMeetGreetInfo(meetAndGreet);
      if (meetGreetValidationError) {
        toast.error(meetGreetValidationError);
        return;
      }

      const { error: meetGreetError } = await supabase
        .from('meet_greet_details')
        .insert([{
          trip_id: savedTripId,
          customer_id: selectedCustomerId,
          airline_flight: meetAndGreet.airlineAndFlight,
          arrival_time: meetAndGreet.arrivalTime,
          passenger_count: meetAndGreet.passengerCount,
          luggage_count: meetAndGreet.luggageCount,
          special_notes: meetAndGreet.specialNotes
        }]);

      if (meetGreetError) throw meetGreetError;

      toast.success('Meet & Greet details saved successfully');
      resetForm('meetGreet');
    } catch (error: any) {
      console.error('Error saving meet & greet details:', error);
      toast.error(error.message || 'Failed to save meet & greet details');
    }
  };

  const resetForm = (section: 'trip' | 'meetGreet' | 'all' = 'all') => {
    if (section === 'trip' || section === 'all') {
      setTripDetails(initialTripDetails);
      setSavedTripId(null);
    }
    if (section === 'meetGreet' || section === 'all') {
      setMeetAndGreet(initialMeetGreetInfo);
    }
    if (section === 'all') {
      setSelectedCustomerId('');
      setSelectedCustomer(null);
      setIsFormEnabled(false);
    }
    toast.success(`${section === 'all' ? 'All forms' : section === 'trip' ? 'Trip details' : 'Meet & greet details'} reset successfully`);
  };

  return {
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
    resetForm,
  };
}