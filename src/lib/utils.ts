// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(price);
}

export function calculateEstimate(customization: any): number {
  const basePrice = 25; // Base price per pair
  const gripSoleUpcharge = customization.hasGripSole ? 8 : 0;
  const logoUpcharge = customization.logoPosition === 'both' ? 5 : 3;
  
  return (basePrice + gripSoleUpcharge + logoUpcharge) * customization.quantity;
}