import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Palette,
  Phone,
  Settings,
  ShieldCheck,
  Home,
  Store,
  User as UserIcon,
  Tag,
  Sun,
  Moon,
  LogOut,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Info,
  FileText,
  ShoppingCart,
  Award,
} from 'lucide-react';
import { useStore, AdminTab } from '../context/StoreContext';
import { getCategoryIcon } from '../utils/iconRegistry';
import { toPersianDigits } from '../utils/pricing';

interface DesktopSidebarProps {
  onOpenLogin: () => void;
}

export function DesktopSidebar({ onOpenLogin }: DesktopSidebarProps) {
  const {
    activePage,
    adminActiveTab,
    setAdminActiveTab,
    products,
    categories,
    brands,
    orders,
    cart,
    currentUser,
    navigateTo,
    isDarkMode,
    toggleDarkMode,
    logout,
    settings,
  } = useStore();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [expandedCatIds, setExpandedCatIds] = useState<{ [catId: string]: boolean }>({});

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleCatExpand = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    setExpandedCatIds((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const adminNavItems: { id: AdminTab; label: string; icon: any; count?: number }[] = [
    { id: 'dashboard', label: 'داشبورد و آمار کلی', icon: LayoutDashboard },
    { id: 'products', label: 'مدیریت محصولات', icon: Package, count: products.length },
    { id: 'categories', label: 'مدیریت دسته‌بندی‌ها', icon: Layers, count: categories.length },
    { id: 'brands', label: 'برندها و کاتالوگ', icon: Tag, count: brands.length },
    { id: 'orders', label: 'سفارشات ثبت شده', icon: ShoppingBag, count: orders.length },
    { id: 'users', label: 'کاربران و مشتریان', icon: Users },
    { id: 'theme', label: 'تم، ظاهر و بنرها', icon: Palette },
    { id: 'contact', label: 'اطلاعات فروشگاه', icon: Phone },
    { id: 'torob', label: 'تنظیمات', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 fixed top-0 right-0 h-screen z-40 border-l border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 overflow-y-auto no-scrollbar select-none transition-colors">
      {/* Top Branding Section: Island Battery Brand */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900">
        <div
          onClick={() => navigateTo('home')}
          className="cursor-pointer group flex items-center gap-2.5"
        >
          <img
            src="/assets/aistudio/island-battery-logo_fbc20e25.webp"
            alt="Island Battery Logo"
            className="w-9 h-9 xl:w-10 xl:h-10 object-contain shrink-0 group-hover:scale-105 transition-transform drop-shadow-xs"
          />
          <div>
            <h1 className="font-black text-base xl:text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors tracking-tight">
              {settings.storeName || 'آیلند باتری'}
            </h1>
            <span className="text-[10px] xl:text-[11px] text-amber-600 dark:text-amber-400 font-extrabold block mt-0.5 font-mono" dir="ltr">
              Island Battery
            </span>
          </div>
        </div>
      </div>

      {/* Top Section: Profile & Site Switch */}
      <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/90">
        {currentUser ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                {currentUser.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </h4>
                  {currentUser.role === 'admin' && (
                    <span className="px-1.5 py-0.2 text-[9px] font-black rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 shrink-0">
                      مدیر
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5" dir="ltr">
                  {toPersianDigits(currentUser.phone)}
                </p>
              </div>
            </div>

            {/* Quick action button for admins */}
            {currentUser.role === 'admin' && (
              <div>
                {activePage === 'admin' ? (
                  <button
                    onClick={() => navigateTo('home')}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-sky-200/80 dark:border-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95"
                    title="ورود به نمای عادی فروشگاه"
                  >
                    <Store className="w-3.5 h-3.5 text-sky-500" />
                    <span>ورود به سایت (نمای کاربر)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ورود به پنل مدیریت</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>ورود / عضویت در سایت</span>
          </button>
        )}
      </div>

      {/* Navigation Body */}
      <nav className="flex-1 p-2.5 space-y-1 text-xs font-semibold overflow-y-auto no-scrollbar">
        {/* ADMIN MODE VIEW */}
        {activePage === 'admin' ? (
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500">
              بخش‌های مدیریت آیلند باتری:
            </div>

            {adminNavItems.map((item) => {
              const ItemIcon = item.icon;
              const isActive = adminActiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-2xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ItemIcon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {toPersianDigits(item.count)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          /* REGULAR STORE NAVIGATION - Unified Sleek & Monochrome */
          <div className="space-y-0.5">
            <button
              onClick={() => navigateTo('home')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePage === 'home'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>خانه</span>
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePage === 'shop'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>فروشگاه محصولات</span>
            </button>

            {/* Categories Accordion */}
            <div className="rounded-xl overflow-hidden my-1 bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-xs font-bold"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>دسته‌بندی‌های کالا</span>
                </div>
                {categoriesOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {categoriesOpen && (
                <div className="py-1 px-1.5 space-y-1 max-h-56 overflow-y-auto no-scrollbar">
                  {categories.map((cat) => {
                    const CatIcon = getCategoryIcon(cat.iconName);
                    const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                    const isSubExpanded = expandedCatIds[cat.id];

                    return (
                      <div
                        key={cat.id}
                        className="rounded-lg overflow-hidden bg-white dark:bg-slate-800/60"
                      >
                        <div className="flex items-center justify-between px-2 py-1.5">
                          <button
                            onClick={() => navigateTo('shop', undefined, cat.id, null)}
                            className="flex-1 flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-right cursor-pointer"
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

                        {/* Nested Subcategories */}
                        {hasSubs && isSubExpanded && (
                          <div className="pr-6 pl-2 py-1 space-y-0.5 bg-sky-50/40 dark:bg-sky-950/20">
                            {cat.subcategories?.map((sub) => (
                              <button
                                key={sub}
                                onClick={() => navigateTo('shop', undefined, cat.id, sub)}
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

            {/* Brands Accordion / Catalog Quick Access */}
            <div className="rounded-xl overflow-hidden my-1 bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => setBrandsOpen(!brandsOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer text-xs font-bold"
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>برندها</span>
                </div>
                {brandsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {brandsOpen && (
                <div className="p-2 grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => navigateTo('shop', undefined, undefined, undefined, b.name)}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-300 text-[10px] font-bold text-center truncate transition-colors cursor-pointer shadow-2xs"
                    >
                      {b.nameFa || b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('cart')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePage === 'cart'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4 shrink-0" />
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
                onClick={() => navigateTo('profile')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePage === 'profile'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <UserIcon className="w-4 h-4 shrink-0" />
                <span>سفارش‌های من و حساب</span>
              </button>
            )}

            <button
              onClick={() => navigateTo('contact')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePage === 'contact'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-2xs'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>تماس با ما و پشتیبانی</span>
            </button>

            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-0.5">
              <button
                onClick={() => navigateTo('about')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-[11px] cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>درباره فروشگاه</span>
              </button>

              <button
                onClick={() => navigateTo('terms')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-[11px] cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>قوانین و مقررات</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Footer Actions: Dark Mode Toggle & Logout */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/60 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="text-[11px]">حالت نمایش:</span>
          <button
            onClick={toggleDarkMode}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-750"
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
            onClick={logout}
            className="w-full py-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از حساب</span>
          </button>
        )}
      </div>
    </aside>
  );
}
