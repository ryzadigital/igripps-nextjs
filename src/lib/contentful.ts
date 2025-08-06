// src/lib/contentful.ts
import { createClient } from 'contentful';

// Base Contentful Asset interface
export interface ContentfulAsset {
  metadata: {
    tags: any[];
    concepts: any[];
  };
  sys: {
    space: {
      sys: {
        type: 'Link';
        linkType: 'Space';
        id: string;
      };
    };
    id: string;
    type: 'Asset';
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: {
        id: string;
        type: 'Link';
        linkType: 'Environment';
      };
    };
    publishedVersion: number;
    revision: number;
    locale: string;
  };
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

// Asset Link interface
interface ContentfulAssetLink {
  sys: {
    type: 'Link';
    linkType: 'Asset';
    id: string;
  };
}

// Homepage Gallery Types
interface ContentfulHomepageGallery {
  metadata: {
    tags: any[];
    concepts: any[];
  };
  sys: {
    space: {
      sys: {
        type: 'Link';
        linkType: 'Space';
        id: string;
      };
    };
    id: string;
    type: 'Entry';
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: {
        id: string;
        type: 'Link';
        linkType: 'Environment';
      };
    };
    publishedVersion: number;
    revision: number;
    contentType: {
      sys: {
        type: 'Link';
        linkType: 'ContentType';
        id: 'homepageGallery';
      };
    };
    locale: string;
  };
  fields: {
    title: string;
    images: ContentfulAssetLink[];
  };
}

export interface ContentfulGalleryResponse {
  sys: {
    type: 'Array';
  };
  total: number;
  skip: number;
  limit: number;
  items: ContentfulHomepageGallery[];
  includes: {
    Asset: ContentfulAsset[];
  };
}

// Product Types (Updated to match your existing structure)
export interface ContentfulProduct {
  sys: {
    id: string;
  };
  fields: {
    name: string;
    urlSlug: string;
    shortDescription: string;
    description: string;
    price: number;
    features: string[];
    minimumOrder: number;
    mainImage: {
      sys: {
        id: string;
      };
    };
    secondaryImage: {
      sys: {
        id: string;
      };
    };
    soldOut: boolean;
  };
}

export interface ContentfulResponse {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: ContentfulProduct[];
  includes: {
    Asset: ContentfulAsset[];
  };
}

// Simplified product type for your app
export interface SockProduct {
  id: string;
  name: string;
  urlSlug: string;
  shortDescription: string;
  description: string;
  price: number;
  features: string[];
  minimumOrder: number;
  mainImage: string;
  secondaryImage: string;
  soldOut: boolean;
}

// Partner Types
export interface ContentfulPartner {
  sys: {
    id: string;
  };
  fields: {
    name: string;
    urlSlug: string;
    logo: {
      sys: {
        id: string;
      };
    };
    testimonial: string;
    supplierName: string;
    supplierTitle: string;
    supplierProducts?: {
      sys: {
        id: string;
      };
    }[];
  };
}

export interface ContentfulPartnerResponse {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: ContentfulPartner[];
  includes: {
    Asset: ContentfulAsset[];
  };
}

export interface Partner {
  id: string;
  name: string;
  urlSlug: string;
  logo: string;
  testimonial: string;
  supplierName: string;
  supplierTitle: string;
  supplierProducts: string[];
}

// Gallery Image interface for easy consumption
export interface GalleryImage {
  url: string;
  alt: string;
  title: string;
  width: number;
  height: number;
}

// Create Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Helper function to resolve asset references (Enhanced version)
function resolveAsset(assetId: string, assets: ContentfulAsset[]): string {
  const asset = assets.find(asset => asset.sys.id === assetId);
  return asset ? `https:${asset.fields.file.url}` : '';
}

// Enhanced helper to resolve asset with full details
function resolveAssetWithDetails(assetId: string, assets: ContentfulAsset[]): GalleryImage | null {
  const asset = assets.find(asset => asset.sys.id === assetId);
  if (!asset) return null;
  
  return {
    url: `https:${asset.fields.file.url}`,
    alt: asset.fields.title || asset.fields.description || 'Image',
    title: asset.fields.title,
    width: asset.fields.file.details.image.width,
    height: asset.fields.file.details.image.height,
  };
}

// HOMEPAGE GALLERY FUNCTIONS
export async function getHomepageGallery(): Promise<ContentfulGalleryResponse | null> {
  try {
    const response = await client.getEntries({
      content_type: 'homepageGallery',
      include: 2, // Include referenced assets
      limit: 1,
    });
    
    return response as unknown as ContentfulGalleryResponse;
  } catch (error) {
    console.error('Error fetching homepage gallery:', error);
    return null;
  }
}

// Simplified function to get just the gallery images
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const galleryData = await getHomepageGallery();
    
    if (!galleryData || !galleryData.items.length) {
      return [];
    }

    const gallery = galleryData.items[0];
    const assetLinks = gallery.fields.images;
    const assets = galleryData.includes.Asset;

    // Resolve asset links to full image data
    const resolvedImages = assetLinks.map(link => 
      resolveAssetWithDetails(link.sys.id, assets)
    ).filter(Boolean) as GalleryImage[];

    return resolvedImages;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
}

