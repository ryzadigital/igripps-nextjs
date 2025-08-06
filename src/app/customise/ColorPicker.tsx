// app/customise/ColorPicker.tsx
'use client';
import { Check } from 'lucide-react';

interface Color {
  name: string;
  value: string;
  hex: string;
}

interface ColorPickerProps {
  colors: Color[];
  selectedColor: Color;
  onColorSelect: (color: Color) => void;
}

export default function ColorPicker({ colors, selectedColor, onColorSelect }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => onColorSelect(color)}
          className={`relative w-6 h-6 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            selectedColor.hex === color.hex
              ? 'border-gray-800 shadow-lg'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          style={{ backgroundColor: color.hex }}
          title={color.name}
        >
          {selectedColor.hex === color.hex && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check 
                className={`h-6 w-6 ${
                  color.hex === '#ffffff' ? 'text-gray-800' : 'text-white'
                }`} 
              />
            </div>
          )}
          
          {/* White border for white color visibility */}
          {color.hex === '#ffffff' && (
            <div className="absolute inset-0 rounded-lg border border-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
}