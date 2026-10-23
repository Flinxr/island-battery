import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Flame, Sparkles } from 'lucide-react';

export function SpecialOfferBanner() {
  const { settings, navigateTo } = useStore();
  const banner = settings.specialBanner;

  return (
    <div
      className="relative w-[98%] sm:w-full mx-auto my-4 sm:my-7 rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden text-white shadow-lg border border-sky-400/20"
      style={{
        background: `linear-gradient(135deg, ${banner?.bgGradientFrom || '#0284c7'} 0%, #1d4ed8 50%, ${banner?.bgGradientTo || '#1e3a8a'} 100%)`,
      }}
    >
      {/* Decorative background light circle */}
      <div className="absolute -bottom-12 -left-12 w-60 h-60 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-white shadow-xs"
            style={{ backgroundColor: '#697b8f' }}
          >
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span>فروش ویژه هفتگی باتری و قطعات</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
            {banner?.title || 'پیشنهاد شگفت‌انگیز آیلند باتری'}
          </h3>
          <p className="text-xs sm:text-base text-sky-100/90 leading-relaxed font-normal">
            {banner?.subtitle ||
              'تخفیف‌های استثنایی روی باتری‌های تقویت شده اورجینال، شارژرهای فست و اکسسوری‌های پرچمدار.'}
          </p>
        </div>

        <button
          onClick={() => navigateTo('shop')}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-4 rounded-2xl bg-white text-blue-900 font-black text-xs sm:text-sm shadow-md hover:bg-sky-50 active:scale-95 transition-all cursor-pointer group"
          style={{ width: '173.656px', height: '35px' }}
        >
          <span>{banner?.buttonText || 'مشاهده محصولات'}</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1.5 text-blue-600" />
        </button>
      </div>
    </div>
  );
}
