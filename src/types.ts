export interface TripCosts {
  flatRate: number;
  perHourRate: number;
  perHourHours: number;
  perHourBaseRate: number; // New field for customizable hourly rate
  perMileRate: number;
  perMileMiles: number;
  stdGrat: number;
  parking: number;
  meetAndGreet: number;
  otWaitTime: number;
  extraStopsCount: number;
  extraStopsRate: number;
  fuelSurcharge: number;
  discount: number;
  gstTax: number;
  currency: string;
}