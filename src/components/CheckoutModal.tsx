import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  calculateCartTotals,
  formatToman,
  toPersianDigits,
  validateIranianPhone,
  validatePostalCode,
} from '../utils/pricing';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const {
    cart,
    currentUser,
    registerUser,
    createOrder,
    navigateTo,
    settings,
  } = useStore();

  const totals = calculateCartTotals(cart);

  // Steps: 'auth' (if guest) -> 'gateway' (simulated Shaparak) -> 'receipt'
  const [step, setStep] = useState<'auth' | 'gateway' | 'receipt'>(
    currentUser ? 'gateway' : 'auth'
  );

  // Guest Registration Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formError, setFormError] = useState('');

  // Payment gateway state
  const [cardNumber, setCardNumber] = useState('6037-9975-4321-8890');
  const [cvv2, setCvv2] = useState('482');
  const [expMonth, setExpMonth] = useState('08');
  const [expYear, setExpYear] = useState('06');
  const [pin2, setPin2] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('لطفاً نام و نام‌خانوادگی خود را وارد کنید');
      return;
    }
    if (!validateIranianPhone(phone)) {
      setFormError('شماره موبایل باید ۱۱ رقمی و با ۰۹ شروع شود (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }
    if (!address.trim()) {
      setFormError('لطفاً آدرس دقیق جهت ارسال کالا را وارد فرمایید');
      return;
    }
    if (postalCode && !validatePostalCode(postalCode)) {
      setFormError('کد پستی باید ۱۰ رقم باشد');
      return;
    }
    if (!agreeTerms) {
      setFormError('پذیرش قوانین و مقررات برای ثبت نام و سفارش الزامی است');
      return;
    }

    const regRes = await registerUser({
      name,
      phone,
      password: password || '123456',
      address,
      postalCode,
    });

    if (regRes.success) {
      setStep('gateway');
    } else {
      setFormError(regRes.error || 'خطا در ثبت اطلاعات کاربر');
    }
  };

  const handleSimulatePayment = async (success: boolean) => {
    if (!success) {
      alert('پرداخت توسط کاربر لغو گردید.');
      onClose();
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(async () => {
      const order = await createOrder({
        customerName: currentUser?.name || name,
        customerPhone: currentUser?.phone || phone,
        shippingAddress: currentUser?.address || address,
        postalCode: currentUser?.postalCode || postalCode,
        subtotal: totals.subtotal,
        shippingFee: totals.shippingFee,
        totalAmount: totals.payableTotal,
        paymentMethod: 'online',
        items: cart.map((c) => ({
          productId: c.productId,
          title: c.title,
          price: c.salePrice || c.price,
          quantity: c.quantity,
          variantName: c.variantName,
          image: c.image,
        })),
      });

      setCompletedOrder(order);
      setIsProcessingPayment(false);
      setStep('receipt');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 my-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative my-auto w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden transition-all">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-blue-900 to-sky-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-300" />
            <h3 className="font-extrabold text-base sm:text-lg">
              {step === 'auth' && 'تکمیل مشخصات و آدرس تحویل'}
              {step === 'gateway' && 'درگاه پرداخت شاپرک (شبیه‌ساز رسمی)'}
              {step === 'receipt' && 'رسید سفارش و پرداخت موفق'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-5rem)] overscroll-contain flex-1">
          {/* STEP 1: GUEST REGISTRATION & ADDRESS FORM */}
          {step === 'auth' && (
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl text-xs text-sky-950 dark:text-sky-200">
                جهت نهایی‌سازی سفارش و ارسال کالا، لطفاً اطلاعات تحویل‌گیرنده را وارد نمایید. یک
                حساب کاربری امن برای پیگیری سفارشات شما به طور خودکار ایجاد خواهد شد.
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    نام و نام خانوادگی تحویل‌گیرنده *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: رضا محمدی"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره موبایل (جهت پیامک رهگیری) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 text-left transition-colors"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    کد پستی (۱۰ رقمی)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 text-left transition-colors"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تعیین رمز عبور حساب (اختیاری)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="حداقل ۶ کاراکتر"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  آدرس دقیق پستی جهت تحویل سفارش *
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="استان، شهر، خیابان اصلی، کوچه، پلاک، واحد..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                />
              </div>

              {/* Terms agreement checkbox with explicit link as requested */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="checkoutTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label
                  htmlFor="checkoutTerms"
                  className="text-xs text-slate-600 dark:text-slate-400 select-none cursor-pointer"
                >
                  <span>من کلیه </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigateTo('terms');
                    }}
                    className="text-sky-600 dark:text-sky-400 font-bold underline inline-flex items-center gap-0.5"
                  >
                    <span>قوانین و مقررات</span>
                    <ExternalLink className="w-3 h-3 inline" />
                  </button>
                  <span> فروشگاه را مطالعه نموده و با آن موافقم.</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                <div className="text-sm font-bold">
                  <span>مبلغ قابل پرداخت: </span>
                  <span className="text-sky-600 dark:text-sky-400 font-black">
                    {formatToman(totals.payableTotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  ثبت و ورود به درگاه پرداخت
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SHAPARAK PAYMENT GATEWAY SIMULATOR */}
          {step === 'gateway' && (
            <div className="space-y-4">
              {/* Shaparak Bar */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">پذیرنده رسمی شاپرک</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {settings.storeName || 'آیلند باتری'}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-slate-500 dark:text-slate-400">مبلغ تراکنش:</div>
                  <div className="text-base font-black text-blue-600 dark:text-sky-400">
                    {formatToman(totals.payableTotal)}
                  </div>
                </div>
              </div>

              {/* Card inputs */}
              <div className="p-4 bg-sky-50/60 dark:bg-sky-950/30 rounded-2xl border border-sky-100 dark:border-sky-900 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره کارت بانکی (۱۶ رقم)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="۶۰۳۷-۹۹۷۵-...."
                    dir="ltr"
                    className="w-full px-3 py-2 text-sm tracking-widest font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center outline-none focus:border-sky-500 dark:focus:border-sky-400 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      کد CVV2
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvv2}
                      onChange={(e) => setCvv2(e.target.value)}
                      placeholder="•••"
                      dir="ltr"
                      className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center outline-none focus:border-sky-500 dark:focus:border-sky-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      تاریخ انقضا (ماه / سال)
                    </label>
                    <div className="flex gap-2" dir="ltr">
                      <input
                        type="text"
                        maxLength={2}
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value)}
                        placeholder="MM"
                        className="w-1/2 px-2 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center outline-none focus:border-sky-500 transition-colors"
                      />
                      <input
                        type="text"
                        maxLength={2}
                        value={expYear}
                        onChange={(e) => setExpYear(e.target.value)}
                        placeholder="YY"
                        className="w-1/2 px-2 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رمز پویا / دوم
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={pin2}
                      onChange={(e) => setPin2(e.target.value)}
                      placeholder="رمز ارسال شده به شماره شما"
                      className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setPin2('482910')}
                      className="px-3 py-2 text-xs font-bold rounded-xl bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 hover:bg-sky-200 transition-colors"
                    >
                      دریافت رمز پویا
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSimulatePayment(false)}
                  disabled={isProcessingPayment}
                  className="px-5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  انصراف از پرداخت
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulatePayment(true)}
                  disabled={isProcessingPayment}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessingPayment ? 'در حال تایید و ثبت تراکنش...' : 'پرداخت و تکمیل خرید'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER RECEIPT & SUCCESS */}
          {step === 'receipt' && completedOrder && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white">
                  سفارش شما با موفقیت ثبت گردید!
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  پیامک تایید سفارش و کد رهگیری پستی به شماره شما ارسال گردید.
                </p>
              </div>

              {/* Order summary box */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-150 dark:border-gray-700 text-right text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">شماره سفارش:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    #{toPersianDigits(completedOrder.orderNumber)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">کد پیگیری درگاه شاپرک:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{toPersianDigits(completedOrder.paymentRefId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">تحویل گیرنده:</span>
                  <span className="font-bold">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">مبلغ پرداخت شده:</span>
                  <span className="font-bold text-blue-600 dark:text-sky-400">
                    {formatToman(completedOrder.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">آدرس تحویل:</span>
                  <span className="font-medium max-w-[240px] truncate">
                    {completedOrder.shippingAddress}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    onClose();
                    navigateTo('profile');
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  مشاهده در تاریخچه سفارشات
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigateTo('home');
                  }}
                  className="px-5 py-3 rounded-xl bg-gray-150 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 transition-all cursor-pointer"
                >
                  بازگشت به خانه
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
