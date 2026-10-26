import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_ADMIN_USER,
  INITIAL_BRANDS,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMER_USER,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from './src/data/initialData';
import { formatTorobFeedItem } from './src/utils/torob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsers with large limit for image upload (50mb)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload and data directory exist
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database file if not exists
interface DbSchema {
  products: any[];
  categories: any[];
  brands: any[];
  users: any[];
  orders: any[];
  settings: any;
}

function getDatabase(): DbSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed: DbSchema = JSON.parse(data);
      let updated = false;
      if (parsed.categories) {
        parsed.categories = parsed.categories.map((c: any) => {
          const init = INITIAL_CATEGORIES.find((ic) => ic.id === c.id);
          if (!c.subcategories && init?.subcategories) {
            updated = true;
            return { ...c, subcategories: init.subcategories };
          }
          return c;
        });
      }
      if (parsed.products) {
        parsed.products = parsed.products.map((p: any) => {
          const init = INITIAL_PRODUCTS.find((ip) => ip.id === p.id);
          if (!p.brand) {
            updated = true;
            return {
              ...p,
              brand: init?.brand || p.attributes?.brand || 'آیلند باتری',
              subcategory: p.subcategory || init?.subcategory,
            };
          }
          return p;
        });
      }
      if (!parsed.brands || parsed.brands.length === 0) {
        parsed.brands = INITIAL_BRANDS;
        updated = true;
      }
      if (!parsed.settings) {
        parsed.settings = INITIAL_SETTINGS;
        updated = true;
      }
      if (!parsed.orders) {
        parsed.orders = [];
        updated = true;
      }
      if (!parsed.users || parsed.users.length === 0) {
        parsed.users = [INITIAL_ADMIN_USER, INITIAL_CUSTOMER_USER];
        updated = true;
      }
      if (updated) {
        saveDatabase(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading db.json:', err);
  }

  // Initial seed
  const initialDb: DbSchema = {
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    brands: INITIAL_BRANDS,
    users: [INITIAL_ADMIN_USER, INITIAL_CUSTOMER_USER],
    orders: [
      {
        id: 'ord-1001',
        orderNumber: 'PR-1001',
        userId: INITIAL_CUSTOMER_USER.id,
        customerName: INITIAL_CUSTOMER_USER.name,
        customerPhone: INITIAL_CUSTOMER_USER.phone,
        shippingAddress: INITIAL_CUSTOMER_USER.address || '',
        postalCode: INITIAL_CUSTOMER_USER.postalCode || '',
        items: [
          {
            productId: 'p2',
            title: 'شارژر دیواری ۴۵ وات سامسونگ اصل ویتنام',
            price: 980000,
            quantity: 1,
            image: INITIAL_PRODUCTS[1]?.image || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&q=80',
          },
        ],
        subtotal: 980000,
        shippingFee: 0,
        totalAmount: 980000,
        status: 'completed',
        paymentMethod: 'online',
        paymentRefId: 'ZP-88349271',
        createdAt: '2026-02-01T14:20:00Z',
      },
    ],
    settings: INITIAL_SETTINGS,
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// --- API ROUTES ---

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Settings
app.get('/api/settings', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  const db = getDatabase();
  db.settings = { ...db.settings, ...req.body };
  saveDatabase(db);
  res.json(db.settings);
});

// Categories
app.get('/api/categories', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.categories);
});

app.post('/api/categories', (req: Request, res: Response) => {
  const db = getDatabase();
  const newCat = {
    id: `cat-${Date.now()}`,
    name: req.body.name,
    slug: req.body.slug || `cat-${Date.now()}`,
    iconName: req.body.iconName || 'generic',
    order: db.categories.length + 1,
  };
  db.categories.push(newCat);
  saveDatabase(db);
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const idx = db.categories.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'دسته‌بندی پیدا نشد' });
  db.categories[idx] = { ...db.categories[idx], ...req.body };
  saveDatabase(db);
  res.json(db.categories[idx]);
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  db.categories = db.categories.filter((c) => c.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Brands
app.get('/api/brands', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.brands || INITIAL_BRANDS);
});

app.post('/api/brands', (req: Request, res: Response) => {
  const db = getDatabase();
  const newBrand = {
    id: `br-${Date.now()}`,
    name: req.body.name,
    nameFa: req.body.nameFa || req.body.name,
    slug: req.body.slug || `brand-${Date.now()}`,
    icon: req.body.icon || 'tag',
    logo: req.body.logo || '',
    description: req.body.description || '',
    isPopular: req.body.isPopular !== undefined ? req.body.isPopular : true,
  };
  if (!db.brands) db.brands = [...INITIAL_BRANDS];
  db.brands.push(newBrand);
  saveDatabase(db);
  res.status(201).json(newBrand);
});

app.put('/api/brands/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  if (!db.brands) db.brands = [...INITIAL_BRANDS];
  const idx = db.brands.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'برند پیدا نشد' });
  db.brands[idx] = { ...db.brands[idx], ...req.body };
  saveDatabase(db);
  res.json(db.brands[idx]);
});

app.delete('/api/brands/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  if (!db.brands) db.brands = [...INITIAL_BRANDS];
  db.brands = db.brands.filter((b) => b.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const db = getDatabase();
  let list = db.products;
  if (req.query.categoryId) {
    list = list.filter((p) => p.categoryId === req.query.categoryId);
  }
  if (req.query.filter === 'recommended') {
    list = list.filter((p) => p.isRecommended);
  }
  if (req.query.filter === 'special') {
    list = list.filter((p) => p.isSpecialOffer);
  }
  if (req.query.search) {
    const q = String(req.query.search).toLowerCase();
    list = list.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  res.json(list);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const prod = db.products.find((p) => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: 'محصول پیدا نشد' });
  res.json(prod);
});

