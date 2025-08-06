// src/types/index.ts

// Updated SockProduct interface to match Contentful structure
export interface SockProduct {
  id: string;
  name: string;
  urlSlug: string;
  shortDescription: string;
  description: string;
  price: number;
  features: string[];
  minimumOrder: number;
  mainImage: string;
  secondaryImage: string;
  soldOut: boolean;
}

// Your existing types...
export interface SockColor {
  id: string;
  name: string;
  code: string;
  category: 'primary' | 'accent' | 'neutral';
}

export interface SockSize {
  id: string;
  label: string;
  range: string;
}

export interface CustomizationOptions {
  product: SockProduct;
  primaryColor: SockColor;
  accentColor: SockColor;
  size: SockSize;
  quantity: number;
  teamLogo?: File;
  teamName?: string;
  playerNames?: string[];
}