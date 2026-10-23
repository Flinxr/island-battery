import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { MobileDrawer } from './components/MobileDrawer';
import { LoginModal } from './components/LoginModal';
import { CheckoutModal } from './components/CheckoutModal';
import { HeroBanner } from './components/HeroBanner';
import { CategoriesCarousel } from './components/CategoriesCarousel';
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

      {/* Mobile Drawer */}
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

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activePage === 'home' && (
          <div className="max-w-7xl mx-auto px-1.5 sm:px-3 py-3 sm:py-5">
            {/* Top Hero Banner matching screenshot */}
            <HeroBanner />

            {/* Categories Carousel matching screenshot 145519 */}
            <CategoriesCarousel />

            {/* Special Offer Banner matching screenshot 145152 */}
            <SpecialOfferBanner />

            {/* Recommended Products Carousel matching screenshot 145152 */}
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

      {/* Standardized Footer matching screenshot 145303 */}
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
