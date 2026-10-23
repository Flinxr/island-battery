import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toPersianDigits,
  formatToman,
  calculateDiscount,
  calculateCartTotals,
  validateIranianPhone,
  validatePostalCode,
  formatPersianDate,
} from './pricing';
import { CartItem } from '../types/store';

test('toPersianDigits converts English numbers to Persian glyphs', () => {
  assert.equal(toPersianDigits('1234567890'), '۱۲۳۴۵۶۷۸۹۰');
  assert.equal(toPersianDigits(1405), '۱۴۰۵');
});

test('formatToman produces formatted string with Toman suffix', () => {
  assert.equal(formatToman(1500000), '۱,۵۰۰,۰۰۰ تومان');
  assert.equal(formatToman(0), '۰ تومان');
});

test('calculateDiscount calculates proper rounded percentage', () => {
  assert.equal(calculateDiscount(100000, 80000), 20);
  assert.equal(calculateDiscount(200000, 150000), 25);
  assert.equal(calculateDiscount(100000, 120000), 0); // No discount if price is higher
  assert.equal(calculateDiscount(100000), 0);
});

test('calculateCartTotals calculates quantities, discounts, and free shipping over 500k', () => {
  const emptyItems: CartItem[] = [];
  assert.deepEqual(calculateCartTotals(emptyItems), {
    totalQuantity: 0,
    subtotal: 0,
    discountTotal: 0,
    shippingFee: 0,
    payableTotal: 0,
  });

  // Under 500k: shipping fee is 45,000
  const underLimit: CartItem[] = [
    {
      id: 'item-1',
      productId: 'p1',
      title: 'قاب سیلیکونی',
      image: '/img.png',
      price: 200000,
      salePrice: 150000,
      quantity: 1,
    },
  ];
  const result1 = calculateCartTotals(underLimit);
  assert.equal(result1.totalQuantity, 1);
  assert.equal(result1.subtotal, 200000);
  assert.equal(result1.discountTotal, 50000);
  assert.equal(result1.shippingFee, 45000);
  assert.equal(result1.payableTotal, 150000 + 45000);

  // Over 500k: free shipping
  const overLimit: CartItem[] = [
    {
      id: 'item-2',
      productId: 'p2',
      title: 'باتری آیفون',
      image: '/img.png',
      price: 600000,
      quantity: 1,
    },
  ];
  const result2 = calculateCartTotals(overLimit);
  assert.equal(result2.totalQuantity, 1);
  assert.equal(result2.shippingFee, 0);
  assert.equal(result2.payableTotal, 600000);
});

test('validateIranianPhone handles standard 09xx numbers', () => {
  assert.equal(validateIranianPhone('09123456789'), true);
  assert.equal(validateIranianPhone('۰۹۱۲۳۴۵۶۷۸۹'), true);
  assert.equal(validateIranianPhone('09351112233'), true);
  assert.equal(validateIranianPhone('02188888888'), false);
  assert.equal(validateIranianPhone('0912'), false);
  assert.equal(validateIranianPhone('abc'), false);
});

test('validatePostalCode handles 10-digit Iranian postal codes', () => {
  assert.equal(validatePostalCode('1234567890'), true);
  assert.equal(validatePostalCode('۱۲۳۴۵۶۷۸۹۰'), true);
  assert.equal(validatePostalCode('12345'), false);
  assert.equal(validatePostalCode('12345678901'), false);
});

test('formatPersianDate produces valid formatted date string', () => {
  const formatted = formatPersianDate('2026-05-15T10:00:00Z');
  assert.ok(formatted.includes('/'));
});

