import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function BrandCatalog() {
  const { brands, navigateTo, selectedBrandId } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!brands || brands.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-[98%] sm:w-full mx-auto my-4 sm:my-7 select-none">
      {/* Header with Title and Minimal Arrow Buttons */}
      <div className="flex items-center justify-between mb-3.5 sm:mb-4 px-1">
        {/* Right: Title with vertical bar */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 sm:h-7 bg-sky-500 rounded-full" />
          <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
            برندهای برتر قطعات و لوازم جانبی
          </h2>
        </div>

        {/* Left: Minimal Circular Arrow Controls & View All */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('right')}
            aria-label="اسکرول برندها به راست"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sky-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sky-800 dark:text-sky-300 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => scroll('left')}
            aria-label="اسکرول برندها به چپ"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sky-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-sky-800 dark:text-sky-300 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Smooth Scrollable Carousel - Identical to Categories Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1.5 px-1 scroll-smooth"
      >
        {brands.map((b) => {
          const isSelected = selectedBrandId === b.name || selectedBrandId === b.nameFa;
          const logoSrc = b.logo || b.logoUrl;

          return (
            <button
              key={b.id}
              onClick={() => navigateTo('shop', undefined, undefined, undefined, b.name)}
              className={`group shrink-0 flex flex-col items-center justify-center w-24 sm:w-32 h-28 sm:h-32 rounded-2xl sm:rounded-3xl transition-all duration-300 cursor-pointer p-2.5 ${
                isSelected
                  ? 'bg-sky-100/80 dark:bg-sky-950/80 border-2 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.3)] scale-102'
                  : 'bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-800 shadow-xs hover:shadow-[0_0_18px_rgba(56,189,248,0.2)] hover:border-sky-400 dark:hover:border-sky-500 hover:-translate-y-1'
              }`}
            >
              {/* Direct Logo or Letter Icon */}
              <div className="flex items-center justify-center mb-1.5 h-10 w-10">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={b.name}
                    className="max-h-9 max-w-9 object-contain group-hover:scale-110 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-700 dark:to-slate-800 border border-sky-200/60 dark:border-slate-600/60 flex items-center justify-center text-sky-800 dark:text-sky-200 font-black text-sm group-hover:scale-110 transition-transform">
                    {b.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Slim, refined titles underneath */}
              <span
                className={`text-[11px] sm:text-xs font-bold text-center px-1 truncate max-w-full tracking-tight transition-colors ${
                  isSelected
                    ? 'text-sky-900 dark:text-white'
                    : 'text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-300'
                }`}
              >
                {b.nameFa || b.name}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono text-center truncate max-w-full">
                {b.englishName || b.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
