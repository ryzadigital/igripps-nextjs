'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ColorPicker } from './ColorPicker';
import { SizeSelector } from './SizeSelector';
import { QuoteForm } from '@/components/forms/QuoteForm';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getDummyProducts } from '@/lib/contentful';
import { calculateEstimate } from '@/lib/utils';
import type { SockCustomization, SockProduct } from '@/types';
import { 
  Palette, 
  Ruler, 
  Package, 
  Calculator, 
  CheckCircle, 
  Settings,
  ArrowRight 
} from 'lucide-react';

export function SockDesigner() {
  const [products, setProducts] = useState<SockProduct[]>([]);
  const [currentStep, setCurrentStep] = useState<'design' | 'quote'>('design');
  const [customization, setCustomization] = useState<SockCustomization>({
    productId: '',
    sockColor: '#d8d8d8', // Updated to light gray base
    clubNameColor: '#000000',
    gripColor: '#ff0000',
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

  const estimate = calculateEstimate(customization);
  const selectedProduct = products.find(p => p.id === customization.productId);

  const steps = [
    { id: 'product', label: 'Product', icon: Package },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'details', label: 'Details', icon: Settings },
    { id: 'sizing', label: 'Sizing', icon: Ruler },
    { id: 'quote', label: 'Quote', icon: Calculator },
  ];

  if (currentStep === 'quote') {
    return (
      <div className="max-w-4xl mx-auto">
        <QuoteForm 
          customization={customization}
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
              <h3 className="text-lg font-semibold">Colors & Design</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sock Color */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Sock Color
              </label>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer shadow-sm"
                  style={{ backgroundColor: customization.sockColor }}
                />
                <ColorPicker
                  color={customization.sockColor}
                  onColorChange={(color) => updateCustomization({ sockColor: color })}
                  label="Choose sock base color"
                />
              </div>
              <p className="text-xs text-muted mt-2">
                Colors will be applied to the base sock template
              </p>
            </div>

            {/* Club Name Color */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Club Name Color
              </label>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer shadow-sm"
                  style={{ backgroundColor: customization.clubNameColor }}
                />
                <ColorPicker
                  color={customization.clubNameColor}
                  onColorChange={(color) => updateCustomization({ clubNameColor: color })}
                  label="Choose club name text color"
                />
              </div>
            </div>

            {/* Grip Color */}
            {customization.hasGripSole && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Grip Sole Color
                </label>
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer shadow-sm"
                    style={{ backgroundColor: customization.gripColor }}
                  />
                  <ColorPicker
                    color={customization.gripColor}
                    onColorChange={(color) => updateCustomization({ gripColor: color })}
                    label="Choose grip sole color"
                  />
                </div>
                <p className="text-xs text-muted mt-2">
                  Grip pattern will be overlayed on the sock base
                </p>
              </div>
            )}

            {/* Color Harmony Suggestions */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-3">Popular Color Combinations</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { name: 'Classic', sock: '#d8d8d8', club: '#000000', grip: '#ff0000' },
                  { name: 'Royal', sock: '#1e40af', club: '#ffffff', grip: '#fbbf24' },
                  { name: 'Forest', sock: '#065f46', club: '#ffffff', grip: '#ef4444' },
                  { name: 'Sunset', sock: '#dc2626', club: '#ffffff', grip: '#000000' },
                  { name: 'Clean', sock: '#ffffff', club: '#000000', grip: '#ef4444' },
                  { name: 'Navy', sock: '#1e3a8a', club: '#fbbf24', grip: '#ffffff' },
                  { name: 'Emerald', sock: '#047857', club: '#fef3c7', grip: '#dc2626' },
                  { name: 'Crimson', sock: '#b91c1c', club: '#f9fafb', grip: '#1f2937' },
                ].map((combo) => (
                  <button
                    key={combo.name}
                    onClick={() => updateCustomization({ 
                      sockColor: combo.sock, 
                      clubNameColor: combo.club, 
                      gripColor: combo.grip 
                    })}
                    className="p-2 border border-border rounded-lg hover:border-accent transition-all group"
                  >
                    <div className="flex space-x-1 mb-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: combo.sock }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: combo.club }} />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: combo.grip }} />
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
                {customization.sockColor !== '#d8d8d8' && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: customization.sockColor,
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
              {customization.clubName && (
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
                        fontSize: 'clamp(20px, 4vw, 28px)', // Bigger size
                        fontWeight: 'bold', // Faux bold
                        color: customization.clubNameColor,
                        opacity: 0.90,
                        textShadow: 'none',
                        writingMode: 'vertical-rl',
                        textOrientation: 'upright',
                        letterSpacing: '0.08em',
                        transform: 'scaleX(1.1) scaleY(0.9) rotate(16deg)', // Changed to positive rotation
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
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: customization.clubNameColor,
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
              </div>
              
              {/* Grip Overlay Layer */}
              {customization.hasGripSole && (
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
                      backgroundColor: customization.gripColor,
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
              <p><strong>Sock Colour:</strong> {customization.sockColor}</p>
              <p><strong>Club Name:</strong> {customization.clubName || 'None'} ({customization.clubNameColor})</p>
              <p><strong>Grip:</strong> {customization.hasGripSole ? `Yes (${customization.gripColor})` : 'No'}</p>
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