import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { calculateCartTotals, formatToman, toPersianDigits } from '../utils/pricing';

interface CartViewProps {
  onProceedToCheckout: () => void;
}

export function CartView({ onProceedToCheckout }: CartViewProps) {
  const { cart, removeFromCart, updateCartQuantity, navigateTo, isSyncingCart } = useStore();

  const totals = calculateCartTotals(cart);
  const isEmpty = cart.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Title matching screenshot 145507 */}
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-6">
        سبد خرید شما
      </h1>

      <div className={`grid grid-cols-1 ${isEmpty ? 'max-w-xl mx-auto' : 'lg:grid-cols-12'} gap-6 items-start`}>
        {/* Right side in RTL (col-span-8): Cart Items (only shown when cart has items) */}
        {!isEmpty && (
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="space-y-3">
              {cart.map((item) => {
                const itemTotal = (item.salePrice || item.price) * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 border border-slate-150 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-20 h-20 rounded-xl bg-slate-50 dark:bg-slate-800 p-2 shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4
                          onClick={() => navigateTo('product-detail', item.productId)}
                          className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white hover:text-sky-600 cursor-pointer line-clamp-2"
                        >
                          {item.title}
                        </h4>
                        {item.variantName && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 rounded-md">
                            {item.variantName}
                          </span>
                        )}
                        <div className="mt-1 text-xs text-gray-500">
                          فی واحد: {formatToman(item.salePrice || item.price)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity adjuster and Price */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700">
                      {/* Quantity Buttons */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 p-1">
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          aria-label="افزایش تعداد"
                          className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-sky-50 shadow-xs transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900 dark:text-white">
                          {toPersianDigits(item.quantity)}
                        </span>
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateCartQuantity(item.id, -1);
                            } else {
                              removeFromCart(item.id);
                            }
                          }}
                          aria-label="کاهش تعداد یا حذف"
                          className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 shadow-xs transition-colors"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-left">
                        <span className="font-black text-sm sm:text-base text-gray-950 dark:text-sky-300">
                          {formatToman(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Left side in RTL: Order Summary Card */}
        <div className={`${isEmpty ? 'w-full' : 'lg:col-span-4'} order-1 lg:order-2`}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-150 dark:border-gray-700/80 shadow-xs space-y-4">
            <h3 className="font-black text-base sm:text-lg text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
              خلاصه سفارش
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>تعداد کل اقلام:</span>
                <span className="font-bold">{toPersianDigits(totals.totalQuantity)}</span>
              </div>

              {totals.discountTotal > 0 && (
                <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                  <span>سود شما از خرید:</span>
                  <span className="font-bold">{formatToman(totals.discountTotal)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>هزینه ارسال:</span>
                <span className="font-bold">
                  {totals.totalQuantity === 0
                    ? '۰ تومان'
                    : totals.shippingFee === 0
                    ? 'رایگان'
                    : formatToman(totals.shippingFee)}
                </span>
              </div>

              {/* Dotted line */}
              <div className="border-t border-dashed border-gray-250 dark:border-gray-700 my-3" />

              <div className="flex items-center justify-between text-sm sm:text-base font-black text-gray-950 dark:text-white">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-sky-600 dark:text-sky-400 text-xl font-black">
                  {formatToman(totals.payableTotal)}
                </span>
              </div>
            </div>

            {/* Action Button: When empty, active button to shop */}
            {isEmpty ? (
              <button
                onClick={() => navigateTo('shop')}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-sky-500 hover:bg-sky-600 active:scale-98 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>مشاهده محصولات فروشگاه</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-105 active:scale-98 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>نهایی کردن خرید و پرداخت</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2 pt-2 text-[11px] text-gray-400 dark:text-gray-500">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>پرداخت امن از طریق درگاه رسمی شاپرک</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
