import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { Product } from '../types/store';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  filterType?: 'recommended' | 'special' | 'all';
}

export function ProductCarousel({ title, products }: ProductCarouselProps) {
  const { navigateTo } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="w-[98%] sm:w-full mx-auto my-4 sm:my-7 select-none">
      {/* Header - Strictly single-line layout */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 px-1 gap-2">
        {/* Right side: Title with vertical blue bar */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-1.5 h-6 sm:h-7 bg-sky-500 rounded-full shrink-0" />
          <h2 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap truncate">
            {title}
          </h2>
        </div>

        {/* Left side: Minimal arrows and "مشاهده همه" */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span className="hidden sm:inline">مشاهده همه محصولات</span>
            <span className="sm:hidden">مشاهده همه</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('right')}
              aria-label="محصول قبلی"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-sky-300 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => scroll('left')}
              aria-label="محصول بعدی"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sky-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-sky-300 flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Smooth Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact={true} />
        ))}
      </div>
    </section>
  );
}
