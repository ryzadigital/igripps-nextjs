'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ColorPicker from './ColorPicker';
import { SizeSelector } from './SizeSelector';
import { QuoteForm } from '@/components/forms/QuoteForm';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getDummyProducts } from '@/lib/contentful';
import { calculateEstimate } from '@/lib/utils';
import type { SockProduct } from '@/types';
import { 
  Palette, 
  Ruler, 
  Package, 
  Calculator, 
  CheckCircle, 
  Settings,
  ArrowRight 
} from 'lucide-react';

interface PantoneColor {
  pms: string;
  name: string;
  rgb: string;
  family: string;
  coated: boolean;
}

interface SockCustomization {
  productId: string;
  sockColor: PantoneColor | null;
  clubNameColor: PantoneColor | null;
  gripColor: PantoneColor | null;
  logoPosition: 'ankle' | 'calf' | 'both';
  clubName: string;
  quantity: number;
  size: string;
  hasGripSole: boolean;
}

// Comprehensive Pantone Color Database
const PANTONE_COLORS: PantoneColor[] = [
  // Yellows/Golds
  { pms: 'PMS Yellow C', name: 'Process Yellow', rgb: '#FFED00', family: 'Yellows/Golds', coated: true },
  { pms: 'PMS Yellow U', name: 'Process Yellow', rgb: '#FFE817', family: 'Yellows/Golds', coated: false },
  { pms: 'PMS 116 C', name: 'Lemon Yellow', rgb: '#FFD100', family: 'Yellows/Golds', coated: true },
  { pms: 'PMS 116 U', name: 'Lemon Yellow', rgb: '#FFCC33', family: 'Yellows/Golds', coated: false },
  { pms: 'PMS 109 C', name: 'Bright Yellow', rgb: '#FFED4E', family: 'Yellows/Golds', coated: true },
  { pms: 'PMS 109 U', name: 'Bright Yellow', rgb: '#FFE66D', family: 'Yellows/Golds', coated: false },
  { pms: 'PMS 123 C', name: 'Sunflower', rgb: '#FFC72C', family: 'Yellows/Golds', coated: true },
  { pms: 'PMS 123 U', name: 'Sunflower', rgb: '#FFBF49', family: 'Yellows/Golds', coated: false },
  { pms: 'PMS 130 C', name: 'Golden Yellow', rgb: '#F2A900', family: 'Yellows/Golds', coated: true },
  { pms: 'PMS 130 U', name: 'Golden Yellow', rgb: '#E6A121', family: 'Yellows/Golds', coated: false },
  { pms: 'PMS 137 C', name: 'Orange Yellow', rgb: '#F2A900', family: 'Yellows/Golds', coated: true },
  { pms: 'PMS 137 U', name: 'Orange Yellow', rgb: '#E59E21', family: 'Yellows/Golds', coated: false },

  // Oranges
  { pms: 'PMS Orange 021 C', name: 'Pure Orange', rgb: '#FF5F00', family: 'Oranges', coated: true },
  { pms: 'PMS Orange 021 U', name: 'Pure Orange', rgb: '#FF6B1A', family: 'Oranges', coated: false },
  { pms: 'PMS 152 C', name: 'Deep Orange', rgb: '#E25303', family: 'Oranges', coated: true },
  { pms: 'PMS 152 U', name: 'Deep Orange', rgb: '#D14A00', family: 'Oranges', coated: false },
  { pms: 'PMS 165 C', name: 'Coral Orange', rgb: '#FF6900', family: 'Oranges', coated: true },
  { pms: 'PMS 165 U', name: 'Coral Orange', rgb: '#FF5C1A', family: 'Oranges', coated: false },
  { pms: 'PMS 172 C', name: 'Red Orange', rgb: '#FA4616', family: 'Oranges', coated: true },
  { pms: 'PMS 172 U', name: 'Red Orange', rgb: '#E8381C', family: 'Oranges', coated: false },

  // Reds/Maroons
  { pms: 'PMS Red 032 C', name: 'Process Red', rgb: '#EE2E24', family: 'Reds/Maroons', coated: true },
  { pms: 'PMS Red 032 U', name: 'Process Red', rgb: '#DB2C1F', family: 'Reds/Maroons', coated: false },
  { pms: 'PMS 186 C', name: 'True Red', rgb: '#CE1126', family: 'Reds/Maroons', coated: true },
  { pms: 'PMS 186 U', name: 'True Red', rgb: '#B7112E', family: 'Reds/Maroons', coated: false },
  { pms: 'PMS 199 C', name: 'Deep Red', rgb: '#A6192E', family: 'Reds/Maroons', coated: true },
  { pms: 'PMS 199 U', name: 'Deep Red', rgb: '#8E1538', family: 'Reds/Maroons', coated: false },
  { pms: 'PMS 485 C', name: 'Bright Red', rgb: '#DA020E', family: 'Reds/Maroons', coated: true },
  { pms: 'PMS 485 U', name: 'Bright Red', rgb: '#C50016', family: 'Reds/Maroons', coated: false },
  { pms: 'PMS 18 C', name: 'Crimson', rgb: '#9E1B32', family: 'Reds/Maroons', coated: true },
  { pms: 'PMS 18 U', name: 'Crimson', rgb: '#8A1538', family: 'Reds/Maroons', coated: false },

  // Purples
  { pms: 'PMS 2685 C', name: 'Royal Purple', rgb: '#653165', family: 'Purples', coated: true },
  { pms: 'PMS 2685 U', name: 'Royal Purple', rgb: '#5D2E5D', family: 'Purples', coated: false },
  { pms: 'PMS Purple C', name: 'Process Purple', rgb: '#7B3F98', family: 'Purples', coated: true },
  { pms: 'PMS Purple U', name: 'Process Purple', rgb: '#6E3780', family: 'Purples', coated: false },
  { pms: 'PMS 266 C', name: 'Deep Purple', rgb: '#653165', family: 'Purples', coated: true },
  { pms: 'PMS 266 U', name: 'Deep Purple', rgb: '#5D2E5D', family: 'Purples', coated: false },
  { pms: 'PMS 2592 C', name: 'Bright Purple', rgb: '#8661C5', family: 'Purples', coated: true },
  { pms: 'PMS 2592 U', name: 'Bright Purple', rgb: '#7653B8', family: 'Purples', coated: false },

  // Blues
  { pms: 'PMS Blue 072 C', name: 'Process Blue', rgb: '#0085CA', family: 'Blues', coated: true },
  { pms: 'PMS Blue 072 U', name: 'Process Blue', rgb: '#0079C1', family: 'Blues', coated: false },
  { pms: 'PMS 286 C', name: 'Royal Blue', rgb: '#003DA5', family: 'Blues', coated: true },
  { pms: 'PMS 286 U', name: 'Royal Blue', rgb: '#003893', family: 'Blues', coated: false },
  { pms: 'PMS 280 C', name: 'Sky Blue', rgb: '#007FBF', family: 'Blues', coated: true },
  { pms: 'PMS 280 U', name: 'Sky Blue', rgb: '#0073B3', family: 'Blues', coated: false },
  { pms: 'PMS 294 C', name: 'Medium Blue', rgb: '#002F6C', family: 'Blues', coated: true },
  { pms: 'PMS 294 U', name: 'Medium Blue', rgb: '#002B5C', family: 'Blues', coated: false },
  { pms: 'PMS 300 C', name: 'Cyan Blue', rgb: '#005EB8', family: 'Blues', coated: true },
  { pms: 'PMS 300 U', name: 'Cyan Blue', rgb: '#0052A3', family: 'Blues', coated: false },
  { pms: 'PMS 282 C', name: 'Navy Blue', rgb: '#041E42', family: 'Blues', coated: true },
  { pms: 'PMS 282 U', name: 'Navy Blue', rgb: '#001A3A', family: 'Blues', coated: false },

  // Greens
  { pms: 'PMS Green C', name: 'Process Green', rgb: '#00A651', family: 'Greens', coated: true },
  { pms: 'PMS Green U', name: 'Process Green', rgb: '#009639', family: 'Greens', coated: false },
  { pms: 'PMS 347 C', name: 'Kelly Green', rgb: '#009639', family: 'Greens', coated: true },
  { pms: 'PMS 347 U', name: 'Kelly Green', rgb: '#00853D', family: 'Greens', coated: false },
  { pms: 'PMS 355 C', name: 'Forest Green', rgb: '#007A3D', family: 'Greens', coated: true },
  { pms: 'PMS 355 U', name: 'Forest Green', rgb: '#006837', family: 'Greens', coated: false },
  { pms: 'PMS 349 C', name: 'Emerald', rgb: '#046A38', family: 'Greens', coated: true },
  { pms: 'PMS 349 U', name: 'Emerald', rgb: '#035D33', family: 'Greens', coated: false },
  { pms: 'PMS 340 C', name: 'Teal Green', rgb: '#009681', family: 'Greens', coated: true },
  { pms: 'PMS 340 U', name: 'Teal Green', rgb: '#008573', family: 'Greens', coated: false },

  // Neutrals/Greys
  { pms: 'PMS Cool Gray 1 C', name: 'Light Gray', rgb: '#E6E7E8', family: 'Neutrals/Greys', coated: true },
  { pms: 'PMS Cool Gray 1 U', name: 'Light Gray', rgb: '#E1E2E4', family: 'Neutrals/Greys', coated: false },
  { pms: 'PMS Cool Gray 5 C', name: 'Medium Gray', rgb: '#B1B3B3', family: 'Neutrals/Greys', coated: true },
  { pms: 'PMS Cool Gray 5 U', name: 'Medium Gray', rgb: '#A7A8AA', family: 'Neutrals/Greys', coated: false },
  { pms: 'PMS Cool Gray 9 C', name: 'Dark Gray', rgb: '#75787B', family: 'Neutrals/Greys', coated: true },
  { pms: 'PMS Cool Gray 9 U', name: 'Dark Gray', rgb: '#6D6E70', family: 'Neutrals/Greys', coated: false },
  { pms: 'PMS Cool Gray 11 C', name: 'Charcoal', rgb: '#53565A', family: 'Neutrals/Greys', coated: true },
  { pms: 'PMS Cool Gray 11 U', name: 'Charcoal', rgb: '#4C4F52', family: 'Neutrals/Greys', coated: false },

  // Browns
  { pms: 'PMS 476 C', name: 'Light Brown', rgb: '#A67C5A', family: 'Browns', coated: true },
  { pms: 'PMS 476 U', name: 'Light Brown', rgb: '#9B6F47', family: 'Browns', coated: false },
  { pms: 'PMS 4695 C', name: 'Medium Brown', rgb: '#8B4513', family: 'Browns', coated: true },
  { pms: 'PMS 4695 U', name: 'Medium Brown', rgb: '#7D3C0A', family: 'Browns', coated: false },
  { pms: 'PMS 476 C', name: 'Chocolate', rgb: '#6F4E37', family: 'Browns', coated: true },
  { pms: 'PMS 476 U', name: 'Chocolate', rgb: '#5D4037', family: 'Browns', coated: false },

  // Blacks
  { pms: 'PMS Black C', name: 'Process Black', rgb: '#2D2926', family: 'Blacks', coated: true },
  { pms: 'PMS Black U', name: 'Process Black', rgb: '#2B2B2B', family: 'Blacks', coated: false },
  { pms: 'PMS Black 2 C', name: 'True Black', rgb: '#2D2926', family: 'Blacks', coated: true },
  { pms: 'PMS Black 2 U', name: 'True Black', rgb: '#2B2B2B', family: 'Blacks', coated: false },
  { pms: 'PMS Black 3 C', name: 'Rich Black', rgb: '#2B2B2B', family: 'Blacks', coated: true },
  { pms: 'PMS Black 3 U', name: 'Rich Black', rgb: '#282828', family: 'Blacks', coated: false },

  // Add White for completeness
  { pms: 'PMS White', name: 'White', rgb: '#FFFFFF', family: 'Neutrals/Greys', coated: true },
];

