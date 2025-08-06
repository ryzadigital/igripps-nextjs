'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPinIcon as MapPin, 
  PhoneIcon as Phone, 
  EnvelopeIcon as Mail 
} from '@heroicons/react/24/outline';
import { Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Contact Details - Left */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Cobbitty 2570 NSW, Australia</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-accent" />
                <span>+61 434 886 676</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-accent" />
                <span>info@igripps.com.au</span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="https://www.instagram.com/igripps/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:text-accent transition-colors"
              >
                <Instagram className="h-4 w-4 text-accent" />
                <span>iGripps</span>
              </Link>
            </div>
          </div>

          {/* Brand Logo - Center */}
          <div className="flex justify-center">
            <Image
              src="/iGripps.svg"
              alt="iGripps Logo"
              width={150}
              height={150}
              className="invert brightness-0"
            />
          </div>

          {/* Quick Links - Right */}
          <div className="md:text-right">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-accent transition-colors">Products</Link></li>
              <li><Link href="/partners" className="hover:text-accent transition-colors">Our Partners</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 text-center text-sm text-primary/60">
          <p>&copy; 2025 iGripps. This website was built and is managed by <Link href="https://ryza.digital" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-accent transition-colors">RYZA Digital</Link>.</p>
        </div>
      </div>
    </footer>
  );
}