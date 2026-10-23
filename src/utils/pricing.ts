import { CartItem } from '../types/store';

/**
 * Converts English digits to Persian digits
 */
export function toPersianDigits(input: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return input
    .toString()
    .replace(/[0-9]/g, (w) => farsiDigits[parseInt(w, 10)]);
}

/**
 * Format price in Toman with thousand separators and Persian numbers
 */
export function formatToman(price: number): string {
  if (isNaN(price)) return '۰ تومان';
  const formatted = price.toLocaleString('en-US');
  return `${toPersianDigits(formatted)} تومان`;
}

/**
 * Calculate percentage discount
 */
export function calculateDiscount(regularPrice: number, salePrice?: number): number {
  if (!salePrice || salePrice >= regularPrice || regularPrice <= 0) return 0;
  const discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  return Math.max(0, Math.min(100, discount));
}

/**
 * Calculate totals for cart items
 * Free shipping above 500,000 Tomans, otherwise 45,000 Tomans
 */
export function calculateCartTotals(items: CartItem[]): {
  totalQuantity: number;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  payableTotal: number;
} {
  let totalQuantity = 0;
  let subtotal = 0;
  let discountTotal = 0;

  for (const item of items) {
    const qty = Math.max(1, item.quantity);
    totalQuantity += qty;
    const itemOriginal = (item.price || 0) * qty;
    subtotal += itemOriginal;

    if (item.salePrice && item.salePrice < item.price) {
      discountTotal += (item.price - item.salePrice) * qty;
    }
  }

  const discountedItemsTotal = subtotal - discountTotal;
  // Free shipping for orders >= 500,000 Toman or 0 if empty
  const shippingFee = totalQuantity === 0 ? 0 : discountedItemsTotal >= 500000 ? 0 : 45000;
  const payableTotal = totalQuantity === 0 ? 0 : discountedItemsTotal + shippingFee;

  return {
    totalQuantity,
    subtotal,
    discountTotal,
    shippingFee,
    payableTotal,
  };
}

/**
 * Validates Iranian mobile numbers (starts with 09 and is 11 digits)
 */
export function validateIranianPhone(phone: string): boolean {
  if (!phone) return false;
  // normalize persian digits if any
  const normalized = phone
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .trim();
  const regex = /^09[0-9]{9}$/;
  return regex.test(normalized);
}

export function validatePostalCode(code: string): boolean {
  if (!code) return false;
  const normalized = code
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .trim();
  const regex = /^[0-9]{10}$/;
  return regex.test(normalized);
}

/**
 * Safe date formatter with Persian digits that avoids browser locale font glitches
 */
export function formatPersianDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '۱۴۰۵/۰۱/۰۱';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${toPersianDigits(year)}/${toPersianDigits(month)}/${toPersianDigits(day)}`;
  } catch {
    return '۱۴۰۵/۰۱/۰۱';
  }
}

/**
 * Safe date and time formatter with Persian digits
 */
export function formatPersianDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '۱۴۰۵/۰۱/۰۱ - ۱۰:۰۰';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${toPersianDigits(year)}/${toPersianDigits(month)}/${toPersianDigits(day)} - ساعت ${toPersianDigits(hours)}:${toPersianDigits(minutes)}`;
  } catch {
    return '۱۴۰۵/۰۱/۰۱ - ۱۰:۰۰';
  }
}


