import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { getHomepageGallery } from '@/lib/contentful';

export default async function HomePage() {
  // Fetch gallery data from Contentful
  const galleryData = await getHomepageGallery();
  
  return (
    <>
      <HeroSection galleryData={galleryData} />
      <FeaturesSection />
    </>
  );
}