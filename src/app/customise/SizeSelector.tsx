// app/customise/SizeSelector.tsx
'use client';

interface SizeSelectorProps {
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

const SIZES = [
  { label: 'Small (4-7)', value: 'Small (4-7)' },
  { label: 'Medium (7-11)', value: 'Medium (7-11)' },
  { label: 'Large (11-14)', value: 'Large (11-14)' },
  { label: 'Extra Large (14+)', value: 'Extra Large (14+)' },
];

export default function SizeSelector({ selectedSize, onSizeSelect }: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SIZES.map((size) => (
        <button
          key={size.value}
          onClick={() => onSizeSelect(size.value)}
          className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            selectedSize === size.value
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}