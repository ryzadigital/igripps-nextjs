// app/products/page.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Asset {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
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

interface Product {
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

interface ContentfulResponse {
  sys: {
    type: string;
  };
  total: number;
  skip: number;
  limit: number;
  items: Product[];
  includes: {
    Asset: Asset[];
  };
}

// Helper function to resolve asset references
function resolveAsset(assetId: string, assets: Asset[]): Asset | null {
  return assets.find(asset => asset.sys.id === assetId) || null;
}

async function getProducts(): Promise<ContentfulResponse> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  
  if (!spaceId || !accessToken) {
    throw new Error('Contentful configuration missing');
  }

  const response = await fetch(
    `https://cdn.contentful.com/spaces/${spaceId}/entries?content_type=products&include=2`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export default async function ProductsPage() {
  try {
    const data = await getProducts();
    const { items, includes } = data;
    const assets = includes?.Asset || [];
    
    // Sort manually in JS by price
    const products = items.sort((a, b) => a.fields.price - b.fields.price);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const mainImage = resolveAsset(product.fields.mainImage?.sys.id, assets);
              
              return (
                <Link 
                  key={product.sys.id} 
                  href={`/products/${product.fields.urlSlug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform duration-200 group-hover:scale-105 group-hover:shadow-lg">
                    {/* Product Image */}
                    <div className="relative h-64 bg-gray-100">
                      {mainImage ? (
                        <Image
                          src={`https:${mainImage.fields.file.url}`}
                          alt={product.fields.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                      
                      {/* Sold Out Badge */}
                      {product.fields.soldOut && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-sm font-semibold rounded">
                          Sold Out
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.fields.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.fields.shortDescription}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${product.fields.price.toFixed(2)}
                        </span>
                        
                        <span className="text-xs text-gray-500">
                          Min order: {product.fields.minimumOrder}
                        </span>
                      </div>

                      {/* Available Sizes */}
                      {product.fields.features && product.fields.features.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Sizes: </span>
                          <span className="text-xs text-gray-700">
                            {product.fields.features.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Products</h1>
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }
}