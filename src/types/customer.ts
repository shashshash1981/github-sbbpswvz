export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  pickupAddress: string;  // Added these fields
  dropoffAddress: string;
}

export interface TripDetails {
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  passengerCount: number;
  specialNotes: string;
}

export interface MeetGreetInfo {
  airlineAndFlight: string;
  arrivalTime: string;
  passengerCount: number;
  luggageCount: number;
  specialNotes: string;
}

export interface CustomerFormData {
  customer: CustomerInfo;
  tripDetails: TripDetails;
  meetAndGreet: MeetGreetInfo;
}