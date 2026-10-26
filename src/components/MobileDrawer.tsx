import React, { useState, useEffect } from 'react';
import {
  X,
  Home,
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
  Phone,
  FileText,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  LogOut,
  Moon,
  Sun,
  LayoutGrid,
  LayoutDashboard,
  Package,
  Layers,
  Users,
  Image as ImageIcon,
  Settings,
  ArrowRight,
  Store,
  Tag,
  Palette,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AdminTab } from '../context/StoreContext';
import { getCategoryIcon } from '../utils/iconRegistry';
import { toPersianDigits } from '../utils/pricing';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export function MobileDrawer({ isOpen, onClose, onOpenLogin }: MobileDrawerProps) {
  const {
    products,
    categories,
    brands,
    orders,
    currentUser,
    logout,
    navigateTo,
    activePage,
    adminActiveTab,
    setAdminActiveTab,
    cart,
    isDarkMode,
    toggleDarkMode,
  } = useStore();

  const [animateIn, setAnimateIn] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [expandedCatIds, setExpandedCatIds] = useState<{ [catId: string]: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  const handleNav = (page: any, catId?: string, subcat?: string | null, brand?: string) => {
    navigateTo(page, undefined, catId, subcat, brand);
    handleClose();
  };

  const toggleCatExpand = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    setExpandedCatIds((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const adminNavItems: { id: AdminTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'داشبورد و آمار کلی', icon: LayoutDashboard },
    { id: 'products', label: 'مدیریت محصولات', icon: Package, badge: toPersianDigits(products.length) },
    { id: 'categories', label: 'دسته‌بندی‌ها', icon: Layers, badge: toPersianDigits(categories.length) },
    { id: 'brands', label: 'برندهای تجاری', icon: Tag, badge: toPersianDigits(brands.length) },
    { id: 'orders', label: 'سفارشات ثبت شده', icon: ShoppingBag, badge: toPersianDigits(orders.length) },
    { id: 'users', label: 'کاربران و مشتریان', icon: Users },
    { id: 'theme', label: 'تم، ظاهر و بنرها', icon: Palette },
    { id: 'contact', label: 'اطلاعات فروشگاه', icon: Phone },
    { id: 'torob', label: 'تنظیمات', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Smooth fading backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Gentle Slide-in Drawer from Right with deceleration curve */}
      <div
        className={`fixed inset-y-0 right-0 max-w-[290px] sm:max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out border-l border-slate-200/80 dark:border-slate-800 select-none ${
          animateIn ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Unified Compact Top Header: Profile + Close button merged into one sleek bar */}
          <div className="p-3 sm:p-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/90 flex items-center justify-between gap-2">
            {currentUser ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </h4>
                    {currentUser.role === 'admin' && (
                      <span className="px-1.5 py-0.2 text-[9px] font-black rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 shrink-0">
                        ادمین
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5" dir="ltr">
                    {toPersianDigits(currentUser.phone)}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleClose();
                  onOpenLogin();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>ورود / عضویت</span>
              </button>
            )}

            <div className="flex items-center gap-1 shrink-0">
              {/* If in admin page, compact "ورود به سایت" button right in the top header */}
              {activePage === 'admin' && (
                <button
                  onClick={() => handleNav('home')}
                  className="px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                  title="بازگشت به نمای عادی فروشگاه"
                >
                  <Store className="w-3 h-3" />
                  <span>نمای سایت</span>
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={handleClose}
                aria-label="بستن منو"
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clean, De-cluttered Navigation Menu */}
          <nav className="p-2.5 space-y-1 text-xs font-semibold">
            {/* ADMIN MODE */}
            {activePage === 'admin' ? (
              <div className="space-y-1 pt-1">
                <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  بخش‌های پنل مدیریت:
                </div>

                {adminNavItems.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = adminActiveTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setAdminActiveTab(item.id);
                        handleClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-2xs'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ItemIcon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* REGULAR STORE NAVIGATION - Ultra Clean & Minimal */
              <div className="space-y-0.5 pt-1">
                <button
                  onClick={() => handleNav('home')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'home'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-extrabold border border-sky-200/60 dark:border-sky-800/60'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Home className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>خانه</span>
                </button>

                <button
                  onClick={() => handleNav('shop')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'shop'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-extrabold border border-sky-200/60 dark:border-sky-800/60'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>فروشگاه محصولات</span>
                </button>

                {/* Categories Accordion with 2-level nested subcategories */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 overflow-hidden my-1 shadow-2xs">
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutGrid className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="font-semibold text-xs">دسته‌بندی‌های کالا</span>
                    </div>
                    {categoriesOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {categoriesOpen && (
                    <div className="py-1 px-1.5 bg-white/50 dark:bg-slate-900/60 space-y-1 border-t border-slate-200/70 dark:border-slate-800 max-h-64 overflow-y-auto no-scrollbar">
                      {categories.map((cat) => {
                        const CatIcon = getCategoryIcon(cat.iconName);
                        const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                        const isSubExpanded = Boolean(expandedCatIds[cat.id]);

                        return (
                          <div
                            key={cat.id}
                            className="rounded-xl overflow-hidden bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-750 shadow-2xs"
                          >
                            <div className="flex items-center justify-between px-2 py-1.5">
                              <button
                                onClick={() => handleNav('shop', cat.id, null)}
                                className="flex-1 flex items-center gap-2 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-right cursor-pointer"
                              >
                                <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                                  <CatIcon className="w-3 h-3" />
                                </div>
                                <span className="truncate">{cat.name}</span>
                              </button>

                              {hasSubs && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleCatExpand(e, cat.id)}
                                  className="p-1 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer rounded-md"
                                  title="نمایش زیردسته‌ها"
                                >
                                  {isSubExpanded ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Level 2: Nested Subcategories */}
                            {hasSubs && isSubExpanded && (
                              <div className="pr-6 pl-2 py-1 space-y-0.5 bg-sky-50/40 dark:bg-sky-950/20 border-t border-slate-200/60 dark:border-slate-700/60">
                                {cat.subcategories?.map((sub) => (
                                  <button
                                    key={sub}
                                    onClick={() => handleNav('shop', cat.id, sub)}
                                    className="w-full text-right px-2 py-1 rounded-md text-[10px] text-slate-600 dark:text-slate-300 hover:text-sky-700 hover:bg-sky-100/70 dark:hover:bg-sky-900/40 transition-colors cursor-pointer flex items-center justify-between"
                                  >
                                    <span>{sub}</span>
                                    <span className="text-sky-500 font-bold">←</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Brands Accordion for Mobile and Tablet Views */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 overflow-hidden my-1 shadow-2xs">
                  <button
                    onClick={() => setBrandsOpen(!brandsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="font-semibold text-xs">برندها</span>
                    </div>
                    {brandsOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {brandsOpen && (
                    <div className="p-2 bg-white/50 dark:bg-slate-900/60 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                      {brands.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => handleNav('shop', undefined, undefined, b.name)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-300 text-[10px] font-bold border border-slate-200/70 dark:border-slate-700/70 text-center truncate transition-colors cursor-pointer shadow-2xs"
                        >
                          {b.nameFa || b.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleNav('cart')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'cart'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-extrabold border border-sky-200/60 dark:border-sky-800/60'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingCart className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>سبد خرید</span>
                  </div>
                  {totalCartCount > 0 && (
                    <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                      {toPersianDigits(totalCartCount)}
                    </span>
                  )}
                </button>

                {currentUser && (
                  <button
                    onClick={() => handleNav('profile')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                      activePage === 'profile'
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-extrabold border border-sky-200/60 dark:border-sky-800/60'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>سفارش‌های من و حساب</span>
                  </button>
                )}

                <button
                  onClick={() => handleNav('contact')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'contact'
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-extrabold border border-sky-200/60 dark:border-sky-800/60'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Phone className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>تماس با ما و پشتیبانی</span>
                </button>

                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
                  <button
                    onClick={() => handleNav('about')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-[11px] cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>درباره فروشگاه</span>
                  </button>

                  <button
                    onClick={() => handleNav('terms')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-[11px] cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>قوانین و مقررات</span>
                  </button>
                </div>

                {/* Direct Admin Link for Admin Users */}
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl mt-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-bold text-xs shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-950" />
                      <span>ورود به پنل مدیریت</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180 text-slate-950" />
                  </button>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="text-[11px]">حالت نمایش:</span>
            <button
              onClick={toggleDarkMode}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-2xs"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>روز</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-500" />
                  <span>شب</span>
                </>
              )}
            </button>
          </div>

          {currentUser && (
            <button
              onClick={() => {
                logout();
                handleClose();
              }}
              className="w-full py-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از حساب</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
