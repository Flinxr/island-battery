import React from 'react';
import { Truck, Headphones, CreditCard, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function Footer() {
  const { navigateTo, settings } = useStore();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-sky-100 dark:border-slate-800 mt-8 py-5 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4">
        {/* 5 Trust Badges - Guaranteed Single Row on all devices including mobile */}
        <div className="grid grid-cols-5 items-start justify-items-center gap-1 sm:gap-4 py-2 w-full">
          {/* 1. ارسال فوری */}
          <div className="flex flex-col items-center text-center group cursor-default w-full">
            <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-1 sm:mb-1.5 shadow-xs border border-sky-100 dark:border-sky-900/40 group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[1.75]" />
            </div>
            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-800 dark:text-slate-100 text-center leading-tight">
              ارسال فوری
            </span>
          </div>

          {/* 2. پشتیبانی تخصصی */}
          <div className="flex flex-col items-center text-center group cursor-default w-full">
            <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-1 sm:mb-1.5 shadow-xs border border-sky-100 dark:border-sky-900/40 group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[1.75]" />
            </div>
            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-800 dark:text-slate-100 text-center leading-tight">
              پشتیبانی تخصصی
            </span>
          </div>

          {/* 3. درگاه پرداخت ایمن */}
          <div className="flex flex-col items-center text-center group cursor-default w-full">
            <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-1 sm:mb-1.5 shadow-xs border border-sky-100 dark:border-sky-900/40 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[1.75]" />
            </div>
            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-800 dark:text-slate-100 text-center leading-tight">
              پرداخت امن
            </span>
          </div>

          {/* 4. ضمانت اصالت */}
          <div className="flex flex-col items-center text-center group cursor-default w-full">
            <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-1 sm:mb-1.5 shadow-xs border border-sky-100 dark:border-sky-900/40 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[1.75]" />
            </div>
            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-800 dark:text-slate-100 text-center leading-tight">
              ضمانت اصالت
            </span>
          </div>

          {/* 5. خرید باتری */}
          <div className="flex flex-col items-center text-center group cursor-default w-full">
            <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-1 sm:mb-1.5 shadow-xs border border-sky-100 dark:border-sky-900/40 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 stroke-[1.75]" />
            </div>
            <span className="font-bold text-[10px] sm:text-xs md:text-sm text-slate-800 dark:text-slate-100 text-center leading-tight">
              خرید مطمئن
            </span>
          </div>
        </div>

        {/* Minimal Divider */}
        <div className="border-t border-sky-100/70 dark:border-slate-800" />

        {/* Compact Links & Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-semibold text-slate-600 dark:text-slate-300">
            <button onClick={() => navigateTo('home')} className="hover:text-sky-600 transition-colors cursor-pointer">
              خانه
            </button>
            <button onClick={() => navigateTo('shop')} className="hover:text-sky-600 transition-colors cursor-pointer">
              فروشگاه
            </button>
            <button onClick={() => navigateTo('cart')} className="hover:text-sky-600 transition-colors cursor-pointer">
              سبد خرید
            </button>
            <button onClick={() => navigateTo('profile')} className="hover:text-sky-600 transition-colors cursor-pointer">
              پروفایل
            </button>
            <button onClick={() => navigateTo('terms')} className="hover:text-sky-600 transition-colors cursor-pointer">
              قوانین
            </button>
            <button onClick={() => navigateTo('contact')} className="hover:text-sky-600 transition-colors cursor-pointer">
              تماس با ما
            </button>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            © 2026 {settings.storeName || 'آیلند باتری'} | island battery. تمام حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
