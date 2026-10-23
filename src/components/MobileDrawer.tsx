import React, { useState } from 'react';
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

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [expandedCatIds, setExpandedCatIds] = useState<{ [catId: string]: boolean }>({});

  if (!isOpen) return null;

  const handleNav = (page: any, catId?: string, subcat?: string | null) => {
    navigateTo(page, undefined, catId, subcat);
    onClose();
  };

  const toggleCatExpand = (e: React.MouseEvent, catId: string) => {
    e.stopPropagation();
    setExpandedCatIds((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const adminNavItems: { id: AdminTab; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'داشبورد و آمار کلی', icon: LayoutDashboard },
    { id: 'products', label: 'مدیریت محصولات', icon: Package, badge: toPersianDigits(products.length) },
    { id: 'categories', label: 'مدیریت دسته‌بندی‌ها', icon: Layers, badge: toPersianDigits(categories.length) },
    { id: 'orders', label: 'سفارشات ثبت شده', icon: ShoppingBag, badge: toPersianDigits(orders.length) },
    { id: 'users', label: 'کاربران و مشتریان', icon: Users },
    { id: 'banners', label: 'تنظیمات بنرها و ظاهر', icon: ImageIcon },
    { id: 'contact', label: 'اطلاعات تماس و فروشگاه', icon: Phone },
    { id: 'torob', label: 'تنظیمات ترب و درگاه', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Content */}
      <div className="absolute inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out border-l border-sky-100/30 dark:border-gray-800">
        <div>
          {/* Header */}
          <div className="p-4 bg-gradient-to-l from-slate-950 via-blue-900 to-sky-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center border border-sky-400/30">
                {activePage === 'admin' ? (
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                ) : (
                  <LayoutGrid className="w-4 h-4 text-sky-300" />
                )}
              </div>
              <span className="font-extrabold text-base">
                {activePage === 'admin' ? 'پنل مدیریت آیلند باتری' : 'منوی دسترسی آیلند باتری'}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="بستن منو"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Status Bar */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-sky-50/50 dark:bg-gray-800/50">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white font-bold flex items-center justify-center shadow-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      {currentUser.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {toPersianDigits(currentUser.phone)}
                    </p>
                  </div>
                </div>
                {currentUser.role === 'admin' && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 rounded-md">
                    مدیر سیستم
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm hover:brightness-105 active:scale-98 transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>ورود یا ثبت‌نام در سایت</span>
              </button>
            )}
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            {/* If in ADMIN mode: Show Admin Tabs + Return to Site Button */}
            {activePage === 'admin' ? (
              <div className="space-y-1">
                {/* Switch back to store button */}
                <button
                  onClick={() => handleNav('home')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    <span>ورود به سایت (نمای کاربر)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>

                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 border-t border-gray-150 dark:border-gray-800">
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
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-xs'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
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
                              : 'bg-gray-100 dark:bg-gray-750 text-gray-500'
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
              /* Regular Customer Navigation */
              <div className="space-y-1">
                <button
                  onClick={() => handleNav('home')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'home'
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold border border-sky-100 dark:border-sky-900'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Home className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span>خانه</span>
                </button>

                <button
                  onClick={() => handleNav('shop')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'shop'
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold border border-sky-100 dark:border-sky-900'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span>فروشگاه</span>
                </button>

                {/* Styled Categories Accordion with 2-level nested subcategories */}
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutGrid className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                      <span>دسته‌بندی‌های کالا</span>
                    </div>
                    {categoriesOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {categoriesOpen && (
                    <div className="py-1 px-2 bg-gray-50/70 dark:bg-gray-800/40 space-y-1 border-t border-gray-100 dark:border-gray-800 max-h-72 overflow-y-auto">
                      {categories.map((cat) => {
                        const CatIcon = getCategoryIcon(cat.iconName);
                        const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                        const isSubExpanded = Boolean(expandedCatIds[cat.id]);

                        return (
                          <div key={cat.id} className="rounded-lg overflow-hidden bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between px-2.5 py-1.5">
                              <button
                                onClick={() => handleNav('shop', cat.id, null)}
                                className="flex-1 flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-right cursor-pointer"
                              >
                                <div className="w-6 h-6 rounded-md bg-white dark:bg-gray-700 flex items-center justify-center shadow-2xs text-sky-600 dark:text-sky-400 shrink-0">
                                  <CatIcon className="w-3.5 h-3.5" />
                                </div>
                                <span className="truncate">{cat.name}</span>
                              </button>

                              {hasSubs && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleCatExpand(e, cat.id)}
                                  className="p-1 text-gray-400 hover:text-sky-600 transition-colors cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                  title="نمایش زیردسته‌ها"
                                >
                                  {isSubExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Level 2: Nested Subcategories Accordion */}
                            {hasSubs && isSubExpanded && (
                              <div className="pr-7 pl-2 py-1.5 space-y-1 bg-sky-50/50 dark:bg-sky-950/20 border-t border-gray-100 dark:border-gray-700">
                                {cat.subcategories?.map((sub) => (
                                  <button
                                    key={sub}
                                    onClick={() => handleNav('shop', cat.id, sub)}
                                    className="w-full text-right px-2.5 py-1 rounded-md text-[11px] text-gray-600 dark:text-gray-300 hover:text-sky-700 hover:bg-sky-100/70 dark:hover:bg-sky-900/40 transition-colors cursor-pointer flex items-center justify-between"
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

                <button
                  onClick={() => handleNav('cart')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'cart'
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold border border-sky-100 dark:border-sky-900'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <span>سبد خرید</span>
                  </div>
                  {totalCartCount > 0 && (
                    <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                      {toPersianDigits(totalCartCount)}
                    </span>
                  )}
                </button>

                {currentUser && (
                  <button
                    onClick={() => handleNav('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                      activePage === 'profile'
                        ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold border border-sky-100 dark:border-sky-900'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <UserIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    <span>پروفایل و پیگیری سفارش‌ها</span>
                  </button>
                )}

                <button
                  onClick={() => handleNav('contact')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'contact'
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold border border-sky-100 dark:border-sky-900'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Phone className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span>تماس با ما</span>
                </button>

                <button
                  onClick={() => handleNav('terms')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'terms'
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold border border-sky-100 dark:border-sky-900'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span>قوانین و مقررات</span>
                </button>

                <button
                  onClick={() => handleNav('about')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activePage === 'about'
                      ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-bold border border-sky-100 dark:border-sky-900'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span>درباره فروشگاه</span>
                </button>

                {/* Admin Panel Direct Link -> ورود به مدیریت */}
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl mt-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-950" />
                      <span>ورود به مدیریت</span>
                    </div>
                    <ArrowRight className="w-4 h-4 rotate-180 text-slate-950" />
                  </button>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>تغییر حالت تم:</span>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-500" />}
              <span>{isDarkMode ? 'حالت روز' : 'حالت شب'}</span>
            </button>
          </div>

          {currentUser && (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج از حساب کاربری</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
