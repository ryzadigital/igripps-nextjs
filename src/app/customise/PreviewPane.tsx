// src/components/customise/PreviewPane.tsx
'use client';
import React from 'react';
import type { SockCustomization, SockProduct } from '@/types';

interface PreviewPaneProps {
  customization: SockCustomization;
  product?: SockProduct;
}

export function PreviewPane({ customization, product }: PreviewPaneProps) {
  return (
    <div className="space-y-4">
      {/* Sock Visual Preview */}
      <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-6 text-center">
        <div className="relative mx-auto w-32 h-48 mb-4">
          {/* Sock SVG Representation */}
          <svg
            viewBox="0 0 100 150"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
          >
            {/* Main sock body */}
            <path
              d="M30 10 L70 10 L70 120 L65 130 L60 140 L45 145 L35 140 L30 130 Z"
              fill={customization.primaryColor}
              stroke={customization.secondaryColor}
              strokeWidth="2"
            />
            
            {/* Ankle section */}
            <rect
              x="30"
              y="10"
              width="40"
              height="15"
              fill={customization.secondaryColor}
              opacity="0.8"
            />
            
            {/* Calf section */}
            <rect
              x="30"
              y="25"
              width="40"
              height="15"
              fill={customization.secondaryColor}
              opacity="0.3"
            />
            
            {/* Logo indicators */}
            {(customization.logoPosition === 'ankle' || customization.logoPosition === 'both') && (
              <circle cx="50" cy="17" r="3" fill="#FFD700" />
            )}
            {(customization.logoPosition === 'calf' || customization.logoPosition === 'both') && (
              <circle cx="50" cy="32" r="3" fill="#FFD700" />
            )}
            
            {/* Grip sole indication */}
            {customization.hasGripSole && (
              <g>
                <circle cx="40" cy="135" r="2" fill="#333" />
                <circle cx="50" cy="135" r="2" fill="#333" />
                <circle cx="60" cy="135" r="2" fill="#333" />
              </g>
            )}
          </svg>
        </div>
        
        <h4 className="font-medium text-secondary mb-2">
          {customization.clubName || 'Your Club'} Custom Sock
        </h4>
        <p className="text-sm text-muted">
          {product?.name || 'Custom Design'}
        </p>
      </div>

      {/* Design Summary */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">Primary Color:</span>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: customization.primaryColor }}
            />
            <span className="font-mono text-xs">{customization.primaryColor}</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted">Secondary Color:</span>
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: customization.secondaryColor }}
            />
            <span className="font-mono text-xs">{customization.secondaryColor}</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted">Logo Position:</span>
          <span className="capitalize">{customization.logoPosition}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted">Grip Sole:</span>
          <span className={customization.hasGripSole ? 'text-accent' : 'text-muted'}>
            {customization.hasGripSole ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted">Size:</span>
          <span className="capitalize">{customization.size}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted">Quantity:</span>
          <span>{customization.quantity} pairs</span>
        </div>
      </div>
    </div>
  );
}