// Default colors
const DEFAULT_SOCK_COLOR = PANTONE_COLORS.find(c => c.pms === 'PMS Cool Gray 1 C') || PANTONE_COLORS[0];
const DEFAULT_CLUB_NAME_COLOR = PANTONE_COLORS.find(c => c.pms === 'PMS Black C') || PANTONE_COLORS[0];
const DEFAULT_GRIP_COLOR = PANTONE_COLORS.find(c => c.pms === 'PMS Red 032 C') || PANTONE_COLORS[0];

export function SockDesigner() {
  const [products, setProducts] = useState<SockProduct[]>([]);
  const [currentStep, setCurrentStep] = useState<'design' | 'quote'>('design');
  const [sockColorFamily, setSockColorFamily] = useState<string>('Neutrals/Greys');
  const [clubNameColorFamily, setClubNameColorFamily] = useState<string>('Blacks');
  const [gripColorFamily, setGripColorFamily] = useState<string>('Reds/Maroons');
  const [customization, setCustomization] = useState<SockCustomization>({
    productId: '',
    sockColor: DEFAULT_SOCK_COLOR,
    clubNameColor: DEFAULT_CLUB_NAME_COLOR,
    gripColor: DEFAULT_GRIP_COLOR,
    logoPosition: 'ankle',
    clubName: '',
    quantity: 20,
    size: 'mixed',
    hasGripSole: true,
  });

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getDummyProducts();
      setProducts(data);
      if (data.length > 0) {
        setCustomization(prev => ({
          ...prev,
          productId: data[0].id
        }));
      }
    };
    loadProducts();

    // Load Jersey 20 font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Jersey+20&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const updateCustomization = (updates: Partial<SockCustomization>) => {
    setCustomization(prev => ({ ...prev, ...updates }));
  };

  const handleClubNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upperCaseValue = e.target.value.toUpperCase();
    if (upperCaseValue.length <= 10) {
      updateCustomization({ clubName: upperCaseValue });
    }
  };

  // Calculate estimate using RGB values for now (you may need to update calculateEstimate function)
  const estimate = calculateEstimate({
    ...customization,
    sockColor: customization.sockColor?.rgb || '#d8d8d8',
    clubNameColor: customization.clubNameColor?.rgb || '#000000',
    gripColor: customization.gripColor?.rgb || '#ff0000',
  } as any);

  const selectedProduct = products.find(p => p.id === customization.productId);

  const steps = [
    { id: 'product', label: 'Product', icon: Package },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'details', label: 'Details', icon: Settings },
    { id: 'sizing', label: 'Sizing', icon: Ruler },
    { id: 'quote', label: 'Quote', icon: Calculator },
  ];

  // Popular Pantone color combinations for sports teams
  const popularCombinations = [
    {
      name: 'Classic',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS Cool Gray 1 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS Black C')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS Red 032 C')!,
    },
    {
      name: 'Royal',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 286 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS 123 C')!,
    },
    {
      name: 'Forest',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 347 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS Red 032 C')!,
    },
    {
      name: 'Crimson',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 199 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS Black C')!,
    },
    {
      name: 'Navy',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 282 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS 123 C')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
    },
    {
      name: 'Emerald',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 349 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS 123 C')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS 199 C')!,
    },
    {
      name: 'Orange',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS Orange 021 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS Black C')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
    },
    {
      name: 'Purple',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 2685 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS 123 C')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
    },
  ];

  if (currentStep === 'quote') {
    return (
      <div className="max-w-4xl mx-auto">
        <QuoteForm 
          customization={{
            ...customization,
            sockColor: customization.sockColor?.rgb || '#d8d8d8',
            clubNameColor: customization.clubNameColor?.rgb || '#000000',
            gripColor: customization.gripColor?.rgb || '#ff0000',
          } as any}
          estimate={estimate}
          onBack={() => setCurrentStep('design')}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Design Panel */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Steps */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {steps.slice(0, -1).map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-secondary">
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-secondary hidden sm:block">
                    {step.label}
                  </span>
                  {index < steps.length - 2 && (
                    <div className="w-8 h-0.5 bg-border mx-4 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Choose Your Sock Type</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => updateCustomization({ productId: product.id })}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    customization.productId === product.id
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <h4 className="font-medium text-secondary mb-2">{product.name}</h4>
                  <p className="text-sm text-muted mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-accent">
                      From ${product.basePrice}
                    </span>
                    {product.hasGripSole && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        Grip
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Color Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Pantone Colors & Design</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sock Color */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Sock Base Colour
              </label>
              <ColorPicker
                colors={PANTONE_COLORS}
                selectedColor={customization.sockColor}
                onColorSelect={(color) => updateCustomization({ sockColor: color })}
                selectedFamily={sockColorFamily}
                onFamilyChange={setSockColorFamily}
              />
            </div>

            {/* Club Name Color */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Club Name Colour
              </label>
              <ColorPicker
                colors={PANTONE_COLORS}
                selectedColor={customization.clubNameColor}
                onColorSelect={(color) => updateCustomization({ clubNameColor: color })}
                selectedFamily={clubNameColorFamily}
                onFamilyChange={setClubNameColorFamily}
              />
            </div>

            {/* Grip Color */}
            {customization.hasGripSole && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Grip Sole Color
                </label>
                <ColorPicker
                  colors={PANTONE_COLORS}
                  selectedColor={customization.gripColor}
                  onColorSelect={(color) => updateCustomization({ gripColor: color })}
                  selectedFamily={gripColorFamily}
                  onFamilyChange={setGripColorFamily}
                />
                <p className="text-xs text-muted mt-2">
                  Grip pattern will be overlayed on the sock base
                </p>
              </div>
            )}

            {/* Popular Pantone Color Combinations */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-3">Popular Designs</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {popularCombinations.map((combo) => (
                  <button
                    key={combo.name}
                    onClick={() => {
                      updateCustomization({ 
                        sockColor: combo.sock, 
                        clubNameColor: combo.club, 
                        gripColor: combo.grip 
                      });
                      // Update color family selections
                      setSockColorFamily(combo.sock.family);
                      setClubNameColorFamily(combo.club.family);
                      setGripColorFamily(combo.grip.family);
                    }}
                    className="p-2 border border-border rounded-lg hover:border-accent transition-all group"
                  >
                    <div className="flex space-x-1 mb-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: combo.sock.rgb }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: combo.club.rgb }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: combo.grip.rgb }} />
                    </div>
                    <span className="text-xs text-muted group-hover:text-foreground">{combo.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Club Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Club Details</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                label="Club Name (Auto-Capitalized)"
                value={customization.clubName}
                onChange={handleClubNameChange}
                placeholder="MAX 10 CHARACTERS"
                className="uppercase placeholder:normal-case"
              />
              <p className="text-xs text-muted mt-1">
                {customization.clubName.length}/10 characters • Text will be styled with Jersey 20 font and converted to CAPITALS
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Logo Position
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'ankle', label: 'Ankle Only' },
                  { value: 'calf', label: 'Calf Only' },
                  { value: 'both', label: 'Both (+$5)' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateCustomization({ logoPosition: option.value as any })}
                    className={`p-3 border rounded-lg text-sm transition-all ${
                      customization.logoPosition === option.value
                        ? 'border-accent bg-accent/5 text-accent'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="gripSole"
                checked={customization.hasGripSole}
                onChange={(e) => updateCustomization({ hasGripSole: e.target.checked })}
                className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
              />
              <label htmlFor="gripSole" className="text-sm">
                Add Grip Sole Technology (+$8 per pair)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Size & Quantity */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Ruler className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Size & Quantity</h3>
            </div>
          </CardHeader>
          <CardContent>
            <SizeSelector
              selectedSize={customization.size}
              quantity={customization.quantity}
              onSizeChange={(size) => updateCustomization({ size })}
              onQuantityChange={(quantity) => updateCustomization({ quantity })}
            />
          </CardContent>
        </Card>
      </div>

      {/* Preview & Quote Panel */}
      <div className="space-y-6">
        {/* Sock Preview */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Live Preview</h3>
            <p className="text-sm text-muted">
              Base sock with {customization.hasGripSole ? 'grip overlay' : 'no grips'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-white rounded-lg overflow-hidden">
              {/* Base Sock Layer */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="/Base.png"
                  alt="Base Sock"
                  fill
                  className="object-contain"
                />
                {/* Color overlay for base sock - masked to sock shape */}
                {customization.sockColor && customization.sockColor.rgb !== '#E6E7E8' && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: customization.sockColor.rgb,
                      mask: 'url(/Base.png)',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMask: 'url(/Base.png)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      mixBlendMode: 'multiply'
                    }}
                  />
                )}
              </div>
              
              {/* Text Field Guide (invisible, used for positioning) */}
              <div className="absolute inset-0 z-12">
                <Image
                  src="/Text-field.png"
                  alt=""
                  fill
                  className="object-contain opacity-0 pointer-events-none"
                />
              </div>
              
              {/* Club Name Text - positioned using Text-field.png as guide */}
              {customization.clubName && customization.clubNameColor && (
                <div className="absolute inset-0 z-15 flex items-center justify-center">
                  <div
                    className="absolute"
                    style={{
                      // Position based on the Text-field.png location
                      left: '42%',
                      top: '18%',
                      height: '45%',
                      width: '10%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Jersey 20', monospace",
                        fontSize: '24px', // Fixed size relative to sock container
                        fontWeight: 'bold',
                        color: customization.clubNameColor.rgb,
                        opacity: 0.90,
                        textShadow: 'none',
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        letterSpacing: '0.08em',
                        transform: 'scaleX(1.1) scaleY(0.9) rotate(16deg)',
                        transformOrigin: 'center',
                        lineHeight: 0.9,
                      }}
                    >
                      {customization.clubName}
                    </span>
                  </div>
                </div>
              )}
              
              {/* iGripps Branding Logo */}
              <div className="absolute inset-0 z-16">
                <Image
                  src="/iGripps-Branding.png"
                  alt="iGripps Logo"
                  fill
                  className="object-contain"
                />
                {/* Color overlay for logo - masked to logo shape */}
                {customization.clubNameColor && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: customization.clubNameColor.rgb,
                      mask: 'url(/iGripps-Branding.png)',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMask: 'url(/iGripps-Branding.png)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      mixBlendMode: 'multiply'
                    }}
                  />
                )}
              </div>
              
              {/* Grip Overlay Layer */}
              {customization.hasGripSole && customization.gripColor && (
                <div className="absolute inset-0 z-20">
                  <Image
                    src="/Grips.png"
                    alt="Grip Pattern"
                    fill
                    className="object-contain"
                  />
                  {/* Color overlay for grips - masked to grip shape */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: customization.gripColor.rgb,
                      mask: 'url(/Grips.png)',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMask: 'url(/Grips.png)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      mixBlendMode: 'multiply'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-gray-600 space-y-1">
              <p><strong>Sock Colour:</strong> {customization.sockColor?.pms || 'None'}</p>
              <p><strong>Club Name:</strong> {customization.clubName || 'None'} ({customization.clubNameColor?.pms || 'None'})</p>
              <p><strong>Grip:</strong> {customization.hasGripSole ? `Yes (${customization.gripColor?.pms || 'None'})` : 'No'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quote Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-semibold">Quote Summary</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Price ({customization.quantity} pairs)</span>
                <span>${(25 * customization.quantity).toFixed(2)}</span>
              </div>
              {customization.hasGripSole && (
                <div className="flex justify-between">
                  <span>Grip Sole Technology</span>
                  <span>+${(8 * customization.quantity).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Logo Placement</span>
                <span>+${((customization.logoPosition === 'both' ? 5 : 3) * customization.quantity).toFixed(2)}</span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Estimated Total</span>
                <span className="text-accent">${estimate.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-xs text-muted">
              <p>• Prices are estimates in AUD</p>
              <p>• Free Delivery to Sydney Metro</p>
              <p>• Bulk discounts available for whole-club orders</p>
              <p>• All colours specified using Pantone PMS standards</p>
            </div>

            <Button 
              onClick={() => setCurrentStep('quote')}
              className="w-full group"
              disabled={!customization.clubName}
            >
              Get Official Quote
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}