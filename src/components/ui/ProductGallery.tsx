// src/components/ui/ProductGallery.tsx
'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ProductGalleryProps {
  products: string[];
  partnerName: string;
}

export default function ProductGallery({ products, partnerName }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
      setIsTransitioning(false);
    }, 150);
  };

  const goToImage = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  const hasProducts = products && products.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Products for {partnerName}
        </h3>
        <p className="text-gray-600">
          {hasProducts 
            ? "Custom grip socks designed specifically for this partner club"
            : "No custom products available for this partner yet."
          }
        </p>
      </div>

      {hasProducts && (
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative w-full max-w-[400px] mx-auto aspect-square rounded-lg overflow-hidden group border-0">
            <div className="relative w-full h-full bg-white">
              <Image
                src={products[currentIndex]}
                alt={`${partnerName} custom sock design ${currentIndex + 1}`}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
                sizes="(max-width: 768px) 100vw, 400px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            
            {/* Navigation Arrows - only show if more than 1 image */}
            {products.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={isTransitioning}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 disabled:opacity-30"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={isTransitioning}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 disabled:opacity-30"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </>
            )}
            
            {/* Image Counter */}
            {products.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentIndex + 1} / {products.length}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {products.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {products.map((product, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  disabled={isTransitioning}
                  className={`relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors disabled:opacity-50 ${
                    index === currentIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={product}
                    alt={`${partnerName} design ${index + 1} thumbnail`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}