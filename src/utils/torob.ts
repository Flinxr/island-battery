import { Product } from '../types/store';

/**
 * Standard Torob feed item representation according to Torob's developer API specs
 * https://torob.com/pages/torob-api/
 */
export interface TorobFeedItem {
  page_unique_code: string;
  title: string;
  subtitle?: string;
  page_url: string;
  price: number;
  old_price?: number;
  availability: 'instock' | 'outofstock';
  category_name?: string;
  image_link: string;
  guarantee?: string;
  date_modified?: string;
}

/**
 * Converts a Product to Torob Feed Item
 */
export function formatTorobFeedItem(product: Product, baseUrl: string): TorobFeedItem {
  const currentPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const oldPrice = product.salePrice && product.salePrice < product.price ? product.price : undefined;
  const availability = product.stock > 0 ? 'instock' : 'outofstock';
  const cleanBase = baseUrl.replace(/\/$/, '');

  return {
    page_unique_code: product.id,
    title: product.title,
    subtitle: product.shortDescription,
    page_url: `${cleanBase}/?product=${product.id}`,
    price: currentPrice,
    old_price: oldPrice,
    availability,
    category_name: product.categoryName || 'لوازم جانبی موبایل',
    image_link: product.image.startsWith('http') ? product.image : `${cleanBase}${product.image}`,
    guarantee: product.attributes?.warranty || 'گارانتی اصالت و سلامت فیزیکی',
    date_modified: product.updatedAt || product.createdAt,
  };
}

/**
 * Generates Schema.org JSON-LD for Search Engines and Torob crawler
 */
export function generateTorobProductSchema(product: Product, baseUrl: string) {
  const cleanBase = baseUrl.replace(/\/$/, '');
  const activePrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const inStock = product.stock > 0;

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: [product.image.startsWith('http') ? product.image : `${cleanBase}${product.image}`],
    description: product.shortDescription || product.description,
    sku: product.sku || `PR-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.attributes?.brand || 'اورجینال',
    },
    offers: {
      '@type': 'Offer',
      url: `${cleanBase}/?product=${product.id}`,
      priceCurrency: 'IRT', // Iranian Toman standard
      price: activePrice,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'فروشگاه آیلند باتری',
      },
    },
  };
}
