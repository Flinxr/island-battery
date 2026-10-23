import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  LogOut,
  Save,
  ArrowRight,
  ChevronLeft,
  FileText,
  Printer,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPersianDate, formatPersianDateTime, formatToman, toPersianDigits } from '../utils/pricing';
import { Order } from '../types/store';

export function UserProfileView() {
  const { currentUser, orders, products, logout, updateUserProfile, navigateTo } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">برای مشاهده پروفایل ابتدا وارد شوید</h3>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold rounded-xl text-xs cursor-pointer"
        >
          بازگشت به خانه
        </button>
      </div>
    );
  }

  // Filter orders for this user
  const userOrders = orders.filter(
    (o) => o.userId === currentUser.id || o.customerPhone === currentUser.phone
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, address, postalCode });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 text-xs font-black rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-700/60 shadow-2xs">
            تکمیل شده
          </span>
        );
      case 'shipped':
        return (
          <span className="px-3 py-1 text-xs font-black rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 dark:border dark:border-sky-700/60 shadow-2xs">
            ارسال شده (تحویل به پست)
          </span>
        );
      case 'processing':
        return (
          <span className="px-3 py-1 text-xs font-black rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-700/60 shadow-2xs">
            در حال بسته‌بندی
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 text-xs font-black rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 dark:border dark:border-rose-700/60 shadow-2xs">
            لغو شده
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-black rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:border dark:border-slate-700 shadow-2xs">
            در انتظار بررسی
          </span>
        );
    }
  };

  // Dedicated Order Detail View
  if (selectedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Navigation & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSelectedOrder(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ArrowRight className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>بازگشت به تاریخچه سفارشات</span>
          </button>

          <div className="flex items-center gap-2">
            {getStatusBadge(selectedOrder.status)}
          </div>
        </div>

        {/* Main Order Header Banner */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-medium">شماره ثبت سفارش</span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>سفارش #{toPersianDigits(selectedOrder.orderNumber)}</span>
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1 font-medium">تاریخ و زمان ثبت دقیق</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 dir-rtl">
                {formatPersianDateTime(selectedOrder.createdAt)}
              </span>
            </div>
          </div>

          {/* Key Reference Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">کد پیگیری پرداخت</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                {selectedOrder.paymentRefId ? toPersianDigits(selectedOrder.paymentRefId) : 'پرداخت آنلاین'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">وضعیت پرداخت</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>پرداخت آنلاین موفق (درگاه شتاب)</span>
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block font-medium">روش ارسال سفارش</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-sky-500" />
                <span>پست پیشتاز (بسته‌بندی ایمن)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Itemized Table - اقلام سفارش ردیف به ردیف */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <Package className="w-5 h-5 text-sky-500" />
            <span>اقلام خریداری شده ({toPersianDigits(selectedOrder.items.length)} کالا)</span>
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {selectedOrder.items.map((item, index) => {
              const matchedProduct = products.find((p) => p.id === item.productId || p.title === item.title);
              const itemImg = item.image || matchedProduct?.image || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300';

              return (
                <div
                  key={index}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                      <img
                        src={itemImg}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      {item.variantName && (
                        <span className="inline-block mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/80 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-600">
                          {item.variantName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 text-xs sm:text-sm shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100 dark:border-slate-700/40">
                    <div className="text-right sm:text-left">
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] block font-medium">قیمت واحد:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatToman(item.price)}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] block font-medium">تعداد:</span>
                      <span className="font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-lg">
                        {toPersianDigits(item.quantity)}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] block font-medium">جمع ردیف:</span>
                      <span className="font-black text-sky-600 dark:text-sky-400">
                        {formatToman(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recipient Info & Financial Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Recipient Details */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <MapPin className="w-4 h-4 text-sky-500" />
              <span>اطلاعات تحویل و آدرس گیرنده</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] block font-medium">تحویل‌گیرنده:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedOrder.customerName}</p>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] block font-medium">شماره تماس:</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{toPersianDigits(selectedOrder.customerPhone)}</p>
              </div>

              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] block font-medium">آدرس کامل پستی:</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed mt-0.5">{selectedOrder.shippingAddress || 'آدرس ثبت نشده'}</p>
              </div>

              {selectedOrder.postalCode && (
                <div>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] block font-medium">کد پستی ۱۰ رقمی:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{toPersianDigits(selectedOrder.postalCode)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <FileText className="w-4 h-4 text-sky-500" />
              <span>خلاصه صورت‌حساب پرداختی</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>مجموع قیمت کالاها:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatToman(selectedOrder.subtotal || selectedOrder.items.reduce((a, c) => a + c.price * c.quantity, 0))}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>هزینه ارسال (پست پیشتاز):</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedOrder.shippingFee === 0 ? 'رایگان' : formatToman(selectedOrder.shippingFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm font-black">
                <span className="text-slate-900 dark:text-white">جمع کل پرداختی:</span>
                <span className="text-sky-600 dark:text-sky-400 text-base font-black">
                  {formatToman(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-sky-500" />
                <span>چاپ فاکتور این سفارش</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* User Header Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {currentUser.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              شماره همراه: {toPersianDigits(currentUser.phone)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => navigateTo('admin')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-110 transition-colors cursor-pointer shadow-xs"
            >
              ورود به پنل مدیریت
            </button>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از حساب</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* User Info & Address Box (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-500" />
              <span>اطلاعات تماس و آدرس تحویل</span>
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
            >
              {isEditing ? 'انصراف' : 'ویرایش'}
            </button>
          </div>

          {saveSuccess && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>اطلاعات با موفقیت ذخیره گردید</span>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  کد پستی
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:border-sky-500 outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  آدرس کامل
                </label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:border-sky-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>ذخیره تغییرات</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">آدرس پستی ثبت شده:</span>
                <p className="mt-0.5 font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                  {currentUser.address || 'هنوز آدرسی ثبت نشده است.'}
                </p>
              </div>

              {currentUser.postalCode && (
                <div>
                  <span className="text-slate-400 dark:text-slate-400 block text-[11px] font-medium">کد پستی:</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{toPersianDigits(currentUser.postalCode)}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Orders History List (8 cols) - Ultra Clean Dark & Light Card Box Design */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-sky-500" />
              <span>تاریخچه سفارشات شما ({toPersianDigits(userOrders.length)})</span>
            </h3>
          </div>

          {userOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <Package className="w-12 h-12 mx-auto stroke-[1.2] opacity-40 mb-2" />
              <p className="text-xs font-medium">شما تاکنون سفارشی ثبت نکرده‌اید.</p>
              <button
                onClick={() => navigateTo('shop')}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                مشاهده محصولات فروشگاه
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="group relative p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md transition-all duration-200 cursor-pointer space-y-3"
                >
                  {/* Top row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 text-sm sm:text-base transition-colors">
                        سفارش #{toPersianDigits(order.orderNumber)}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">
                        {formatPersianDate(order.createdAt)}
                      </span>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-2 py-1.5 border-y border-slate-150 dark:border-slate-800/80">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-200 font-medium truncate max-w-[70%]">
                          <span className="text-slate-900 dark:text-slate-100 font-bold bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded-md ml-1.5">
                            {toPersianDigits(item.quantity)}×
                          </span>
                          {item.title}
                          {item.variantName ? ` (${item.variantName})` : ''}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{formatToman(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between text-xs font-bold pt-1">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span>مجموع پرداختی:</span>
                      <span className="text-sky-600 dark:text-sky-400 font-black text-sm sm:text-base">
                        {formatToman(order.totalAmount)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 text-xs font-black group-hover:translate-x-[-4px] transition-transform">
                      <span>مشاهده جزئیات کامل</span>
                      <ChevronLeft className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
