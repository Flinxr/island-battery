import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MobileDrawer } from './components/MobileDrawer';
import { LoginModal } from './components/LoginModal';
import { CheckoutModal } from './components/CheckoutModal';
import { HeroBanner } from './components/HeroBanner';
import { CategoriesCarousel } from './components/CategoriesCarousel';
import { BrandCatalog } from './components/BrandCatalog';
import { SpecialOfferBanner } from './components/SpecialOfferBanner';
import { ProductCarousel } from './components/ProductCarousel';
import { CartView } from './components/CartView';
import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { UserProfileView } from './components/UserProfileView';
import { ContactView } from './components/ContactView';
import { TermsView } from './components/TermsView';
import { AboutView } from './components/AboutView';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

function MainApp() {
  const { activePage, products, navigateTo } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const recommendedProducts = products.filter((p) => p.isRecommended);
  const specialProducts = products.filter((p) => p.isSpecialOffer);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50/70 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-200 overflow-x-hidden max-w-full w-full">
      {/* Top Header */}
      <Header
        onOpenMenu={() => setMenuOpen(true)}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* Mobile Drawer (Only for mobile/tablet screens when hamburger is clicked) */}
      <MobileDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* Login & Registration Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Checkout & Iranian Gateway Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />

      {/* Desktop Persistent Sidebar + Main Content Layout */}
      <div className="flex-1 flex w-full">
        {/* Persistent Right Sidebar for Desktop / Laptop */}
        <DesktopSidebar onOpenLogin={() => setLoginModalOpen(true)} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full overflow-x-hidden lg:mr-64 xl:mr-72">
          {activePage === 'home' && (
            <div className="max-w-7xl mx-auto px-1.5 sm:px-3 py-3 sm:py-5">
              {/* Top Hero Banner */}
              <HeroBanner />

              {/* Categories Carousel */}
              <CategoriesCarousel />

              {/* Brands Catalog */}
              <BrandCatalog />

              {/* Special Offer Banner */}
              <SpecialOfferBanner />

              {/* Recommended Products Carousel */}
              <ProductCarousel
                title="محصولات پیشنهادی"
                products={recommendedProducts.length > 0 ? recommendedProducts : products.slice(0, 8)}
              />

              {/* Special Deals Carousel */}
              {specialProducts.length > 0 && (
                <ProductCarousel
                  title="تخفیف‌های ویژه"
                  products={specialProducts}
                />
              )}
            </div>
          )}

          {activePage === 'shop' && <ShopView />}
          {activePage === 'product-detail' && <ProductDetailView />}
          {activePage === 'cart' && (
            <CartView onProceedToCheckout={() => setCheckoutModalOpen(true)} />
          )}
          {activePage === 'profile' && <UserProfileView />}
          {activePage === 'contact' && <ContactView />}
          {activePage === 'terms' && <TermsView />}
          {activePage === 'about' && <AboutView />}
          {activePage === 'admin' && <AdminPanel />}
        </main>
      </div>

      {/* Standardized Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
