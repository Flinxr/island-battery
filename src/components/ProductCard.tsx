import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { calculateDiscount, formatToman, toPersianDigits } from '../utils/pricing';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart, navigateTo, currentUser } = useStore();

  const isPartner = currentUser?.role === 'partner';
  const hasPartnerPrice = isPartner && product.partnerPrice !== undefined && product.partnerPrice > 0;

  const activePrice = hasPartnerPrice
    ? product.partnerPrice!
    : product.salePrice && product.salePrice < product.price
    ? product.salePrice
    : product.price;

  const discountPercent = calculateDiscount(product.price, product.salePrice);
  const isOutOfStock = product.stock <= 0;
  const isVariable = product.type === 'variable' && product.variants && product.variants.length > 0;

  const handleCardClick = () => {
    navigateTo('product-detail', product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (isVariable) {
      navigateTo('product-detail', product.id);
      return;
    }
    addToCart(product);
  };

  return (
    <article
      onClick={handleCardClick}
      data-testid={`product-card-${product.id}`}
      className={`product group relative bg-white dark:bg-gray-800/90 rounded-2xl sm:rounded-3xl border border-sky-100 dark:border-slate-800 shadow-xs hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-[0_0_20px_rgba(56,189,248,0.22)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer select-none ${
        compact ? 'w-56 sm:w-64 shrink-0' : 'w-full'
      }`}
    >
      {/* Product Image Container - Clean Without Overlays */}
      <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 p-0 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3.5 py-1.5 bg-gray-900/90 text-white text-xs font-black rounded-xl">
              ناموجود
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1.5">
          {/* Product Title */}
          <h3 className="product-title font-bold text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {product.title}
          </h3>

          {/* Short Description - Expanded to 2 lines */}
          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 font-normal leading-tight">
            {product.shortDescription || 'باتری اصلی و اورجینال با کیفیت عالی و مهلت تست'}
          </p>

          {/* Side-by-Side Badges Row (بغل دست همدیگه) */}
          {(discountPercent > 0 || product.isSpecialOffer || hasPartnerPrice) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {discountPercent > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800 shrink-0">
                  {toPersianDigits(discountPercent)}٪ تخفیف
                </span>
              )}
              {product.isSpecialOffer && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800 shrink-0">
                  پیشنهاد ویژه
                </span>
              )}
              {hasPartnerPrice && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 shrink-0">
                  همکاری
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-2 pt-2.5 border-t border-sky-100/70 dark:border-slate-700/60 flex items-center justify-between gap-1">
          {/* Prices Area */}
          <div className="flex flex-col">
            {hasPartnerPrice ? (
              /* 3-tier Price for Partners: Original & Sale line-through in grey, Partner price in bold highlighted color */
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 line-through">
                  <span>{toPersianDigits(product.price.toLocaleString('en-US'))}</span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span>/ {toPersianDigits(product.salePrice.toLocaleString('en-US'))}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">
                    {toPersianDigits(activePrice.toLocaleString('en-US'))}
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1 py-0.2 rounded">
                    (همکاری)
                  </span>
                </div>
              </div>
            ) : (
              /* Normal Customer 2-tier pricing */
              <>
                {discountPercent > 0 && (
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 line-through decoration-rose-500/60 font-medium">
                    {toPersianDigits(product.price.toLocaleString('en-US'))}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="woocommerce-Price-amount amount text-sm sm:text-base font-black text-gray-950 dark:text-sky-300">
                    {toPersianDigits(activePrice.toLocaleString('en-US'))}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-normal">تومان</span>
                </div>
              </>
            )}
          </div>

          {/* Action button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isVariable ? 'انتخاب مدل و خرید' : 'افزودن به سبد خرید'}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                : isVariable
                ? 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white dark:bg-sky-950/60 dark:text-sky-300'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white active:scale-95'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{isVariable ? 'انتخاب' : 'خرید'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
