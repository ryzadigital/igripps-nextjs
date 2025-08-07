// app/partners/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getPartners, Partner } from '@/lib/contentful';

// Reusable Partner Card Component
function PartnerCard({ partner }: { partner: Partner }) {
  // Truncate testimonial for preview (first 120 characters)
  const testimonialPreview = partner.testimonial.length > 120
    ? `${partner.testimonial.substring(0, 120)}...`
    : partner.testimonial;

  return (
    <Link 
      href={`/partners/${partner.urlSlug}`}
      className="group"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-lg h-full flex flex-col">
        {/* Partner Logo */}
        <div className="relative h-32 bg-gray-50 flex items-center justify-center p-4">
          {partner.logo ? (
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              width={120}
              height={80}
              className="object-contain max-h-20"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded">
              <span className="text-gray-400 text-sm">No logo available</span>
            </div>
          )}
        </div>

        {/* Partner Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {partner.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 flex-1">
            {testimonialPreview}
          </p>

          {/* Attribution */}
          <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
            <p className="font-medium">{partner.supplierName}</p>
            <p>{partner.supplierTitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function PartnersPage() {
  try {
    const partners = await getPartners();

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're proud to work with football clubs across Sydney, providing them with 
            high-quality grip socks that enhance their performance on the pitch.
          </p>
        </div>
        
        {partners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No partners available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Partners</h1>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Failed to load partners. Please try again later.</p>
        </div>
      </div>
    );
  }
}