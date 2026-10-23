import React, { useState } from 'react';
import {
  ChevronRight,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Tag,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { calculateDiscount, formatToman, toPersianDigits } from '../utils/pricing';
import { generateTorobProductSchema } from '../utils/torob';

export function ProductDetailView() {
  const { products, selectedProductId, addToCart, navigateTo, currentUser } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0].id : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'torob'>('desc');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">محصول مورد نظر یافت نشد</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-sm"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  // Determine active price and stock based on variant selection
  let currentPrice = product.price;
  let currentSalePrice = product.salePrice;
  let currentStock = product.stock;

  if (selectedVariantId && product.variants) {
    const v = product.variants.find((item) => item.id === selectedVariantId);
    if (v) {
      currentPrice = v.price;
      currentSalePrice = v.salePrice;
      currentStock = v.stock;
    }
  }

  const activePrice =
    currentSalePrice && currentSalePrice < currentPrice ? currentSalePrice : currentPrice;
  const discountPercent = calculateDiscount(currentPrice, currentSalePrice);
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariantId, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  // Generate SEO Torob Schema for crawlers
  const torobSchema = generateTorobProductSchema(product, window.location.origin);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Torob Crawler JSON-LD Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(torobSchema) }}
      />


      {/* Main Product Container */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 border border-gray-150 dark:border-gray-700/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Right (5 cols in RTL): Product Image Gallery */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl p-0 border border-sky-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 px-2.5 py-1 text-xs font-black rounded-xl backdrop-blur-md bg-rose-500/85 border border-white/25 text-white shadow-xs">
                {toPersianDigits(discountPercent)}٪ تخفیف
              </span>
            )}
          </div>

          {/* Trust points under image */}
          <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center">
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                ضمانت اصالت
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                ارسال سریع
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                ۷ روز مهلت تست
              </span>
            </div>
          </div>
        </div>

        {/* Left (7 cols in RTL): Product Details, Variants, Price, Add to Cart */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            {/* SKU, Brand & Subcategory */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span>برند:</span>
                <span className="font-bold text-sky-700 dark:text-sky-300">
                  {product.brand || product.attributes?.brand || 'آیلند باتری'}
                </span>
                {product.subcategory && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800">
                    {product.subcategory}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span>شناسه کالا (SKU):</span>
                <span className="font-bold text-gray-700 dark:text-gray-300">{product.sku}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white leading-snug">
              {product.title}
            </h1>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          {/* Variable Product Options (Colors/Capacities/Warranties) */}
          {product.type === 'variable' && product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                انتخاب مدل / تنوع کالا:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 ring-2 ring-sky-500/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      <span>{v.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* In Stock Status */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-sky-950 dark:text-sky-200">
                {isOutOfStock ? 'ناموجود در انبار' : `موجود در انبار (${toPersianDigits(currentStock)} عدد)`}
              </span>
            </div>
          </div>

          {/* Price and Cart Buttons */}
          <div className="pt-4 border-t border-gray-150 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Price section */}
            <div className="w-full sm:w-auto">
              {currentUser?.role === 'partner' && product.partnerPrice && product.partnerPrice > 0 ? (
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 line-through">
                    <span>{formatToman(currentPrice)}</span>
                    {discountPercent > 0 && <span>/ {formatToman(activePrice)}</span>}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                      {toPersianDigits(product.partnerPrice.toLocaleString('en-US'))}
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-800/60">
                      قیمت ویژه همکار
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {discountPercent > 0 && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 line-through">
                      {formatToman(currentPrice)}
                    </div>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-gray-950 dark:text-sky-300">
                      {toPersianDigits(activePrice.toLocaleString('en-US'))}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">تومان</span>
                  </div>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-750 p-1">
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-sky-50 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm">
                  {toPersianDigits(quantity)}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-rose-50 shadow-xs cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 sm:flex-initial px-6 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  addedAnimation
                    ? 'bg-blue-600 text-white'
                    : isOutOfStock
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white hover:brightness-105 active:scale-95'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>به سبد اضافه شد!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>افزودن به سبد خرید</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description & Specs */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 border border-sky-100 dark:border-slate-800 shadow-xs">
        <div className="flex border-b border-gray-150 dark:border-gray-700 gap-4 sm:gap-8 pb-3">
          <button
            onClick={() => setActiveTab('desc')}
            className={`text-sm sm:text-base font-bold pb-2 transition-all cursor-pointer border-b-2 -mb-3.5 ${
              activeTab === 'desc'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            توضیحات
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-sm sm:text-base font-bold pb-2 transition-all cursor-pointer border-b-2 -mb-3.5 ${
              activeTab === 'specs'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            مشخصات فنی
          </button>
        </div>

        <div className="pt-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-2">
              <table className="w-full text-xs sm:text-sm">
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2.5 px-3 text-gray-500 w-1/3 bg-gray-50 dark:bg-gray-750 rounded-r-xl">
                      برند
                    </td>
                    <td className="py-2.5 px-3 font-bold">{product.attributes?.brand || 'اورجینال'}</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2.5 px-3 text-gray-500 w-1/3 bg-gray-50 dark:bg-gray-750">
                      گارانتی
                    </td>
                    <td className="py-2.5 px-3 font-bold">
                      {product.attributes?.warranty || 'ضمانت سلامت فیزیکی'}
                    </td>
                  </tr>
                  {product.attributes?.modelCompatibility && (
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2.5 px-3 text-gray-500 w-1/3 bg-gray-50 dark:bg-gray-750">
                        سازگاری مدل‌ها
                      </td>
                      <td className="py-2.5 px-3 font-bold">
                        {product.attributes.modelCompatibility}
                      </td>
                    </tr>
                  )}
                  {product.attributes?.material && (
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2.5 px-3 text-gray-500 w-1/3 bg-gray-50 dark:bg-gray-750">
                        جنس و متریال
                      </td>
                      <td className="py-2.5 px-3 font-bold">{product.attributes.material}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2.5 px-3 text-gray-500 w-1/3 bg-gray-50 dark:bg-gray-750 rounded-br-xl">
                      دسته‌بندی
                    </td>
                    <td className="py-2.5 px-3 font-bold">{product.categoryName || 'لوازم جانبی'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
