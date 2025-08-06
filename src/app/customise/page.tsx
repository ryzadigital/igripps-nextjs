'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Palette, Type, Grip } from 'lucide-react';
import ColorPicker from './ColorPicker';

const SOCK_COLORS = [
  { name: 'White', hex: '#d8d8d8' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#cb272e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Black', hex: '#000000' },
  { name: 'Maroon', hex: '#95032c' },
  { name: 'Navy', hex: '#1e40af' },
];

const TEXT_COLORS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#cb272e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Black', hex: '#000000' },
  { name: 'Maroon', hex: '#95032c' },
  { name: 'Navy', hex: '#1e40af' },
];

const GRIP_COLORS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Red', hex: '#cb272e' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Black', hex: '#000000' },
  { name: 'Maroon', hex: '#95032c' },
  { name: 'Navy', hex: '#1e40af' },
];
export default function CustomisePage() {
  const router = useRouter();

  const [sockColor, setSockColor] = useState(SOCK_COLORS[8]); // Black
  const [clubNameColor, setClubNameColor] = useState(TEXT_COLORS[0]); // White
  const [gripColor, setGripColor] = useState(GRIP_COLORS[0]); // White
  const [clubName, setClubName] = useState('IGRIPPS');
  const [hasGrip, setHasGrip] = useState(true);

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
      `Sock Colour: ${sockColor.name}`,
      `Club Name: ${clubName} (${clubNameColor.name})`,
      `Grip: ${hasGrip ? `Yes (${gripColor.name})` : 'No'}`
    ].join('\n');

    const message = `Hi iGripps team,

I'd like to request a quote for custom grip socks with the following specifications:

${sockDetails}

Please provide pricing information and next steps.

Thank you!`;

    const params = new URLSearchParams({
      subject: 'Request Quote',
      message: message
    });

    router.push(`/contact?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sock Designer</h1>
              <p className="text-gray-600">Create your custom grip socks</p>
            </div>
          </div>
        </div>
      </div>


      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
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
                  {sockColor.hex !== '#d8d8d8' && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: sockColor.hex,
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
                          fontSize: 'clamp(20px, 4vw, 28px)',
                          fontWeight: 'bold',
                          color: clubNameColor.hex,
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
                      backgroundColor: clubNameColor.hex,
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
                        backgroundColor: gripColor.hex,
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
                <p><strong>Sock Colour:</strong> {sockColor.name}</p>
                <p><strong>Club Name:</strong> {clubName || 'None'} {clubName && `(${clubNameColor.name})`}</p>
                <p><strong>Grip:</strong> {hasGrip ? `Yes (${gripColor.name})` : 'No'}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Combinations</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Rangers', sock: SOCK_COLORS[3], club: TEXT_COLORS[0], grip: GRIP_COLORS[0] },
                  { name: 'Wolves', sock: SOCK_COLORS[9], club: TEXT_COLORS[4], grip: GRIP_COLORS[4] },
                  { name: 'Diggers', sock: SOCK_COLORS[10], club: TEXT_COLORS[4], grip: GRIP_COLORS[0] },
                  { name: 'Tigers', sock: SOCK_COLORS[8], club: TEXT_COLORS[6], grip: GRIP_COLORS[0] },
                ].map((combo) => (
                  <button
                    key={combo.name}
                    onClick={() => {
                      setSockColor(combo.sock);
                      setClubNameColor(combo.club);
                      setGripColor(combo.grip);
                      setClubName(combo.name.toUpperCase());
                    }}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors group"
                  >
                    <div className="flex justify-center space-x-1 mb-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: combo.sock.hex,
                          border: '2px solid #d1d5dc',
                        }}
                      />
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: combo.club.hex,
                          border: '2px solid #d1d5dc',
                        }}
                      />
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: combo.grip.hex,
                          border: '2px solid #d1d5dc',
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{combo.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Sock Colour Picker */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Sock Colour</h3>
              </div>
              <ColorPicker colors={SOCK_COLORS} selectedColor={sockColor} onColorSelect={setSockColor} />
              <p className="text-xs text-gray-500 mt-2">Select your sock colour</p>
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
                <ColorPicker colors={TEXT_COLORS} selectedColor={clubNameColor} onColorSelect={setClubNameColor} />
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
                  <ColorPicker colors={GRIP_COLORS} selectedColor={gripColor} onColorSelect={setGripColor} />
                  <p className="text-xs text-gray-500 mt-2">Grip pattern overlayed on base sock</p>
                </div>
              )}
            </div>

      {/* Get A Quote button at the end */}
      <div className="space-y-3">
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
            </div>

            {/* Note */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 text-sm text-blue-800 rounded-lg">
              <strong>Note:</strong> Colours are applied to a neutral base template for accurate representation. Actual colours may slightly vary. iGripps will provide physical product samples before any orders are placed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}