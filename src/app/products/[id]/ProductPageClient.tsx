// app/products/[id]/ProductPageClient.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { SockProduct } from '@/lib/contentful';

// Image Carousel Component
function ImageCarousel({ images, productName }: { images: string[], productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsTransitioning(false);
    }, 150);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
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

  if (images.length === 0) {
    return (
      <div className="h-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Main Image - takes up most of the space */}
      <div className="flex-1 relative rounded-lg overflow-hidden group border-0">
        <div className="relative w-full h-full bg-white">
          <Image
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        {/* Navigation Arrows - only show if more than 1 image */}
        {images.length > 1 && (
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
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              disabled={isTransitioning}
              className={`relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors disabled:opacity-50 ${
                index === currentIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductPageClientProps {
  product: SockProduct;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  // Prepare images array
  const images = [product.mainImage, product.secondaryImage].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link 
          href="/products" 
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to Products
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Image Carousel - Full height container */}
        <div className="h-full min-h-[600px] lg:min-h-[700px]">
          <ImageCarousel images={images} productName={product.name} />
        </div>

        {/* Product Details - Full height container */}
        <div className="h-full min-h-[600px] lg:min-h-[700px] flex flex-col">
          <div className="space-y-6 flex-1">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">
                {product.shortDescription}
              </p>
            </div>

            {/* Price and Status */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900">
                 From ${product.price.toFixed(2)}*
                </span>
                {product.soldOut && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Sold Out
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Minimum order: {product.minimumOrder} units
              </p>
            </div>

            {/* Features/Sizes */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Available Sizes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Buttons - Pinned to bottom */}
          <div className="pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Get A Quote Button */}
              {product.soldOut ? (
                <button
                  disabled
                  className="w-full sm:w-auto bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-semibold text-lg cursor-not-allowed"
                >
                  Currently Sold Out
                </button>
              ) : (
                <Link href="/contact?subject=request-quote">
                  <button className="w-full sm:w-auto border border-gray-600 hover:border-orange-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center hover:bg-orange-500/10">
                    Get A Quote
                    <UserGroupIcon className="ml-2 h-5 w-5" />
                  </button>
                </Link>
              )}
              
              {/* Club Customiser Button */}
              <Link href="/customise">
                <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-orange-500/25 transform hover:scale-105">
                  Club Customiser
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Ordering Information</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Minimum order quantity: {product.minimumOrder} units.</li>
              <li>• Perfect for team orders and club purchases</li>
              <li>• *Contact us for bulk pricing and customisation options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}