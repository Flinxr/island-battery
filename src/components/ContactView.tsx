import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toPersianDigits } from '../utils/pricing';

export function ContactView() {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          تماس با ما و پشتیبانی
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          تیم پشتیبانی ما در تمامی ساعات کاری آماده پاسخگویی به سوالات و راهنمایی خرید شماست.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-150 dark:border-gray-700/80 shadow-xs space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">شماره‌های تماس</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  پاسخگویی سریع در ساعات کاری
                </p>
                <div className="mt-2 font-bold text-sky-700 dark:text-sky-300 text-sm" dir="ltr">
                  {settings.phone || '۰۲۱-۶۶۷۰۹۸۷۶'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">ساعات کاری</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  شنبه تا پنجشنبه (به جز روزهای تعطیل رسمی)
                </p>
                <div className="mt-2 font-bold text-gray-800 dark:text-gray-200 text-xs">
                  {settings.supportHours || '۹:۰۰ الی ۲۱:۰۰'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">دفتر مرکزی و تحویل</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                  {settings.address ||
                    'تهران، خیابان جمهوری، تقاطع حافظ، مجتمع تجاری علاءالدین، واحد ۲۰۴'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-150 dark:border-gray-700/80 shadow-xs">
          <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-4">
            ارسال پیام یا استعلام قطعات خاص
          </h3>

          {submitted ? (
            <div className="p-6 bg-sky-50 dark:bg-sky-950/50 rounded-2xl border border-sky-200 dark:border-sky-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-sky-600 dark:text-sky-400 mx-auto" />
              <h4 className="font-bold text-sky-900 dark:text-sky-200 text-sm">
                پیام شما با موفقیت ثبت شد
              </h4>
              <p className="text-xs text-sky-700 dark:text-sky-300">
                کارشناسان ما به زودی با شما تماس خواهند گرفت.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    نام شما *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="علی اکبری"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    شماره تماس *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    dir="ltr"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-left focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  متن پیام یا مشخصات قطعه درخواستی *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="لطفاً پیام خود را بنویسید..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>ارسال پیام</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
