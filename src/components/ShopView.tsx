import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  LayoutGrid,
  Tag,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { getCategoryIcon } from '../utils/iconRegistry';
import { toPersianDigits } from '../utils/pricing';

export function ShopView() {
  const {
    products,
    categories,
    selectedCategoryId,
    selectedSubcategoryId,
    setSelectedSubcategoryId,
    navigateTo,
    searchQuery,
    setSearchQuery,
  } = useStore();

  // Collapsible filter section state (narrow by default)
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Panels: null by default so all products are immediately visible at the top
  const [activePanel, setActivePanel] = useState<'filters' | 'categories' | 'brands' | null>(null);

  // Filter states
  const [sortBy, setSortBy] = useState<'newest' | 'cheapest' | 'expensive'>('newest');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const selectedSubcategory = selectedSubcategoryId;
  const setSelectedSubcategory = setSelectedSubcategoryId;
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(selectedCategoryId || null);
  const [onlySpecial, setOnlySpecial] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Extract all unique brands from products
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brandSet.add(p.brand.trim());
      else if (p.attributes?.brand) brandSet.add(p.attributes.brand.trim());
    });
    return Array.from(brandSet);
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (selectedCategoryId) {
      list = list.filter((p) => p.categoryId === selectedCategoryId);
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      list = list.filter((p) => p.subcategory === selectedSubcategory);
    }

    // Filter by brand
    if (selectedBrand) {
      list = list.filter(
        (p) =>
          p.brand === selectedBrand ||
          p.attributes?.brand === selectedBrand ||
          (p.brand && p.brand.toLowerCase().includes(selectedBrand.toLowerCase()))
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Filter by special offer
    if (onlySpecial) {
      list = list.filter((p) => p.isSpecialOffer);
    }

    // Filter by in-stock
    if (onlyInStock) {
      list = list.filter((p) => p.stock > 0);
    }

    // Sorting
    if (sortBy === 'cheapest') {
      list.sort((a, b) => {
        const pA = a.salePrice && a.salePrice < a.price ? a.salePrice : a.price;
        const pB = b.salePrice && b.salePrice < b.price ? b.salePrice : b.price;
        return pA - pB;
      });
    } else if (sortBy === 'expensive') {
      list.sort((a, b) => {
        const pA = a.salePrice && a.salePrice < a.price ? a.salePrice : a.price;
        const pB = b.salePrice && b.salePrice < b.price ? b.salePrice : b.price;
        return pB - pA;
      });
    } else {
      // Newest
      list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return list;
  }, [
    products,
    selectedCategoryId,
    selectedSubcategory,
    selectedBrand,
    searchQuery,
    onlySpecial,
    onlyInStock,
    sortBy,
  ]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategoryId);

  const togglePanel = (panel: 'filters' | 'categories' | 'brands') => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const handleSelectCategory = (catId?: string) => {
    navigateTo('shop', undefined, catId);
    setSelectedSubcategory(null);
    if (catId) {
      setExpandedCategoryId(catId);
    }
  };

  const handleSelectSubcategory = (catId: string, sub: string) => {
    navigateTo('shop', undefined, catId);
    setSelectedSubcategory(sub === selectedSubcategory ? null : sub);
    setExpandedCategoryId(catId);
  };

  const clearAllFilters = () => {
    navigateTo('shop', undefined, undefined);
    setSelectedBrand(null);
    setSelectedSubcategory(null);
    setOnlySpecial(false);
    setOnlyInStock(false);
    setSortBy('newest');
    setSearchQuery('');
  };

  const hasActiveFilters =
    Boolean(selectedCategoryId) ||
    Boolean(selectedSubcategory) ||
    Boolean(selectedBrand) ||
    onlySpecial ||
    onlyInStock ||
    sortBy !== 'newest' ||
    Boolean(searchQuery.trim());

  return (
    <div className="max-w-7xl mx-auto px-1.5 sm:px-3 py-3 sm:py-5 space-y-3 sm:space-y-5">
      {/* Collapsible Top Header & Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-sky-100 dark:border-slate-800 shadow-xs transition-all space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="cursor-pointer select-none flex-1 min-w-0"
          >
            <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white truncate">
              فروشگاه محصولات آیلند باتری
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              نمایش {toPersianDigits(filteredProducts.length)} محصول موجود
              {activeCategoryObj && ` در «${activeCategoryObj.name}»`}
              {selectedBrand && ` | برند: ${selectedBrand}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-750 text-sky-800 dark:text-sky-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border border-sky-200/60 dark:border-slate-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">فیلترها و دسته‌ها</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isFilterExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded Filters Content */}
        {isFilterExpanded && (
          <div className="space-y-3 pt-3 border-t border-sky-100 dark:border-slate-800 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* The 3 Main Toggle Buttons: perfectly fitted for mobile & desktop */}
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              {/* 1. فیلترها (Filters + Sort) */}
              <button
                onClick={() => togglePanel('filters')}
                className={`w-full sm:w-auto px-2 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shrink-0 ${
                  activePanel === 'filters'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-sky-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-750 border border-sky-200/70 dark:border-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                <span>فیلترها</span>
                {(onlyInStock || onlySpecial || sortBy !== 'newest') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                )}
                {activePanel === 'filters' ? (
                  <ChevronUp className="w-3 h-3 mr-0.5 shrink-0" />
                ) : (
                  <ChevronDown className="w-3 h-3 mr-0.5 shrink-0" />
                )}
              </button>

              {/* 2. دسته‌ها (Categories + Subcategories) */}
              <button
                onClick={() => togglePanel('categories')}
                className={`w-full sm:w-auto px-2 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shrink-0 ${
                  activePanel === 'categories'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-sky-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-750 border border-sky-200/70 dark:border-slate-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span>دسته‌ها</span>
                {selectedCategoryId && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shrink-0" />
                )}
                {activePanel === 'categories' ? (
                  <ChevronUp className="w-3 h-3 mr-0.5 shrink-0" />
                ) : (
                  <ChevronDown className="w-3 h-3 mr-0.5 shrink-0" />
                )}
              </button>

              {/* 3. برندها (Brands) */}
              <button
                onClick={() => togglePanel('brands')}
                className={`w-full sm:w-auto px-2 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shrink-0 ${
                  activePanel === 'brands'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-sky-50/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-750 border border-sky-200/70 dark:border-slate-700'
                }`}
              >
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <span>برندها</span>
                {selectedBrand && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shrink-0" />
                )}
                {activePanel === 'brands' ? (
                  <ChevronUp className="w-3 h-3 mr-0.5 shrink-0" />
                ) : (
                  <ChevronDown className="w-3 h-3 mr-0.5 shrink-0" />
                )}
              </button>
            </div>

            {/* Clear Filters Quick Button */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-auto"
                title="پاک کردن تمام فیلترها"
              >
                <RotateCcw className="w-3 h-3" />
                <span>حذف فیلترها</span>
              </button>
            )}
          </div>

        {/* Collapsible Panel 1: فیلترها (Sorting + In Stock + Special Deals) */}
        {activePanel === 'filters' && (
          <div className="pt-3 border-t border-sky-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            {/* Sorting Tab */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                مرتب‌سازی بر اساس:
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sortBy === 'newest'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  جدیدترین
                </button>
                <button
                  onClick={() => setSortBy('cheapest')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sortBy === 'cheapest'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  ارزان‌ترین
                </button>
                <button
                  onClick={() => setSortBy('expensive')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sortBy === 'expensive'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  گران‌ترین
                </button>
              </div>
            </div>

            {/* Quick switches */}
            <div className="flex items-center gap-6 self-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 cursor-pointer"
                />
                <span>فقط کالاهای موجود</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={onlySpecial}
                  onChange={(e) => setOnlySpecial(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 cursor-pointer"
                />
                <span>تخفیف‌های ویژه</span>
              </label>
            </div>
          </div>
        )}

        {/* Collapsible Panel 2: دسته‌ها (Categories with Dropdown Subcategories) */}
        {activePanel === 'categories' && (
          <div className="pt-3 border-t border-sky-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                انتخاب دسته‌بندی و زیردسته‌ها:
              </span>
              <button
                onClick={() => handleSelectCategory(undefined)}
                className="text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer font-bold"
              >
                نمایش همه کالاها
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const CatIcon = getCategoryIcon(cat.iconName);
                const isSelected = selectedCategoryId === cat.id;
                const isExpanded = expandedCategoryId === cat.id;
                const count = products.filter((p) => p.categoryId === cat.id).length;
                const hasSubs = cat.subcategories && cat.subcategories.length > 0;

                return (
                  <div
                    key={cat.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isSelected
                        ? 'border-sky-400 bg-sky-50/70 dark:bg-slate-800/90 shadow-xs'
                        : 'border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between p-2.5">
                      <button
                        onClick={() => handleSelectCategory(cat.id)}
                        className="flex items-center gap-2 text-right flex-1 cursor-pointer"
                      >
                        <CatIcon className="w-4 h-4 text-sky-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
                          ({toPersianDigits(count)})
                        </span>
                      </button>

                      {hasSubs && (
                        <button
                          onClick={() => setExpandedCategoryId(isExpanded ? null : cat.id)}
                          className="p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                          title="نمایش زیردسته‌ها"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Subcategories dropdown list */}
                    {hasSubs && isExpanded && (
                      <div className="p-2 pt-1 border-t border-sky-100/60 dark:border-slate-700/80 flex flex-wrap gap-1.5 bg-sky-50/40 dark:bg-slate-900/80">
                        {cat.subcategories?.map((sub) => {
                          const isSubSelected =
                            selectedCategoryId === cat.id && selectedSubcategory === sub;
                          return (
                            <button
                              key={sub}
                              onClick={() => handleSelectSubcategory(cat.id, sub)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isSubSelected
                                  ? 'bg-sky-500 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <span>{sub}</span>
                              {isSubSelected && <Check className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsible Panel 3: برندها (Brands Selector) */}
        {activePanel === 'brands' && (
          <div className="pt-3 border-t border-sky-100 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                فیلتر بر اساس برند کالا:
              </span>
              {selectedBrand && (
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="text-xs text-rose-500 hover:underline cursor-pointer font-bold"
                >
                  حذف فیلتر برند
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBrand(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !selectedBrand
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                همه برندها
              </button>

              {availableBrands.map((brand) => {
                const isSelected = selectedBrand === brand;
                const count = products.filter(
                  (p) => p.brand === brand || p.attributes?.brand === brand
                ).length;

                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(isSelected ? null : brand)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-xs font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-100/70 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{brand}</span>
                    <span className="text-[10px] opacity-70">({toPersianDigits(count)})</span>
                    {isSelected && <Check className="w-3 h-3 mr-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Filter Indicators */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
            <span className="text-slate-400 font-medium ml-1">فیلترهای فعال:</span>

            {activeCategoryObj && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <span>دسته‌بندی: {activeCategoryObj.name}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => handleSelectCategory(undefined)}
                />
              </span>
            )}

            {selectedSubcategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <span>زیردسته: {selectedSubcategory}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => setSelectedSubcategory(null)}
                />
              </span>
            )}

            {selectedBrand && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <span>برند: {selectedBrand}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => setSelectedBrand(null)}
                />
              </span>
            )}

            {onlyInStock && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <span>فقط کالای موجود</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => setOnlyInStock(false)}
                />
              </span>
            )}

            {onlySpecial && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <span>تخفیف ویژه</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => setOnlySpecial(false)}
                />
              </span>
            )}

            {sortBy !== 'newest' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <span>
                  مرتب‌سازی: {sortBy === 'cheapest' ? 'ارزان‌ترین' : 'گران‌ترین'}
                </span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-500"
                  onClick={() => setSortBy('newest')}
                />
              </span>
            )}
          </div>
        )}
      </div>
    )}
  </div>

      {/* Products Grid - Directly Visible at the Top! Full width layout */}
      <main className="w-full">
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-14 text-center border border-sky-100 dark:border-slate-800">
            <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              هیچ کالایی با فیلترهای انتخابی یافت نشد
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              لطفاً فیلترها را تغییر دهید یا دکمه زیر را برای نمایش تمام کالاها بزنید.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl cursor-pointer active:scale-95 transition-all shadow-xs"
            >
              پاک کردن همه فیلترها و مشاهده همه محصولات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
