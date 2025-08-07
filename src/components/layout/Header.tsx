'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Bars3Icon as Menu,
  XMarkIcon as X,
  ArrowRightIcon as ArrowRight
} from '@heroicons/react/24/outline';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'Partners', href: '/partners' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-secondary text-primary border-b border-primary/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between md:justify-between items-center h-16 relative">
          {/* Logo - Centered on mobile/tablet, left-aligned on desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none md:translate-x-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-60 h-12 bg-white/0 rounded-lg p-1.5 group-hover:bg-white/0 transition-colors">
                <Image
                  src="/iGripps-Landscape.png"
                  alt="iGripps Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-primary/80 hover:text-accent transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
            <Link href="/customise">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-orange-500/25 transform hover:scale-105 ml-4">
                Club Customiser
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </div>

          {/* Mobile menu button - Always positioned on the right */}
          <div className="md:hidden relative z-10">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary/80 hover:text-accent transition-all duration-300 p-2 rounded-lg hover:bg-primary/10"
            >
              <div className="relative w-6 h-6">
                <X className={`h-6 w-6 absolute transition-all duration-300 ${
                  isMenuOpen 
                    ? 'rotate-0 opacity-100 scale-100' 
                    : 'rotate-90 opacity-0 scale-75'
                }`} />
                <Menu className={`h-6 w-6 absolute transition-all duration-300 ${
                  isMenuOpen 
                    ? '-rotate-90 opacity-0 scale-75' 
                    : 'rotate-0 opacity-100 scale-100'
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden bg-secondary text-primary border-t border-primary/20 transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}>
          <div className={`px-2 pt-2 pb-3 space-y-1 transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}>
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-primary/80 hover:text-accent transition-all duration-300 font-medium transform ${
                  isMenuOpen 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-4 opacity-0'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className={`px-3 py-2 transition-all duration-300 transform ${
              isMenuOpen 
                ? 'translate-x-0 opacity-100' 
                : '-translate-x-4 opacity-0'
            }`}
            style={{
              transitionDelay: isMenuOpen ? `${navigation.length * 50}ms` : '0ms'
            }}>
              <Link href="/customise">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-orange-500/25 transform hover:scale-105">
                  Club Customiser
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}