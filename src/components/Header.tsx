import React, { useState } from 'react';
import {
  Menu,
  Search,
  ShoppingCart,
  User as UserIcon,
  Moon,
  Sun,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toPersianDigits } from '../utils/pricing';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenLogin: () => void;
}

export function Header({ onOpenMenu, onOpenLogin }: HeaderProps) {
  const {
    cart,
    currentUser,
    navigateTo,
    activePage,
    searchQuery,
    setSearchQuery,
    isDarkMode,
    toggleDarkMode,
    isSyncingCart,
    settings,
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (activePage !== 'shop') {
      navigateTo('shop');
    }
  };

  const handleProfileClick = () => {
    if (!currentUser) {
      onOpenLogin();
    } else {
      navigateTo('profile');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full lg:w-[calc(100%-16rem)] xl:w-[calc(100%-18rem)] lg:mr-64 xl:mr-72 bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xs border-b border-sky-100 dark:border-slate-800/80 transition-colors duration-200">
      {/* Main Single-Row Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Right Section: Mobile Hamburger & Mobile Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenMenu}
            aria-label="باز کردن منو"
            className="lg:hidden p-2 rounded-2xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-750 text-sky-800 dark:text-sky-200 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-sky-100 dark:border-slate-700"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo & Name with uploaded customer logo */}
          <div
            onClick={() => navigateTo('home')}
            className="cursor-pointer flex items-center gap-2 select-none group shrink-0"
          >
            <img
              src="/assets/aistudio/island-battery-logo_fbc20e25.webp"
              alt="Island Battery Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 group-hover:scale-105 transition-transform drop-shadow-xs"
            />
            <div className="flex flex-col justify-center">
              <span className="font-black text-base sm:text-lg tracking-tight leading-none text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                {settings.storeName || 'آیلند باتری'}
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-extrabold leading-tight mt-0.5 font-mono" dir="ltr">
                Island Battery
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activePage === 'home'
                  ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-black border border-sky-200/80 dark:border-slate-700'
                  : 'hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-sky-600'
              }`}
            >
              خانه
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activePage === 'shop'
                  ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-black border border-sky-200/80 dark:border-slate-700'
                  : 'hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-sky-600'
              }`}
            >
              فروشگاه
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activePage === 'contact'
                  ? 'bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-black border border-sky-200/80 dark:border-slate-700'
                  : 'hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-sky-600'
              }`}
            >
              تماس با ما
            </button>
          </nav>
        </div>

        {/* Center Section: Compact Integrated Search Bar for Desktop (No extra thick row!) */}
        {activePage !== 'admin' && (
          <div className="hidden lg:flex flex-1 max-w-md mx-3">
            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-full border border-sky-200/80 dark:border-slate-700/80 pr-3.5 pl-1.5 py-1 transition-all focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-sky-400 focus-within:bg-white dark:focus-within:bg-slate-900"
            >
              <Search className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0 ml-2" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="جستجوی باتری یا قطعات..."
                className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer ml-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 px-3 py-1 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer"
              >
                جستجو
              </button>
            </form>
          </div>
        )}

        {/* Left Section: Dark Mode, Cart & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? 'روشن کردن تم' : 'تاریک کردن تم'}
            className="p-2 sm:p-2.5 rounded-2xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-700 dark:text-sky-200 border border-sky-200/70 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
            title={isDarkMode ? 'حالت روز' : 'حالت شب'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-sky-600" />
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => navigateTo('cart')}
            aria-label="سبد خرید"
            className="relative p-2 sm:p-2.5 rounded-2xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-700 dark:text-sky-200 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-sky-200/70 dark:border-slate-700"
            title="مشاهده سبد خرید"
          >
            <ShoppingCart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSyncingCart ? 'animate-bounce' : ''}`} />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs">
                {toPersianDigits(totalCartCount)}
              </span>
            )}
          </button>

          {/* User Profile Button */}
          <button
            onClick={handleProfileClick}
            aria-label="حساب کاربری"
            className="p-2 sm:p-2.5 rounded-2xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-700 dark:text-sky-200 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-sky-200/70 dark:border-slate-700"
            title={currentUser ? currentUser.name : 'ورود / عضویت'}
          >
            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            {currentUser && (
              <span className="text-xs font-semibold max-w-[80px] truncate hidden md:inline text-slate-700 dark:text-slate-200">
                {currentUser.name}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Only Search Bar (Hidden on Desktop to prevent thick navigation bar) */}
      {activePage !== 'admin' && (
        <div className="lg:hidden px-3 py-2 border-t border-sky-50 dark:border-slate-800/80">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-slate-50 dark:bg-slate-800 rounded-full border border-sky-200 dark:border-slate-700 shadow-xs pr-3 pl-1.5 py-1 focus-within:ring-2 focus-within:ring-sky-400"
          >
            <Search className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0 ml-2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="جستجوی باتری یا قطعات..."
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="shrink-0 px-3 py-1 rounded-full bg-sky-500 text-white text-xs font-bold active:scale-95 cursor-pointer"
            >
              جستجو
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
