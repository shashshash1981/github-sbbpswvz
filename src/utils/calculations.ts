import { TripCosts, Calculations } from '../types';

const roundToTwo = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export function calculateTotals(costs: TripCosts): Calculations {
  // Calculate hourly total if hours are provided
  const perHourTotal = costs.perHourHours > 0 
    ? roundToTwo(costs.perHourHours * costs.perHourBaseRate)
    : 0;

  // Calculate mileage total if miles are provided
  const perMileTotal = costs.perMileMiles > 0
    ? roundToTwo(costs.perMileRate * costs.perMileMiles)
    : 0;
  
  // Calculate extra stops total (using integer values)
  const extraStopsTotal = roundToTwo(Math.floor(costs.extraStopsCount) * costs.extraStopsRate);

  // Calculate overtime wait time (using integer values)
  const otWaitTime = Math.floor(costs.otWaitTime);
  
  // Calculate gratuity on all charges including meet & greet
  const gratuitableAmount = perHourTotal + perMileTotal + otWaitTime + 
    extraStopsTotal + costs.meetAndGreet;
  const gratTotal = roundToTwo((gratuitableAmount * costs.stdGrat) / 100);
  
  // Calculate fuel surcharge on both hourly and mileage
  const fuelSurchargeTotal = roundToTwo(
    ((perHourTotal + perMileTotal) * costs.fuelSurcharge) / 100
  );
  
  // Calculate discount
  const discountTotal = roundToTwo((perHourTotal * costs.discount) / 100);
  
  const subtotalBeforeTax = roundToTwo(
    perHourTotal + 
    perMileTotal + 
    gratTotal + 
    costs.parking + 
    costs.meetAndGreet + 
    otWaitTime + 
    extraStopsTotal + 
    fuelSurchargeTotal - 
    discountTotal
  );
  
  const gstTotal = roundToTwo((subtotalBeforeTax * costs.gstTax) / 100);
  const grandTotal = roundToTwo(subtotalBeforeTax + gstTotal);
  
  return {
    perHourTotal,
    perMileTotal,
    gratTotal,
    extraStopsTotal,
    fuelSurchargeTotal,
    discountTotal,
    gstTotal,
    grandTotal,
    paymentsDeposits: 0,
    totalDue: roundToTwo(grandTotal)
  };
}