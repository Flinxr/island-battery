import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Phone,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  MapPin,
  Mail,
  Home,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { validateIranianPhone, toPersianDigits } from '../utils/pricing';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, registerUser, checkPhoneExists } = useStore();

  const [animateIn, setAnimateIn] = useState(false);
  const [step, setStep] = useState<'phone' | 'password' | 'register'>('phone');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [existingUserName, setExistingUserName] = useState<string | null>(null);

  // Optional fields for new user registration
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [plaque, setPlaque] = useState('');

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setStep('phone');
      const frame = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(frame);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  // Step 1: Submit Phone Number
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/[^\d]/g, '');
    if (!validateIranianPhone(cleanPhone)) {
      setError('شماره موبایل نامعتبر است (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    setLoading(true);
    try {
      const res = await checkPhoneExists(cleanPhone);
      setLoading(false);
      if (res.exists) {
        setExistingUserName(res.name || null);
        setStep('password');
      } else {
        setStep('register');
      }
    } catch {
      setLoading(false);
      // Fallback
      if (cleanPhone === '09334237673') {
        setExistingUserName('مدیریت آیلند باتری');
        setStep('password');
      } else {
        setStep('register');
      }
    }
  };

  // Step 2A: Submit Password for Existing User
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('لطفاً رمز عبور خود را وارد کنید');
      return;
    }

    setLoading(true);
    const res = await login(phone, password);
    setLoading(false);

    if (res.success) {
      handleClose();
    } else {
      setError(res.error || 'رمز عبور وارد شده اشتباه است');
    }
  };

  // Step 2B: Submit Registration for New User
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('لطفاً نام و نام‌خانوادگی خود را وارد نمایید');
      return;
    }

    if (!password || password.length < 4) {
      setError('رمز عبور باید حداقل ۴ رقم یا کاراکتر باشد');
      return;
    }

    if (!agreeTerms) {
      setError('جهت عضویت، پذیرش قوانین و مقررات الزامی است');
      return;
    }

    setLoading(true);
    const combinedAddress = [address.trim(), plaque.trim() ? `پلاک: ${plaque.trim()}` : '']
      .filter(Boolean)
      .join(' - ');

    const res = await registerUser({
      name: name.trim(),
      phone: phone.trim(),
      password,
      address: combinedAddress || undefined,
      postalCode: postalCode.trim() || undefined,
    });

    setLoading(false);
    if (res.success) {
      handleClose();
    } else {
      setError(res.error || 'خطا در ثبت‌نام کاربر');
    }
  };

  // Quick fill admin credentials for testing
  const handleFillAdmin = () => {
    setPhone('09334237673');
    setPassword('i1l3i8a5');
    setExistingUserName('مدیریت آیلند باتری');
    setStep('password');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 my-auto">
      {/* Smooth backdrop fade */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Smooth Scale & Slide-up Modal Dialog */}
      <div
        className={`relative my-auto w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-10 max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden transition-all duration-300 ease-out transform ${
          animateIn ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Sleek Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-l from-slate-950 via-slate-900 to-sky-950 text-white flex items-center justify-between border-b border-sky-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {step === 'phone' && 'ورود یا عضویت'}
                {step === 'password' && 'ورود به حساب کاربری'}
                {step === 'register' && 'تکمیل عضویت در سایت'}
              </h3>
              <p className="text-[10px] text-sky-300/80">
                مرجع تخصصی باتری و قطعات آیلند باتری
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(85vh-5rem)] overscroll-contain flex-1">
          {/* Quick Admin fill button for rapid testing */}
          {step === 'phone' && (
            <div className="p-2.5 bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/60 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-sky-900 dark:text-sky-200">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span className="text-[11px] font-medium">شماره ادمین: ۰۹۳۳۴۲۳۷۶۷۳</span>
              </div>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="px-2.5 py-1 text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-all cursor-pointer shadow-2xs"
              >
                تکمیل سریع ادمین
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Phone input only + Blue "بعدی" button */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  شماره موبایل خود را وارد کنید
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    autoFocus
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-mono tracking-wider"
                    dir="ltr"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  در صورت داشتن حساب، مستقیماً وارد می‌شوید و در غیر این صورت حساب جدید ساخته می‌شود.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-105 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>بعدی</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2A: Password only for existing user (No terms checkbox needed) */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">شماره همراه وارد شده:</span>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100 font-mono" dir="ltr">
                    {toPersianDigits(phone)}
                  </span>
                  {existingUserName && (
                    <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 block mt-0.5">
                      خوش آمدید، {existingUserName} عزیز
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setError('');
                  }}
                  className="text-[11px] text-sky-600 hover:text-sky-700 dark:text-sky-400 font-bold underline cursor-pointer"
                >
                  ویرایش شماره
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  رمز عبور حساب کاربری
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-105 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>ورود به حساب کاربری</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2B: New User Registration (Address & Postal Code are OPTIONAL) */}
          {step === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-fadeIn">
              <div className="p-2.5 bg-sky-50/70 dark:bg-sky-950/40 rounded-xl border border-sky-200/80 dark:border-sky-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">شماره موبایل:</span>
                  <span className="font-bold text-xs text-sky-700 dark:text-sky-300 font-mono" dir="ltr">
                    {toPersianDigits(phone)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setError('');
                  }}
                  className="text-[11px] text-sky-600 hover:text-sky-700 dark:text-sky-400 font-bold underline cursor-pointer"
                >
                  تغییر شماره
                </button>
              </div>

              {/* Name (Required) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  نام و نام خانوادگی <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: علی محمدی"
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Password (Required) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  تعیین رمز عبور <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="حداقل ۴ کاراکتر"
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Address & Postal Code Details (Always visible, optional at registration) */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-bold text-xs pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>آدرس و کد پستی</span>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                    آدرس دقیق پستی <span className="text-slate-400">(اختیاری)</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="شهر، خیابان، کوچه..."
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-xs outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                      کد پستی ۱۰ رقمی <span className="text-slate-400">(اختیاری)</span>
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="۱۲۳۴۵۶۷۸۹۰"
                      maxLength={10}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-xs outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                      پلاک و واحد <span className="text-slate-400">(اختیاری)</span>
                    </label>
                    <input
                      type="text"
                      value={plaque}
                      onChange={(e) => setPlaque(e.target.value)}
                      placeholder="پلاک ۱۲، واحد ۴"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-750 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-xs outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                  <span className="text-sky-600 dark:text-sky-400 font-semibold">قوانین و مقررات</span> آیلند باتری را مطالعه نموده و می‌پذیرم.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-105 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تکمیل عضویت و ورود</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