// PRODUCT FUNCTIONS (Your existing code)
export async function getProducts(): Promise<SockProduct[]> {
  try {
    const response = await client.getEntries({
      content_type: 'products',
      include: 2,
    });

    const contentfulResponse = response as unknown as ContentfulResponse;
    const assets = contentfulResponse.includes?.Asset || [];

    return contentfulResponse.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name,
      urlSlug: item.fields.urlSlug,
      shortDescription: item.fields.shortDescription,
      description: item.fields.description,
      price: item.fields.price,
      features: item.fields.features || [],
      minimumOrder: item.fields.minimumOrder,
      mainImage: resolveAsset(item.fields.mainImage?.sys.id, assets),
      secondaryImage: resolveAsset(item.fields.secondaryImage?.sys.id, assets),
      soldOut: item.fields.soldOut,
    }));
  } catch (error) {
    console.error('Error fetching products from Contentful:', error);
    return [];
  }
}

export async function getProduct(slug: string): Promise<SockProduct | null> {
  try {
    const response = await client.getEntries({
      content_type: 'products',
      'fields.urlSlug': slug,
      include: 2,
    });

    const contentfulResponse = response as unknown as ContentfulResponse;
    
    if (contentfulResponse.items.length === 0) {
      return null;
    }

    const item = contentfulResponse.items[0];
    const assets = contentfulResponse.includes?.Asset || [];

    return {
      id: item.sys.id,
      name: item.fields.name,
      urlSlug: item.fields.urlSlug,
      shortDescription: item.fields.shortDescription,
      description: item.fields.description,
      price: item.fields.price,
      features: item.fields.features || [],
      minimumOrder: item.fields.minimumOrder,
      mainImage: resolveAsset(item.fields.mainImage?.sys.id, assets),
      secondaryImage: resolveAsset(item.fields.secondaryImage?.sys.id, assets),
      soldOut: item.fields.soldOut,
    };
  } catch (error) {
    console.error('Error fetching product from Contentful:', error);
    return null;
  }
}

// PARTNER FUNCTIONS (Your existing code)
export async function getPartners(): Promise<Partner[]> {
  try {
    const response = await client.getEntries({
      content_type: 'partners',
      include: 2,
    });

    const contentfulResponse = response as unknown as ContentfulPartnerResponse;
    const assets = contentfulResponse.includes?.Asset || [];

    return contentfulResponse.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name,
      urlSlug: item.fields.urlSlug,
      logo: resolveAsset(item.fields.logo?.sys.id, assets),
      testimonial: item.fields.testimonial,
      supplierName: item.fields.supplierName,
      supplierTitle: item.fields.supplierTitle,
      supplierProducts: item.fields.supplierProducts?.map(product => 
        resolveAsset(product.sys.id, assets)
      ).filter(Boolean) || [],
    }));
  } catch (error) {
    console.error('Error fetching partners from Contentful:', error);
    return [];
  }
}

export async function getPartnerBySlug(slug: string): Promise<Partner | null> {
  try {
    const response = await client.getEntries({
      content_type: 'partners',
      'fields.urlSlug': slug,
      include: 2,
    });

    const contentfulResponse = response as unknown as ContentfulPartnerResponse;
    
    if (contentfulResponse.items.length === 0) {
      return null;
    }

    const item = contentfulResponse.items[0];
    const assets = contentfulResponse.includes?.Asset || [];

    // Debug logging (remove in production)
    console.log('Partner supplierProducts:', item.fields.supplierProducts);
    console.log('Available assets:', assets.map(a => ({ id: a.sys.id, url: a.fields.file.url })));

    const supplierProducts = item.fields.supplierProducts?.map(product => {
      const resolvedAsset = resolveAsset(product.sys.id, assets);
      console.log(`Resolving product ${product.sys.id}:`, resolvedAsset);
      return resolvedAsset;
    }).filter(Boolean) || [];

    console.log('Final supplierProducts:', supplierProducts);

    return {
      id: item.sys.id,
      name: item.fields.name,
      urlSlug: item.fields.urlSlug,
      logo: resolveAsset(item.fields.logo?.sys.id, assets),
      testimonial: item.fields.testimonial,
      supplierName: item.fields.supplierName,
      supplierTitle: item.fields.supplierTitle,
      supplierProducts,
    };
  } catch (error) {
    console.error('Error fetching partner from Contentful:', error);
    return null;
  }
}

// UTILITY FUNCTIONS

// Function to optimize Contentful image URLs
export function optimizeImageUrl(url: string, options: {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpg' | 'png';
  quality?: number;
  fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
} = {}): string {
  if (!url) return '';
  
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.format) params.append('fm', options.format);
  if (options.quality) params.append('q', options.quality.toString());
  if (options.fit) params.append('fit', options.fit);
  
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

// Function to get responsive image URLs
export function getResponsiveImageUrls(baseUrl: string) {
  return {
    mobile: optimizeImageUrl(baseUrl, { width: 768, format: 'webp', quality: 80 }),
    tablet: optimizeImageUrl(baseUrl, { width: 1024, format: 'webp', quality: 80 }),
    desktop: optimizeImageUrl(baseUrl, { width: 1920, format: 'webp', quality: 80 }),
    original: baseUrl
  };
}