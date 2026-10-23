import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function HeroBanner() {
  const { settings, navigateTo } = useStore();
  const banner = settings.heroBanner;

  return (
    <div className="relative w-[98%] sm:w-full mx-auto overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl border border-sky-500/20 my-2 sm:my-3">
      {/* Background with vibrant blue gradient and subtle texture */}
      <div
        className="relative min-h-[140px] sm:min-h-[180px] md:min-h-[210px] flex items-center p-4 sm:p-7 md:p-8 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${banner?.bgGradientFrom || '#0284c7'} 0%, #0369a1 40%, ${banner?.bgGradientTo || '#0f172a'} 100%)`,
        }}
      >
        {/* Background Image Overlay with dark fading */}
        {banner?.imageUrl && (
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-25 select-none pointer-events-none"
          />
        )}

        {/* Ambient subtle light blue glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-sky-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Text Content - Compact and refined */}
        <div className="relative z-10 max-w-2xl text-white space-y-2 sm:space-y-3">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight drop-shadow-md">
            {banner?.title || 'فروشگاه تخصصی آیلند باتری'}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-sky-100/90 leading-relaxed font-normal max-w-xl line-clamp-2 sm:line-clamp-none">
            {banner?.subtitle ||
              'مرجع تخصصی باتری‌های تقویت شده اورجینال، نمایشگرها و قطعات تخصصی موبایل؛ انتخابی هوشمندانه از برترین برندها'}
          </p>

          <div className="pt-1 sm:pt-2">
            <button
              onClick={() => {
                if (banner?.buttonLink?.startsWith('http')) {
                  window.location.href = banner.buttonLink;
                } else {
                  navigateTo('shop');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-white to-sky-50 text-blue-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:bg-sky-100 active:scale-95 transition-all cursor-pointer group border border-white/80"
            >
              <span>{banner?.buttonText || 'مشاهده و خرید باتری‌ها'}</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
