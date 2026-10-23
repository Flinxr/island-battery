import React from 'react';
import { Package, Award, Users, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function AboutView() {
  const { settings, navigateTo } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          درباره {settings.storeName || 'آیلند باتری'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          مرجع تخصصی پخش و فروش مستقیم لوازم جانبی و قطعات یدکی اورجینال تلفن همراه
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 border border-gray-150 dark:border-gray-700/80 shadow-xs space-y-6 text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <p>
          فروشگاه ما با بیش از ۱۰ سال سابقه در قلب بازار علاءالدین تهران، با هدف حذف واسطه‌های غیرضروری و
          تأمین مستقیم قطعات اصلی تلفن همراه (باتری‌های تقویت شده با سلول ژاپنی، نمایشگرهای روکاری،
          کابل‌های فوق سریع و اکسسوری‌های معتبر بین‌المللی) آغاز به کار کرده است.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-gray-750 border border-sky-100 dark:border-gray-700 text-center space-y-1.5">
            <Award className="w-6 h-6 text-sky-600 dark:text-sky-400 mx-auto" />
            <h4 className="font-bold text-gray-900 dark:text-white">تضمین بالاترین کیفیت</h4>
            <p className="text-[11px] text-gray-500">ارائه کالای اورجینال و تست شده</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-gray-750 border border-sky-100 dark:border-gray-700 text-center space-y-1.5">
            <Users className="w-6 h-6 text-sky-600 dark:text-sky-400 mx-auto" />
            <h4 className="font-bold text-gray-900 dark:text-white">بیش از ۵۰,۰۰۰ مشتری</h4>
            <p className="text-[11px] text-gray-500">اعتماد خریداران و تعمیرکاران سراسر ایران</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-gray-750 border border-sky-100 dark:border-gray-700 text-center space-y-1.5">
            <ShieldCheck className="w-6 h-6 text-sky-600 dark:text-sky-400 mx-auto" />
            <h4 className="font-bold text-gray-900 dark:text-white">پشتیبانی واقعی</h4>
            <p className="text-[11px] text-gray-500">پاسخگویی سریع در تمام مراحل خرید</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-150 dark:border-gray-700 flex justify-center">
          <button
            onClick={() => navigateTo('shop')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <span>مشاهده و خرید محصولات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
