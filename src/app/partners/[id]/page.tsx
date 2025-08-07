// app/partners/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getPartnerBySlug, getPartners } from '@/lib/contentful';
import ProductGallery from '@/components/ui/ProductGallery';
import { CTASection } from '@/components/home/CTASection';

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const partners = await getPartners();
    
    return partners.map((partner) => ({
      id: partner.urlSlug,
    }));
  } catch (error) {
    return [];
  }
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PartnerPage({ params }: PageProps) {
  const { id } = await params;
  const partner = await getPartnerBySlug(id);
  
  if (!partner) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          {/* Club Logo */}
          <div className="mb-6">
            {partner.logo ? (
              <div className="inline-block bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={200}
                  height={120}
                  className="object-contain max-h-24"
                  priority
                />
              </div>
            ) : (
              <div className="inline-block bg-gray-100 rounded-lg p-6 border border-gray-200">
                <div className="w-48 h-24 flex items-center justify-center">
                  <span className="text-gray-400">No logo available</span>
                </div>
              </div>
            )}
          </div>

          {/* Club Name */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {partner.name}
          </h1>
          
          <p className="text-gray-600">
            Partner Club
          </p>
        </div>

        {/* Testimonial Section */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
          <p className="text-lg leading-relaxed text-gray-800 mb-6">
            {partner.testimonial}
          </p>
          
          {/* Attribution */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-100 flex-shrink-0">
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Logo
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {partner.supplierName}
                </p>
                <p className="text-gray-600 text-sm">
                  {partner.supplierTitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Gallery - Only show if products exist */}
        {partner.supplierProducts && partner.supplierProducts.length > 0 && (
          <div className="mb-8">
            <ProductGallery 
              products={partner.supplierProducts} 
              partnerName={partner.name} 
            />
          </div>
        )}

        {/* CTA Section */}
        <CTASection />
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const partner = await getPartnerBySlug(id);
  
  if (!partner) {
    return {
      title: 'Partner Not Found',
    };
  }

  // Get first 160 characters of testimonial for description
  const description = partner.testimonial.length > 160
    ? `${partner.testimonial.substring(0, 160)}...`
    : partner.testimonial;

  return {
    title: `${partner.name} - Partner Club | iGripps`,
    description: `Read what ${partner.supplierName} from ${partner.name} says about our premium grip socks: "${description}"`,
  };
}