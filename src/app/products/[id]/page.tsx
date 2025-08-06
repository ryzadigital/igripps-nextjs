// app/products/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/contentful';
import ProductPageClient from './ProductPageClient';

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    
    return products.map((product) => ({
      id: product.urlSlug,
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

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - £${product.price.toFixed(2)}`,
    description: product.shortDescription,
  };
}