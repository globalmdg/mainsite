import { BreakdownEntry } from "@/types/data";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calcualtor Functions

// Format currency values - improved with proper locale support
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: value >= 10000 ? 0 : 2
  }).format(value);
};


// Helper function to format percentage values
export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};


// Group by quarter function
export const groupByQuarter = (data: BreakdownEntry[]) => {
  const quarterlyMap: Record<
    string,
    { principal: number; interest: number; remainingPrincipal: number }
  > = {};

  data.forEach((entry) => {
    const year = Math.floor((entry.month - 1) / 12) + 1;
    const quarter = Math.floor(((entry.month - 1) % 12) / 3) + 1;
    const key = `${year}-Q${quarter}`;

    if (!quarterlyMap[key]) {
      quarterlyMap[key] = {
        principal: 0,
        interest: 0,
        remainingPrincipal: entry.remainingPrincipal,
      };
    }

    quarterlyMap[key].principal += entry.principal;
    quarterlyMap[key].interest += entry.interest;
    quarterlyMap[key].remainingPrincipal = entry.remainingPrincipal;
  });

  return Object.entries(quarterlyMap).map(([key, values]) => ({
    name: key,
    Principal: values.principal,
    Intereses: values.interest,
    "Capital pendiente": values.remainingPrincipal,
  }));
};


// Group by year function - improved with better naming
export const groupByYear = (data: BreakdownEntry[]) => {
  const yearlyMap: Record<
    number,
    { principal: number; interest: number; remainingPrincipal: number }
  > = {};

  data.forEach((entry) => {
    const year = Math.ceil(entry.month / 12);
    if (!yearlyMap[year]) {
      yearlyMap[year] = {
        principal: 0,
        interest: 0,
        remainingPrincipal: entry.remainingPrincipal,
      };
    }

    yearlyMap[year].principal += entry.principal;
    yearlyMap[year].interest += entry.interest;
    yearlyMap[year].remainingPrincipal = entry.remainingPrincipal;
  });

  return Object.entries(yearlyMap).map(([year, values]) => ({
    name: `Año ${year}`,
    Principal: values.principal,
    Intereses: values.interest,
    "Capital pendiente": values.remainingPrincipal,
  }));
};


