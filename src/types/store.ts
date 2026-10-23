export type ProductType = 'simple' | 'variable';

export interface ProductVariant {
  id: string;
  name: string; // e.g., 'مشکی - گارانتی ۱۸ ماهه' or 'ظرفیت ۱۲۸ گیگ'
  price: number;
  salePrice?: number;
  partnerPrice?: number;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  type: ProductType;
  categoryId: string;
  categoryName?: string;
  brand: string;
  subcategory?: string;
  image: string;
  gallery?: string[];
  price: number;
  salePrice?: number;
  partnerPrice?: number;
  stock: number;
  shortDescription: string;
  description: string;
  isRecommended?: boolean;
  isSpecialOffer?: boolean;
  variants?: ProductVariant[];
  attributes?: {
    brand?: string;
    warranty?: string;
    modelCompatibility?: string;
    material?: string;
    color?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string; // Key of icon in icon registry
  description?: string;
  order?: number;
  subcategories?: string[];
}

export interface UserAddress {
  province?: string;
  city?: string;
  street: string;
  postalCode: string;
  recipientName: string;
  recipientPhone: string;
}

export type UserRole = 'customer' | 'partner' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string;
  role: UserRole;
  address?: string;
  postalCode?: string;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique cart item id (e.g. productId or productId_variantId)
  productId: string;
  title: string;
  image: string;
  price: number;
  salePrice?: number;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  variantName?: string;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'online' | 'cod';
  paymentRefId?: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface HeroBanner {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgGradientFrom: string;
  bgGradientTo: string;
  imageUrl?: string;
}

export interface SpecialBanner {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgGradientFrom: string;
  bgGradientTo: string;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  supportHours: string;
  address: string;
  copyrightYear: string;
  heroBanner: HeroBanner;
  specialBanner: SpecialBanner;
  torobFeedEnabled: boolean;
  zarinpalMerchantId: string;
  smsGatewayProvider: string;
  smsApiKey: string;
}
