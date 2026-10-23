import test from 'node:test';
import assert from 'node:assert/strict';
import { formatTorobFeedItem, generateTorobProductSchema } from './torob';
import { Product } from '../types/store';

const sampleProduct: Product = {
  id: 'prod-101',
  title: 'باتری اورجینال آیفون 13 پرو مکس تقویت شده',
  slug: 'iphone-13-pro-max-battery',
  sku: 'BAT-IP13PM',
  type: 'simple',
  categoryId: 'cat-battery',
  categoryName: 'باتری موبایل',
  brand: 'اپل (Apple)',
  subcategory: 'باتری آیفون',
  image: '/uploads/battery-13.jpg',
  price: 1650000,
  salePrice: 1450000,
  stock: 12,
  shortDescription: 'باتری تقویت شده با ظرفیت بالا و گارانتی تعویض ۶ ماهه',
  description: 'توضیحات کامل باتری اورجینال مناسب تعویض آیفون ۱۳ پرو مکس با سلامت ۱۰۰٪',
  createdAt: '2026-01-01T10:00:00Z',
  attributes: {
    brand: 'Apple',
    warranty: '۶ ماه گارانتی تعویض',
  },
};

test('formatTorobFeedItem returns valid Torob crawler specifications', () => {
  const item = formatTorobFeedItem(sampleProduct, 'https://myshop.ir');
  assert.equal(item.page_unique_code, 'prod-101');
  assert.equal(item.title, sampleProduct.title);
  assert.equal(item.price, 1450000);
  assert.equal(item.old_price, 1650000);
  assert.equal(item.availability, 'instock');
  assert.equal(item.page_url, 'https://myshop.ir/?product=prod-101');
  assert.equal(item.category_name, 'باتری موبایل');
  assert.equal(item.image_link, 'https://myshop.ir/uploads/battery-13.jpg');
});

test('generateTorobProductSchema formats valid Schema.org Product Offer JSON-LD', () => {
  const schema = generateTorobProductSchema(sampleProduct, 'https://myshop.ir');
  assert.equal(schema['@type'], 'Product');
  assert.equal(schema.name, sampleProduct.title);
  assert.equal(schema.sku, 'BAT-IP13PM');
  assert.equal(schema.offers.priceCurrency, 'IRT');
  assert.equal(schema.offers.price, 1450000);
  assert.equal(schema.offers.availability, 'https://schema.org/InStock');
});
