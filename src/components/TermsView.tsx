import React from 'react';
import {
  FileText,
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  Clock,
  HelpCircle,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export function TermsView() {
  const { settings, navigateTo } = useStore();
  const storeName = settings.storeName || 'آیلند باتری';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2 pb-5 border-b border-gray-150 dark:border-gray-800">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-200/60 dark:border-sky-800/60">
          <FileText className="w-3.5 h-3.5" />
          <span>شرایط استفاده، قوانین و راهنمای خرید</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          قوانین و مقررات فروشگاه {storeName}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          کاربر گرامی، لطفاً قوانین و مقررات زیر را به جهت استفاده بهینه از خدمات، پشتیبانی و خریدی امن و لذت‌بخش به دقت مطالعه فرمایید.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 border border-gray-150 dark:border-gray-700/80 shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {/* Section 1 */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400 font-bold text-sm sm:text-base">
            <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-black text-xs">
              ۱
            </span>
            <h3>مقدمه و پذیرش قوانین</h3>
          </div>
          <p className="pr-9 leading-relaxed">
            ورود کاربران به وب‌سایت {storeName} و استفاده از خدمات، پروفایل شخصی، ثبت سفارش و سایر خدمات ارائه‌شده به معنای آگاهی کامل و پذیرش بدون قید و شرط قوانین و مقررات وب‌سایت است. کاربر متعهد می‌شود که تمام مفاد این توافق‌نامه را رعایت نماید.
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400 font-bold text-sm sm:text-base">
            <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-black text-xs">
              ۲
            </span>
            <h3>تعاریف و واژگان</h3>
          </div>
          <div className="pr-9 space-y-2">
            <p>
              <strong className="text-gray-900 dark:text-white">فروشگاه (مرجع فروش):</strong> وب‌سایت اینترنتی {storeName} به آدرس رسمی سایت که ارائه‌دهنده کالا، باتری‌های تقویت شده، نمایشگرها، قطعات و لوازم جانبی دیجیتال است.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">کاربر / مشتری:</strong> هر شخص حقیقی یا حقوقی که با ثبت اطلاعات خود در فرم ثبت‌نام یا ثبت سفارش، اقدام به خرید کالا یا استفاده از خدمات فروشگاه می‌نماید.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">سفارش:</strong> کالا یا کالاهایی که مشتری انتخاب کرده و با پرداخت هزینه، درخواست خرید آن‌ها را ثبت می‌کند.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400 font-bold text-sm sm:text-base">
            <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-black text-xs">
              ۳
            </span>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <h3>سیاست حفظ حریم خصوصی</h3>
            </div>
          </div>
          <p className="pr-9 leading-relaxed">
            فروشگاه {storeName} متعهد می‌شود که اطلاعات شخصی کاربران (نظیر نام و نام خانوادگی، آدرس، شماره تلفن و پست الکترونیکی) را به طور کامل حفظ و صیانت کرده و از جدیدترین فناوری‌های امنیتی جهت حفاظت از داده‌ها بهره ببرد. این اطلاعات صرفاً برای فرآیند پردازش، ارسال سفارش و ارائه خدمات پشتیبانی استفاده شده و به هیچ عنوان در اختیار اشخاص ثالث قرار نخواهد گرفت.
          </p>
        </section>

        {/* Section 4 */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400 font-bold text-sm sm:text-base">
            <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-black text-xs">
              ۴
            </span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <h3>فرآیند ثبت و پردازش سفارش</h3>
            </div>
          </div>
          <p className="pr-9 leading-relaxed">
            امکان ثبت سفارش در فروشگاه {storeName} در تمامی ۲۴ ساعت شبانه‌روز و ۷ روز هفته فراهم می‌باشد. سفارش‌های ثبت‌شده در کوتاه‌ترین زمان ممکن (معمولاً روز کاری بعد) پردازش شده و کد پیگیری ارسال برای مشتری صادر می‌شود. در صورت بروز هرگونه مشکل در پردازش نهایی سبد خرید (نظیر اتمام موجودی کالا یا نوسان شدید قیمت)، مبلغ پرداختی ظرف حداکثر ۲۴ ساعت کاری به حساب خریدار عودت داده خواهد شد.
          </p>
        </section>

        {/* Section 5 */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400 font-bold text-sm sm:text-base">
            <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-black text-xs">
              ۵
            </span>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <h3>شرایط و روش‌های پرداخت</h3>
            </div>
          </div>
          <p className="pr-9 leading-relaxed">
            کاربران می‌توانند مبالغ سفارش‌های خود را به صورت آنلاین و ایمن از طریق درگاه‌های رسمی و معتبر بانکی متصل به شبکه شتاب پرداخت نمایند. پرداخت موفق به منزله ثبت قطعی سفارش بوده و فاکتور خرید الکترونیکی برای کاربر صادر می‌گردد.
          </p>
        </section>

        {/* Section 6 */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400 font-bold text-sm sm:text-base">
            <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-black text-xs">
              ۶
            </span>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <h3>روش‌ها، هزینه‌ها و شرایط ارسال کالا</h3>
            </div>
          </div>
          <p className="pr-9 leading-relaxed">
            ارسال سفارش‌ها در سراسر کشور با هماهنگی کاربر و از طریق روش‌های رسمی شامل پست پیشتاز، تیپاکس و یا پیک موتوری (ویژه شهر مبدأ) صورت می‌گیرد. هزینه و زمان تقریبی تحویل سفارش هنگام ثبت خرید کالا کاملاً شفاف به کاربر نمایش داده می‌شود. مسئولیت صحت آدرس و شماره تماس ثبت‌شده بر عهده خریدار است.
          </p>
        </section>

        {/* Section 7 */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-sky-200/80 dark:border-sky-800/50 space-y-2">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400 font-bold text-sm sm:text-base">
            <span className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs">
              ۷
            </span>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3>حق انصراف و قانون عودت کالا (ماده ۳۷ قانون تجارت الکترونیکی)</h3>
            </div>
          </div>
          <p className="pr-9 leading-relaxed">
            طبق ماده ۳۷ قانون تجارت الکترونیکی کشور، خریدار حق دارد ظرف مدت ۷ روز کاری از خرید خود منصرف شده و اقدام به عودت کالا نماید. شرایط اعمال حق انصراف به شرح زیر است:
          </p>
          <ul className="pr-12 list-disc space-y-1.5 text-gray-700 dark:text-gray-300">
            <li>کالا باید کاملاً پلمب، بدون هرگونه تغییر ظاهری، مخدوش شدن برچسب‌ها و علائم عودت داده شود.</li>
            <li>هرگونه استفاده از کالا، باز شدن پلمب یا باز شدن جعبه اصلی کالا، حق انصراف را باطل می‌سازد.</li>
            <li>هزینه‌های مربوط به عودت و بازپس‌فرستادن کالا به عهده خریدار خواهد بود.</li>
            <li>مبلغ کالا پس از تحویل به انبار فروشگاه و تأیید سلامت آن توسط کارشناسان، ظرف حداکثر ۴۸ ساعت کاری به شماره شبای همنام با نام کاربری خریدار عودت داده می‌شود.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400 font-bold text-sm sm:text-base">
            <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-black text-xs">
              ۸
            </span>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <h3>پشتیبانی، ثبت و رسیدگی به شکایات</h3>
            </div>
          </div>
          <p className="pr-9 leading-relaxed">
            فروشگاه {storeName} متعهد به ارائه بالاترین سطح پشتیبانی به کاربران خود می‌باشد. تیم پشتیبانی در روزهای کاری (شنبه تا چهارشنبه از ساعت ۹:۰۰ الی ۱۷:۰۰ و پنج‌شنبه‌ها از ساعت ۹:۰۰ الی ۱۳:۰۰) آماده پاسخگویی و رفع مشکلات کاربران است.
          </p>
          <p className="pr-9 leading-relaxed">
            کاربران می‌توانند هرگونه مغایرت کالا، تأخیر در ارسال یا شکایت خود را از طریق فرم «تماس با ما»، ارسال تیکت در پنل کاربری یا شماره تلفن‌های اعلام‌شده در فوتر ثبت نمایند. فروشگاه متعهد می‌گردد حداکثر ظرف ۴۸ ساعت کاری به تمامی شکایات رسیدگی کرده و نتیجه را به اطلاع کاربر برساند.
          </p>
        </section>

        {/* Section 9 */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 text-sky-700 dark:text-sky-400 font-bold text-sm sm:text-base">
            <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-black text-xs">
              ۹
            </span>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <h3>قوه قهریه (فورس ماژور)</h3>
            </div>
          </div>
          <p className="pr-9 leading-relaxed">
            تمامی قوانین، مقررات و تعهدات مندرج در این صفحه، در شرایط عادی و پایدار معتبر است. در صورت بروز هرگونه حوادث غیرمترقبه، قهریه و خارج از کنترل (مانند سیل، زلزله، اختلالات سراسری در شبکه اینترنت کشور و قوانین دولتی خاص)، فروشگاه {storeName} هیچ‌گونه مسئولیتی در قبال تأخیر یا عدم انجام تعهدات نخواهد داشت، اما همواره تلاش می‌کند مشکلات را در سریع‌ترین زمان ممکن برای کاربران برطرف سازد.
          </p>
        </section>

        {/* Signoff and back to store */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-750 border border-sky-100 dark:border-slate-700 text-center space-y-3">
          <p className="font-bold text-sky-950 dark:text-sky-200">
            با تشکر از اعتماد و همراهی شما — مدیریت فروشگاه {storeName}
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            مشاهده محصولات و شروع خرید
          </button>
        </div>
      </div>
    </div>
  );
}
