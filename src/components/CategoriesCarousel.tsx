import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getCategoryIcon } from '../utils/iconRegistry';

export function CategoriesCarousel() {
  const { categories, navigateTo, selectedCategoryId } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

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
        {/* Right: Title with vertical blue bar */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-6 sm:h-7 bg-gradient-to-b from-sky-400 to-blue-600 rounded-full" />
          <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
            دسته‌بندی‌های کالا
          </h2>
        </div>

        {/* Left: Minimal Circular Arrow Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('right')}
            aria-label="اسکرول به راست"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sky-200 dark:border-sky-900/60 bg-white dark:bg-gray-800 text-sky-800 dark:text-sky-300 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-sky-950/40 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => scroll('left')}
            aria-label="اسکرول به چپ"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sky-200 dark:border-sky-900/60 bg-white dark:bg-gray-800 text-sky-800 dark:text-sky-300 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-sky-950/40 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Smooth Scrollable Carousel */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1.5 px-1 scroll-smooth"
      >
        {categories.map((cat) => {
          const CatIcon = getCategoryIcon(cat.iconName);
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => navigateTo('shop', undefined, cat.id)}
              className={`group shrink-0 flex flex-col items-center justify-center w-24 sm:w-32 h-28 sm:h-32 rounded-2xl sm:rounded-3xl transition-all duration-300 cursor-pointer p-2.5 ${
                isSelected
                  ? 'bg-sky-100/80 dark:bg-sky-950/80 border-2 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.3)] scale-102'
                  : 'bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-slate-800 shadow-xs hover:shadow-[0_0_18px_rgba(56,189,248,0.2)] hover:border-sky-400 dark:hover:border-sky-500 hover:-translate-y-1'
              }`}
            >
              {/* Single unified box - Direct Icon without inner background box */}
              <div className="flex items-center justify-center mb-2">
                <CatIcon className={`w-8 h-8 sm:w-10 sm:h-10 stroke-[1.8] transition-transform duration-200 group-hover:scale-110 ${
                  isSelected
                    ? 'text-sky-700 dark:text-sky-300'
                    : 'text-sky-600 dark:text-sky-400'
                }`} />
              </div>

              {/* Slim, refined title underneath */}
              <span className={`text-[11px] sm:text-xs font-bold text-center px-1 truncate max-w-full tracking-tight transition-colors ${
                isSelected
                  ? 'text-sky-900 dark:text-white'
                  : 'text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-300'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