app.post('/api/products', (req: Request, res: Response) => {
  const db = getDatabase();
  const newProduct = {
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'محصول پیدا نشد' });
  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  res.json(db.products[idx]);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  db.products = db.products.filter((p) => p.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// Image Upload saving directly to local Debian server directory
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'تصویر ارسال نشده است' });
    }

    // Extract base64 payload
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('png')) ext = 'png';
      else if (mime.includes('webp')) ext = 'webp';
      else if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(imageBase64, 'base64');
    }

    const safeName = `${Date.now()}-${(filename || 'image').replace(/[^a-zA-Z0-9_-]/g, '')}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    return res.json({ url: publicUrl, filename: safeName, success: true });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'خطا در بارگذاری تصویر روی سرور: ' + err.message });
  }
});

// Delete uploaded file (e.g. replaced brand logo or banner)
app.post('/api/delete-file', (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (url && typeof url === 'string' && url.startsWith('/uploads/')) {
      const filename = path.basename(url);
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    console.error('File deletion error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Torob Bot Crawler API Feed
app.get(['/api/torob/products', '/torob.json'], (req: Request, res: Response) => {
  const db = getDatabase();
  const protocol = req.protocol;
  const host = req.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  const torobItems = db.products.map((p) => formatTorobFeedItem(p, baseUrl));
  res.json(torobItems);
});

// Orders
app.get('/api/orders', (req: Request, res: Response) => {
  const db = getDatabase();
  res.json(db.orders);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const db = getDatabase();
  const orderNumber = `PR-${Math.floor(100000 + Math.random() * 900000)}`;

  // Server-side audit & calculation of items and totals
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  let calculatedSubtotal = 0;

  const auditedItems = items.map((item: any) => {
    // If the product exists in db, verify price integrity
    const matchedProduct = db.products.find((p) => p.id === item.productId);
    let itemPrice = Number(item.price) || 0;
    if (matchedProduct) {
      if (item.variantId && matchedProduct.variants) {
        const v = matchedProduct.variants.find((vr: any) => vr.id === item.variantId);
        if (v) itemPrice = v.salePrice || v.price;
      } else {
        itemPrice = matchedProduct.salePrice || matchedProduct.price;
      }
    }
    const quantity = Math.max(1, Number(item.quantity) || 1);
    calculatedSubtotal += itemPrice * quantity;
    return {
      ...item,
      price: itemPrice,
      quantity,
    };
  });

  const shippingFee = calculatedSubtotal >= 500000 ? 0 : 45000;
  const totalAmount = calculatedSubtotal + shippingFee;

  const newOrder = {
    ...req.body,
    id: `ord-${Date.now()}`,
    orderNumber,
    items: auditedItems,
    subtotal: calculatedSubtotal,
    shippingFee,
    totalAmount,
    createdAt: new Date().toISOString(),
    status: req.body.status || 'pending',
  };
  db.orders.unshift(newOrder);
  saveDatabase(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const db = getDatabase();
  const idx = db.orders.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'سفارش پیدا نشد' });
  db.orders[idx].status = req.body.status;
  db.orders[idx].updatedAt = new Date().toISOString();
  saveDatabase(db);
  res.json(db.orders[idx]);
});

// Users
app.get('/api/users', (req: Request, res: Response) => {
  const db = getDatabase();
  // attach order count to each user
  const usersWithOrders = db.users.map((u) => {
    const userOrders = db.orders.filter((o) => o.userId === u.id || o.customerPhone === u.phone);
    const { password, ...safeUser } = u;
    return {
      ...safeUser,
      ordersCount: userOrders.length,
      orders: userOrders,
    };
  });
  res.json(usersWithOrders);
});

app.put('/api/users/:id/role', (req: Request, res: Response) => {
  const db = getDatabase();
  const idx = db.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'کاربر پیدا نشد' });
  db.users[idx].role = req.body.role;
  saveDatabase(db);
  res.json({ success: true, user: db.users[idx] });
});

// Auth
app.post('/api/auth/login', (req: Request, res: Response) => {
  const db = getDatabase();
  const { phone, password } = req.body;
  const user = db.users.find((u) => u.phone === phone && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'شماره موبایل یا رمز عبور اشتباه است' });
  }
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, token: `mock-jwt-${user.id}` });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const db = getDatabase();
  const { name, phone, password, address, postalCode } = req.body;

  const existing = db.users.find((u) => u.phone === phone);
  if (existing) {
    // If user already exists, update info and return
    existing.name = name || existing.name;
    if (address) existing.address = address;
    if (postalCode) existing.postalCode = postalCode;
    saveDatabase(db);
    const { password: _, ...safeUser } = existing;
    return res.json({ user: safeUser, token: `mock-jwt-${existing.id}` });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    phone,
    password: password || '123456',
    role: 'customer' as const,
    address: address || '',
    postalCode: postalCode || '',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDatabase(db);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser, token: `mock-jwt-${newUser.id}` });
});

app.post('/api/auth/check-phone', (req: Request, res: Response) => {
  const db = getDatabase();
  const { phone } = req.body;
  const user = db.users.find((u) => u.phone === phone);
  res.json({ exists: Boolean(user), name: user ? user.name : null });
});

// --- SPA SERVER INTEGRATION ---
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist directory
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`> Island Battery Store Server running on port ${PORT}`);
    console.log(`> Torob Feed available at http://localhost:${PORT}/api/torob/products`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
