// src/components/home/HeroSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRightIcon as ArrowRight, 
  StarIcon as Star, 
  UsersIcon as Users,
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight
} from '@heroicons/react/24/outline';
import { ContentfulGalleryResponse } from '@/lib/contentful';

interface HeroSectionProps {
  galleryData?: ContentfulGalleryResponse | null;
}

export function HeroSection({ galleryData }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Extract and resolve images from Contentful response
  const images = React.useMemo(() => {
    if (!galleryData || !galleryData.items.length) {
      return [];
    }

    const gallery = galleryData.items[0];
    const assetLinks = gallery.fields.images;
    const assets = galleryData.includes.Asset;

    const resolvedImages = assetLinks.map(link => {
      const asset = assets.find(a => a.sys.id === link.sys.id);
      if (!asset) return null;

      return {
        url: `https:${asset.fields.file.url}`,
        alt: asset.fields.title || asset.fields.description || 'Professional football socks showcase',
        title: asset.fields.title
      };
    }).filter(Boolean);

    return resolvedImages;
  }, [galleryData]);

  // Auto-advance carousel
  useEffect(() => {
    if (images.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="flex items-center py-12 lg:py-16" style={{ backgroundColor: '#f7f7f7', color: '#202020' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Content */}
          <div className="space-y-6">
            
            {/* Order Badge */}
            <div className="inline-flex items-center space-x-2 border border-orange-500 rounded-full px-4 py-2">
                          <span className="text-sm font-medium">ORDER NOW FOR THE 2026 SEASON</span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block text-orange-500 mb-2">Stay Grounded.</span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl font-normal">
                  iGripps Football Socks
                </span>
              </h1>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-xl sm:text-2xl leading-relaxed">
                Premium custom football socks engineered with advanced grip technology.
              </p>
              <p className="text-lg opacity-80">
                Trusted by some of Sydney's most prestigious clubs.
              </p>
            </div>

            {/* CTAs - Primary Focus */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/customise" className="flex-1 sm:flex-none">
                  <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-orange-500/25 transform hover:scale-105">
                    Club Customiser
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
                <Link href="/contact?subject=request-quote">
                  <button className="w-full sm:w-auto border border-gray-600 hover:border-orange-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center hover:bg-orange-500/10">
                    Get A Quote
                    <Users className="ml-2 h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>

          </div>

          {/* Right Side - Image Gallery */}
          <div className="relative">
            {images.length > 0 ? (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Main Image Display */}
                <div className="relative h-80 lg:h-96">
                  {images.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img 
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  
                  {/* Navigation Controls */}
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button 
                      onClick={prevImage}
                      className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? 'bg-orange-500' : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Fallback when no images
              <div className="h-80 lg:h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
                <p className="text-gray-600">Gallery loading...</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}