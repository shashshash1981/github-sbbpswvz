import { useState } from 'react';
import { CustomerFormData, CustomerInfo, MeetGreetInfo } from '../types/customer';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const initialCustomerInfo: CustomerInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  province: '',
  country: '',
  postalCode: '',
  pickupAddress: '',  // Added these fields to match the database requirements
  dropoffAddress: ''
};

const initialMeetGreetInfo: MeetGreetInfo = {
  airlineAndFlight: '',
  arrivalTime: '',
  passengerCount: 1,
  luggageCount: 0,
  specialNotes: ''
};

export function useCustomerInfo() {
  const [formData, setFormData] = useState<CustomerFormData>({
    customer: initialCustomerInfo,
    meetAndGreet: initialMeetGreetInfo,
  });

  const updateCustomerInfo = (updates: Partial<CustomerInfo>) => {
    setFormData(prev => ({
      ...prev,
      customer: { ...prev.customer, ...updates },
    }));
  };

  const updateMeetGreetInfo = (updates: Partial<MeetGreetInfo>) => {
    setFormData(prev => ({
      ...prev,
      meetAndGreet: { ...prev.meetAndGreet, ...updates },
    }));
  };

  const validateCustomerData = (data: CustomerInfo): string | null => {
    if (!data.firstName.trim()) return 'First name is required';
    if (!data.lastName.trim()) return 'Last name is required';
    if (!data.email.trim()) return 'Email is required';
    if (!data.phone.trim()) return 'Phone number is required';
    if (!data.addressLine1.trim()) return 'Address is required';
    if (!data.city.trim()) return 'City is required';
    if (!data.province.trim()) return 'Province/State is required';
    if (!data.country.trim()) return 'Country is required';
    if (!data.postalCode.trim()) return 'Postal/ZIP code is required';
    if (!data.pickupAddress.trim()) return 'Pickup address is required';
    if (!data.dropoffAddress.trim()) return 'Dropoff address is required';

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(data.email)) return 'Invalid email format';

    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(data.phone)) return 'Phone number must be in format: XXX-XXX-XXXX';

    return null;
  };

  const constructFullAddress = (data: CustomerInfo): string => {
    const parts = [
      data.addressLine1,
      data.addressLine2,
      data.city,
      data.province,
      data.country,
      data.postalCode
    ].filter(Boolean); // Remove empty strings

    return parts.join(', ');
  };

  const saveCustomerInfo = async () => {
    try {
      const validationError = validateCustomerData(formData.customer);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const fullAddress = constructFullAddress(formData.customer);

      const { error } = await supabase
        .from('customers')
        .insert([{
          fullname: `${formData.customer.firstName} ${formData.customer.lastName}`,
          first_name: formData.customer.firstName,
          last_name: formData.customer.lastName,
          email: formData.customer.email,
          phone: formData.customer.phone,
          address: fullAddress, // Set the full address string
          address_line1: formData.customer.addressLine1,
          address_line2: formData.customer.addressLine2,
          city: formData.customer.city,
          province: formData.customer.province,
          country: formData.customer.country,
          postal_code: formData.customer.postalCode,
          pickupaddress: formData.customer.pickupAddress || 'TBD',
          dropoffaddress: formData.customer.dropoffAddress || 'TBD'
        }]);

      if (error) throw error;
      toast.success('Customer information saved successfully');
      resetForm();
    } catch (error: any) {
      console.error('Error saving customer info:', error);
      toast.error(error.message || 'Failed to save customer information');
    }
  };

  const resetForm = () => {
    setFormData({
      customer: initialCustomerInfo,
      meetAndGreet: initialMeetGreetInfo,
    });
    toast.success('Form reset successfully');
  };

  return {
    formData,
    updateCustomerInfo,
    updateMeetGreetInfo,
    saveCustomerInfo,
    resetForm,
  };
}