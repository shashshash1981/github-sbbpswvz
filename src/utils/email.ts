import emailjs from '@emailjs/browser';
import { TripCosts, Calculations } from '../types';
import { CustomerInfo } from '../types/customer';

export async function sendInvoiceEmail(
  costs: TripCosts,
  calculations: Calculations,
  customer?: CustomerInfo
) {
  const templateParams = {
    to_email: customer?.email || '',
    customer_name: customer?.fullName || '',
    from_name: 'Trip Cost Calculator',
    flat_rate: costs.flatRate,
    per_hour_total: calculations.perHourTotal,
    per_mile_total: calculations.perMileTotal,
    grat_total: calculations.gratTotal,
    parking: costs.parking,
    meet_greet: costs.meetAndGreet,
    ot_wait_time: costs.otWaitTime,
    extra_stops_total: calculations.extraStopsTotal,
    fuel_surcharge: calculations.fuelSurchargeTotal,
    discount: calculations.discountTotal,
    gst_tax: calculations.gstTotal,
    grand_total: calculations.grandTotal,
    currency: costs.currency,
    pickup_address: customer?.pickupAddress || '',
    dropoff_address: customer?.dropoffAddress || ''
  };

  return emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    templateParams,
    'YOUR_PUBLIC_KEY'
  );
}