'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Palette, Type, Grip } from 'lucide-react';
import ColorPicker from './ColorPicker';

interface PantoneColor {
  pms: string;
  name: string;
  rgb: string;
  family: string;
  coated: boolean;
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

  // Reds
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
  { pms: 'PMS 4975 C', name: 'Chocolate', rgb: '#6F4E37', family: 'Browns', coated: true },
  { pms: 'PMS 4975 U', name: 'Chocolate', rgb: '#5D4037', family: 'Browns', coated: false },

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

// Helper function to find colors by PMS code
const findPantoneColor = (pmsCode: string): PantoneColor => {
  return PANTONE_COLORS.find(color => color.pms === pmsCode) || PANTONE_COLORS[0];
};

// Color family definitions
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

export default function CustomisePage() {
  const router = useRouter();

  // Color family state management
  const [sockColorFamily, setSockColorFamily] = useState<string>('Blacks');
  const [clubNameColorFamily, setClubNameColorFamily] = useState<string>('Neutrals/Greys');
  const [gripColorFamily, setGripColorFamily] = useState<string>('Neutrals/Greys');

  // Default to common team colors using Pantone standards
  const [sockColor, setSockColor] = useState<PantoneColor>(findPantoneColor('PMS Black C'));
  const [clubNameColor, setClubNameColor] = useState<PantoneColor>(findPantoneColor('PMS White'));
  const [gripColor, setGripColor] = useState<PantoneColor>(findPantoneColor('PMS White'));
  const [clubName, setClubName] = useState('IGRIPPS');
  const [hasGrip, setHasGrip] = useState(true);
  const [quantity, setQuantity] = useState('1-20');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Jersey+20&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const isFormValid = () => {
    if (!clubName.trim()) return false;
    if (!sockColor) return false;
    if (hasGrip && !gripColor) return false;
    return true;
  };

  const handleClubNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 10) setClubName(value);
  };

  const handleGetQuote = () => {
    if (!isFormValid()) return;

    const sockDetails = [
      `Quantity: ${quantity} pairs`,
      `Sock Colour: ${sockColor.pms} (${sockColor.name})`,
      `Club Name: ${clubName} - ${clubNameColor.pms} (${clubNameColor.name})`,
      `Grip: ${hasGrip ? `Yes - ${gripColor.pms} (${gripColor.name})` : 'No'}`
    ].join('\n');

    const message = `Hi iGripps team,

I'd like to request a quote for custom grip socks with the following Pantone PMS specifications:

${sockDetails}

Please provide pricing information and next steps.

Thank you!`;

    const params = new URLSearchParams({
      subject: 'Request Quote - Pantone PMS Colors',
      message: message
    });

    router.push(`/contact?${params.toString()}`);
  };

  // Popular team color combinations using real Pantone colors
  const popularCombinations = [
    {
      name: 'Rangers',
      sock: findPantoneColor('PMS Red 032 C'),
      club: findPantoneColor('PMS White'),
      grip: findPantoneColor('PMS White')
    },
    {
      name: 'Wolves',
      sock: findPantoneColor('PMS 199 U'),
      club: findPantoneColor('PMS 116 U'),
      grip: findPantoneColor('PMS 116 U')
    },
    {
      name: 'Diggers',
      sock: findPantoneColor('PMS 300 U'),
      club: findPantoneColor('PMS 123 C'),
      grip: findPantoneColor('PMS White')
    },
    {
      name: 'Tigers',
      sock: findPantoneColor('PMS Black C'),
      club: findPantoneColor('PMS Orange 021 C'),
      grip: findPantoneColor('PMS White')
    },
    {
      name: 'Gunners',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 186 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS 286 C')!,
    },
    {
      name: 'Devils',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS Black 2 U')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS 485 C')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
    },
    {
      name: 'Citizens',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 280 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
    },
    {
      name: 'Cherries',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 485 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS White')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS Black C')!,
    },
    {
      name: 'Villains',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS 199 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS Blue 072 C')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS Blue 072 C')!,
    },
    {
      name: 'Peacocks',
      sock: PANTONE_COLORS.find(c => c.pms === 'PMS Cool Gray 1 C')!,
      club: PANTONE_COLORS.find(c => c.pms === 'PMS 294 C')!,
      grip: PANTONE_COLORS.find(c => c.pms === 'PMS 294 C')!,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Club Customiser</h1>
              <p className="text-gray-600">Create your club's custom iGripps socks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Mobile-First Layout with Responsive Grid */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            
            {/* Customization Controls - First on Mobile, Right Column on Desktop */}
            <div className="space-y-6 lg:order-2">
              {/* Sock Colour Picker */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Sock Colour</h3>
                </div>
                <ColorPicker 
                  colors={PANTONE_COLORS} 
                  selectedColor={sockColor} 
                  onColorSelect={setSockColor}
                  selectedFamily={sockColorFamily}
                  onFamilyChange={setSockColorFamily}
                />
              </div>

              {/* Club Name Input */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Club Name</h3>
                </div>
                <input
                  type="text"
                  value={clubName}
                  onChange={handleClubNameChange}
                  placeholder="MAX 10 CHARACTERS"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase placeholder:normal-case"
                />
                <p className="text-sm text-gray-500 mt-2">{clubName.length}/10 characters</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Club Name Colour</h4>
                  <ColorPicker 
                    colors={PANTONE_COLORS} 
                    selectedColor={clubNameColor} 
                    onColorSelect={setClubNameColor}
                    selectedFamily={clubNameColorFamily}
                    onFamilyChange={setClubNameColorFamily}
                  />
                </div>
              </div>

              {/* Grip Options */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Grip className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Grip Options</h3>
                </div>
                <label className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={hasGrip}
                    onChange={(e) => setHasGrip(e.target.checked)}
                    className="w-5 h-5 border-gray-300 rounded text-blue-600"
                  />
                  <span className="text-gray-700 font-medium">Add grip soles</span>
                </label>
                {hasGrip && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Grip Colour</h4>
                    <ColorPicker 
                      colors={PANTONE_COLORS} 
                      selectedColor={gripColor} 
                      onColorSelect={setGripColor}
                      selectedFamily={gripColorFamily}
                      onFamilyChange={setGripColorFamily}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sock Preview and Popular Combinations - Second on Mobile, Left Column on Desktop */}
            <div className="space-y-6 mt-6 lg:mt-0 lg:order-1">
              {/* Sock Preview */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
                <div className="relative w-full max-w-sm mx-auto aspect-[3/4] bg-white rounded-lg overflow-hidden">
                  {/* Base Sock Layer */}
                  <div className="absolute inset-0 z-10">
                    <Image
                      src="/Base.png"
                      alt="Base Sock"
                      fill
                      className="object-contain"
                      style={{
                        filter: 'contrast(1.15) brightness(1.05) saturate(0.9)'
                      }}
                    />
                    {sockColor.rgb !== '#E6E7E8' && (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: sockColor.rgb,
                          opacity: 0.95,
                          mask: 'url(/Base.png)',
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMask: 'url(/Base.png)',
                          WebkitMaskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          mixBlendMode: 'vivid-lighten'
                        }}
                      />
                    )}
                  </div>

                  {/* Text Field Guide */}
                  <div className="absolute inset-0 z-12">
                    <Image
                      src="/Text-field.png"
                      alt=""
                      fill
                      className="object-contain opacity-0 pointer-events-none"
                    />
                  </div>

                  {/* Club Name */}
                  {clubName && (
                    <div className="absolute inset-0 z-15 flex items-center justify-center">
                      <div
                        className="absolute"
                        style={{
                          left: '42%',
                          top: '18%',
                          height: '45%',
                          width: '12%',
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
                            color: clubNameColor.rgb,
                            opacity: 0.95,
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            letterSpacing: '0.08em',
                            transform: 'scaleX(1.2) scaleY(0.8) rotate(14deg)',
                            transformOrigin: 'center',
                            lineHeight: 0.9,
                          }}
                        >
                          {clubName}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* iGripps Logo */}
                  <div className="absolute inset-0 z-16">
                    <Image
                      src="/iGripps-Branding.png"
                      alt="iGripps Logo"
                      fill
                      className="object-contain"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: clubNameColor.rgb,
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

                  {/* Grip Layer */}
                  {hasGrip && (
                    <div className="absolute inset-0 z-20">
                      <Image
                        src="/Grips.png"
                        alt="Grip Pattern"
                        fill
                        className="object-contain"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: gripColor.rgb,
                          opacity: 0.9,
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
                  <p><strong>Sock Colour:</strong> {sockColor.pms}</p>
                  <p><strong>Club Name:</strong> {clubName || 'None'} {clubName && `(${clubNameColor.pms})`}</p>
                  <p><strong>Grip:</strong> {hasGrip ? `Yes (${gripColor.pms})` : 'No'}</p>
                </div>
              </div>

              {/* Popular Team Combinations */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Team Combinations</h3>
                <div className="grid grid-cols-2 gap-3">
                  {popularCombinations.map((combo) => (
                    <button
                      key={combo.name}
                      onClick={() => {
                        setSockColor(combo.sock);
                        setClubNameColor(combo.club);
                        setGripColor(combo.grip);
                        setClubName(combo.name.toUpperCase());
                        // Update color family selections
                        setSockColorFamily(combo.sock.family);
                        setClubNameColorFamily(combo.club.family);
                        setGripColorFamily(combo.grip.family);
                      }}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors group"
                    >
                      <div className="flex justify-center space-x-1 mb-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor: combo.sock.rgb,
                            border: '2px solid #d1d5dc',
                          }}
                        />
                        <div
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor: combo.club.rgb,
                            border: '2px solid #d1d5dc',
                          }}
                        />
                        <div
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor: combo.grip.rgb,
                            border: '2px solid #d1d5dc',
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{combo.name}</span>
                      <div className="text-xs text-gray-400 mt-1">
                        {combo.sock.pms.replace('PMS ', '')} • {combo.club.pms.replace('PMS ', '')} • {combo.grip.pms.replace('PMS ', '')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Selector and Get A Quote Section - Always at the bottom on all screen sizes */}
          <div className="mt-6 space-y-6">
            {/* Quantity Selector */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              </div>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="1-20">1-20 pairs</option>
                <option value="21-50">21-50 pairs</option>
                <option value="51-100">51-100 pairs</option>
                <option value="100+">100+ pairs</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
              </p>
            </div>

            {/* Get A Quote Button */}
            <button
              onClick={handleGetQuote}
              disabled={!isFormValid()}
              className={`w-full ${
                isFormValid()
                  ? 'bg-[#9EE624] hover:bg-[#8ED91A] cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-[#202020] py-4 px-6 rounded-lg font-semibold text-lg transition-colors`}
            >
              Get A Quote
            </button>

            {/* Note */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-800 rounded-lg">
              <strong>Note:</strong> All colours are specified using professional Pantone+ Solid Coated and Uncoated standards for accurate colour matching. iGripps will provide physical colour samples and Pantone swatch confirmation before production. Can't see your club's PMS colours? Let us know!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}