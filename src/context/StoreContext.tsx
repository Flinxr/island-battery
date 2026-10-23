import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CartItem,
  Category,
  Order,
  OrderStatus,
  Product,
  StoreSettings,
  User,
  UserRole,
} from '../types/store';
import {
  INITIAL_ADMIN_USER,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMER_USER,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from '../data/initialData';

export type ActivePage =
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'profile'
  | 'contact'
  | 'terms'
  | 'about'
  | 'admin';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'users'
  | 'banners'
  | 'contact'
  | 'torob';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  currentUser: User | null;
  orders: Order[];
  settings: StoreSettings;
  activePage: ActivePage;
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;
  selectedProductId: string | null;
  selectedCategoryId: string | null;
  selectedSubcategoryId: string | null;
  searchQuery: string;
  isDarkMode: boolean;
  isLoading: boolean;
  isSyncingCart: boolean;
  // Navigation
  navigateTo: (page: ActivePage, productId?: string, categoryId?: string, subcategory?: string | null) => void;
  setSelectedSubcategoryId: (sub: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleDarkMode: () => void;
  // Cart
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  // Auth
  login: (phone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: {
    name: string;
    phone: string;
    password?: string;
    address?: string;
    postalCode?: string;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  // Admin Operations
  saveProduct: (product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  saveCategory: (category: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  updateUserRole: (userId: string, role: UserRole) => Promise<boolean>;
  saveSettings: (settings: Partial<StoreSettings>) => Promise<boolean>;
  uploadImage: (base64: string, filename?: string) => Promise<string>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  // State initialization with localStorage fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pr_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map((p) => ({
          ...p,
          brand: p.brand || p.attributes?.brand || 'آیلند باتری',
          subcategory: p.subcategory || undefined,
        }));
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('pr_categories');
      if (saved) {
        const parsed: Category[] = JSON.parse(saved);
        // Merge subcategories from INITIAL_CATEGORIES if missing
        return parsed.map((cat) => {
          const initCat = INITIAL_CATEGORIES.find((c) => c.id === cat.id);
          return {
            ...cat,
            subcategories: cat.subcategories || initCat?.subcategories || [],
          };
        });
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('pr_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('pr_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('pr_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.storeName?.includes('پیچ') || parsed.heroBanner?.imageUrl?.includes('unsplash')) {
          const sanitized = {
            ...parsed,
            heroBanner: { ...parsed.heroBanner, imageUrl: '' },
          };
          localStorage.setItem('pr_settings', JSON.stringify(sanitized));
          return sanitized;
        }
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [adminActiveTab, setAdminActiveTab] = useState<AdminTab>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncingCart, setIsSyncingCart] = useState<boolean>(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pr_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pr_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Sync to backend on mount if server is available
  useEffect(() => {
    async function loadServerData() {
      try {
        const [prodRes, catRes, setRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/categories').catch(() => null),
          fetch('/api/settings').catch(() => null),
        ]);

        if (prodRes && prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods) && prods.length > 0) {
            setProducts(prods);
            localStorage.setItem('pr_products', JSON.stringify(prods));
          }
        }
        if (catRes && catRes.ok) {
          const cats = await catRes.json();
          if (Array.isArray(cats) && cats.length > 0) {
            setCategories(cats);
            localStorage.setItem('pr_categories', JSON.stringify(cats));
          }
        }
        if (setRes && setRes.ok) {
          const sets = await setRes.json();
          if (sets && sets.storeName) {
            setSettings(sets);
            localStorage.setItem('pr_settings', JSON.stringify(sets));
          }
        }
      } catch (err) {
        // Fallback to local storage
      }
    }
    loadServerData();
  }, []);

  // Save cart changes
  useEffect(() => {
    localStorage.setItem('pr_cart', JSON.stringify(cart));
  }, [cart]);

  // Save orders changes
  useEffect(() => {
    localStorage.setItem('pr_orders', JSON.stringify(orders));
  }, [orders]);

  // Save users changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pr_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pr_current_user');
    }
  }, [currentUser]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const navigateTo = (
    page: ActivePage,
    productId?: string,
    categoryId?: string,
    subcategory?: string | null
  ) => {
    setActivePage(page);
    if (productId !== undefined) setSelectedProductId(productId);
    if (categoryId !== undefined) setSelectedCategoryId(categoryId);
    if (subcategory !== undefined) setSelectedSubcategoryId(subcategory);
    else if (categoryId !== undefined) setSelectedSubcategoryId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations with simulated sync state
  const addToCart = (product: Product, variantId?: string, quantity: number = 1) => {
    setIsSyncingCart(true);

    let price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
    let variantName = '';

    if (variantId && product.variants) {
      const v = product.variants.find((item) => item.id === variantId);
      if (v) {
        price = v.salePrice && v.salePrice < v.price ? v.salePrice : v.price;
        variantName = v.name;
      }
    }

    const cartItemId = variantId ? `${product.id}_${variantId}` : product.id;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
            salePrice: product.salePrice,
            quantity,
            variantId,
            variantName,
          },
        ];
      }
    });

    setTimeout(() => {
      setIsSyncingCart(false);
    }, 300);
  };

  const removeFromCart = (cartItemId: string) => {
    setIsSyncingCart(true);
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    setTimeout(() => {
      setIsSyncingCart(false);
    }, 200);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setIsSyncingCart(true);
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
    setTimeout(() => {
      setIsSyncingCart(false);
    }, 200);
  };

  const clearCart = () => {
    setCart([]);
  };

  // Auth Operations
  const login = async (phone: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Check server login first
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setIsLoading(false);
        return { success: true };
      }

      // Local fallback check
      if (phone === '09334237673' && pass === 'i1l3i8a5') {
        setCurrentUser(INITIAL_ADMIN_USER);
        setIsLoading(false);
        return { success: true };
      }

      if (phone === INITIAL_CUSTOMER_USER.phone && pass === 'user1234') {
        setCurrentUser(INITIAL_CUSTOMER_USER);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'شماره موبایل یا رمز عبور نامعتبر است' };
    } catch {
      if (phone === '09334237673' && pass === 'i1l3i8a5') {
        setCurrentUser(INITIAL_ADMIN_USER);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'خطا در برقراری ارتباط با سرور' };
    }
  };

  const registerUser = async (data: {
    name: string;
    phone: string;
    password?: string;
    address?: string;
    postalCode?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        setCurrentUser(result.user);
        setIsLoading(false);
        return { success: true, user: result.user };
      }

      // Local fallback
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        password: data.password || '123456',
        role: 'customer',
        address: data.address,
        postalCode: data.postalCode,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        password: data.password || '123456',
        role: 'customer',
        address: data.address,
        postalCode: data.postalCode,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
      setIsLoading(false);
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigateTo('home');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
  };

  // Admin and store management
  const saveProduct = async (productData: Partial<Product>): Promise<Product> => {
    try {
      const isEdit = !!productData.id;
      const url = isEdit ? `/api/products/${productData.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        const saved = await res.json();
        setProducts((prev) => {
          if (isEdit) {
            return prev.map((p) => (p.id === saved.id ? saved : p));
          } else {
            return [saved, ...prev];
          }
        });
        return saved;
      }
    } catch {
      // Fallback
    }

    const savedProd: Product = {
      id: productData.id || `prod-${Date.now()}`,
      title: productData.title || 'محصول جدید',
      slug: productData.slug || `prod-${Date.now()}`,
      sku: productData.sku || `PR-${Date.now()}`,
      type: productData.type || 'simple',
      categoryId: productData.categoryId || 'cat-battery',
      categoryName: productData.categoryName || 'لوازم جانبی',
      brand: productData.brand || 'آیلند باتری',
      subcategory: productData.subcategory || undefined,
      image: productData.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
      price: productData.price || 0,
      salePrice: productData.salePrice,
      stock: productData.stock ?? 10,
      shortDescription: productData.shortDescription || '',
      description: productData.description || '',
      isRecommended: productData.isRecommended,
      isSpecialOffer: productData.isSpecialOffer,
      variants: productData.variants,
      attributes: productData.attributes,
      createdAt: productData.createdAt || new Date().toISOString(),
    };

    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProd.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProd.id ? savedProd : p));
      }
      return [savedProd, ...prev];
    });

    return savedProd;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {}
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const saveCategory = async (categoryData: Partial<Category>): Promise<Category> => {
    try {
      const isEdit = !!categoryData.id;
      const url = isEdit ? `/api/categories/${categoryData.id}` : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      if (res.ok) {
        const saved = await res.json();
        setCategories((prev) => {
          if (isEdit) {
            return prev.map((c) => (c.id === saved.id ? saved : c));
          } else {
            return [...prev, saved];
          }
        });
        return saved;
      }
    } catch {}

    const savedCat: Category = {
      id: categoryData.id || `cat-${Date.now()}`,
      name: categoryData.name || 'دسته‌بندی جدید',
      slug: categoryData.slug || `cat-${Date.now()}`,
      iconName: categoryData.iconName || 'generic',
      order: categoryData.order || categories.length + 1,
    };

    setCategories((prev) => {
      const exists = prev.some((c) => c.id === savedCat.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCat.id ? savedCat : c));
      }
      return [...prev, savedCat];
    });

    return savedCat;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    } catch {}
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const orderNumber = `PR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id || 'guest',
      customerName: orderData.customerName || currentUser?.name || 'مشتری گرامی',
      customerPhone: orderData.customerPhone || currentUser?.phone || '',
      shippingAddress: orderData.shippingAddress || currentUser?.address || '',
      postalCode: orderData.postalCode || currentUser?.postalCode || '',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      shippingFee: orderData.shippingFee || 0,
      totalAmount: orderData.totalAmount || 0,
      status: 'pending',
      paymentMethod: 'online',
      paymentRefId: `ZP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
      ...orderData,
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch {}

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {}

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
    return true;
  };

  const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
    } catch {}

    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role } : null));
    }
    return true;
  };

  const saveSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    const updated = { ...settings, ...newSettings };
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {}

    setSettings(updated);
    return true;
  };

  const uploadImage = async (base64: string, filename?: string): Promise<string> => {
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, filename }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch {}
    // If offline or fallback, return the data URI directly
    return base64;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        currentUser,
        orders,
        settings,
        activePage,
        adminActiveTab,
        setAdminActiveTab,
        selectedProductId,
        selectedCategoryId,
        selectedSubcategoryId,
        setSelectedSubcategoryId,
        searchQuery,
        isDarkMode,
        isLoading,
        isSyncingCart,
        navigateTo,
        setSearchQuery,
        toggleDarkMode,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        login,
        registerUser,
        logout,
        updateUserProfile,
        saveProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        createOrder,
        updateOrderStatus,
        updateUserRole,
        saveSettings,
        uploadImage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
