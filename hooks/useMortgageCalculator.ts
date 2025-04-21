// hooks/useMortgageCalculator.ts

import { MonthlyBreakdown } from "@/types/data";

type MortgageParams = {
  price: number;
  downPayment: number;
  interestRate: number; // en %
  term: number; // en años
};



export function useMortgageCalculator({
  price,
  downPayment,
  interestRate,
  term,
}: MortgageParams) {
  const loanAmount = price - downPayment;
  const months = term * 12;
  const monthlyRate = interestRate / 100 / 12;

  // Cuota mensual con fórmula de amortización francesa
  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - loanAmount;

  const breakdown: MonthlyBreakdown[] = [];

  let balance = loanAmount;

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance -= principal;

    breakdown.push({
      month: i,
      principal: parseFloat(principal.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
      remainingBalance: parseFloat(balance.toFixed(2)),
      remainingPrincipal: parseFloat(balance.toFixed(2)),
    });
  }

  return {
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    totalPaid: parseFloat(totalPaid.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    breakdown,
  };
}
