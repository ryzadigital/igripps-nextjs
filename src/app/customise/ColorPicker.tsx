// app/customise/ColorPicker.tsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface PantoneColor {
  pms: string; // e.g., "PMS 186 C" or "PMS 186 U"
  name: string;
  rgb: string; // RGB hex for display purposes
  family: string;
  coated: boolean; // true for Coated, false for Uncoated
}

interface ColorPickerProps {
  colors: PantoneColor[];
  selectedColor: PantoneColor | null;
  onColorSelect: (color: PantoneColor) => void;
  selectedFamily?: string; // Allow external control of selected family
  onFamilyChange?: (family: string) => void; // Notify parent of family changes
}

const COLOR_FAMILIES = [
  'Yellows/Golds',
  'Oranges', 
  'Reds/Maroons',
  'Purples',
  'Blues',
  'Greens',
  'Neutrals/Greys',
  'Browns',
  'Blacks'
];

export default function ColorPicker({ 
  colors, 
  selectedColor, 
  onColorSelect, 
  selectedFamily: externalSelectedFamily,
  onFamilyChange 
}: ColorPickerProps) {
  const [internalSelectedFamily, setInternalSelectedFamily] = useState<string>('Reds/Maroons');

  // Use external family if provided, otherwise use internal
  const selectedFamily = externalSelectedFamily || internalSelectedFamily;

  // Update internal state when external family changes
  useEffect(() => {
    if (externalSelectedFamily) {
      setInternalSelectedFamily(externalSelectedFamily);
    }
  }, [externalSelectedFamily]);

  // Handle family change
  const handleFamilyChange = (family: string) => {
    setInternalSelectedFamily(family);
    if (onFamilyChange) {
      onFamilyChange(family);
    }
  };

  // Filter colors based on selected family only (always show both coated and uncoated)
  const filteredColors = useMemo(() => {
    return colors.filter(color => color.family === selectedFamily);
  }, [colors, selectedFamily]);

  return (
    <div className="space-y-4">
      {/* Color Family Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        </label>
        <div className="relative">
          <select
            value={selectedFamily}
            onChange={(e) => handleFamilyChange(e.target.value)}
            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            {COLOR_FAMILIES.map((family) => {
              const familyCount = colors.filter(c => c.family === family).length;
              return (
                <option key={family} value={family}>
                  {family} ({familyCount} colors)
                </option>
              );
            })}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
      </div>

      {/* Color Grid for Selected Family */}
      <div className="border border-gray-200 rounded-lg p-4">
        
        <div className="grid grid-cols-8 gap-2">
          {filteredColors.map((color) => (
            <div key={color.pms} className="flex flex-col items-center space-y-1">
              <button
                onClick={() => onColorSelect(color)}
                className={`relative w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedColor?.pms === color.pms
                    ? 'border-gray-800 shadow-lg ring-2 ring-blue-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.rgb }}
                title={`${color.pms}\n${color.name}`}
              >
                {selectedColor?.pms === color.pms && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check 
                      className={`h-4 w-4 ${
                        color.rgb === '#ffffff' || color.rgb === '#FFFFFF' ? 'text-gray-800' : 'text-white'
                      }`} 
                    />
                  </div>
                )}
                
                {/* White border for light colors visibility */}
                {(color.rgb === '#ffffff' || color.rgb === '#FFFFFF') && (
                  <div className="absolute inset-0 rounded-lg border border-gray-300" />
                )}
              </button>
              
              {/* PMS Code Label */}
              <span className="text-xs text-gray-600 text-center leading-tight">
                {color.pms.replace('PMS ', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}