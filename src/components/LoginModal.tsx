import React, { useState } from 'react';
import { X, User, Lock, Phone, AlertCircle, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { validateIranianPhone } from '../utils/pricing';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, registerUser, navigateTo } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateIranianPhone(phone)) {
      setError('شماره موبایل وارد شده معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('لطفاً نام و نام‌خانوادگی خود را وارد کنید');
        return;
      }
      if (!agreeTerms) {
        setError('پذیرش قوانین و مقررات الزامی است');
        return;
      }
      setLoading(true);
      const res = await registerUser({ name, phone, password, address });
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'خطا در ثبت‌نام کاربر');
      }
    } else {
      setLoading(true);
      const res = await login(phone, password);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'شماره موبایل یا رمز عبور اشتباه است');
      }
    }
  };

  const handleFillAdmin = () => {
    setMode('login');
    setPhone('09334237673');
    setPassword('i1l3i8a5');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-150 dark:border-gray-800 overflow-hidden z-10 transition-all">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-blue-900 to-sky-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-300" />
            <h3 className="font-extrabold text-base sm:text-lg">
              {mode === 'login' ? 'ورود به حساب کاربری' : 'ثبت‌نام کاربر جدید'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-1">
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-400 shadow-xs'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            ورود به حساب
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-400 shadow-xs'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            عضویت در سایت
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Admin shortcut test helper button */}
          <div className="p-2.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-sky-900 dark:text-sky-200">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>ادمین آیلند باتری: ۰۹۳۳۴۲۳۷۶۷۳</span>
            </div>
            <button
              type="button"
              onClick={handleFillAdmin}
              className="px-2.5 py-1 text-[11px] font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-lg transition-all cursor-pointer shrink-0 shadow-xs"
            >
              تکمیل ادمین
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام و نام خانوادگی *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: علی رضایی"
                    className="w-full px-3 py-2 pr-9 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                شماره موبایل *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                  className="w-full px-3 py-2 pr-9 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 text-left font-mono transition-colors"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رمز عبور *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-9 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  آدرس پیش‌فرض (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="جهت ارسال سریع سفارشات بعدی..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors"
                />
              </div>
            )}

            {/* Terms checkbox with explicit link */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="loginTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <label
                htmlFor="loginTerms"
                className="text-xs text-gray-600 dark:text-gray-400 select-none cursor-pointer"
              >
                <span>کلیه </span>
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
                <span> وب‌سایت را خوانده و می‌پذیرم.</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer mt-2"
            >
              {loading
                ? 'در حال پردازش...'
                : mode === 'login'
                ? 'ورود به حساب'
                : 'تکمیل عضویت و ورود'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
